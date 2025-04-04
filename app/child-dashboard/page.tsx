"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task } from "@/components/task-card"
import { GameTimeBank } from "@/components/game-time-bank"
import { TaskTimer } from "@/components/task-timer"
import { ChildAvatar } from "@/components/child-avatar"
import { StreakTracker } from "@/components/streak-tracker"
import type { Badge } from "@/components/badge-collection"
import { GameTimeUsage } from "@/components/game-time-usage"
import { RewardAnimation } from "@/components/reward-animation"
import { TaskCalendar } from "@/components/task-calendar"
import { LogOut, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

// Mock data
const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Read a book",
    description: "Read for at least 20 minutes",
    type: "time",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Clean your room",
    description: "Make your bed and put away toys",
    type: "credit",
    creditMinutes: 15,
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Practice piano",
    type: "time",
    status: "approved",
    timeSpent: 900, // 15 minutes
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Brush teeth",
    type: "credit",
    creditMinutes: 5,
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: "task-5",
    title: "Do homework",
    type: "time",
    status: "approved",
    timeSpent: 1800, // 30 minutes
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
]

// Mock badges
const mockBadges: Badge[] = [
  {
    id: "badge-1",
    title: "First Task",
    description: "Complete your first task",
    icon: "trophy",
    category: "achievement",
    achieved: true,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "badge-2",
    title: "Reading Star",
    description: "Read for a total of 1 hour",
    icon: "book",
    category: "skill",
    achieved: false,
    progress: 35,
    total: 60,
  },
  {
    id: "badge-3",
    title: "Streak Master",
    description: "Maintain a 7-day streak",
    icon: "star",
    category: "streak",
    achieved: false,
    progress: 3,
    total: 7,
  },
  {
    id: "badge-4",
    title: "Chore Champion",
    description: "Complete 10 chores",
    icon: "award",
    category: "achievement",
    achieved: false,
    progress: 4,
    total: 10,
  },
  {
    id: "badge-5",
    title: "Time Keeper",
    description: "Use the timer for 5 tasks",
    icon: "clock",
    category: "skill",
    achieved: true,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
]

export default function ChildDashboard() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [gameTimeMinutes, setGameTimeMinutes] = useState(30)
  const [activeTab, setActiveTab] = useState("tasks")
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [showReward, setShowReward] = useState(false)
  const [rewardMinutes, setRewardMinutes] = useState(0)
  const [avatarReaction, setAvatarReaction] = useState<"cheer" | "levelUp" | "streak" | null>(null)
  const [isUsingGameTime, setIsUsingGameTime] = useState(false)
  const [streakCount, setStreakCount] = useState(3)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isGameTimeLocked, setIsGameTimeLocked] = useState(false)

  // Check if user is logged in and is a child
  useEffect(() => {
    if (!loading) {
      // If not logged in, check if onboarding is completed
      const isOnboardingCompleted = localStorage.getItem("carrot-onboarding-completed")
      const onboardingData = localStorage.getItem("carrot-onboarding-data")

      if (!user) {
        if (isOnboardingCompleted === "true" && onboardingData) {
          // Try to get user type from onboarding data
          try {
            const parsedData = JSON.parse(onboardingData)
            if (parsedData.userType !== "child") {
              router.push("/")
            }
          } catch (e) {
            router.push("/")
          }
        } else {
          router.push("/")
        }
      } else if (user.type !== "child") {
        router.push("/parent-dashboard")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const handleStartTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.type === "time") {
      setActiveTask(task)
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: "in-progress" } : t)))
    }
  }

  const handlePauseTask = () => {
    if (activeTask) {
      setActiveTask(null)
      setTasks(tasks.map((t) => (t.id === activeTask.id ? { ...t, status: "pending" } : t)))
    }
  }

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)

    if (task) {
      if (task.type === "credit") {
        // For credit-based tasks, mark as completed
        setTasks(
          tasks.map((t) =>
            t.id === taskId ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t,
          ),
        )

        // Show reward animation for credit tasks (simulating auto-approval)
        setRewardMinutes(task.creditMinutes || 0)
        setGameTimeMinutes((prev) => prev + (task.creditMinutes || 0))
        setShowReward(true)

        // Show avatar reaction
        setAvatarReaction("cheer")

        // Check if this completes a streak
        if (streakCount % 3 === 2) {
          // Next task will complete a streak of 3
          setTimeout(() => {
            setAvatarReaction("streak")
            setGameTimeMinutes((prev) => prev + 5) // Bonus 5 minutes
          }, 3500)
        }

        // Increment streak
        setStreakCount((prev) => prev + 1)

        toast({
          title: "Task completed",
          description: "You earned game time!",
        })
      } else {
        // This is for when the timer is running
        setActiveTask(null)
      }
    }
  }

  const handleTimerComplete = (taskId: string, seconds: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "completed",
              timeSpent: seconds,
              completedAt: new Date().toISOString(),
            }
          : t,
      ),
    )

    setActiveTask(null)

    // Show reward animation for time tasks (simulating auto-approval)
    const minutes = Math.ceil(seconds / 60)
    setRewardMinutes(minutes)
    setGameTimeMinutes((prev) => prev + minutes)
    setShowReward(true)

    // Show avatar reaction
    setAvatarReaction("cheer")

    // Check if this completes a streak
    if (streakCount % 3 === 2) {
      // Next task will complete a streak of 3
      setTimeout(() => {
        setAvatarReaction("streak")
        setGameTimeMinutes((prev) => prev + 5) // Bonus 5 minutes
      }, 3500)
    }

    // Increment streak
    setStreakCount((prev) => prev + 1)

    toast({
      title: "Task completed",
      description: "You earned game time!",
    })
  }

  const handleUseGameTime = (minutes: number) => {
    setIsUsingGameTime(true)
    toast({
      title: "Game time started",
      description: `You've started ${minutes} minutes of game time.`,
    })
  }

  const handlePauseGameTime = () => {
    toast({
      title: "Game time paused",
      description: "Your game time has been paused.",
    })
  }

  const handleStopGameTime = () => {
    setIsUsingGameTime(false)
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
  }

  // Filter tasks by status and date
  const getTasksForToday = () => {
    const today = new Date()
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt)
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear() &&
        task.status === "pending"
      )
    })
  }

  const pendingTasks = getTasksForToday()
  const completedTasks = tasks.filter((task) => ["completed", "approved", "rejected"].includes(task.status))
  const today = format(new Date(), "EEEE, MMMM d")

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <header className="bg-gradient-to-r from-purple-500 to-blue-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <span className="text-3xl mr-2">🥕</span> Carrot
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white font-medium">{user?.name || "Buddy"}</span>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ChildAvatar
              name={user?.name || "Buddy"}
              level={5}
              showReaction={avatarReaction}
              streakCount={streakCount}
            />
            <GameTimeBank minutes={gameTimeMinutes} isChild={true} />
            <StreakTracker currentStreak={streakCount} longestStreak={7} />
          </div>

          {activeTask && (
            <TaskTimer taskId={activeTask.id} taskTitle={activeTask.title} onComplete={handleTimerComplete} />
          )}

          {isUsingGameTime && (
            <GameTimeUsage
              availableMinutes={gameTimeMinutes}
              onUseGameTime={handleUseGameTime}
              onPauseGameTime={handlePauseGameTime}
              onStopGameTime={handleStopGameTime}
              isLocked={isGameTimeLocked}
            />
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid grid-cols-4 h-auto p-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
              <TabsTrigger
                value="tasks"
                className="flex flex-col items-center py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg"
              >
                <span className="text-2xl mb-1">✅</span>
                <span className="text-xs font-medium">My Tasks</span>
              </TabsTrigger>
              <TabsTrigger
                value="play"
                className="flex flex-col items-center py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg"
              >
                <span className="text-2xl mb-1">🎮</span>
                <span className="text-xs font-medium">Play</span>
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="flex flex-col items-center py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg"
              >
                <span className="text-2xl mb-1">🏆</span>
                <span className="text-xs font-medium">Badges</span>
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="flex flex-col items-center py-3 px-2 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg"
              >
                <span className="text-2xl mb-1">📅</span>
                <span className="text-xs font-medium">Calendar</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-purple-800 flex items-center">
                  <span className="text-2xl mr-2">📝</span> Today's Tasks
                </h2>
                <span className="text-sm font-medium text-blue-600">{today}</span>
              </div>

              {pendingTasks.length === 0 ? (
                <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <div className="text-5xl mb-4">🎉</div>
                    <p className="text-gray-600">You've completed all your tasks for today!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingTasks.map((task) => (
                    <ChildTaskCard
                      key={task.id}
                      task={task}
                      onStart={() => handleStartTask(task.id)}
                      onPause={handlePauseTask}
                      onComplete={() => handleCompleteTask(task.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="play" className="mt-6">
              {!isUsingGameTime ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-purple-800 flex items-center">
                    <span className="text-2xl mr-2">🎮</span> Game Time
                  </h2>
                  <GameTimeUsage
                    availableMinutes={gameTimeMinutes}
                    onUseGameTime={handleUseGameTime}
                    onPauseGameTime={handlePauseGameTime}
                    onStopGameTime={handleStopGameTime}
                    isLocked={isGameTimeLocked}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎮</div>
                  <p className="text-lg font-medium text-purple-800">Game time is active!</p>
                  <p className="text-gray-600">Have fun playing!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <h2 className="text-xl font-bold text-purple-800 flex items-center mb-4">
                <span className="text-2xl mr-2">🏆</span> My Badges
              </h2>
              <ChildBadgeCollection badges={mockBadges} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <h2 className="text-xl font-bold text-purple-800 flex items-center mb-4">
                <span className="text-2xl mr-2">📅</span> My Calendar
              </h2>
              <ChildTaskCalendar tasks={tasks} onSelectDate={handleSelectDate} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Reward animation */}
      <RewardAnimation show={showReward} minutes={rewardMinutes} onComplete={() => setShowReward(false)} />
    </div>
  )
}

// Child-friendly task card component
function ChildTaskCard({
  task,
  onStart,
  onPause,
  onComplete,
}: {
  task: Task
  onStart?: () => void
  onPause?: () => void
  onComplete?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  // Simplified time format
  const formatTime = (seconds?: number) => {
    if (!seconds) return "0 min"
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  // Task emoji based on title
  const getTaskEmoji = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("read")) return "📚"
    if (lowerTitle.includes("clean")) return "🧹"
    if (lowerTitle.includes("homework")) return "📝"
    if (lowerTitle.includes("piano") || lowerTitle.includes("music")) return "🎹"
    if (lowerTitle.includes("brush") || lowerTitle.includes("teeth")) return "🪥"
    return "✨"
  }

  return (
    <Card
      className={`transition-all duration-200 border-none shadow-md overflow-hidden ${
        isHovered ? "shadow-lg transform scale-[1.02]" : ""
      } bg-white/80 backdrop-blur-sm`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2"></div>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="text-3xl">{getTaskEmoji(task.title)}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-purple-800">{task.title}</h3>
            {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}

            <div className="mt-4">
              {task.type === "time" ? (
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={onStart}
                >
                  <span className="mr-2">⏱️</span>
                  Start Timer
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  onClick={onComplete}
                >
                  <span className="mr-2">✅</span>
                  Mark as Done
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Child-friendly badge collection
function ChildBadgeCollection({ badges }: { badges: Badge[] }) {
  // Badge emoji mapping
  const getBadgeEmoji = (icon: string, achieved: boolean) => {
    if (!achieved) return "🔒"

    switch (icon) {
      case "trophy":
        return "🏆"
      case "book":
        return "📚"
      case "star":
        return "⭐"
      case "award":
        return "🎖️"
      case "clock":
        return "⏱️"
      case "brush":
        return "🎨"
      default:
        return "🏅"
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {badges.map((badge) => (
        <Card
          key={badge.id}
          className={`border-none shadow-md overflow-hidden transition-all hover:shadow-lg ${
            badge.achieved ? "bg-gradient-to-br from-purple-50 to-blue-50" : "bg-gray-100 opacity-75"
          }`}
        >
          <div
            className={`h-1 ${badge.achieved ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-300"}`}
          ></div>
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center">
              <div className={`text-4xl mb-2 ${!badge.achieved && "grayscale opacity-50"}`}>
                {getBadgeEmoji(badge.icon, badge.achieved)}
              </div>

              <h3 className={`font-bold ${badge.achieved ? "text-purple-800" : "text-gray-600"}`}>{badge.title}</h3>

              <p className="text-xs text-gray-500 mt-1">{badge.description}</p>

              {badge.progress !== undefined && badge.total !== undefined && (
                <div className="w-full mt-3">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-center mt-1 text-gray-500">
                    {badge.progress}/{badge.total}
                  </div>
                </div>
              )}

              {badge.achieved && badge.date && (
                <div className="text-xs text-purple-600 mt-2 font-medium">
                  Earned: {new Date(badge.date).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Child-friendly calendar
function ChildTaskCalendar({ tasks, onSelectDate }: { tasks: Task[]; onSelectDate: (date: Date) => void }) {
  return (
    <Card className="border-none shadow-md bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <TaskCalendar tasks={tasks} onSelectDate={onSelectDate} />
      </CardContent>
    </Card>
  )
}

