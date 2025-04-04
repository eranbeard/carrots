"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, Loader2, User, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

// Mock data
const mockChildren = [
  {
    id: "child-1",
    name: "Alex",
    gameTimeMinutes: 45,
    dailyLimit: 60,
    isLocked: false,
    level: 5,
    streakCount: 3,
  },
  {
    id: "child-2",
    name: "Sam",
    gameTimeMinutes: 120,
    dailyLimit: 90,
    isLocked: true,
    level: 3,
    streakCount: 0,
  },
]

export default function SettingsPage() {
  const [children, setChildren] = useState(mockChildren)
  const [activeTab, setActiveTab] = useState("gameTime")
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in and is a parent
  useEffect(() => {
    if (!loading && (!user || user.type !== "parent")) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const handleAdjustTime = (childId: string, minutes: number) => {
    setChildren(
      children.map((child) =>
        child.id === childId ? { ...child, gameTimeMinutes: Math.max(0, child.gameTimeMinutes + minutes) } : child,
      ),
    )

    toast({
      title: minutes >= 0 ? "Time added" : "Time deducted",
      description: `${Math.abs(minutes)} minutes have been ${minutes >= 0 ? "added to" : "deducted from"} the game time bank`,
    })
  }

  const handleUpdateGameTimeSettings = (childId: string, settings: { dailyLimit: number; isLocked: boolean }) => {
    setChildren(
      children.map((child) =>
        child.id === childId
          ? {
              ...child,
              dailyLimit: settings.dailyLimit,
              isLocked: settings.isLocked,
            }
          : child,
      ),
    )

    toast({
      title: "Settings updated",
      description: "Game time settings have been updated",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.push("/parent-dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Settings</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user?.name || "Parent"}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gameTime" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Game Time
              </TabsTrigger>
              <TabsTrigger value="accounts" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Child Accounts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gameTime" className="space-y-4">
              <h2 className="text-lg font-medium">Game Time Management</h2>
              <p className="text-sm text-gray-500">
                Adjust game time settings for each child. You can add or remove minutes, set daily limits, and lock game
                time.
              </p>

              {children.map((child) => (
                <Card key={child.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-base">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="text-xs bg-orange-200 text-orange-700">
                          {child.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {child.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Current Game Time</h3>
                        <p className="text-2xl font-bold text-orange-500">{child.gameTimeMinutes} minutes</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleAdjustTime(child.id, -15)}
                        >
                          -15m
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleAdjustTime(child.id, -5)}
                        >
                          -5m
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          onClick={() => handleAdjustTime(child.id, 5)}
                        >
                          +5m
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-500 hover:bg-green-50"
                          onClick={() => handleAdjustTime(child.id, 15)}
                        >
                          +15m
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`dailyLimit-${child.id}`}>Daily Time Limit (minutes)</Label>
                        <Input
                          id={`dailyLimit-${child.id}`}
                          type="number"
                          min={0}
                          value={child.dailyLimit}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value) || 0
                            handleUpdateGameTimeSettings(child.id, {
                              dailyLimit: value,
                              isLocked: child.isLocked,
                            })
                          }}
                        />
                        <p className="text-xs text-gray-500">
                          Set to 0 for no limit. This caps how much game time can be used per day.
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor={`lockGameTime-${child.id}`}>Lock Game Time</Label>
                          <p className="text-xs text-gray-500">When locked, child cannot use their game time</p>
                        </div>
                        <Switch
                          id={`lockGameTime-${child.id}`}
                          checked={child.isLocked}
                          onCheckedChange={(checked) => {
                            handleUpdateGameTimeSettings(child.id, {
                              dailyLimit: child.dailyLimit,
                              isLocked: checked,
                            })
                          }}
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-500 text-orange-500 hover:bg-orange-50"
                        onClick={() => handleAdjustTime(child.id, -child.gameTimeMinutes)}
                      >
                        Reset Time to Zero
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="accounts" className="space-y-4">
              <h2 className="text-lg font-medium">Child Accounts</h2>
              <p className="text-sm text-gray-500">Manage your children's accounts and profiles.</p>

              {children.map((child) => (
                <Card key={child.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-orange-200 text-orange-700">
                            {child.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{child.name}</h3>
                          <p className="text-sm text-gray-500">Level {child.level}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

