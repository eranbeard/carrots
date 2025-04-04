"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // First check if user is logged in
    if (user) {
      // User is logged in, redirect to appropriate dashboard
      if (user.type === "parent") {
        router.push("/parent-dashboard")
      } else {
        router.push("/child-dashboard")
      }
      return
    }

    // If not logged in, check if onboarding is completed
    const isOnboardingCompleted = localStorage.getItem("carrot-onboarding-completed")
    if (isOnboardingCompleted === "true") {
      // Onboarding is completed but user is not logged in
      // This shouldn't happen in our flow, but just in case
      router.push("/login")
    }
    // Otherwise, stay on the home page
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-orange-500">🥕 Carrot</h1>
          <p className="mt-2 text-lg text-gray-600">Complete tasks, earn game time!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Carrot</CardTitle>
            <CardDescription>The app that helps kids earn game time by completing real-world tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-gray-500">
                Parents can create tasks for their children to complete, and children earn game time as rewards.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
            <Button variant="link" className="w-full text-orange-500" onClick={() => router.push("/onboarding")}>
              Start Onboarding
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

