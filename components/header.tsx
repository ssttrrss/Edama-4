"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/components/language-provider"
import { useTheme } from "next-themes"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Menu,
  ShoppingCart,
  Sun,
  Moon,
  Phone,
  Mail,
  User,
  LogOut,
  Settings,
  Heart,
  Package,
  Store,
  ChevronDown,
  Bell,
  Search,
  Home,
  Info,
  Leaf,
  BarChart3,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const { t, language, setLanguage, dir } = useTranslation()
  const { setTheme, theme } = useTheme()
  const { itemCount } = useCart()
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showContactOptions, setShowContactOptions] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer")
  const [showSearchBar, setShowSearchBar] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem("edama-user")
    if (user) {
      try {
        const parsedUser = JSON.parse(user)
        setUserData(parsedUser)
        setIsLoggedIn(true)
        setAccountType(parsedUser.accountType || "buyer")
      } catch (error) {
        console.error("Failed to parse user data", error)
      }
    }
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
    window.location.href = "/"
  }

  // Handle contact options
  const handleSendSMS = () => {
    window.location.href = "sms:01274311482"
    setShowContactOptions(false)
  }

  const handleSendEmail = () => {
    window.location.href = "mailto:edama.team@gmail.com"
    setShowContactOptions(false)
  }

  // Navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { href: "/home", label: t("home"), icon: <Home className="h-4 w-4 mr-2" /> },
      { href: "/about", label: t("about"), icon: <Info className="h-4 w-4 mr-2" /> },
    ]

    const buyerItems = [
      ...commonItems,
      { href: "/cart", label: t("cart"), icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
    ]

    const sellerItems = [
      ...commonItems,
      { href: "/profile?tab=products", label: t("myProducts"), icon: <Store className="h-4 w-4 mr-2" /> },
      { href: "/profile?tab=analytics", label: t("analytics"), icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    ]

    return accountType === "seller" ? sellerItems : buyerItems
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t("menu")}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side={dir === "rtl" ? "right" : "left"} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Edama Logo"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xl font-bold text-primary">Edama</span>
                  </div>

                  {isLoggedIn && userData && (
                    <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                        <AvatarFallback>{userData.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{userData.name}</p>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                      </div>
                    </div>
                  )}

                  <nav className="flex flex-col gap-1 flex-1">
                    {getNavigationItems().map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-muted ${
                            pathname === item.href ? "bg-muted font-medium text-primary" : ""
                          }`}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}

                    <SheetClose asChild>
                      <Link
                        href="#"
                        className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-muted"
                        onClick={() => setShowContactOptions(!showContactOptions)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        {t("contact")}
                      </Link>
                    </SheetClose>
                  </nav>

                  {isLoggedIn ? (
                    <div className="border-t border-border pt-4 mt-4 space-y-2">
                      <SheetClose asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-muted"
                        >
                          <User className="h-4 w-4" />
                          {t("profile")}
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/profile?tab=favorites"
                          className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-muted"
                        >
                          <Heart className="h-4 w-4" />
                          {t("favorites")}
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/profile?tab=orders"
                          className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-muted"
                        >
                          <Package className="h-4 w-4" />
                          {t("orders")}
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/profile?tab=settings"
                          className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-muted"
                        >
                          <Settings className="h-4 w-4" />
                          {t("settings")}
                        </Link>
                      </SheetClose>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t("logout")}
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t border-border pt-4 mt-4 flex gap-2">
                      <SheetClose asChild>
                        <Link href="/login" className="flex-1">
                          <Button variant="outline" className="w-full">
                            {t("login")}
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/signup" className="flex-1">
                          <Button className="w-full">{t("signup")}</Button>
                        </Link>
                      </SheetClose>
                    </div>
                  )}

                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between">
                      <Button variant="ghost" size="sm" onClick={toggleLanguage}>
                        {language === "ar" ? "English" : "العربية"}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

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
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {getNavigationItems().map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <span className={`flex items-center ${pathname === item.href ? "text-primary" : ""}`}>
                          {item.icon}
                          {item.label}
                        </span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Mail className="h-4 w-4 mr-2" />
                    {t("contact")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[200px]">
                      <div
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-muted cursor-pointer"
                        onClick={handleSendSMS}
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{t("sendSMS")}</div>
                          <p className="text-xs text-muted-foreground">01274311482</p>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-muted cursor-pointer"
                        onClick={handleSendEmail}
                      >
                        <Mail className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{t("sendEmail")}</div>
                          <p className="text-xs text-muted-foreground">edama.team@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => setShowSearchBar(!showSearchBar)}
            >
              <Search className="h-5 w-5" />
            </Button>

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

            {/* Notifications */}
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-auto">
                    <div className="p-3 hover:bg-muted rounded-md transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Leaf className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t("productExpiringSoon")}</p>
                          <p className="text-xs text-muted-foreground">{t("productExpiringDescription")}</p>
                          <p className="text-xs text-muted-foreground mt-1">2 {t("hoursAgo")}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 hover:bg-muted rounded-md transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
                          <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t("orderReady")}</p>
                          <p className="text-xs text-muted-foreground">{t("orderReadyDescription")}</p>
                          <p className="text-xs text-muted-foreground mt-1">5 {t("hoursAgo")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full justify-center">
                      {t("viewAllNotifications")}
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User menu (desktop) */}
            {!isMobile && isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={userData?.avatar || "/placeholder.svg"} alt={userData?.name || "User"} />
                      <AvatarFallback>{userData?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">
                      {userData?.name || t("account")}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{userData?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{userData?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=favorites" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{t("favorites")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>{t("orders")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile?tab=settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              !isMobile && (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">{t("signup")}</Button>
                  </Link>
                </div>
              )
            )}

            {/* Theme and language toggles (desktop) */}
            {!isMobile && (
              <>
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleLanguage} className="text-muted-foreground">
                  {language === "ar" ? "EN" : "عربي"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {showSearchBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("searchProducts")}
                  className="w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full"
                  onClick={() => setShowSearchBar(false)}
                >
                  <span className="sr-only">Close search</span>
                  <span aria-hidden="true">×</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
