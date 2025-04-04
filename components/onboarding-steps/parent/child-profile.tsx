"use client"

import { useState } from "react"
import { OnboardingLayout } from "@/components/onboarding-layout"
import { useOnboarding } from "@/components/onboarding-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarPicker } from "@/components/avatar-picker"
import { Button } from "@/components/ui/button"
import { PlusCircle, User, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ChildProfileStep() {
  const { addChildProfile, setCurrentStep, currentStep, data, updateData } = useOnboarding()
  const [name, setName] = useState("")
  const [age, setAge] = useState<number | "">("")
  const [avatarId, setAvatarId] = useState<string | null>(null)
  const [isAddingChild, setIsAddingChild] = useState(data.childProfiles.length === 0)

  const isValid = name.trim() !== "" && age !== "" && avatarId !== null

  const handleAddChild = () => {
    if (isValid) {
      addChildProfile({
        name: name.trim(),
        age: typeof age === "number" ? age : 0,
        avatarId: avatarId || "avatar1",
      })

      // Reset form for next child
      setName("")
      setAge("")
      setAvatarId(null)
      setIsAddingChild(false)
    }
  }

  const handleNext = () => {
    // If we're adding a child, add it first
    if (isAddingChild && isValid) {
      handleAddChild()
    }

    // Proceed to next step
    setCurrentStep(currentStep + 1)
  }

  const handleRemoveChild = (index: number) => {
    const updatedProfiles = [...data.childProfiles]
    updatedProfiles.splice(index, 1)
    updateData("childProfiles", updatedProfiles)
  }

  return (
    <OnboardingLayout
      title="Set up your children's profiles"
      subtitle="Tell us about your children to personalize their experience."
      nextButtonDisabled={data.childProfiles.length === 0 && !isValid}
      nextButtonText={data.childProfiles.length > 0 ? "Continue" : "Add Child & Continue"}
      onNext={handleNext}
      progress={30}
    >
      {/* List of added children */}
      {data.childProfiles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Children:</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {data.childProfiles.map((child, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">{child.name}</p>
                      <p className="text-xs text-gray-500">Age: {child.age}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveChild(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Add child form */}
      <AnimatePresence>
        {isAddingChild ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            <div className="space-y-2">
              <Label htmlFor="childName">Child's Name</Label>
              <Input
                id="childName"
                placeholder="Enter your child's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="childAge">Child's Age</Label>
              <Input
                id="childAge"
                type="number"
                min={1}
                max={17}
                placeholder="Enter your child's age"
                value={age}
                onChange={(e) => {
                  const value = e.target.value
                  setAge(value === "" ? "" : Number.parseInt(value, 10))
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Choose an Avatar</Label>
              <AvatarPicker selectedAvatarId={avatarId} onSelect={setAvatarId} />
            </div>

            {data.childProfiles.length > 0 && (
              <div className="flex justify-end">
                <Button variant="outline" className="mt-2" onClick={() => setIsAddingChild(false)}>
                  Cancel
                </Button>
                <Button
                  className="mt-2 ml-2 bg-orange-500 hover:bg-orange-600"
                  onClick={handleAddChild}
                  disabled={!isValid}
                >
                  Add Child
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Button
              variant="outline"
              className="w-full border-dashed border-orange-300 text-orange-500 hover:bg-orange-50 py-6"
              onClick={() => setIsAddingChild(true)}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {data.childProfiles.length === 0 ? "Add a Child" : "Add Another Child"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingLayout>
  )
}

