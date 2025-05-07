"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, ShoppingCart, Heart, Package, LogOut, Phone, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export function BurgerMenu() {
  const { t, dir } = useTranslation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  // Check if user is logged in
  useState(() => {
    const user = localStorage.getItem("edama-user")
    if (user) {
      try {
        const parsedUser = JSON.parse(user)
        setUserData(parsedUser)
        setIsLoggedIn(true)
      } catch (error) {
        console.error("Failed to parse user data", error)
      }
    }
  })

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("edama-user")
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t("menu")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side={dir === "rtl" ? "right" : "left"} className="flex flex-col">
        <div className="flex-1 py-6">
          {isLoggedIn && userData ? (
            <div className="mb-6 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback>{userData.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userData.name}</p>
                <p className="text-sm text-muted-foreground">{userData.email}</p>
              </div>
            </div>
          ) : (
            <div className="mb-6 flex gap-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full">{t("signup")}</Button>
              </Link>
            </div>
          )}

          <Separator className="mb-6" />

          <nav className="space-y-4">
            <Link href="/profile" className="flex items-center gap-3 py-2 text-lg">
              <User className="h-5 w-5" />
              <span>{t("profile")}</span>
            </Link>
            <Link href="/cart" className="flex items-center gap-3 py-2 text-lg">
              <ShoppingCart className="h-5 w-5" />
              <span>{t("cart")}</span>
            </Link>
            <Link href="/profile?tab=favorites" className="flex items-center gap-3 py-2 text-lg">
              <Heart className="h-5 w-5" />
              <span>{t("favorites")}</span>
            </Link>
            <Link href="/profile?tab=orders" className="flex items-center gap-3 py-2 text-lg">
              <Package className="h-5 w-5" />
              <span>{t("orders")}</span>
            </Link>
          </nav>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="mb-2 text-sm font-semibold">{t("contactUs")}</h3>
          <div className="space-y-2">
            <a
              href="sms:01274311482"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Phone className="h-4 w-4" />
              {t("sendSMS")}
            </a>
            <a
              href="mailto:edama.team@gmail.com"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
            >
              <Mail className="h-4 w-4" />
              {t("sendEmail")}
            </a>
            <div className="px-3 py-2 text-xs text-muted-foreground">
              <p>{t("phone")}: 01274311482</p>
              <p>{t("email")}: edama.team@gmail.com</p>
            </div>
          </div>
        </div>

        {isLoggedIn && (
          <Button
            variant="outline"
            className="mt-auto gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>{t("logout")}</span>
          </Button>
        )}
      </SheetContent>
    </Sheet>
  )
}
