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
import { Eye, EyeOff, ArrowLeft, ArrowRight, Loader2, AlertCircle, Lock, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function LoginPage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, checkExistingEmail } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailExists, setEmailExists] = useState<boolean | null>(null)

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home")
    }
  }, [isAuthenticated, router])

  // Check if email exists when changed
  useEffect(() => {
    if (email && email.includes("@")) {
      const exists = checkExistingEmail(email)
      setEmailExists(exists)
    } else {
      setEmailExists(null)
    }
  }, [email, checkExistingEmail])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!emailExists) {
        toast({
          title: t("accountNotFound"),
          description: t("redirectToSignup"),
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/signup?email=${encodeURIComponent(email)}`)}
            >
              {t("signup")}
            </Button>
          ),
        })
        setIsLoading(false)
        return
      }

      await login(email, password)
    } catch (error: any) {
      // Error handling is done in auth-provider
      setIsLoading(false)
    }
  }

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
              <CardTitle className="text-2xl font-bold">{t("loginTitle")}</CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-base">{t("loginDescription")}</CardDescription>
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

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="text-base flex gap-2 items-center">
                  <Mail className="h-4 w-4" />
                  {t("email")}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                    className="h-11 pl-3 transition-all duration-300 border-primary/20 focus:border-primary"
                  />
                  {emailExists === false && email.length > 5 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-500">
                      {t("newUser")}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-base flex gap-2 items-center">
                    <Lock className="h-4 w-4" />
                    {t("password")}
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
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
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <motion.div variants={itemVariants} className="w-full">
                <Button
                  type="submit"
                  className="mb-4 w-full h-11 text-base transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/90"
                  disabled={isLoading || !email || !password}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("loggingIn")}
                    </>
                  ) : (
                    t("login")
                  )}
                </Button>
              </motion.div>

              <motion.p variants={itemVariants} className="text-center text-base text-muted-foreground">
                {t("dontHaveAccount")}{" "}
                <Link
                  href={email ? `/signup?email=${encodeURIComponent(email)}` : "/signup"}
                  className="text-primary font-medium hover:underline"
                >
                  {t("createAccount")}
                </Link>
              </motion.p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
