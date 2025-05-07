"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

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
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  {t("contact")}
                </Link>
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
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@edama.eg</span>
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
