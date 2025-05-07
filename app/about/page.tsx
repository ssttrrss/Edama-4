"use client"

import { useState } from "react"
import type React from "react"
import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, useInView, useAnimation } from "framer-motion"
import {
  Leaf,
  Droplets,
  ShoppingBag,
  Users,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Globe,
  Recycle,
  Heart,
  Calendar,
  Award,
} from "lucide-react"

// Team member data
const teamMembers = [
  {
    name: "Mahmoud Ibrahim Mahmoud",
    role: "Lead Developer",
    bio: "Passionate about creating sustainable technology solutions that make a positive impact on the environment.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Hannah Elsayed",
    role: "Researcher",
    bio: "نسيت كنت هكتب اي.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Saif Eldin",
    role: "Leader",
    bio: "Focused on developing innovative strategies to reduce food waste and promote sustainable consumption patterns.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Marwan Mamdouh",
    role: "اخويا",
    bio: "يكتب اللي هو عايزه.",
    image: "/placeholder.svg?height=300&width=300",
  },
]

// Counter animation component
const AnimatedCounter = ({
  value,
  label,
  icon,
  delay = 0,
}: { value: number; label: string; icon: React.ReactNode; delay?: number }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay },
      })
    }
  }, [controls, isInView, delay])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-4 rounded-full bg-primary/10 p-4">{icon}</div>
      <h3 className="text-4xl font-bold text-primary">
        <CountUp target={value} />
      </h3>
      <p className="mt-2 text-muted-foreground">{label}</p>
    </motion.div>
  )
}

