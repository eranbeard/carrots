"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface GameTimeUsageProps {
  availableMinutes: number
  onUseGameTime: (minutes: number) => void
  onPauseGameTime: () => void
  onStopGameTime: () => void
  isLocked?: boolean
}

export function GameTimeUsage({
  availableMinutes,
  onUseGameTime,
  onPauseGameTime,
  onStopGameTime,
  isLocked = false,
}: GameTimeUsageProps) {
  const [isUsing, setIsUsing] = useState(false)
  const [selectedMinutes, setSelectedMinutes] = useState(30)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { toast } = useToast()

  // Handle countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isUsing && !isPaused && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval as NodeJS.Timeout)
            setIsUsing(false)
            toast({
              title: "Time's up!",
              description: "Your game time has ended.",
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isUsing, isPaused, remainingSeconds, toast])

  const handleStartGameTime = () => {
    if (selectedMinutes > availableMinutes) {
      toast({
        title: "Not enough time",
        description: `You only have ${availableMinutes} minutes available.`,
        variant: "destructive",
      })
      return
    }

    setRemainingSeconds(selectedMinutes * 60)
    setIsUsing(true)
    setIsPaused(false)
    onUseGameTime(selectedMinutes)
  }

  const handlePauseGameTime = () => {
    setIsPaused(true)
    onPauseGameTime()
  }

  const handleResumeGameTime = () => {
    setIsPaused(false)
  }

  const handleStopGameTime = () => {
    const minutesUsed = Math.ceil((selectedMinutes * 60 - remainingSeconds) / 60)
    setIsUsing(false)
    setRemainingSeconds(0)
    onStopGameTime()

    toast({
      title: "Game time stopped",
      description: `You used ${minutesUsed} minutes of game time.`,
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progressPercentage = isUsing ? (remainingSeconds / (selectedMinutes * 60)) * 100 : 100

  return (
    <Card className="border-none shadow-md overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-3xl mr-2"
          >
            🎮
          </motion.div>
          <h3 className="text-xl font-bold text-purple-800">Game Time</h3>
        </div>

        {!isUsing ? (
          <>
            <div className="text-sm font-medium text-purple-800 mb-2">How much time do you want to use?</div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="lg"
                className={`
                  h-16 flex flex-col items-center justify-center border-2
                  ${
                    selectedMinutes === 15
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "hover:border-purple-300 hover:bg-purple-50"
                  }
                `}
                onClick={() => setSelectedMinutes(15)}
              >
                <span className="text-xl mb-1">⏱️</span>
                <span>15 min</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`
                  h-16 flex flex-col items-center justify-center border-2
                  ${
                    selectedMinutes === 30
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "hover:border-purple-300 hover:bg-purple-50"
                  }
                `}
                onClick={() => setSelectedMinutes(30)}
              >
                <span className="text-xl mb-1">⏱️</span>
                <span>30 min</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`
                  h-16 flex flex-col items-center justify-center border-2
                  ${
                    selectedMinutes === 60
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "hover:border-purple-300 hover:bg-purple-50"
                  }
                `}
                onClick={() => setSelectedMinutes(60)}
              >
                <span className="text-xl mb-1">⏱️</span>
                <span>1 hour</span>
              </Button>
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="range"
                min="5"
                max={Math.min(120, availableMinutes)}
                step="5"
                value={selectedMinutes}
                onChange={(e) => setSelectedMinutes(Number.parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="w-16 text-center font-medium text-purple-800">{selectedMinutes} min</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <motion.div
                animate={!isPaused ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1, repeat: !isPaused ? Number.POSITIVE_INFINITY : 0 }}
                className="text-5xl font-mono font-bold text-purple-800 mb-2"
              >
                {formatTime(remainingSeconds)}
              </motion.div>
              <div className="text-sm text-gray-600">remaining</div>
            </div>

            <div className="relative pt-1">
              <Progress value={progressPercentage} className="h-3 bg-purple-100 rounded-full" />
              {progressPercentage > 75 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -right-1 -top-1 text-lg"
                >
                  ⏳
                </motion.div>
              )}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        {!isUsing ? (
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-12 text-lg"
            onClick={handleStartGameTime}
            disabled={isLocked || availableMinutes < 5}
          >
            <span className="text-xl mr-2">🎮</span>
            Start Game Time
          </Button>
        ) : (
          <div className="flex w-full space-x-2">
            {isPaused ? (
              <Button
                className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                onClick={handleResumeGameTime}
              >
                <span className="text-xl mr-2">▶️</span>
                Resume
              </Button>
            ) : (
              <Button
                className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                onClick={handlePauseGameTime}
              >
                <span className="text-xl mr-2">⏸️</span>
                Pause
              </Button>
            )}

            <Button
              variant="outline"
              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
              onClick={handleStopGameTime}
            >
              <span className="text-xl mr-2">⏹️</span>
              End
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

