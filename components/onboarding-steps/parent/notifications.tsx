"use client"

import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Bell, BarChart } from "lucide-react"

export function NotificationsStep() {
  const { data, updateData } = useOnboarding()

  return (
    <OnboardingLayout
      title="Notification Preferences"
      subtitle="Choose how and when you want to be notified."
      progress={70}
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dailySummary" className="text-base flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-orange-500" />
              Daily Summary
            </Label>
            <p className="text-sm text-gray-500">Receive a daily report of tasks completed and game time earned</p>
          </div>
          <Switch
            id="dailySummary"
            checked={data.dailySummary}
            onCheckedChange={(checked) => updateData("dailySummary", checked)}
          />
        </div>

        {data.dailySummary && (
          <div className="pl-6 space-y-2">
            <Label htmlFor="dailySummaryTime">Time to receive summary</Label>
            <Input
              id="dailySummaryTime"
              type="time"
              value={data.dailySummaryTime}
              onChange={(e) => updateData("dailySummaryTime", e.target.value)}
            />
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifyOnCompletion" className="text-base flex items-center">
              <Bell className="h-4 w-4 mr-2 text-orange-500" />
              Task Completion Alerts
            </Label>
            <p className="text-sm text-gray-500">Get notified when your child completes a task</p>
          </div>
          <Switch
            id="notifyOnCompletion"
            checked={data.notifyOnCompletion}
            onCheckedChange={(checked) => updateData("notifyOnCompletion", checked)}
          />
        </div>
      </div>
    </OnboardingLayout>
  )
}

