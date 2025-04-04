"use client"

import { Button } from "@/components/ui/button"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding, type DeviceAccess } from "@/components/onboarding-provider"
import { Smartphone, Monitor } from "lucide-react"

export function DeviceAccessStep() {
  const { updateData, data } = useOnboarding()

  const handleSelectDeviceAccess = (access: DeviceAccess) => {
    updateData("deviceAccess", access)
  }

  return (
    <OnboardingLayout
      title="Will your child use the app on their own device?"
      subtitle="This helps us set up the right experience for your family."
      progress={20}
    >
      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className={`
            h-auto py-6 flex flex-col items-center border-2 hover:border-orange-500 hover:bg-orange-50
            ${data.deviceAccess === "own-device" ? "border-orange-500 bg-orange-50" : ""}
          `}
          onClick={() => handleSelectDeviceAccess("own-device")}
        >
          <Smartphone className="h-12 w-12 mb-2 text-orange-500" />
          <span className="text-lg font-medium">Yes, they have their own device</span>
          <span className="text-sm text-gray-500 mt-1">We'll set up a connection between your accounts</span>
        </Button>

        <Button
          variant="outline"
          className={`
            h-auto py-6 flex flex-col items-center border-2 hover:border-orange-500 hover:bg-orange-50
            ${data.deviceAccess === "parent-managed" ? "border-orange-500 bg-orange-50" : ""}
          `}
          onClick={() => handleSelectDeviceAccess("parent-managed")}
        >
          <Monitor className="h-12 w-12 mb-2 text-orange-500" />
          <span className="text-lg font-medium">No, I'll manage everything</span>
          <span className="text-sm text-gray-500 mt-1">You'll track tasks and game time from your device</span>
        </Button>
      </div>
    </OnboardingLayout>
  )
}

