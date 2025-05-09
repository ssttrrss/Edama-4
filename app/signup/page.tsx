"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslation } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Lock,
  Building,
  Store,
} from "lucide-react"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function SignupPage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register, isAuthenticated, checkExistingEmail } = useAuth()
  const { toast } = useToast()

  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer")
  const [name, setName] = useState("")
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Seller specific fields
  const [storeName, setStoreName] = useState("")
  const [storeNameAr, setStoreNameAr] = useState("")
  const [storeLocation, setStoreLocation] = useState("")
  const [storePhone, setStorePhone] = useState("")

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home")
    }
  }, [isAuthenticated, router])

  // Check if email exists
  useEffect(() => {
    if (email && email.includes("@")) {
      const exists = checkExistingEmail(email)
      if (exists) {
        setError(t("emailAlreadyRegistered"))
      } else {
        setError(null)
      }
    }
  }, [email, checkExistingEmail, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t("passwordsDontMatch"))
      return
    }

    if (!hasMinLength || !hasUpperCase || !hasNumber) {
      setError(t("passwordRequirements"))
      return
    }

    if (checkExistingEmail(email)) {
      setError(t("emailAlreadyRegistered"))
      toast({
        title: t("emailAlreadyRegistered"),
        description: t("redirectToLogin"),
        action: (
          <Button variant="outline" size="sm" onClick={() => router.push(`/login?email=${encodeURIComponent(email)}`)}>
            {t("login")}
          </Button>
        ),
      })
      return
    }

    // Check required seller fields
    if (accountType === "seller" && (!storeName || !storeNameAr || !storeLocation || !storePhone)) {
      setError(t("storeInfoRequired"))
      return
    }

    setIsLoading(true)

    try {
      const userData = {
        name,
        email,
        password,
        accountType,
        ...(accountType === "seller" && {
          storeName,
          storeNameAr,
          storeLocation,
          storePhone,
        }),
      }

      await register(userData)
    } catch (error: any) {
      // Error handling is in AuthProvider
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const passwordsMatch = password === confirmPassword && password !== ""

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-8">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-md">
        <Card className="backdrop-blur-sm border-border shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-tr-full -z-10" />

          <motion.div variants={itemVariants} className="flex justify-center pt-6">
            <div className="w-20 h-20 relative">
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt="Edama Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </motion.div>

          <CardHeader className="space-y-1">
            <motion.div variants={itemVariants} className="mb-2 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => router.push("/")}
                aria-label={t("back")}
              >
                <BackArrow className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl font-bold">{t("signupTitle")}</CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-base">{t("signupDescription")}</CardDescription>
            </motion.div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <motion.div variants={itemVariants}>
                  <Alert variant="destructive" className="text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Tabs
                  defaultValue="buyer"
                  value={accountType}
                  onValueChange={(value) => setAccountType(value as "buyer" | "seller")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-primary/10 rounded-lg">
                    <TabsTrigger value="buyer" className="flex items-center gap-2 data-[state=active]:bg-background">
                      <User className="h-4 w-4" />
                      {t("buyer")}
                    </TabsTrigger>
                    <TabsTrigger value="seller" className="flex items-center gap-2 data-[state=active]:bg-background">
                      <Store className="h-4 w-4" />
                      {t("seller")}
                    </TabsTrigger>
                  </TabsList>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {accountType === "seller" ? t("sellerAccountDescription") : t("buyerAccountDescription")}
                  </p>
                </Tabs>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="name" className="text-base flex gap-2 items-center">
                  <User className="h-4 w-4" />
                  {accountType === "seller" ? t("businessName") : t("fullName")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={accountType === "seller" ? t("businessNamePlaceholder") : t("fullNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11 transition-all duration-300 border-primary/20 focus:border-primary"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="text-base flex gap-2 items-center">
                  <Mail className="h-4 w-4" />
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  className="h-11 transition-all duration-300 border-primary/20 focus:border-primary"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className="text-base flex gap-2 items-center">
                  <Lock className="h-4 w-4" />
                  {t("password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="h-11 transition-all duration-300 border-primary/20 focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {password && (
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle2
                        className={`h-3 w-3 ${hasMinLength ? "text-green-500" : "text-muted-foreground"}`}
                      />
                      <span className={hasMinLength ? "text-green-500" : "text-muted-foreground"}>
                        {t("passwordMinLength")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2
                        className={`h-3 w-3 ${hasUpperCase ? "text-green-500" : "text-muted-foreground"}`}
                      />
                      <span className={hasUpperCase ? "text-green-500" : "text-muted-foreground"}>
                        {t("passwordUppercase")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className={`h-3 w-3 ${hasNumber ? "text-green-500" : "text-muted-foreground"}`} />
                      <span className={hasNumber ? "text-green-500" : "text-muted-foreground"}>
                        {t("passwordNumber")}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base flex gap-2 items-center">
                  <Lock className="h-4 w-4" />
                  {t("confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    dir="ltr"
                    className="h-11 transition-all duration-300 border-primary/20 focus:border-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? t("hidePassword") : t("showPassword")}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <CheckCircle2 className={`h-3 w-3 ${passwordsMatch ? "text-green-500" : "text-red-500"}`} />
                    <span className={passwordsMatch ? "text-green-500" : "text-red-500"}>
                      {passwordsMatch ? t("passwordsMatch") : t("passwordsDontMatch")}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Seller-specific fields */}
              {accountType === "seller" && (
                <motion.div variants={itemVariants} className="space-y-4 border-t pt-4 mt-4">
                  <h3 className="text-md font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {t("storeDetails")}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">{t("storeName")}</Label>
                      <Input
                        id="storeName"
                        placeholder={t("storeNamePlaceholder")}
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        required
                        className="transition-all duration-300 border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeNameAr">{t("storeNameAr")}</Label>
                      <Input
                        id="storeNameAr"
                        placeholder={t("storeNameArPlaceholder")}
                        value={storeNameAr}
                        onChange={(e) => setStoreNameAr(e.target.value)}
                        required
                        dir="rtl"
                        className="transition-all duration-300 border-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeLocation">{t("storeLocation")}</Label>
                      <Input
                        id="storeLocation"
                        placeholder={t("storeLocationPlaceholder")}
                        value={storeLocation}
                        onChange={(e) => setStoreLocation(e.target.value)}
                        required
                        className="transition-all duration-300 border-primary/20 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storePhone">{t("storePhone")}</Label>
                      <Input
                        id="storePhone"
                        placeholder={t("storePhonePlaceholder")}
                        value={storePhone}
                        onChange={(e) => setStorePhone(e.target.value)}
                        required
                        dir="ltr"
                        className="transition-all duration-300 border-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col">
              <motion.div variants={itemVariants} className="w-full">
                <Button
                  type="submit"
                  className="mb-4 w-full h-11 text-base transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/90"
                  disabled={
                    isLoading ||
                    !name ||
                    !email ||
                    !password ||
                    !confirmPassword ||
                    !passwordsMatch ||
                    !hasMinLength ||
                    !hasUpperCase ||
                    !hasNumber ||
                    (accountType === "seller" && (!storeName || !storeNameAr || !storeLocation || !storePhone))
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("creatingAccount")}
                    </>
                  ) : (
                    t("createAccount")
                  )}
                </Button>
              </motion.div>

              <motion.p variants={itemVariants} className="text-center text-base text-muted-foreground">
                {t("alreadyHaveAccount")}{" "}
                <Link
                  href={email ? `/login?email=${encodeURIComponent(email)}` : "/login"}
                  className="text-primary font-medium hover:underline"
                >
                  {t("login")}
                </Link>
              </motion.p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
