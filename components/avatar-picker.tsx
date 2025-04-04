"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

// In a real app, these would be actual avatar images
const avatarOptions = [
  { id: "avatar1", src: "/placeholder.svg?height=100&width=100", alt: "Avatar 1" },
  { id: "avatar2", src: "/placeholder.svg?height=100&width=100", alt: "Avatar 2" },
  { id: "avatar3", src: "/placeholder.svg?height=100&width=100", alt: "Avatar 3" },
  { id: "avatar4", src: "/placeholder.svg?height=100&width=100", alt: "Avatar 4" },
  { id: "avatar5", src: "/placeholder.svg?height=100&width=100", alt: "Avatar 5" },
  { id: "avatar6", src: "/placeholder.svg?height=100&width=100", alt: "Avatar 6" },
]

interface AvatarPickerProps {
  selectedAvatarId: string | null
  onSelect: (avatarId: string) => void
}

export function AvatarPicker({ selectedAvatarId, onSelect }: AvatarPickerProps) {
  const [avatars, setAvatars] = useState(avatarOptions)

  const handleRandomize = () => {
    // Shuffle the avatars array
    const shuffled = [...avatars].sort(() => Math.random() - 0.5)
    setAvatars(shuffled)
    // Select the first avatar after shuffling
    onSelect(shuffled[0].id)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`
              relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all
              ${selectedAvatarId === avatar.id ? "border-orange-500 scale-105" : "border-transparent hover:border-orange-300"}
            `}
            onClick={() => onSelect(avatar.id)}
          >
            <Image
              src={avatar.src || "/placeholder.svg"}
              alt={avatar.alt}
              width={100}
              height={100}
              className="w-full h-auto"
            />
            {selectedAvatarId === avatar.id && (
              <div className="absolute inset-0 bg-orange-500 bg-opacity-20 flex items-center justify-center">
                <div className="bg-white rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-orange-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        className="w-full border-orange-300 text-orange-500 hover:bg-orange-50"
        onClick={handleRandomize}
      >
        <Shuffle className="mr-2 h-4 w-4" />
        Randomize Avatar
      </Button>
    </div>
  )
}

