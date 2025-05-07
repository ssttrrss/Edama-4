"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

// Client components for translation
function WelcomeTitle() {
  const { t } = useTranslation()
  return <>{t("welcomeTitle")}</>
}

function WelcomeDescription() {
  const { t } = useTranslation()
  return <>{t("welcomeDescription")}</>
}

function LoginButton() {
  const { t } = useTranslation()
  return <>{t("login")}</>
}

function SignupButton() {
  const { t } = useTranslation()
  return <>{t("signup")}</>
}

function ExploreButton() {
  const { t } = useTranslation()
  return <>{t("exploreProducts")}</>
}

function FeatureCard({
  icon,
  titleKey,
  descriptionKey,
  delay,
}: {
  icon: string
  titleKey: string
  descriptionKey: string
  delay: number
}) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{t(titleKey)}</h3>
      <p className="text-muted-foreground">{t(descriptionKey)}</p>
    </motion.div>
  )
}

export default function WelcomePage() {
  const { language } = useTranslation()

  // Reset scroll position on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8 h-40 w-40"
        >
          <Image
            src="/placeholder.svg?height=160&width=160"
            alt="Edama Logo"
            width={160}
            height={160}
            className="object-cover"
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6 bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
        >
          <WelcomeTitle />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          <WelcomeDescription />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              <LoginButton />
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <SignupButton />
            </Button>
          </Link>
        </motion.div>

        <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard icon="🌱" titleKey="feature1Title" descriptionKey="feature1Description" delay={0.9} />
          <FeatureCard icon="💰" titleKey="feature2Title" descriptionKey="feature2Description" delay={1.1} />
          <FeatureCard icon="🌍" titleKey="feature3Title" descriptionKey="feature3Description" delay={1.3} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-12"
        >
          <Link href="/home" className="group inline-flex items-center">
            <Button variant="link" size="lg" className="gap-2">
              <ExploreButton />
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
