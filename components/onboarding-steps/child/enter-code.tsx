"use client"

import { useState } from "react"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EnterCodeStep() {
  const { updateData } = useOnboarding()
  const [code, setCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const { toast } = useToast()

  const handleValidateCode = async () => {
    if (code.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      })
      return
    }

    setIsValidating(true)

    // In a real app, this would validate the code against a database
    // For now, we'll simulate a network request and accept any 6-digit code
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsValidating(false)
    setIsValid(true)
    updateData("connectionCode", code)

    toast({
      title: "Success!",
      description: "Your code has been validated.",
    })
  }

  return (
    <OnboardingLayout
      title="Enter Your Connection Code"
      subtitle="Ask your parent for the 6-digit code to connect your account."
      showBackButton={false}
      nextButtonDisabled={!isValid}
      progress={25}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="connectionCode">Connection Code</Label>
          <Input
            id="connectionCode"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="text-center text-2xl tracking-widest"
            maxLength={6}
            disabled={isValidating || isValid}
          />
        </div>

        {!isValid && (
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={handleValidateCode}
            disabled={code.length !== 6 || isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              "Validate Code"
            )}
          </Button>
        )}

        {isValid && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
            <p className="text-green-800 font-medium">Code validated successfully!</p>
            <p className="text-sm text-green-600 mt-1">Click Next to continue.</p>
          </div>
        )}
      </div>
    </OnboardingLayout>
  )
}

