"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface StreakTrackerProps {
  currentStreak: number
  longestStreak: number
}

export function StreakTracker({ currentStreak, longestStreak }: StreakTrackerProps) {
  // Progress towards next streak bonus (every 3 days)
  const nextBonus = currentStreak % 3
  const progressToNextBonus = (nextBonus / 3) * 100

  return (
    <Card className="border-none shadow-md overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 text-white">
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <motion.div
            animate={{
              rotate: [0, 15, 0, 15, 0],
              scale: [1, 1.2, 1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            className="text-3xl mr-2"
          >
            🔥
          </motion.div>
          <h3 className="text-xl font-bold">Daily Streak</h3>
        </div>

        <div className="flex justify-between items-baseline mb-2">
          <div className="text-4xl font-bold text-white flex items-center">
            {currentStreak}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="text-yellow-300 ml-1"
            >
              🔥
            </motion.span>
          </div>
          <div className="text-sm text-orange-100">Best: {longestStreak}</div>
        </div>

        {currentStreak > 0 && (
          <>
            <div className="flex justify-between text-xs mb-1 text-orange-100">
              <span>Next bonus in</span>
              <span>{3 - nextBonus} days</span>
            </div>
            <div className="relative pt-1">
              <Progress value={progressToNextBonus} className="h-3 bg-orange-300/50 rounded-full" />
              {nextBonus === 0 && currentStreak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="absolute -right-1 -top-1 text-lg"
                >
                  🎁
                </motion.div>
              )}
            </div>
            {nextBonus === 0 && currentStreak > 0 && (
              <div className="mt-2 text-sm text-yellow-300 font-medium flex items-center">
                <span className="mr-1">Bonus earned!</span>
                <span className="font-bold">+5 minutes</span>
              </div>
            )}
          </>
        )}

        {currentStreak === 0 && (
          <div className="text-sm text-orange-100 mt-2">Complete a task today to start your streak!</div>
        )}
      </CardContent>
    </Card>
  )
}

