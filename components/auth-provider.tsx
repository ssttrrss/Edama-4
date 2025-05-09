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
  checkEmailExists,
} from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: Omit<User, "password"> | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: Omit<User, "id" | "joinDate">) => Promise<void>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<void>
  checkExistingEmail: (email: string) => boolean
  isBuyer: boolean
  isSeller: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  checkExistingEmail: () => false,
  isBuyer: false,
  isSeller: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is buyer or seller
  const isBuyer = !!user && user.accountType === "buyer"
  const isSeller = !!user && user.accountType === "seller"

  // Initialize auth state
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

  // Check if email exists
  const checkExistingEmail = (email: string): boolean => {
    return checkEmailExists(email)
  }

  // Login function with error handling
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const loggedInUser = loginUser(email, password)
      const { password: _, ...userWithoutPassword } = loggedInUser
      setUser(userWithoutPassword)

      // Navigate to appropriate dashboard based on user role
      if (loggedInUser.accountType === "seller") {
        router.push("/profile?tab=products")
      } else {
        router.push("/home")
      }
    } catch (error: any) {
      if (error.message === "user_not_found") {
        toast({
          title: "Account not found",
          description: "This email is not registered. Would you like to create an account?",
          variant: "destructive",
          action: (
            <button
              onClick={() => router.push("/signup?email=" + encodeURIComponent(email))}
              className="rounded bg-white px-3 py-2 text-xs font-medium text-black"
            >
              Sign Up
            </button>
          ),
        })
      } else if (error.message === "invalid_password") {
        toast({
          title: "Invalid password",
          description: "Please check your password and try again",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Login failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Registration with enhanced validation
  const register = async (userData: Omit<User, "id" | "joinDate">) => {
    try {
      setIsLoading(true)
      const newUser = registerUser(userData)
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)

      toast({
        title: "Account created successfully!",
        description: `Welcome to Edama, ${userData.name}!`,
        duration: 5000,
      })

      // Navigate to appropriate dashboard based on user role
      if (userData.accountType === "seller") {
        router.push("/profile?tab=storeSettings")
      } else {
        router.push("/home")
      }
    } catch (error: any) {
      if (error.message === "email_exists") {
        toast({
          title: "Email already registered",
          description: "This email is already in use. Try logging in instead.",
          variant: "destructive",
          action: (
            <button
              onClick={() => router.push("/login?email=" + encodeURIComponent(userData.email))}
              className="rounded bg-white px-3 py-2 text-xs font-medium text-black"
            >
              Log In
            </button>
          ),
        })
      } else {
        toast({
          title: "Registration failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced logout
  const logout = () => {
    logoutUser()
    setUser(null)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    router.push("/")
  }

  // Profile update with confirmation
  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true)
      const updatedUser = updateUserProfile(userData)
      setUser(updatedUser)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      return updatedUser
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
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
        checkExistingEmail,
        isBuyer,
        isSeller,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
