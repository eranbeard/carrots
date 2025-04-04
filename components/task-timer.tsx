"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface TaskTimerProps {
  taskId: string
  taskTitle: string
  onComplete: (taskId: string, seconds: number) => void
  initialSeconds?: number
}

export function TaskTimer({ taskId, taskTitle, onComplete, initialSeconds = 0 }: TaskTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleComplete = () => {
    setIsRunning(false)
    onComplete(taskId, seconds)
  }

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  // For the progress bar - we'll show progress in 5-minute increments
  const fiveMinutesInSeconds = 5 * 60
  const currentSegment = Math.floor(seconds / fiveMinutesInSeconds)
  const progressInCurrentSegment = ((seconds % fiveMinutesInSeconds) / fiveMinutesInSeconds) * 100

  // Get task emoji based on title
  const getTaskEmoji = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("read")) return "📚"
    if (lowerTitle.includes("clean")) return "🧹"
    if (lowerTitle.includes("homework")) return "📝"
    if (lowerTitle.includes("piano") || lowerTitle.includes("music")) return "🎹"
    if (lowerTitle.includes("brush") || lowerTitle.includes("teeth")) return "🪥"
    return "⏱️"
  }

  return (
    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-green-400 to-teal-500 text-white">
      <CardContent className="p-4">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-2">{getTaskEmoji(taskTitle)}</span>
          <h3 className="text-xl font-bold">{taskTitle}</h3>
        </div>

        <div className="flex flex-col items-center">
          <motion.div
            animate={isRunning ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: isRunning ? Number.POSITIVE_INFINITY : 0 }}
            className="text-5xl font-mono font-bold text-white mb-2"
          >
            {formatTime(seconds)}
          </motion.div>

          {currentSegment > 0 && (
            <div className="text-sm text-teal-100 mb-2">{currentSegment * 5} minutes completed</div>
          )}
        </div>

        <div className="relative pt-1 mb-4">
          <Progress value={progressInCurrentSegment} className="h-3 bg-teal-300/50 rounded-full" />
          {progressInCurrentSegment > 90 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              className="absolute -right-1 -top-1 text-lg"
            >
              🚀
            </motion.div>
          )}
        </div>

        <div className="flex space-x-2">
          {isRunning ? (
            <Button
              variant="outline"
              className="flex-1 border-white text-white hover:bg-white/20"
              onClick={handlePause}
            >
              <span className="text-xl mr-2">⏸️</span>
              Pause
            </Button>
          ) : (
            <Button className="flex-1 bg-white text-teal-600 hover:bg-white/90" onClick={handleStart}>
              <span className="text-xl mr-2">▶️</span>
              {seconds === 0 ? "Start" : "Resume"}
            </Button>
          )}

          <Button
            className="flex-1 bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={handleComplete}
            disabled={seconds === 0}
          >
            <span className="text-xl mr-2">✅</span>
            Complete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

