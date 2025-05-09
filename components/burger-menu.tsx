"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, Info, User, LogOut, Globe, Sun, Moon, ChevronDown, ChevronRight } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface BurgerMenuProps {
  className?: string
}

export function BurgerMenu({ className }: BurgerMenuProps) {
  const { user, logout, isLoading } = useAuth()
  const { t, setLocale, locale, availableLocales } = useLanguage()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const toggleLanguages = () => {
    setShowLanguages(!showLanguages)
  }

  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale)
    setShowLanguages(false)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const menuItems = [
    { href: "/home", label: t("home"), icon: Home },
    { href: "/about", label: t("about"), icon: Info },
    ...(user
      ? [{ href: "/profile", label: t("profile"), icon: User }]
      : [{ href: "/login", label: t("login"), icon: User }]),
  ]

  return (
    <div ref={menuRef} className={cn("relative z-50", className)}>
      <button
        onClick={toggleMenu}
        className="rounded-full bg-white p-2 shadow-md transition-colors duration-300 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label={isOpen ? t("closeMenu") : t("openMenu")}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
        )}
      </button>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      ></div>

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 top-0 z-50 w-full max-w-xs bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out dark:bg-gray-900",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/home"
              className="text-xl font-bold text-green-600 dark:text-green-400"
              onClick={() => setIsOpen(false)}
            >
              Edama
            </Link>
            <button
              onClick={toggleMenu}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label={t("closeMenu")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mb-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400",
                    )}
                  />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={toggleLanguages}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <Globe className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  {t("language")}
                </div>
                {showLanguages ? (
                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                )}
              </button>

              {showLanguages && (
                <div className="border-t border-gray-200 px-2 py-2 dark:border-gray-700">
                  {availableLocales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => changeLanguage(loc)}
                      className={cn(
                        "flex w-full items-center rounded-md px-4 py-2 text-sm transition-colors duration-200",
                        locale === loc
                          ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800",
                      )}
                    >
                      {loc.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  {t("lightMode")}
                </>
              ) : (
                <>
                  <Moon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  {t("darkMode")}
                </>
              )}
            </button>
          </div>

          {user && (
            <div className="mt-auto pt-6">
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-3 h-5 w-5" />
                {t("logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
