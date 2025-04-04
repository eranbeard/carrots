"use client"

import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useOnboarding } from "./onboarding-provider"

interface OnboardingLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  showNextButton?: boolean
  nextButtonText?: string
  nextButtonDisabled?: boolean
  onNext?: () => void
  onBack?: () => void
  progress?: number
}

export function OnboardingLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
  showNextButton = true,
  nextButtonText = "Next",
  nextButtonDisabled = false,
  onNext,
  onBack,
  progress,
}: OnboardingLayoutProps) {
  const { currentStep, setCurrentStep } = useOnboarding()

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      setCurrentStep(Math.max(0, currentStep - 1))
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-orange-500">🥕 Carrot</h1>
          {progress !== undefined && (
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>

            <div className="space-y-6">{children}</div>

            <div className="flex justify-between mt-8">
              {showBackButton ? (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div />
              )}
              {showNextButton && (
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleNext}
                  disabled={nextButtonDisabled}
                >
                  {nextButtonText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

