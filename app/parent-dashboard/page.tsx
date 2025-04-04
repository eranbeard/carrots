"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task } from "@/components/task-card"
import { CreateTaskForm } from "@/components/create-task-form"
import { LogOut, Plus, Settings, Loader2, Calendar, Users, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format, isToday, isYesterday, parseISO, isThisWeek } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AddChildForm } from "@/components/add-child-form"

// Mock data
const mockChildren = [
  {
    id: "child-1",
    name: "Alex",
    gameTimeMinutes: 45,
    dailyLimit: 60,
    isLocked: false,
    level: 5,
    streakCount: 3,
  },
  {
    id: "child-2",
    name: "Sam",
    gameTimeMinutes: 120,
    dailyLimit: 90,
    isLocked: true,
    level: 3,
    streakCount: 0,
  },
]

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Read a book",
    description: "Read for at least 20 minutes",
    type: "time",
    status: "completed",
    timeSpent: 1230, // 20 minutes and 30 seconds
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    childId: "child-1",
  },
  {
    id: "task-2",
    title: "Clean your room",
    description: "Make your bed and put away toys",
    type: "credit",
    creditMinutes: 15,
    status: "completed",
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    childId: "child-2",
  },
  {
    id: "task-3",
    title: "Practice piano",
    type: "time",
    status: "approved",
    timeSpent: 900, // 15 minutes
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    childId: "child-1",
  },
  {
    id: "task-4",
    title: "Brush teeth",
    type: "credit",
    creditMinutes: 5,
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    childId: "child-1",
  },
  {
    id: "task-5",
    title: "Do homework",
    type: "time",
    status: "approved",
    timeSpent: 1800, // 30 minutes
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    childId: "child-2",
  },
]

