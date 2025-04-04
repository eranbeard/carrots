"use client"

import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export function RewardSettingsStep() {
  const { data, updateData } = useOnboarding()

  return (
    <OnboardingLayout
      title="Reward Settings"
      subtitle="Configure how game time is earned for different tasks."
      progress={50}
    >
      {data.taskPreferences.includes("time-based") && (
        <div className="space-y-4 mb-6 p-4 border rounded-md bg-blue-50">
          <h3 className="font-medium text-blue-800">Time-based Task Rewards</h3>

          <div className="space-y-2">
            <Label htmlFor="timeRatio" className="flex justify-between">
              <span>Game time earned per minute of task time</span>
              <span className="font-medium text-blue-800">{data.timeRatio}:1</span>
            </Label>
            <Slider
              id="timeRatio"
              min={0.25}
              max={2}
              step={0.25}
              value={[data.timeRatio]}
              onValueChange={(value) => updateData("timeRatio", value[0])}
              className="py-2"
            />
            <p className="text-xs text-gray-600">
              Example: At {data.timeRatio}:1, 10 minutes of reading = {10 * data.timeRatio} minutes of game time
            </p>
          </div>
        </div>
      )}

      {data.taskPreferences.includes("credit-based") && (
        <div className="space-y-4 p-4 border rounded-md bg-orange-50">
          <h3 className="font-medium text-orange-800">Credit-based Task Rewards</h3>

          <div className="space-y-2">
            <Label htmlFor="defaultCreditMinutes">Default reward for completed tasks (minutes)</Label>
            <Input
              id="defaultCreditMinutes"
              type="number"
              min={1}
              max={60}
              value={data.defaultCreditMinutes}
              onChange={(e) => updateData("defaultCreditMinutes", Number.parseInt(e.target.value) || 10)}
              className="bg-white"
            />
            <p className="text-xs text-gray-600">
              This is the default value. You can customize rewards for individual tasks later.
            </p>
          </div>
        </div>
      )}
    </OnboardingLayout>
  )
}

