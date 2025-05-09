"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // If still loading auth state, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    )
  }

  // If no user or user doesn't have required role, redirect to login
  if (!user || !allowedRoles.includes(user.role)) {
    // Use setTimeout to avoid hydration issues
    setTimeout(() => {
      router.push("/login")
    }, 0)

    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Restricted</h1>
        <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
      </div>
    )
  }

  // User has required role, render children
  return <>{children}</>
}
