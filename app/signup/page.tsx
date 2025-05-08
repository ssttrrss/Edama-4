"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

export default function SignupPage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [accountType, setAccountType] = useState("buyer")
  const [error, setError] = useState<string | null>(null)

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home")
    }
  }, [isAuthenticated, router])

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

    setIsLoading(true)

    try {
      await register({
        name,
        email,
        password,
        accountType: accountType as "buyer" | "seller",
      })

      toast({
        title: t("accountCreated"),
        description: t("accountCreatedDescription"),
      })

      router.push("/home")
    } catch (error: any) {
      if (error.message === "Email already registered") {
        setError(t("emailAlreadyRegistered"))
      } else {
        setError(t("registrationError"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const passwordsMatch = password === confirmPassword && password !== ""

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1">
            <div className="mb-2 flex items-center">
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
            </div>
            <CardDescription className="text-base">{t("signupDescription")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">
                  {t("fullName")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
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
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
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
                    className="h-11"
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base">
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
                    className="h-11"
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
              </div>
              <div className="space-y-2">
                <Label className="text-base">{t("accountType")}</Label>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="radio"
                      id="buyer"
                      name="accountType"
                      value="buyer"
                      checked={accountType === "buyer"}
                      onChange={() => setAccountType("buyer")}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="buyer" className="font-normal">
                      {t("buyer")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="radio"
                      id="seller"
                      name="accountType"
                      value="seller"
                      checked={accountType === "seller"}
                      onChange={() => setAccountType("seller")}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="seller" className="font-normal">
                      {t("seller")}
                    </Label>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {accountType === "seller" ? t("sellerAccountDescription") : t("buyerAccountDescription")}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="mb-4 w-full h-11 text-base"
                disabled={isLoading || !passwordsMatch || !hasMinLength || !hasUpperCase || !hasNumber}
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
              <p className="text-center text-base text-muted-foreground">
                {t("alreadyHaveAccount")}{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  {t("login")}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
