"use client"

import { Button } from "@/components/ui/button"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { User, Users } from "lucide-react"

export function UserTypeSelection() {
  const { updateData, setCurrentStep } = useOnboarding()

  const handleSelectUserType = (type: "parent" | "child") => {
    updateData("userType", type)
    // Add this line to advance to the next step
    setCurrentStep(1)
  }

  return (
    <OnboardingLayout
      title="Who's using this app right now?"
      showBackButton={false}
      showNextButton={false}
      progress={10}
    >
      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center border-2 hover:border-orange-500 hover:bg-orange-50"
          onClick={() => handleSelectUserType("parent")}
        >
          <Users className="h-12 w-12 mb-2 text-orange-500" />
          <span className="text-lg font-medium">I'm a Parent</span>
          <span className="text-sm text-gray-500 mt-1">Set up tasks and manage game time for my child</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center border-2 hover:border-orange-500 hover:bg-orange-50"
          onClick={() => handleSelectUserType("child")}
        >
          <User className="h-12 w-12 mb-2 text-orange-500" />
          <span className="text-lg font-medium">I'm a Kid</span>
          <span className="text-sm text-gray-500 mt-1">Complete tasks and earn game time</span>
        </Button>
      </div>
    </OnboardingLayout>
  )
}

