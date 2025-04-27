"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function CartPage() {
  const { t, language, dir } = useTranslation()
  const { items, removeItem, updateQuantity, subtotal } = useCart()

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  // Reset scroll position on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Calculate shipping cost and total
  const shippingCost = items.length > 0 ? 15 : 0
  const total = subtotal + shippingCost

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount} ${t("currency")}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="mb-6 text-2xl font-bold">{t("yourCart")}</h1>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2"
        >
          {items.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">{t("emptyCart")}</h2>
              <p className="mb-6 text-muted-foreground">{t("emptyCart")}</p>
              <Link href="/home">
                <Button>{t("startShopping")}</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={language === "ar" ? item.nameAr : item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <h3 className="font-medium">{language === "ar" ? item.nameAr : item.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">{item.supermarket}</div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="font-medium text-primary">{formatCurrency(item.price)}</span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatCurrency(item.originalPrice)}
                            </span>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex h-8 items-center">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <div className="flex h-8 w-10 items-center justify-center border-y bg-background text-center text-sm">
                                {item.quantity}
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>{t("subtotal")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("shipping")}</span>
                  <span>{formatCurrency(shippingCost)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>{t("total")}</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className="w-full" disabled={items.length === 0}>
                {t("checkout")}
              </Button>
              <Link href="/home" className="w-full">
                <Button variant="outline" className="w-full gap-2">
                  <BackArrow className="h-4 w-4" />
                  {t("continueShopping")}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
