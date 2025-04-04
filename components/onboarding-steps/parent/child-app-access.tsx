"use client"

import { useEffect } from "react"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { Button } from "@/components/ui/button"
import { Copy, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ChildAppAccessStep() {
  const { data, updateData } = useOnboarding()
  const { toast } = useToast()

  // Generate a connection code if not already set
  useEffect(() => {
    if (!data.connectionCode) {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      updateData("connectionCode", code)
    }
  }, [data.connectionCode, updateData])

  const handleCopyCode = () => {
    navigator.clipboardd.writeText(data.connectionCode)
    toast({
      title: "Code copied!",
      description: "You can now share this with your child.",
    })
  }

  return (
    <OnboardingLayout
      title="Connect Your Child's Device"
      subtitle="Use this code to connect your child's device to your account."
      progress={80}
      nextButtonText="Continue"
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <Smartphone className="h-24 w-24 text-orange-500" />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Have your child enter this code on their device:</p>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-3xl font-bold tracking-widest text-orange-600">{data.connectionCode}</p>
          </div>
          <Button
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
            onClick={handleCopyCode}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Code
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
          <p>
            <strong>Note:</strong> This code will expire in 24 hours. If your child doesn't connect within that time,
            you can generate a new code from the parent dashboard.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  )
}