export default function ParentDashboard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [children, setChildren] = useState(mockChildren)
  const [activeTab, setActiveTab] = useState("today")
  const [selectedChild, setSelectedChild] = useState<string | "all">("all")
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [showAddChild, setShowAddChild] = useState(false)
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in and is a parent
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
            if (parsedData.userType !== "parent") {
              router.push("/")
            }
          } catch (e) {
            router.push("/")
          }
        } else {
          router.push("/")
        }
      } else if (user.type !== "parent") {
        router.push("/child-dashboard")
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

  const handleApproveTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: "approved" } : t)))

    // Find the child this task belongs to
    const childId = task.childId || "child-1"

    // Add game time to the child's bank
    const minutesEarned = task.type === "time" ? Math.floor((task.timeSpent || 0) / 60) : task.creditMinutes || 0

    setChildren(
      children.map((child) =>
        child.id === childId ? { ...child, gameTimeMinutes: child.gameTimeMinutes + minutesEarned } : child,
      ),
    )

    toast({
      title: "Task approved",
      description: `${minutesEarned} minutes have been added to the game time bank`,
    })
  }

  const handleRejectTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "rejected" } : task)))

    toast({
      title: "Task rejected",
      description: "The task has been rejected",
    })
  }

  const handleCreateTask = async (taskData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      creditMinutes: taskData.creditMinutes,
      status: "pending",
      createdAt: new Date().toISOString(),
      childId: taskData.childId,
    }

    setTasks([newTask, ...tasks])
    setShowCreateTask(false)

    toast({
      title: "Task created",
      description: "The task has been created successfully",
    })
  }

  const handleAddChild = (childData: { name: string; age: number; avatarId: string }) => {
    const newChild = {
      id: `child-${Date.now()}`,
      name: childData.name,
      gameTimeMinutes: 0,
      dailyLimit: 60,
      isLocked: false,
      level: 1,
      streakCount: 0,
    }

    setChildren([...children, newChild])
    setShowAddChild(false)

    toast({
      title: "Child added",
      description: `${childData.name} has been added to your account`,
    })
  }

  // Filter tasks based on the selected tab and child
  const getFilteredTasks = () => {
    let filteredTasks = tasks

    // Filter by child if not "all"
    if (selectedChild !== "all") {
      filteredTasks = filteredTasks.filter((task) => task.childId === selectedChild)
    }

    // Filter by time period
    switch (activeTab) {
      case "today":
        return filteredTasks.filter((task) => isToday(parseISO(task.createdAt)))
      case "pending":
        return filteredTasks.filter((task) => task.status === "completed")
      case "yesterday":
        return filteredTasks.filter((task) => isYesterday(parseISO(task.createdAt)))
      case "thisWeek":
        return filteredTasks.filter((task) => isThisWeek(parseISO(task.createdAt)))
      case "all":
      default:
        return filteredTasks
    }
  }

  const filteredTasks = getFilteredTasks()
  const pendingApprovalCount = tasks.filter((task) => task.status === "completed").length

  // Group tasks by child
  const tasksByChild = filteredTasks.reduce(
    (acc, task) => {
      const childId = task.childId || "unknown"
      if (!acc[childId]) {
        acc[childId] = []
      }
      acc[childId].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500 flex items-center">
            <span className="mr-2">🥕</span> Carrot
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600"
              onClick={() => router.push("/parent-dashboard/settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <span className="text-sm text-gray-600">{user?.name || "Parent"}</span>
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col space-y-6">
          {/* Children selector and add child button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <Button
                variant={selectedChild === "all" ? "default" : "outline"}
                size="sm"
                className={selectedChild === "all" ? "bg-orange-500 hover:bg-orange-600" : ""}
                onClick={() => setSelectedChild("all")}
              >
                <Users className="h-4 w-4 mr-2" />
                All Children
              </Button>

              {children.map((child) => (
                <Button
                  key={child.id}
                  variant={selectedChild === child.id ? "default" : "outline"}
                  size="sm"
                  className={selectedChild === child.id ? "bg-orange-500 hover:bg-orange-600" : ""}
                  onClick={() => setSelectedChild(child.id)}
                >
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarFallback className="text-xs bg-orange-200 text-orange-700">
                      {child.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {child.name}
                  {child.isLocked && (
                    <Badge variant="outline" className="ml-2 bg-red-100 text-red-700 border-red-200">
                      Locked
                    </Badge>
                  )}
                </Button>
              ))}

              <Dialog open={showAddChild} onOpenChange={setShowAddChild}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-dashed border-orange-300 text-orange-500">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Child
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Child</DialogTitle>
                  </DialogHeader>
                  <AddChildForm onAddChild={handleAddChild} onCancel={() => setShowAddChild(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create a New Task</DialogTitle>
                </DialogHeader>
                <CreateTaskForm
                  onCreateTask={handleCreateTask}
                  children={children}
                  onCancel={() => setShowCreateTask(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Pending approval notification */}
          {pendingApprovalCount > 0 && (
            <Card className="border-orange-300 bg-orange-50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-full mr-3">
                    <Calendar className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-orange-800">Tasks Awaiting Approval</h3>
                    <p className="text-sm text-orange-700">
                      {pendingApprovalCount} task{pendingApprovalCount !== 1 ? "s" : ""} need your approval
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-orange-400 text-orange-600 hover:bg-orange-100"
                  onClick={() => setActiveTab("pending")}
                >
                  View Tasks
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Time period tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="pending">
                Pending
                {pendingApprovalCount > 0 && <Badge className="ml-2 bg-orange-500">{pendingApprovalCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
              <TabsTrigger value="thisWeek">This Week</TabsTrigger>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {Object.keys(tasksByChild).length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No tasks found for the selected filters.</p>
                  </CardContent>
                </Card>
              ) : (
                Object.entries(tasksByChild).map(([childId, childTasks]) => {
                  const child = children.find((c) => c.id === childId)

                  return (
                    <Card key={childId} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 py-3 px-4">
                        <CardTitle className="text-base flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="text-xs bg-orange-200 text-orange-700">
                              {child?.name.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          {child?.name || "Unknown Child"}
                          <Badge className="ml-2 bg-blue-100 text-blue-700 border-blue-200">
                            {childTasks.length} task{childTasks.length !== 1 ? "s" : ""}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {childTasks.map((task, index) => (
                            <div key={task.id}>
                              {index > 0 && <Separator className="my-3" />}
                              <TaskSummary
                                task={task}
                                onApprove={() => handleApproveTask(task.id)}
                                onReject={() => handleRejectTask(task.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

// Simplified task summary component for the parent dashboard
function TaskSummary({
  task,
  onApprove,
  onReject,
}: {
  task: Task
  onApprove: () => void
  onReject: () => void
}) {
  const formatTime = (seconds?: number) => {
    if (!seconds) return "0 min"
    return `${Math.floor(seconds / 60)} min`
  }

  const getStatusBadge = () => {
    switch (task.status) {
      case "pending":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Pending</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>
      case "completed":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Needs Approval</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejected</Badge>
      default:
        return null
    }
  }

  const getTaskIcon = () => {
    const lowerTitle = task.title.toLowerCase()
    if (lowerTitle.includes("read")) return "📚"
    if (lowerTitle.includes("clean")) return "🧹"
    if (lowerTitle.includes("homework")) return "📝"
    if (lowerTitle.includes("piano") || lowerTitle.includes("music")) return "🎹"
    if (lowerTitle.includes("brush") || lowerTitle.includes("teeth")) return "🪥"
    return task.type === "time" ? "⏱️" : "✅"
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3">
        <div className="text-2xl mt-0.5">{getTaskIcon()}</div>
        <div>
          <h3 className="font-medium">{task.title}</h3>
          {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
          <div className="flex items-center mt-1 space-x-3 text-sm text-gray-500">
            <span>
              {task.type === "time" ? `${formatTime(task.timeSpent)} spent` : `${task.creditMinutes} min reward`}
            </span>
            <span>•</span>
            <span>{format(new Date(task.createdAt), "MMM d, h:mm a")}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {getStatusBadge()}

        {task.status === "completed" && (
          <div className="flex space-x-1 ml-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-green-500 text-green-600 hover:bg-green-50"
              onClick={onApprove}
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-red-500 text-red-600 hover:bg-red-50"
              onClick={onReject}
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

