"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface GameTimeBankProps {
  minutes: number
  isChild?: boolean
}

export function GameTimeBank({ minutes, isChild = false }: GameTimeBankProps) {
  const formatTime = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const remainingMins = mins % 60

    if (hours > 0) {
      return `${hours}h ${remainingMins}m`
    }
    return `${remainingMins}m`
  }

  // For the progress bar - max at 120 minutes (2 hours)
  const progressPercentage = Math.min((minutes / 120) * 100, 100)

  if (isChild) {
    return (
      <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              className="text-3xl mr-2"
            >
              🎮
            </motion.div>
            <h3 className="text-xl font-bold">Game Time Bank</h3>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-4xl font-bold text-white">{formatTime(minutes)}</span>
              <span className="text-blue-100">available</span>
            </div>

            <div className="relative pt-1">
              <Progress value={progressPercentage} className="h-3 bg-blue-300/50 rounded-full" />
              <div className="absolute -right-1 -top-1">
                {progressPercentage >= 50 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg">
                    🚀
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Parent version remains simpler
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <span className="text-xl mr-2">🎮</span>
          <h3 className="text-lg font-medium">Game Time Bank</h3>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-bold text-orange-500">{formatTime(minutes)}</span>
            <span className="text-gray-500">available</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

