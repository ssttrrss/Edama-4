"use client"

import Link from "next/link"
import { useTranslation } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, Package, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export function ProfileShortcut() {
  const { t } = useTranslation()
  const [userData, setUserData] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
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
  }, [])

  if (!isLoggedIn) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="flex flex-col items-end space-y-2">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-end space-y-2"
        >
          <Link href="/profile?tab=orders">
            <Button size="icon" variant="outline" className="rounded-full bg-background shadow-md">
              <Package className="h-5 w-5" />
              <span className="sr-only">{t("myOrders")}</span>
            </Button>
          </Link>
          <Link href="/profile?tab=favorites">
            <Button size="icon" variant="outline" className="rounded-full bg-background shadow-md">
              <Heart className="h-5 w-5" />
              <span className="sr-only">{t("favorites")}</span>
            </Button>
          </Link>
          <Link href="/profile?tab=settings">
            <Button size="icon" variant="outline" className="rounded-full bg-background shadow-md">
              <Settings className="h-5 w-5" />
              <span className="sr-only">{t("settings")}</span>
            </Button>
          </Link>
        </motion.div>
        <Link href="/profile">
          <Button size="icon" className="h-14 w-14 rounded-full bg-primary shadow-lg">
            {userData?.avatar ? (
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                <AvatarFallback>{userData.name?.charAt(0) || <User className="h-6 w-6" />}</AvatarFallback>
              </Avatar>
            ) : (
              <User className="h-6 w-6" />
            )}
            <span className="sr-only">{t("myProfile")}</span>
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
