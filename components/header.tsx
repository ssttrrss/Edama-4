"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/components/language-provider"
import { useTheme } from "next-themes"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Menu, Search, ShoppingCart, Sun, Moon, User, LogOut, Heart, Package, Settings } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const { t, language, setLanguage, dir } = useTranslation()
  const { setTheme, theme } = useTheme()
  const { itemCount } = useCart()
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("edama-user")
    setIsLoggedIn(!!user)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar")
  }

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("edama-user")
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Edama Logo"
                width={40}
                height={40}
                className="object-cover"
                priority
              />
            </div>
            <span className="text-xl font-bold text-primary">Edama</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="mx-6 flex flex-1 items-center justify-center">
              <ul className="flex space-x-1 rtl:space-x-reverse">
                <li>
                  <Link
                    href="/home"
                    className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      pathname === "/home" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      pathname === "/about" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      pathname === "/contact" ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {t("contact")}
                  </Link>
                </li>
              </ul>
            </nav>
          )}

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            {(pathname === "/home" || pathname === "/search") && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Search className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={dir === "rtl" ? "right" : "left"}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <h2 className="text-lg font-medium">{t("searchProducts")}</h2>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          placeholder={t("searchProducts")}
                        />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Cart button */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1"
                    >
                      <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-[10px]">
                        {itemCount}
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Language toggle */}
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="text-muted-foreground">
              {t("language")}
            </Button>

            {/* User menu or auth buttons */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full relative" aria-label={t("myProfile")}>
                    <Avatar className="h-8 w-8 border-2 border-primary/20 hover:border-primary transition-colors">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">{t("myProfile")}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === "rtl" ? "start" : "end"} className="w-56">
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("myProfile")}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile?tab=orders">
                    <DropdownMenuItem>
                      <Package className="mr-2 h-4 w-4" />
                      <span>{t("myOrders")}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile?tab=favorites">
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{t("favorites")}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/profile?tab=settings">
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("settings")}</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">{t("signup")}</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 text-muted-foreground">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side={dir === "rtl" ? "right" : "left"}>
                  <nav className="flex flex-col gap-4">
                    <Link href="/home" className="flex items-center py-2" onClick={() => document.body.click()}>
                      {t("home")}
                    </Link>
                    {isLoggedIn && (
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 py-2"
                        onClick={() => document.body.click()}
                      >
                        <User className="h-4 w-4" />
                        {t("myProfile")}
                      </Link>
                    )}
                    <Link href="/about" className="flex items-center py-2" onClick={() => document.body.click()}>
                      {t("about")}
                    </Link>
                    <Link href="/contact" className="flex items-center py-2" onClick={() => document.body.click()}>
                      {t("contact")}
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
