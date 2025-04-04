"use client"

import { OnboardingLayout } from "@/components/onboarding-layout"
import { motion } from "framer-motion"

export function ChildWelcomeStep() {
  // In a real app, we would fetch the child's name from the parent's account
  // using the connection code. For now, we'll use a placeholder.
  const childName = "Alex"

  return (
    <OnboardingLayout
      title={`Welcome, ${childName}!`}
      subtitle="You can earn Game Time by doing cool tasks."
      progress={50}
    >
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="text-8xl">🎮</div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold"
            >
              +10
            </motion.div>
          </div>
        </motion.div>

        <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
          <h3 className="font-medium text-orange-800 mb-2">Here's how it works:</h3>
          <ul className="space-y-2 text-orange-700">
            <li className="flex items-center">
              <span className="bg-orange-200 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs font-bold">
                1
              </span>
              <span>Complete tasks your parent assigns to you</span>
            </li>
            <li className="flex items-center">
              <span className="bg-orange-200 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs font-bold">
                2
              </span>
              <span>Earn Game Time for each completed task</span>
            </li>
            <li className="flex items-center">
              <span className="bg-orange-200 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-xs font-bold">
                3
              </span>
              <span>Use your earned Game Time to play games</span>
            </li>
          </ul>
        </div>
      </div>
    </OnboardingLayout>
  )
}

