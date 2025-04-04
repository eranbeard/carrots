"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarPicker } from "@/components/avatar-picker"
import { Loader2 } from "lucide-react"

interface AddChildFormProps {
  onAddChild: (childData: { name: string; age: number; avatarId: string }) => void
  onCancel: () => void
}

export function AddChildForm({ onAddChild, onCancel }: AddChildFormProps) {
  const [name, setName] = useState("")
  const [age, setAge] = useState<number | "">("")
  const [avatarId, setAvatarId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValid = name.trim() !== "" && age !== "" && avatarId !== null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValid) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onAddChild({
      name: name.trim(),
      age: typeof age === "number" ? age : 0,
      avatarId: avatarId || "avatar1",
    })

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="childName">Child's Name</Label>
        <Input
          id="childName"
          placeholder="Enter your child's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Choose an Avatar</Label>
        <AvatarPicker selectedAvatarId={avatarId} onSelect={setAvatarId} />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={!isValid || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            "Add Child"
          )}
        </Button>
      </div>
    </form>
  )
}

