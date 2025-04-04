"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { motion } from "framer-motion"
import { CheckCircle, Clock, ListTodo, Loader2 } from "lucide-react"

export function ChildAllSetStep() {
  const { completeOnboarding } = useOnboarding()
  const router = useRouter()
  const [isCompleting, setIsCompleting] = useState(false)

  const handleFinish = async () => {
    setIsCompleting(true)
    try {
      await completeOnboarding()
      router.push("/child-dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      setIsCompleting(false)
    }
  }

  return (
    <OnboardingLayout
      title="You're All Set!"
      subtitle="Time to start earning Game Time"
      progress={100}
      nextButtonText={isCompleting ? "Setting up..." : "Let's Go!"}
      nextButtonDisabled={isCompleting}
      onNext={handleFinish}
    >
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="bg-green-100 rounded-full p-4">
            {isCompleting ? (
              <Loader2 className="h-16 w-16 text-green-500 animate-spin" />
            ) : (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-orange-50 border border-orange-200 rounded-md p-4 flex flex-col items-center text-center"
          >
            <Clock className="h-8 w-8 text-orange-500 mb-2" />
            <h3 className="font-medium">Game Time Bank</h3>
            <p className="text-2xl font-bold text-orange-600">0m</p>
            <p className="text-xs text-gray-600 mt-1">Complete tasks to earn time</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-md p-4 flex flex-col items-center text-center"
          >
            <ListTodo className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium">Tasks</h3>
            <p className="text-xs text-gray-600 mt-1">Check your dashboard for available tasks</p>
          </motion.div>
        </div>
      </div>
    </OnboardingLayout>
  )
}

