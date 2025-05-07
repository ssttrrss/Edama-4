"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Footer() {
  const { t, language } = useTranslation()
  const currentYear = new Date().getFullYear()
  const [showContactOptions, setShowContactOptions] = useState(false)

  // Handle contact options
  const handleSendSMS = () => {
    window.location.href = "sms:01274311482"
    setShowContactOptions(false)
  }

  const handleSendEmail = () => {
    window.location.href = "mailto:edama.team@gmail.com"
    setShowContactOptions(false)
  }

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and about */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
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
            <p className="text-sm text-muted-foreground">{t("welcomeDescription")}</p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("home")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-sm text-muted-foreground hover:text-primary">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  {t("about")}
                </Link>
              </li>
              <li>
                <div className="relative">
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setShowContactOptions(!showContactOptions)}
                  >
                    {t("contact")}
                  </Button>

                  {showContactOptions && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <button
                          onClick={handleSendSMS}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted"
                        >
                          <Phone className="h-4 w-4" />
                          {t("sendSMS")}
                        </button>
                        <button
                          onClick={handleSendEmail}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted"
                        >
                          <Mail className="h-4 w-4" />
                          {t("sendEmail")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("termsAndConditions")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  {t("termsAndConditions")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  {t("privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{t("contact")}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:01274311482" className="hover:text-primary">
                  01274311482
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:edama.team@gmail.com" className="hover:text-primary">
                  edama.team@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Cairo, Egypt</span>
              </li>
            </ul>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Edama. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
