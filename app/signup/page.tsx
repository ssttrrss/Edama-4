"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function SignupPage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      // Show error
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Store user in localStorage (in a real app, this would be a JWT token)
      localStorage.setItem("edama-user", JSON.stringify({ name, email }))
      setIsLoading(false)
      router.push("/home")
    }, 1500)
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
        <Card>
          <CardHeader>
            <div className="mb-2 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => router.push("/")}
                aria-label={t("back")}
              >
                <BackArrow />
              </Button>
              <CardTitle className="text-2xl">{t("signupTitle")}</CardTitle>
            </div>
            <CardDescription>{t("signupDescription")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullName")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
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
                  <div className="mt-2 space-y-1 text-xs">
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
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    dir="ltr"
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
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <CheckCircle2 className={`h-3 w-3 ${passwordsMatch ? "text-green-500" : "text-red-500"}`} />
                    <span className={passwordsMatch ? "text-green-500" : "text-red-500"}>
                      {passwordsMatch ? t("passwordsMatch") : t("passwordsDontMatch")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="mb-4 w-full"
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
              <p className="text-center text-sm text-muted-foreground">
                {t("alreadyHaveAccount")}{" "}
                <Link href="/login" className="text-primary hover:underline">
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
