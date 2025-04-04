"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"

interface ChildAvatarProps {
  name: string
  level: number
  showReaction?: "cheer" | "levelUp" | "streak" | null
  streakCount?: number
}

export function ChildAvatar({ name, level, showReaction = null, streakCount = 0 }: ChildAvatarProps) {
  const [reaction, setReaction] = useState(showReaction)

  // Reset reaction after animation
  useEffect(() => {
    if (showReaction) {
      setReaction(showReaction)
      const timer = setTimeout(() => {
        setReaction(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showReaction])

  // Get avatar image based on level
  const getAvatarImage = () => {
    // In a real app, you'd have different avatars for different levels
    // For now, we'll use placeholder images
    return `/placeholder.svg?height=200&width=200`
  }

  return (
    <Card className="relative flex flex-col items-center p-4 overflow-hidden">
      <div className="relative">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-300">
          <Image
            src={getAvatarImage() || "/placeholder.svg"}
            alt={`${name}'s avatar`}
            width={96}
            height={96}
            className="object-cover"
          />
        </div>

        {/* Level badge */}
        <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-white">
          {level}
        </div>

        {/* Streak indicator */}
        {streakCount >= 3 && (
          <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full px-2 py-1 text-xs font-bold border-2 border-white flex items-center">
            <span className="mr-1">{streakCount}</span>
            <span className="text-yellow-300">🔥</span>
          </div>
        )}
      </div>

      <h3 className="mt-2 font-medium text-lg">{name}</h3>

      {/* Reactions */}
      <AnimatePresence>
        {reaction === "cheer" && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="bg-orange-100 bg-opacity-80 rounded-full p-6 flex flex-col items-center">
              <span className="text-4xl">🎉</span>
              <span className="font-bold text-orange-600 mt-2">Great job!</span>
            </div>
          </motion.div>
        )}

        {reaction === "levelUp" && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-blue-100 bg-opacity-80 rounded-full p-6 flex flex-col items-center">
              <span className="text-4xl">⭐</span>
              <span className="font-bold text-blue-600 mt-2">Level Up!</span>
            </div>
          </motion.div>
        )}

        {reaction === "streak" && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 10 }}
          >
            <div className="bg-yellow-100 bg-opacity-80 rounded-full p-6 flex flex-col items-center">
              <span className="text-4xl">🔥</span>
              <span className="font-bold text-yellow-600 mt-2">Streak Bonus!</span>
              <span className="text-sm text-yellow-600">+5 mins</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

