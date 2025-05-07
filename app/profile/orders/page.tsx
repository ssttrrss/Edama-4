"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function OrdersPage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  useEffect(() => {
    // Redirect to profile page with orders tab active
    router.push("/profile?tab=orders")
  }, [router])

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="text-center">
        <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p>{t("redirecting")}...</p>
        <Button variant="link" onClick={() => router.push("/profile")} className="mt-4">
          <BackArrow className="mr-2 h-4 w-4" />
          {t("backToProfile")}
        </Button>
      </div>
    </div>
  )
}
