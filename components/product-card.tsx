"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Trash2, Clock } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { CountdownTimer } from "@/components/countdown-timer"
import { Button } from "@/components/ui/button"
import { AnimatedContainer } from "@/components/animated-container"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  shop: {
    id: string
    name: string
  }
  category: string
  expiryDate: Date
  isVisible?: boolean
  isSeller?: boolean
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  shop,
  category,
  expiryDate,
  isVisible = true,
  isSeller = false,
}: ProductCardProps) {
  const { t } = useLanguage()
  const [visible, setVisible] = useState(isVisible)
  const [isHovered, setIsHovered] = useState(false)

  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  const isExpiringSoon = daysUntilExpiry <= 3

  const handleToggleVisibility = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setVisible(!visible)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Implement delete functionality
    alert(`Delete product ${id}`)
  }

  return (
    <AnimatedContainer
      animation="fadeIn"
      duration={0.3}
      className={`group relative overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg dark:bg-gray-800 ${
        !visible ? "opacity-70" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {discount > 0 && (
            <div className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              -{discount}%
            </div>
          )}

          {isExpiringSoon && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-1 text-xs font-bold text-white">
              <Clock className="h-3 w-3" />
              {daysUntilExpiry <= 0
                ? t("expiringToday")
                : daysUntilExpiry === 1
                  ? t("expiringTomorrow")
                  : t("expiringInDays", { days: daysUntilExpiry })}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            {shop.name} • {category}
          </div>

          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>

          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-green-600 dark:text-green-400">${price.toFixed(2)}</span>
            {originalPrice > price && (
              <span className="text-sm text-gray-500 line-through dark:text-gray-400">${originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <CountdownTimer expiryDate={expiryDate} />
            </div>
          </div>
        </div>
      </Link>

      {isSeller && (
        <div
          className={`
          absolute right-3 top-3 flex gap-2 transition-opacity
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
            onClick={handleToggleVisibility}
          >
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="sr-only">{visible ? t("hideProduct") : t("showProduct")}</span>
          </Button>

          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">{t("deleteProduct")}</span>
          </Button>
        </div>
      )}
    </AnimatedContainer>
  )
}
