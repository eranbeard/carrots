"use client"

import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding, type TaskType } from "@/components/onboarding-provider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle } from "lucide-react"

export function TaskPreferencesStep() {
  const { data, updateData } = useOnboarding()

  const handleToggleTaskType = (type: TaskType) => {
    const currentPreferences = [...data.taskPreferences]

    if (currentPreferences.includes(type)) {
      // Remove the type if it's already selected
      updateData(
        "taskPreferences",
        currentPreferences.filter((t) => t !== type),
      )
    } else {
      // Add the type if it's not selected
      updateData("taskPreferences", [...currentPreferences, type])
    }
  }

  return (
    <OnboardingLayout
      title="Which types of tasks will your child do?"
      subtitle="Select all that apply. You can change this later."
      nextButtonDisabled={data.taskPreferences.length === 0}
      progress={40}
    >
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 border rounded-md hover:bg-gray-50">
          <Checkbox
            id="time-based"
            checked={data.taskPreferences.includes("time-based")}
            onCheckedChange={() => handleToggleTaskType("time-based")}
          />
          <div>
            <Label htmlFor="time-based" className="flex items-center text-base font-medium cursor-pointer">
              <Clock className="mr-2 h-5 w-5 text-blue-500" />
              Time-based Tasks
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              Activities where time spent matters, like reading or practicing an instrument. Child earns game time equal
              to time spent on the task.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 p-4 border rounded-md hover:bg-gray-50">
          <Checkbox
            id="credit-based"
            checked={data.taskPreferences.includes("credit-based")}
            onCheckedChange={() => handleToggleTaskType("credit-based")}
          />
          <div>
            <Label htmlFor="credit-based" className="flex items-center text-base font-medium cursor-pointer">
              <CheckCircle className="mr-2 h-5 w-5 text-orange-500" />
              Credit-based Tasks
            </Label>
            <p className="text-sm text-gray-500 mt-1">
              One-time tasks like chores or homework. Child earns a fixed amount of game time for completing the task.
            </p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}

