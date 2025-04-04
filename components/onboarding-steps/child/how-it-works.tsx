"use client"

import { OnboardingLayout } from "@/components/onboarding-layout"
import { motion } from "framer-motion"
import { Clock, CheckCircle, Play } from "lucide-react"

export function HowItWorksStep() {
  return (
    <OnboardingLayout title="How It Works" subtitle="Here's how you can earn and use Game Time" progress={85}>
      <div className="space-y-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          <div className="bg-blue-100 rounded-full p-3">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">Time-based Tasks</h3>
            <p className="text-sm text-gray-600">
              For activities like reading or practicing piano, you'll earn Game Time based on how long you spend on the
              task.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center space-x-4"
        >
          <div className="bg-orange-100 rounded-full p-3">
            <CheckCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium">Credit-based Tasks</h3>
            <p className="text-sm text-gray-600">
              For chores and one-time tasks, you'll earn a fixed amount of Game Time when you complete them.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center space-x-4"
        >
          <div className="bg-green-100 rounded-full p-3">
            <Play className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium">Using Game Time</h3>
            <p className="text-sm text-gray-600">
              Once you've earned Game Time, you can use it to play games. Your parent might need to approve your tasks
              first.
            </p>
          </div>
        </motion.div>
      </div>
    </OnboardingLayout>
  )
}

