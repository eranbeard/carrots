"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useAuth } from "@/components/auth-provider"

// Types for our onboarding data
export type UserType = "parent" | "child"
export type DeviceAccess = "own-device" | "parent-managed"
export type TaskType = "time-based" | "credit-based"

export interface ChildProfile {
  name: string
  age: number
  avatarId: string
}

export interface OnboardingData {
  userType: UserType | null
  deviceAccess: DeviceAccess | null
  childProfiles: ChildProfile[]
  taskPreferences: TaskType[]
  timeRatio: number
  defaultCreditMinutes: number
  requireApproval: boolean
  dailySummary: boolean
  dailySummaryTime: string
  notifyOnCompletion: boolean
  connectionCode: string
  childAvatarId: string | null
}

interface OnboardingContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  data: OnboardingData
  updateData: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void
  addChildProfile: (profile: ChildProfile) => void
  resetOnboarding: () => void
  completeOnboarding: () => Promise<void>
}

const defaultOnboardingData: OnboardingData = {
  userType: null,
  deviceAccess: null,
  childProfiles: [],
  taskPreferences: ["time-based", "credit-based"],
  timeRatio: 1,
  defaultCreditMinutes: 10,
  requireApproval: true,
  dailySummary: true,
  dailySummaryTime: "19:00",
  notifyOnCompletion: true,
  connectionCode: "",
  childAvatarId: null,
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData)
  const { signup } = useAuth()

  // Update a specific field in the onboarding data
  const updateData = <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  // Add a child profile
  const addChildProfile = (profile: ChildProfile) => {
    setData((prev) => ({
      ...prev,
      childProfiles: [...prev.childProfiles, profile],
    }))
  }

  // Reset the onboarding process
  const resetOnboarding = () => {
    setCurrentStep(0)
    setData(defaultOnboardingData)
    localStorage.removeItem("carrot-onboarding-completed")
    localStorage.removeItem("carrot-onboarding-data")
  }

  // Complete the onboarding process
  const completeOnboarding = async () => {
    // Generate a random connection code if parent
    if (data.userType === "parent" && data.deviceAccess === "own-device") {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      updateData("connectionCode", code)
    }

    // Store onboarding data in localStorage
    localStorage.setItem("carrot-onboarding-completed", "true")
    localStorage.setItem("carrot-onboarding-data", JSON.stringify(data))

    // Create a user account based on onboarding data
    if (data.userType === "parent") {
      // Create a parent account
      await signup(
        data.childProfiles.length > 0 ? `Parent of ${data.childProfiles[0].name}` : "Parent",
        "parent@example.com",
        "password123",
        "parent",
      )
    } else {
      // Create a child account
      await signup("Child User", "child@example.com", "password123", "child", data.connectionCode || undefined)
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        data,
        updateData,
        addChildProfile,
        resetOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}

