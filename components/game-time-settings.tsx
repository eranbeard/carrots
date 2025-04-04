"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GameTimeSettingsProps {
  childId: string
  childName: string
  dailyLimit: number
  isLocked: boolean
  onUpdateSettings: (settings: {
    childId: string
    dailyLimit: number
    isLocked: boolean
  }) => void
}

export function GameTimeSettings({
  childId,
  childName,
  dailyLimit,
  isLocked,
  onUpdateSettings,
}: GameTimeSettingsProps) {
  const [limit, setLimit] = useState(dailyLimit)
  const [locked, setLocked] = useState(isLocked)
  const { toast } = useToast()

  const handleSaveSettings = () => {
    onUpdateSettings({
      childId,
      dailyLimit: limit,
      isLocked: locked,
    })

    toast({
      title: "Settings updated",
      description: `Game time settings for ${childName} have been updated.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-orange-500" />
          Game Time Settings
        </CardTitle>
        <CardDescription>Configure game time settings for {childName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dailyLimit">Daily Time Limit (minutes)</Label>
          <Input
            id="dailyLimit"
            type="number"
            min={0}
            value={limit}
            onChange={(e) => setLimit(Number.parseInt(e.target.value) || 0)}
          />
          <p className="text-xs text-gray-500">
            Set to 0 for no limit. This caps how much game time can be used per day.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="lockGameTime">Lock Game Time</Label>
            <p className="text-xs text-gray-500">When locked, child cannot use their game time</p>
          </div>
          <Switch id="lockGameTime" checked={locked} onCheckedChange={setLocked} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleSaveSettings}>
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

