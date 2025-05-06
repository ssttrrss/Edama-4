"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Package, Settings, LogOut } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

type ProfileShortcutProps = {
  onSelect?: () => void
}

export default function ProfileShortcut({ onSelect }: ProfileShortcutProps) {
  const { t } = useLanguage()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  // Check if user is logged in on client-side
  useEffect(() => {
    try {
      const authData = localStorage.getItem("edama-auth")
      if (authData) {
        const { user } = JSON.parse(authData)
        setIsLoggedIn(true)
        setUsername(user?.username || "User")
      }
    } catch (error) {
      console.error("Failed to load auth data:", error)
    }
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem("edama-auth")
      setIsLoggedIn(false)
      setUsername("")
      if (onSelect) onSelect()
      // Redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const handleSelect = () => {
    if (onSelect) onSelect()
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" onClick={handleSelect}>
          <Link href="/login">{t("nav.login")}</Link>
        </Button>
        <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSelect}>
          <Link href="/signup">{t("nav.signup")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{username}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onClick={handleSelect}>
          <Link href="/profile" className="w-full cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{t("nav.profile")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={handleSelect}>
          <Link href="/profile/orders" className="w-full cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            <span>Orders</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild onClick={handleSelect}>
          <Link href="/profile/settings" className="w-full cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
