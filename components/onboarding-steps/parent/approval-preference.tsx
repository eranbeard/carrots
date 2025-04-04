"use client"

import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle } from "lucide-react"

export function ApprovalPreferenceStep() {
  const { data, updateData } = useOnboarding()

  return (
    <OnboardingLayout
      title="Task Approval Settings"
      subtitle="Configure how tasks are approved and game time is awarded."
      progress={60}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="requireApproval" className="text-base">
              Require parent approval for tasks
            </Label>
            <p className="text-sm text-gray-500">You'll need to approve each task before game time is awarded</p>
          </div>
          <Switch
            id="requireApproval"
            checked={data.requireApproval}
            onCheckedChange={(checked) => updateData("requireApproval", checked)}
          />
        </div>

        <div className="p-4 rounded-md bg-gray-50 border">
          {data.requireApproval ? (
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Manual Approval</p>
                <p className="text-sm text-gray-600">
                  When your child completes a task, you'll receive a notification. Game time will only be added after
                  you approve the task.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Auto Approval</p>
                <p className="text-sm text-gray-600">
                  Game time will be automatically added when your child marks a task as complete. You can still review
                  the task history later.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  )
}

