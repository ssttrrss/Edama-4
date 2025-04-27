"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "@/components/language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Leaf, Droplets, Recycle } from "lucide-react"

export function EcoImpactCalculator() {
  const { t, language } = useTranslation()
  const [foodWasteSaved, setFoodWasteSaved] = useState(0)
  const [waterSaved, setWaterSaved] = useState(0)
  const [co2Reduced, setCo2Reduced] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Calculate eco impact based on orders
    const orders = JSON.parse(localStorage.getItem("edama-orders") || "[]")

    // Calculate total items purchased
    const totalItems = orders.reduce((total: number, order: any) => {
      return total + order.items.reduce((itemTotal: number, item: any) => itemTotal + item.quantity, 0)
    }, 0)

    // Calculate impact metrics (simplified calculation)
    // In a real app, these would be more accurate calculations based on product types, weight, etc.
    const foodWaste = totalItems * 0.5 // 0.5 kg per item
    const water = totalItems * 100 // 100 liters per item
    const co2 = totalItems * 2.5 // 2.5 kg CO2 per item

    // Animate the values
    animateValue(setFoodWasteSaved, 0, foodWaste, 2000)
    animateValue(setWaterSaved, 0, water, 2000)
    animateValue(setCo2Reduced, 0, co2, 2000)

    // Calculate progress towards next level (simplified)
    const nextLevelThreshold = Math.ceil(totalItems / 10) * 10
    const currentProgress = ((totalItems % 10) / 10) * 100

    setTimeout(() => {
      setProgress(currentProgress)
    }, 500)

    // Set visibility after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Animate value from start to end
  const animateValue = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    start: number,
    end: number,
    duration: number,
  ) => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setter(progress * (end - start) + start)
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("ecoImpact")}</CardTitle>
          <CardDescription>{t("ecoImpactDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900">
                  <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium">{t("foodWasteSaved")}</span>
              </div>
              <span className="font-mono text-lg font-bold text-green-600 dark:text-green-400">
                {foodWasteSaved.toFixed(1)} kg
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900">
                  <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium">{t("waterSaved")}</span>
              </div>
              <span className="font-mono text-lg font-bold text-blue-600 dark:text-blue-400">
                {waterSaved.toFixed(0)} L
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-100 p-1.5 dark:bg-amber-900">
                  <Recycle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm font-medium">{t("co2Reduced")}</span>
              </div>
              <span className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                {co2Reduced.toFixed(1)} kg
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{t("ecoLevel")}</span>
              <span className="font-medium">{Math.floor(progress / 20) + 1}/5</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{t("nextLevelMessage")}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
