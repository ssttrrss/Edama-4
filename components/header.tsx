"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTranslation } from "@/components/language-provider"
import { useTheme } from "next-themes"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  Home,
  Info,
  HelpCircle,
  BarChart3,
  Leaf,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const { t, language, setLanguage, dir } = useTranslation()
  const { setTheme, theme } = useTheme()
  const { itemCount } = useCart()
  const { user, isAuthenticated, logout, isBuyer, isSeller } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showContactOptions, setShowContactOptions] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "expiry",
      message: t("productExpiringSoon"),
      description: t("productExpiringDescription"),
      time: "2h",
      read: false,
      icon: <Leaf className="h-4 w-4 text-primary" />,
    },
    {
      id: 2,
      type: "order",
      message: t("orderReady"),
      description: t("orderReadyDescription"),
      time: "5h",
      read: false,
      icon: <Package className="h-4 w-4 text-green-600 dark:text-green-400" />,
    },
  ])

  // Handle scroll effect with enhanced animation
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

  // Handle logout with confirmation
  const handleLogout = () => {
    logout()
  }

  // Handle notification mark as read
  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  // Handle contact options
  const handleContact = (method: "sms" | "email") => {
    if (method === "sms") {
      window.location.href = "sms:01274311482"
    } else if (method === "email") {
      window.location.href = "mailto:edama.team@gmail.com"
    }
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

    return isSeller ? sellerItems : buyerItems
  }

  // Account menu items based on user role
  const getAccountMenuItems = () => {
    const commonItems = [
      { href: "/profile", label: t("profile"), icon: <User className="h-4 w-4 mr-2" /> },
      { href: "/profile?tab=settings", label: t("settings"), icon: <Settings className="h-4 w-4 mr-2" /> },
    ]

    const buyerItems = [
      ...commonItems,
      { href: "/profile?tab=favorites", label: t("favorites"), icon: <Heart className="h-4 w-4 mr-2" /> },
      { href: "/profile?tab=orders", label: t("orders"), icon: <Package className="h-4 w-4 mr-2" /> },
    ]

    const sellerItems = [
      ...commonItems,
      { href: "/profile?tab=products", label: t("myProducts"), icon: <Store className="h-4 w-4 mr-2" /> },
      { href: "/profile?tab=analytics", label: t("analytics"), icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    ]

    return isSeller ? sellerItems : buyerItems
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-background"
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground md:hidden hover:bg-primary/10 transition-colors duration-300"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t("menu")}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={dir === "rtl" ? "right" : "left"}
                  className="flex flex-col bg-gradient-to-br from-background to-background/80 backdrop-blur-sm"
                >
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
                    <div className="flex flex-col">
                      <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Edama
                      </span>
                      <span className="text-xs text-muted-foreground">{t("smartExpiryDiscounts")}</span>
                    </div>
                  </div>

                  {isAuthenticated && user && (
                    <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <nav className="flex flex-col gap-1 flex-1">
                    {getNavigationItems().map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md px-3 py-2 transition-all duration-300 
                          hover:bg-primary/10 hover:translate-x-1 
                          ${pathname === item.href ? "bg-primary/15 font-medium text-primary" : ""}`}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}

                    <div
                      className="flex items-center gap-2 rounded-md px-3 py-2 transition-all duration-300 hover:bg-primary/10 hover:translate-x-1 cursor-pointer"
                      onClick={() => setShowContactOptions(!showContactOptions)}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      {t("contact")}
                    </div>

                    {showContactOptions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 space-y-2 overflow-hidden"
                      >
                        <div
                          className="flex items-center gap-2 rounded-md px-3 py-2 transition-all duration-300 hover:bg-primary/10 cursor-pointer"
                          onClick={() => handleContact("sms")}
                        >
                          <Phone className="h-4 w-4 text-primary" />
                          <div>
                            <div className="text-sm font-medium">{t("sendSMS")}</div>
                            <p className="text-xs text-muted-foreground">01274311482</p>
                          </div>
                        </div>
                        <div
                          className="flex items-center gap-2 rounded-md px-3 py-2 transition-all duration-300 hover:bg-primary/10 cursor-pointer"
                          onClick={() => handleContact("email")}
                        >
                          <Mail className="h-4 w-4 text-primary" />
                          <div>
                            <div className="text-sm font-medium">{t("sendEmail")}</div>
                            <p className="text-xs text-muted-foreground">edama.team@gmail.com</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </nav>

                  {isAuthenticated ? (
                    <div className="border-t border-border pt-4 mt-4 space-y-2">
                      {getAccountMenuItems().map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 rounded-md px-3 py-2 transition-all duration-300 hover:bg-primary/10 hover:translate-x-1"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive hover:translate-x-1 transition-all duration-300"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t("logout")}
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t border-border pt-4 mt-4 flex gap-2">
                      <Link href="/login" className="flex-1">
                        <Button variant="outline" className="w-full hover:bg-primary/10 transition-colors duration-300">
                          {t("login")}
                        </Button>
                      </Link>
                      <Link href="/signup" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:scale-105 transition-transform duration-300">
                          {t("signup")}
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="border-t border-border pt-4 mt-4">
                    <div className="flex justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLanguage}
                        className="hover:bg-primary/10 transition-colors duration-300"
                      >
                        {language === "ar" ? "English" : "العربية"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="hover:bg-primary/10 transition-colors duration-300"
                      >
                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.3 }}
                className="relative h-10 w-10 overflow-hidden rounded-full shadow-md"
              >
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Edama Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                  priority
                />
              </motion.div>
              <div className="flex flex-col">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
                >
                  Edama
                </motion.span>
                <motion.span
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                  className="text-xs text-muted-foreground"
                >
                  {t("smartExpiryDiscounts")}
                </motion.span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                {getNavigationItems().map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={`${navigationMenuTriggerStyle()} hover:bg-primary/10 transition-colors duration-300`}
                      >
                        <span className={`flex items-center ${pathname === item.href ? "text-primary" : ""}`}>
                          {item.icon}
                          {item.label}
                        </span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:bg-primary/10 transition-colors duration-300">
                    <Mail className="h-4 w-4 mr-2" />
                    {t("contact")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[240px] bg-white dark:bg-gray-950 rounded-md shadow-lg">
                      <div
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-primary/10 cursor-pointer transition-colors duration-300"
                        onClick={() => handleContact("sms")}
                      >
                        <Phone className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-sm font-medium">{t("sendSMS")}</div>
                          <p className="text-xs text-muted-foreground">01274311482</p>
                        </div>
                      </div>
                      <div
                        className="flex items-center gap-2 rounded-md p-2 hover:bg-primary/10 cursor-pointer transition-colors duration-300"
                        onClick={() => handleContact("email")}
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
            {/* Cart button */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-primary"
              >
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

            {/* Notifications - only show when logged in */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-primary"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                          duration: 1.5,
                        }}
                        className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary"
                      ></motion.span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-2">
                    <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
                      {t("markAllAsRead")}
                    </Button>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 hover:bg-primary/5 rounded-md transition-colors duration-300 cursor-pointer ${
                            !notification.read ? "bg-primary/5 dark:bg-primary/10" : ""
                          }`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-primary/10 p-2">{notification.icon}</div>
                            <div>
                              <p className="text-sm font-medium">{notification.message}</p>
                              <p className="text-xs text-muted-foreground">{notification.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notification.time} {t("ago")}
                              </p>
                            </div>
                            {!notification.read && <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">{t("noNotifications")}</div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center hover:bg-primary/10 transition-colors duration-300"
                      onClick={() => router.push("/notifications")}
                    >
                      {t("viewAllNotifications")}
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User menu (desktop) - only show when logged in */}
            {!isMobile && isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 transition-all duration-300 hover:bg-primary/10">
                    <Avatar className="h-6 w-6 border border-primary/20">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                      <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.name || t("account")}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {getAccountMenuItems().map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="cursor-pointer">
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}

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
              !isMobile &&
              !isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-all duration-300 hover:bg-primary/10 border-primary/20"
                    >
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="transition-all duration-300 hover:scale-105 shadow-sm hover:shadow bg-gradient-to-r from-primary to-primary/90"
                    >
                      {t("signup")}
                    </Button>
                  </Link>
                </div>
              )
            )}

            {/* Theme and language toggles (desktop) */}
            {!isMobile && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="text-muted-foreground transition-all duration-300 hover:scale-110 hover:text-primary"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLanguage}
                  className="text-muted-foreground transition-all duration-300 hover:bg-primary/10"
                >
                  {language === "ar" ? "EN" : "عربي"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
