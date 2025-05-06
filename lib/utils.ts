import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "LE") {
  return `${amount} ${currency}`
}

export function formatDate(dateString: string, locale = "en-US") {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function getDaysUntilExpiry(expiryDate: string) {
  const today = new Date()
  const expiry = new Date(expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Safe environment variable access
export function getEnv(key: string, defaultValue = ""): string {
  return typeof process !== "undefined" && process.env && process.env[key] ? (process.env[key] as string) : defaultValue
}
