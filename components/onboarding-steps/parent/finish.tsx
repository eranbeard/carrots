"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { CheckCircle } from "lucide-react"
import { Loader2 } from "lucide-react"

export function ParentFinishStep() {
  const { completeOnboarding, data } = useOnboarding()
  const router = useRouter()
  const [isCompleting, setIsCompleting] = useState(false)

  const handleFinish = async () => {
    setIsCompleting(true)
    try {
      await completeOnboarding()
      router.push("/parent-dashboard")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      setIsCompleting(false)
    }
  }

  return (
    <OnboardingLayout
      title="Setup Complete!"
      subtitle="You're all set to start using Carrot with your child."
      progress={100}
      nextButtonText={isCompleting ? "Setting up..." : "Go to Dashboard"}
      nextButtonDisabled={isCompleting}
      onNext={handleFinish}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="bg-green-100 rounded-full p-4">
            {isCompleting ? (
              <Loader2 className="h-16 w-16 text-green-500 animate-spin" />
            ) : (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-center">Here's what you can do next:</h3>

          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-orange-100 rounded-full p-1 mr-3 mt-0.5">
                <span className="text-orange-600 text-xs font-bold">1</span>
              </div>
              <p className="text-gray-700">
                Create tasks for {data.childProfiles.length > 0 ? data.childProfiles[0].name : "your child"} to complete
              </p>
            </li>
            <li className="flex items-start">
              <div className="bg-orange-100 rounded-full p-1 mr-3 mt-0.5">
                <span className="text-orange-600 text-xs font-bold">2</span>
              </div>
              <p className="text-gray-700">Track their progress and approve completed tasks</p>
            </li>
            <li className="flex items-start">
              <div className="bg-orange-100 rounded-full p-1 mr-3 mt-0.5">
                <span className="text-orange-600 text-xs font-bold">3</span>
              </div>
              <p className="text-gray-700">Manage their game time and set daily limits</p>
            </li>
          </ul>
        </div>
      </div>
    </OnboardingLayout>
  )
}

