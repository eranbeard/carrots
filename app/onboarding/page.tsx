"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { OnboardingProvider, useOnboarding } from "@/components/onboarding-provider"
import { UserTypeSelection } from "@/components/onboarding-steps/user-type-selection"
import { DeviceAccessStep } from "@/components/onboarding-steps/parent/device-access"
import { ChildProfileStep } from "@/components/onboarding-steps/parent/child-profile"
import { TaskPreferencesStep } from "@/components/onboarding-steps/parent/task-preferences"
import { RewardSettingsStep } from "@/components/onboarding-steps/parent/reward-settings"
import { ApprovalPreferenceStep } from "@/components/onboarding-steps/parent/approval-preference"
import { NotificationsStep } from "@/components/onboarding-steps/parent/notifications"
import { ChildAppAccessStep } from "@/components/onboarding-steps/parent/child-app-access"
import { ParentFinishStep } from "@/components/onboarding-steps/parent/finish"
import { EnterCodeStep } from "@/components/onboarding-steps/child/enter-code"
import { ChildWelcomeStep } from "@/components/onboarding-steps/child/welcome"
import { ChildPickAvatarStep } from "@/components/onboarding-steps/child/pick-avatar"
import { HowItWorksStep } from "@/components/onboarding-steps/child/how-it-works"
import { ChildAllSetStep } from "@/components/onboarding-steps/child/all-set"

function OnboardingFlow() {
  const { currentStep, data } = useOnboarding()
  const router = useRouter()

  // Check if onboarding is already completed
  useEffect(() => {
    const isCompleted = localStorage.getItem("carrot-onboarding-completed")
    if (isCompleted === "true") {
      // Redirect to the appropriate dashboard
      const savedData = localStorage.getItem("carrot-onboarding-data")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        if (parsedData.userType === "parent") {
          router.push("/parent-dashboard")
        } else {
          router.push("/child-dashboard")
        }
      } else {
        router.push("/")
      }
    }
  }, [router])

  // Determine which step to show based on user type and current step
  const renderStep = () => {
    // First step is always user type selection
    if (currentStep === 0) {
      return <UserTypeSelection />
    }

    // Parent flow
    if (data.userType === "parent") {
      switch (currentStep) {
        case 1:
          return <DeviceAccessStep />
        case 2:
          return <ChildProfileStep />
        case 3:
          return <TaskPreferencesStep />
        case 4:
          return <RewardSettingsStep />
        case 5:
          return <ApprovalPreferenceStep />
        case 6:
          return <NotificationsStep />
        case 7:
          // Only show the child app access step if the parent selected "own-device"
          return data.deviceAccess === "own-device" ? <ChildAppAccessStep /> : <ParentFinishStep />
        case 8:
          return <ParentFinishStep />
        default:
          return <UserTypeSelection />
      }
    }

    // Child flow
    if (data.userType === "child") {
      switch (currentStep) {
        case 1:
          return <EnterCodeStep />
        case 2:
          return <ChildWelcomeStep />
        case 3:
          return <ChildPickAvatarStep />
        case 4:
          return <HowItWorksStep />
        case 5:
          return <ChildAllSetStep />
        default:
          return <UserTypeSelection />
      }
    }

    return <UserTypeSelection />
  }

  return renderStep()
}

export default function OnboardingPage() {
  return (
    <OnboardingProvider>
      <OnboardingFlow />
    </OnboardingProvider>
  )
}

