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
import { Eye, EyeOff, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Store user in localStorage (in a real app, this would be a JWT token)
      localStorage.setItem("edama-user", JSON.stringify({ email }))
      setIsLoading(false)
      router.push("/home")
    }, 1500)
  }

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
              <CardTitle className="text-2xl">{t("loginTitle")}</CardTitle>
            </div>
            <CardDescription>{t("loginDescription")}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    {t("forgotPassword")}
                  </Link>
                </div>
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="mb-4 w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loggingIn")}
                  </>
                ) : (
                  t("login")
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t("dontHaveAccount")}{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  {t("createAccount")}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