// Count up animation
const CountUp = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = target / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= target) {
          setCount(target)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, target])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export default function AboutPage() {
  const { t, language } = useTranslation()
  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  // Refs for scroll animations
  const missionRef = useRef(null)
  const teamRef = useRef(null)
  const impactRef = useRef(null)

  const missionInView = useInView(missionRef, { once: true, amount: 0.3 })
  const teamInView = useInView(teamRef, { once: true, amount: 0.1 })
  const impactInView = useInView(impactRef, { once: true, amount: 0.3 })

  // Reset scroll position on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section - Redesigned with a more modern look */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative mb-24 overflow-hidden rounded-3xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10"></div>
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-secondary/10"></div>

        <div className="relative z-10 grid items-center gap-8 px-6 py-16 md:grid-cols-2 md:px-12 md:py-20">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
                  {t("aboutEdama")}
                </span>
              </h1>
              <p className="mb-8 text-xl text-muted-foreground">{t("aboutHeroDescription")}</p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <Link href="/home">
                  <Button size="lg" className="gap-2">
                    {t("exploreProducts")}
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </Link>
                <a href="#mission">
                  <Button variant="outline" size="lg">
                    {t("learnMore")}
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full border-8 border-white shadow-xl dark:border-gray-800">
              <Image src="/placeholder.svg?height=600&width=600" alt="Edama" fill className="object-cover" priority />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission Section - Enhanced with cards and icons */}
      <div id="mission" ref={missionRef} className="mb-24 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={missionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("ourMission")}</h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-primary"></div>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{t("missionDescription1")}</p>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{t("missionDescription2")}</p>

              <Card className="overflow-hidden border-none bg-gradient-to-r from-primary/10 to-primary/5">
                <CardContent className="p-6">
                  <blockquote className="border-l-4 border-primary pl-4 italic text-primary">
                    "{t("missionQuote")}"
                  </blockquote>
                </CardContent>
              </Card>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1 font-medium">{t("sustainableShopping")}</h3>
                  <p className="text-sm text-muted-foreground">{t("sustainableShoppingDesc")}</p>
                </div>

                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400">
                    <Recycle className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1 font-medium">{t("reducingWaste")}</h3>
                  <p className="text-sm text-muted-foreground">{t("reducingWasteDesc")}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[500px] overflow-hidden rounded-2xl shadow-xl">
                <Image src="/placeholder.svg?height=1000&width=600" alt="Edama Mission" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">{t("joinOurMission")}</h3>
                  <p className="mb-4">{t("joinOurMissionDesc")}</p>
                  <Button variant="outline" className="border-white text-white hover:bg-white/20">
                    {t("learnMore")}
                  </Button>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/10"></div>
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-secondary/10"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Impact Stats - Redesigned with better spacing and animations */}
      <motion.div
        ref={impactRef}
        initial={{ opacity: 0, y: 50 }}
        animate={impactInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-24"
      >
        <div className="rounded-3xl bg-gradient-to-r from-green-50 to-emerald-50 p-12 shadow-sm dark:from-green-950/30 dark:to-emerald-950/30">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("ourImpact")}</h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-primary"></div>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("ourImpactDescription")}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatedCounter
              value={5000}
              label={t("kgFoodSaved")}
              icon={<Leaf className="h-8 w-8 text-green-600" />}
              delay={0.1}
            />
            <AnimatedCounter
              value={1000000}
              label={t("litersWaterSaved")}
              icon={<Droplets className="h-8 w-8 text-blue-600" />}
              delay={0.2}
            />
            <AnimatedCounter
              value={25000}
              label={t("kgCO2Reduced")}
              icon={<Globe className="h-8 w-8 text-amber-600" />}
              delay={0.3}
            />
            <AnimatedCounter
              value={3000}
              label={t("activeUsers")}
              icon={<Users className="h-8 w-8 text-violet-600" />}
              delay={0.4}
            />
          </div>
        </div>
      </motion.div>

      {/* About Edama Platform - Enhanced with better tab design */}
      <div className="mb-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("aboutPlatform")}</h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-primary"></div>
        </div>

        <Tabs defaultValue="vision" className="w-full">
          <div className="mb-8 flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="vision" className="rounded-full">
                <Heart className="mr-2 h-4 w-4" />
                {t("visionAndGoals")}
              </TabsTrigger>
              <TabsTrigger value="features" className="rounded-full">
                <Award className="mr-2 h-4 w-4" />
                {t("keyFeatures")}
              </TabsTrigger>
              <TabsTrigger value="future" className="rounded-full">
                <Calendar className="mr-2 h-4 w-4" />
                {t("futureRoadmap")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="vision" className="mt-6">
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-0">
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-12">
                    <h3 className="mb-6 text-2xl font-bold">{t("ourVision")}</h3>
                    <p className="mb-4 text-muted-foreground">{t("visionDescription1")}</p>
                    <p className="text-muted-foreground">{t("visionDescription2")}</p>

                    <h3 className="mb-4 mt-8 text-2xl font-bold">{t("ourGoals")}</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{t("goal1")}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{t("goal2")}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{t("goal3")}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{t("goal4")}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative h-[400px] md:h-auto">
                    <Image
                      src="/placeholder.svg?height=800&width=600"
                      alt="Edama Vision"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="mb-2 text-xl font-bold">{t("sustainableFuture")}</h3>
                      <p className="text-sm">{t("sustainableFutureDesc")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-0">
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 md:p-12">
                    <h3 className="mb-6 text-2xl font-bold">{t("platformFeatures")}</h3>

                    <div className="space-y-6">
                      <div className="rounded-lg border border-primary/20 bg-white p-4 shadow-sm dark:bg-gray-800">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900">
                            <svg
                              className="h-4 w-4 text-green-600 dark:text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-lg font-medium">{t("featureConnecting")}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{t("featureConnectingDesc")}</p>
                      </div>

                      <div className="rounded-lg border border-primary/20 bg-white p-4 shadow-sm dark:bg-gray-800">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900">
                            <svg
                              className="h-4 w-4 text-blue-600 dark:text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-lg font-medium">{t("featureDiscounts")}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{t("featureDiscountsDesc")}</p>
                      </div>

                      <div className="rounded-lg border border-primary/20 bg-white p-4 shadow-sm dark:bg-gray-800">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="rounded-full bg-amber-100 p-1.5 dark:bg-amber-900">
                            <svg
                              className="h-4 w-4 text-amber-600 dark:text-amber-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-lg font-medium">{t("featureTracking")}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{t("featureTrackingDesc")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 bg-gradient-to-br from-secondary/5 to-secondary/10 p-8 md:p-12">
                    <h3 className="mb-6 text-2xl font-bold">{t("benefitsForUsers")}</h3>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                          <svg
                            className="h-5 w-5 text-green-600 dark:text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">{t("benefitSaveMoney")}</h4>
                          <p className="text-sm text-muted-foreground">{t("benefitSaveMoneyDesc")}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                          <svg
                            className="h-5 w-5 text-blue-600 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">{t("benefitQuality")}</h4>
                          <p className="text-sm text-muted-foreground">{t("benefitQualityDesc")}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                          <svg
                            className="h-5 w-5 text-amber-600 dark:text-amber-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">{t("benefitEnvironment")}</h4>
                          <p className="text-sm text-muted-foreground">{t("benefitEnvironmentDesc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="future" className="mt-6">
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-8 md:p-12">
                <h3 className="mb-8 text-2xl font-bold">{t("futureRoadmap")}</h3>

                <div className="relative border-l-2 border-primary/30 pl-8">
                  <div className="mb-12 relative">
                    <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
                      <div className="h-4 w-4 rounded-full bg-primary"></div>
                    </div>
                    <h4 className="mb-3 text-xl font-bold">{t("phase1")}</h4>
                    <p className="mb-3 text-muted-foreground">{t("phase1Desc")}</p>
                    <div className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
                      {t("currentPhase")}
                    </div>
                  </div>

                  <div className="mb-12 relative">
                    <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-background">
                      <div className="h-4 w-4 rounded-full bg-muted"></div>
                    </div>
                    <h4 className="mb-3 text-xl font-bold">{t("phase2")}</h4>
                    <p className="mb-3 text-muted-foreground">{t("phase2Desc")}</p>
                    <div className="inline-block rounded-full bg-muted/20 px-3 py-1 text-sm font-medium text-muted-foreground">
                      Q3 2023
                    </div>
                  </div>

                  <div className="mb-12 relative">
                    <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-background">
                      <div className="h-4 w-4 rounded-full bg-muted"></div>
                    </div>
                    <h4 className="mb-3 text-xl font-bold">{t("phase3")}</h4>
                    <p className="mb-3 text-muted-foreground">{t("phase3Desc")}</p>
                    <div className="inline-block rounded-full bg-muted/20 px-3 py-1 text-sm font-medium text-muted-foreground">
                      Q1 2024
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted bg-background">
                      <div className="h-4 w-4 rounded-full bg-muted"></div>
                    </div>
                    <h4 className="mb-3 text-xl font-bold">{t("phase4")}</h4>
                    <p className="mb-3 text-muted-foreground">{t("phase4Desc")}</p>
                    <div className="inline-block rounded-full bg-muted/20 px-3 py-1 text-sm font-medium text-muted-foreground">
                      Q3 2024
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Team Section - Enhanced with better card design */}
      <div id="team" ref={teamRef} className="mb-24 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={teamInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t("meetOurTeam")}</h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-primary"></div>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("meetOurTeamDesc")}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-none shadow-lg transition-all hover:shadow-xl">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                      <p className="text-sm">{member.bio}</p>
                    </div>
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="mb-1 text-xl font-bold">{member.name}</h3>
                    <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                    <div className="flex justify-center space-x-3">
                      <a
                        href="#"
                        className="rounded-full bg-muted/20 p-2 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="rounded-full bg-muted/20 p-2 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="rounded-full bg-muted/20 p-2 text-muted-foreground hover:bg-primary/20 hover:text-primary"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                        </svg>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 rounded-xl border bg-card p-8 text-center shadow-sm">
            <h3 className="mb-4 text-xl font-bold">{t("aboutElSewedy")}</h3>
            <p className="mx-auto max-w-3xl text-muted-foreground">{t("elSewedyDescription")}</p>
            <Button variant="link" className="mt-4">
              {t("learnMoreAboutSchool")} <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Call to Action - Enhanced with gradient background */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-12 text-center text-white shadow-lg"
      >
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/10"></div>

        <div className="relative z-10">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">{t("joinMovement")}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">{t("joinMovementDescription")}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="min-w-[200px] bg-white text-primary hover:bg-white/90">
                {t("signup")}
              </Button>
            </Link>
            <Link href="/home">
              <Button variant="outline" size="lg" className="min-w-[200px] border-white text-white hover:bg-white/20">
                {t("exploreProducts")}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
