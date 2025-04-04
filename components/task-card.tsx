"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Task {
  id: string
  title: string
  description?: string
  type: "time" | "credit"
  creditMinutes?: number
  status: "pending" | "in-progress" | "completed" | "approved" | "rejected"
  timeSpent?: number // in seconds
  createdAt: string
  completedAt?: string
  childId?: string // Added childId to track which child the task belongs to
}

interface TaskCardProps {
  task: Task
  onStart?: () => void
  onPause?: () => void
  onComplete?: () => void
  onApprove?: () => void
  onReject?: () => void
  isParent?: boolean
}

export function TaskCard({ task, onStart, onPause, onComplete, onApprove, onReject, isParent = false }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatTime = (seconds?: number) => {
    if (!seconds) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // For the child view, we'll use a simplified version
  if (!isParent) {
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
                {task.status === "pending" && (
                  <Button
                    className={`w-full ${
                      task.type === "time"
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                        : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                    }`}
                    onClick={task.type === "time" ? onStart : onComplete}
                  >
                    <span className="mr-2">{task.type === "time" ? "⏱️" : "✅"}</span>
                    {task.type === "time" ? "Start Timer" : "Mark as Done"}
                  </Button>
                )}

                {task.status === "in-progress" && (
                  <div className="flex w-full space-x-2">
                    <Button className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500" onClick={onPause}>
                      <span className="mr-2">⏸️</span>
                      Pause
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500" onClick={onComplete}>
                      <span className="mr-2">✅</span>
                      Complete
                    </Button>
                  </div>
                )}

                {task.status === "completed" && (
                  <div className="bg-yellow-100 rounded-lg p-2 text-center">
                    <p className="text-yellow-800 flex items-center justify-center">
                      <span className="mr-2">⏳</span>
                      Waiting for parent approval
                    </p>
                  </div>
                )}

                {task.status === "approved" && (
                  <div className="bg-green-100 rounded-lg p-2 text-center">
                    <p className="text-green-800 flex items-center justify-center">
                      <span className="mr-2">🎉</span>
                      Approved! You earned{" "}
                      {task.type === "time"
                        ? `${Math.floor((task.timeSpent || 0) / 60)} minutes`
                        : `${task.creditMinutes} minutes`}
                    </p>
                  </div>
                )}

                {task.status === "rejected" && (
                  <div className="bg-red-100 rounded-lg p-2 text-center">
                    <p className="text-red-800 flex items-center justify-center">
                      <span className="mr-2">😕</span>
                      Task was not approved
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Parent view remains more functional
  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isHovered && "shadow-md",
        task.status === "completed" && "border-orange-300 bg-orange-50",
        task.status === "approved" && "border-green-300 bg-green-50",
        task.status === "rejected" && "border-red-300 bg-red-50",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge
            variant={task.type === "time" ? "default" : "outline"}
            className={cn(task.type === "time" ? "bg-blue-500" : "border-orange-500 text-orange-500")}
          >
            {task.type === "time" ? "Time-based" : "Credit-based"}
          </Badge>
        </div>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {task.type === "time" ? (
            <>
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Time spent: {formatTime(task.timeSpent)}</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Reward: {task.creditMinutes} minutes</span>
            </>
          )}
        </div>

        {task.status === "completed" && <div className="mt-2 text-sm text-orange-600">Waiting for parent approval</div>}

        {task.status === "approved" && (
          <div className="mt-2 text-sm text-green-600">
            Approved!{" "}
            {task.type === "time"
              ? `Earned ${formatTime(task.timeSpent)} of game time`
              : `Earned ${task.creditMinutes} minutes of game time`}
          </div>
        )}

        {task.status === "rejected" && <div className="mt-2 text-sm text-red-600">Task was not approved</div>}
      </CardContent>
      <CardFooter className="pt-0">
        {isParent && task.status === "completed" && (
          <div className="flex w-full space-x-2">
            <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={onApprove}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button variant="outline" className="flex-1 border-red-500 text-red-500 hover:bg-red-50" onClick={onReject}>
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

