"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  getCurrentUser,
  isLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
  initializeUsers,
} from "@/lib/auth"

interface AuthContextType {
  user: Omit<User, "password"> | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Omit<User, "id" | "joinDate">) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize sample users if needed
    initializeUsers()

    // Check if user is logged in
    if (isLoggedIn()) {
      const currentUser = getCurrentUser()
      setUser(currentUser)
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const loggedInUser = loginUser(email, password)
      const { password: _, ...userWithoutPassword } = loggedInUser
      setUser(userWithoutPassword)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: Omit<User, "id" | "joinDate">) => {
    try {
      setIsLoading(true)
      const newUser = registerUser(userData)
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true)
      const updatedUser = updateUserProfile(userData)
      setUser(updatedUser)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
