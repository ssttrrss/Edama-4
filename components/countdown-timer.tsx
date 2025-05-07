"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/components/language-provider"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  expiryDate: string
  className?: string
}

export function CountdownTimer({ expiryDate, className = "" }: CountdownTimerProps) {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    total: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const expiry = new Date(expiryDate)
      const difference = expiry.getTime() - now.getTime()

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
        total: difference,
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft()
      setTimeLeft(timeLeft)

      if (timeLeft.total <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryDate])

  // Determine the color based on time left
  const getColorClass = () => {
    if (timeLeft.total <= 0) return "bg-red-500 text-white"
    if (timeLeft.days === 0) return "bg-red-500 text-white"
    if (timeLeft.days <= 3) return "bg-amber-500 text-white"
    return "bg-green-500 text-white"
  }

  // Format the display text
  const getDisplayText = () => {
    if (timeLeft.total <= 0) return t("expired")

    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`
    }

    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m`
    }

    return `${timeLeft.minutes}m ${timeLeft.seconds}s`
  }

  return (
    <Badge className={`${getColorClass()} ${className} flex items-center gap-1 px-2 py-1 text-xs font-medium`}>
      <Clock className="h-3 w-3" />
      <span>
        {t("expiresIn")} {getDisplayText()}
      </span>
    </Badge>
  )
}
