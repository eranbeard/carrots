"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type UserType = "parent" | "child"

interface User {
  id: string
  name: string
  type: UserType
  parentId?: string // For child accounts, reference to parent
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, type: UserType, parentId?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Simulate loading user from storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("carrot-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data - in a real app, this would come from your backend
      const mockUser: User = {
        id: "user-1",
        name: email.split("@")[0],
        type: email.includes("parent") ? "parent" : "child",
        ...(email.includes("child") && { parentId: "parent-1" }),
      }

      setUser(mockUser)
      localStorage.setItem("carrot-user", JSON.stringify(mockUser))
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, type: UserType, parentId?: string) => {
    setLoading(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user creation
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name,
        type,
        ...(type === "child" && { parentId }),
      }

      setUser(mockUser)
      localStorage.setItem("carrot-user", JSON.stringify(mockUser))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("carrot-user")
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

