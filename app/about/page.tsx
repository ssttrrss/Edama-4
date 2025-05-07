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
import { Leaf, Droplets, ShoppingBag, Users, ArrowRight, ArrowLeft, ExternalLink } from "lucide-react"

// Team member data
const teamMembers = [
  {
    name: "Mahmoud Ibrahim Mahmoud",
    role: "Lead Developer",
    bio: "Passionate about creating sustainable technology solutions that make a positive impact on the environment.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Hana Elsayed",
    role: "UI/UX Designer",
    bio: "Dedicated to creating intuitive and accessible user experiences that connect people with eco-friendly solutions.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Saif Eldin",
    role: "Product Manager",
    bio: "Focused on developing innovative strategies to reduce food waste and promote sustainable consumption patterns.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Marwan Mamdouh",
    role: "Marketing Specialist",
    bio: "Committed to raising awareness about food waste issues and promoting eco-conscious shopping habits.",
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
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
            {t("aboutEdama")}
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-muted-foreground">{t("aboutHeroDescription")}</p>
        <div className="flex justify-center gap-4">
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

      {/* Mission Section */}
      <div id="mission" ref={missionRef} className="mb-20 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={missionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid gap-12 md:grid-cols-2"
        >
          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">{t("ourMission")}</h2>
            <p className="mb-4 text-lg text-muted-foreground">{t("missionDescription1")}</p>
            <p className="mb-6 text-lg text-muted-foreground">{t("missionDescription2")}</p>
            <div className="rounded-lg bg-primary/10 p-6">
              <blockquote className="italic text-primary">"{t("missionQuote")}"</blockquote>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-xl">
            <Image src="/placeholder.svg?height=800&width=600" alt="Edama Mission" fill className="object-cover" />
          </div>
        </motion.div>
      </div>

      {/* Impact Stats */}
      <motion.div
        ref={impactRef}
        initial={{ opacity: 0, y: 50 }}
        animate={impactInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-12 dark:from-green-950/30 dark:to-emerald-950/30">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">{t("ourImpact")}</h2>
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
              icon={<Leaf className="h-8 w-8 text-amber-600" />}
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

      {/* About Edama Platform */}
      <div className="mb-20">
        <Tabs defaultValue="vision" className="w-full">
          <div className="mb-8 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">{t("aboutPlatform")}</h2>
            <TabsList className="inline-flex">
              <TabsTrigger value="vision">{t("visionAndGoals")}</TabsTrigger>
              <TabsTrigger value="features">{t("keyFeatures")}</TabsTrigger>
              <TabsTrigger value="future">{t("futureRoadmap")}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="vision" className="mt-6">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-2xl font-bold">{t("ourVision")}</h3>
                    <p className="mb-4 text-muted-foreground">{t("visionDescription1")}</p>
                    <p className="text-muted-foreground">{t("visionDescription2")}</p>

                    <h3 className="mb-4 mt-8 text-2xl font-bold">{t("ourGoals")}</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="mt-1 rounded-full bg-primary/20 p-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{t("goal1")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 rounded-full bg-primary/20 p-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{t("goal2")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 rounded-full bg-primary/20 p-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{t("goal3")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1 rounded-full bg-primary/20 p-1">
                          <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{t("goal4")}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative h-[300px] overflow-hidden rounded-xl md:h-full">
                    <Image
                      src="/placeholder.svg?height=600&width=400"
                      alt="Edama Vision"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-6 text-2xl font-bold">{t("platformFeatures")}</h3>

                    <div className="space-y-6">
                      <div className="rounded-lg border p-4">
                        <h4 className="mb-2 text-lg font-medium">{t("featureConnecting")}</h4>
                        <p className="text-sm text-muted-foreground">{t("featureConnectingDesc")}</p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="mb-2 text-lg font-medium">{t("featureDiscounts")}</h4>
                        <p className="text-sm text-muted-foreground">{t("featureDiscountsDesc")}</p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="mb-2 text-lg font-medium">{t("featureTracking")}</h4>
                        <p className="text-sm text-muted-foreground">{t("featureTrackingDesc")}</p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="mb-2 text-lg font-medium">{t("featureEcoImpact")}</h4>
                        <p className="text-sm text-muted-foreground">{t("featureEcoImpactDesc")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="mb-6 text-2xl font-bold">{t("benefitsForUsers")}</h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
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

                      <div className="flex items-start gap-3">
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

                      <div className="flex items-start gap-3">
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

                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                          <svg
                            className="h-5 w-5 text-purple-600 dark:text-purple-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">{t("benefitCommunity")}</h4>
                          <p className="text-sm text-muted-foreground">{t("benefitCommunityDesc")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="future" className="mt-6">
            <Card>
              <CardContent className="p-6 md:p-8">
                <h3 className="mb-6 text-2xl font-bold">{t("futureRoadmap")}</h3>

                <div className="relative border-l border-primary/30 pl-6">
                  <div className="mb-10 relative">
                    <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full border border-primary bg-background">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                    </div>
                    <h4 className="mb-2 text-lg font-medium">{t("phase1")}</h4>
                    <p className="mb-2 text-muted-foreground">{t("phase1Desc")}</p>
                    <div className="text-sm text-primary">{t("currentPhase")}</div>
                  </div>

                  <div className="mb-10 relative">
                    <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full border border-muted bg-background">
                      <div className="h-3 w-3 rounded-full bg-muted"></div>
                    </div>
                    <h4 className="mb-2 text-lg font-medium">{t("phase2")}</h4>
                    <p className="mb-2 text-muted-foreground">{t("phase2Desc")}</p>
                    <div className="text-sm text-muted-foreground">Q3 2023</div>
                  </div>

                  <div className="mb-10 relative">
                    <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full border border-muted bg-background">
                      <div className="h-3 w-3 rounded-full bg-muted"></div>
                    </div>
                    <h4 className="mb-2 text-lg font-medium">{t("phase3")}</h4>
                    <p className="mb-2 text-muted-foreground">{t("phase3Desc")}</p>
                    <div className="text-sm text-muted-foreground">Q1 2024</div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full border border-muted bg-background">
                      <div className="h-3 w-3 rounded-full bg-muted"></div>
                    </div>
                    <h4 className="mb-2 text-lg font-medium">{t("phase4")}</h4>
                    <p className="mb-2 text-muted-foreground">{t("phase4Desc")}</p>
                    <div className="text-sm text-muted-foreground">Q3 2024</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Team Section */}
      <div id="team" ref={teamRef} className="mb-20 scroll-mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={teamInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">{t("meetOurTeam")}</h2>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="mb-1 text-xl font-bold">{member.name}</h3>
                    <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border bg-card p-6 text-center">
            <h3 className="mb-4 text-xl font-bold">{t("aboutElSewedy")}</h3>
            <p className="mx-auto max-w-3xl text-muted-foreground">{t("elSewedyDescription")}</p>
            <Button variant="link" className="mt-4">
              {t("learnMoreAboutSchool")} <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-xl bg-primary/10 p-12 text-center"
      >
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">{t("joinMovement")}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">{t("joinMovementDescription")}</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/signup">
            <Button size="lg" className="min-w-[200px]">
              {t("signup")}
            </Button>
          </Link>
          <Link href="/home">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              {t("exploreProducts")}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
