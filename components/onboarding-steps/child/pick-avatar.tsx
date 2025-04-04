"use client"

import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { AvatarPicker } from "@/components/avatar-picker"

export function ChildPickAvatarStep() {
  const { data, updateData } = useOnboarding()

  return (
    <OnboardingLayout
      title="Choose Your Avatar"
      subtitle="Pick an avatar that represents you!"
      nextButtonDisabled={!data.childAvatarId}
      progress={75}
    >
      <div className="space-y-4">
        <AvatarPicker
          selectedAvatarId={data.childAvatarId}
          onSelect={(avatarId) => updateData("childAvatarId", avatarId)}
        />
      </div>
    </OnboardingLayout>
  )
}

