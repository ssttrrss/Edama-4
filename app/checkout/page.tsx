"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Truck,
  MapPin,
  Check,
  Clock,
  Loader2,
  Home,
  Building,
  ChevronsRight,
} from "lucide-react"
import confetti from "canvas-confetti"

// Step components
const CheckoutSteps = [
  { id: "shipping", title: "shippingInfo" },
  { id: "payment", title: "paymentMethod" },
  { id: "review", title: "reviewOrder" },
  { id: "confirmation", title: "orderConfirmation" },
]

export default function CheckoutPage() {
  const { t, language, dir } = useTranslation()
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState("")

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    addressType: "home",
    address: "",
    city: "",
    area: "",
    notes: "",
  })

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  // Calculate shipping cost and total
  const shippingCost = items.length > 0 ? 15 : 0
  const total = subtotal + shippingCost

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount} ${t("currency")}`
  }

  // Reset scroll position on page load
  useEffect(() => {
    window.scrollTo(0, 0)

    // Redirect if cart is empty
    if (items.length === 0 && !orderComplete) {
      router.push("/cart")
    }
  }, [items.length, router, orderComplete])

  // Handle form changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Navigate between steps
  const nextStep = () => {
    if (currentStep < CheckoutSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  // Validate current step
  const validateCurrentStep = () => {
    if (currentStep === 0) {
      // Validate shipping info
      if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
        toast({
          title: t("errorTitle"),
          description: t("fillRequiredFields"),
          variant: "destructive",
        })
        return false
      }
    } else if (currentStep === 1 && paymentMethod === "card") {
      // Validate card info
      if (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiryDate || !cardInfo.cvv) {
        toast({
          title: t("errorTitle"),
          description: t("fillRequiredFields"),
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  // Handle step navigation
  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep()
    }
  }

  // Handle order submission
  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      // Generate random order ID
      const newOrderId = `ED-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`
      setOrderId(newOrderId)

      // Save order to localStorage
      const order = {
        id: newOrderId,
        date: new Date().toISOString(),
        items: items,
        shipping: shippingInfo,
        payment: {
          method: paymentMethod,
          ...(paymentMethod === "card" && {
            cardInfo: { ...cardInfo, cardNumber: `**** **** **** ${cardInfo.cardNumber.slice(-4)}` },
          }),
        },
        subtotal,
        shippingCost,
        total,
        status: "processing",
      }

      const orders = JSON.parse(localStorage.getItem("edama-orders") || "[]")
      orders.push(order)
      localStorage.setItem("edama-orders", JSON.stringify(orders))

      // Clear cart
      clearCart()

      // Show success
      setIsProcessing(false)
      setOrderComplete(true)
      nextStep()

      // Trigger confetti
      triggerConfetti()
    }, 2000)
  }

  // Trigger confetti animation
  const triggerConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFC107"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFC107"],
      })
    }, 250)
  }

  // Step content components
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t("shippingInfo")}</CardTitle>
                <CardDescription>{t("enterShippingDetails")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t("fullName")} *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phone")} *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("addressType")}</Label>
                  <RadioGroup
                    defaultValue={shippingInfo.addressType}
                    onValueChange={(value) => setShippingInfo((prev) => ({ ...prev, addressType: value }))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="home" id="home" />
                      <Label htmlFor="home" className="flex items-center gap-1 font-normal">
                        <Home className="h-4 w-4" /> {t("home")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="work" id="work" />
                      <Label htmlFor="work" className="flex items-center gap-1 font-normal">
                        <Building className="h-4 w-4" /> {t("work")}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t("address")} *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("city")} *</Label>
                    <Input id="city" name="city" value={shippingInfo.city} onChange={handleShippingChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">{t("area")}</Label>
                    <Input id="area" name="area" value={shippingInfo.area} onChange={handleShippingChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t("deliveryNotes")}</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={shippingInfo.notes}
                    onChange={handleShippingChange}
                    placeholder={t("deliveryNotesPlaceholder")}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/cart")}>
                  <BackArrow className="mr-2 h-4 w-4" />
                  {t("back")}
                </Button>
                <Button onClick={handleNext}>
                  {t("continue")}
                  <ChevronsRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t("paymentMethod")}</CardTitle>
                <CardDescription>{t("selectPaymentMethod")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex w-full cursor-pointer items-center justify-between rounded-md border p-4 hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span>{t("creditCard")}</span>
                      </div>
                      <div className="flex gap-2">
                        <Image
                          src="/placeholder.svg?height=30&width=40"
                          alt="Visa"
                          width={40}
                          height={30}
                          className="h-6 w-auto object-contain"
                        />
                        <Image
                          src="/placeholder.svg?height=30&width=40"
                          alt="Mastercard"
                          width={40}
                          height={30}
                          className="h-6 w-auto object-contain"
                        />
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label
                      htmlFor="cash"
                      className="flex w-full cursor-pointer items-center justify-between rounded-md border p-4 hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        <span>{t("cashOnDelivery")}</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-4 rounded-md border p-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">{t("cardNumber")}</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardInfo.cardNumber}
                        onChange={handleCardInfoChange}
                        placeholder="1234 5678 9012 3456"
                        dir="ltr"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">{t("nameOnCard")}</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={cardInfo.cardName}
                        onChange={handleCardInfoChange}
                        dir="ltr"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">{t("expiryDate")}</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={cardInfo.expiryDate}
                          onChange={handleCardInfoChange}
                          placeholder="MM/YY"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">{t("cvv")}</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          value={cardInfo.cvv}
                          onChange={handleCardInfoChange}
                          type="password"
                          maxLength={4}
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <BackArrow className="mr-2 h-4 w-4" />
                  {t("back")}
                </Button>
                <Button onClick={handleNext}>
                  {t("continue")}
                  <ChevronsRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t("reviewOrder")}</CardTitle>
                <CardDescription>{t("reviewOrderDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order items */}
                <div className="space-y-4">
                  <h3 className="font-medium">{t("items")}</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={language === "ar" ? item.nameAr : item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{language === "ar" ? item.nameAr : item.name}</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {t("quantity")}: {item.quantity}
                            </span>
                            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Shipping info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{t("shippingInfo")}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(0)}>
                      {t("edit")}
                    </Button>
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <div>
                        <p className="font-medium">{shippingInfo.fullName}</p>
                        <p className="text-sm text-muted-foreground">{shippingInfo.phone}</p>
                        <p className="text-sm text-muted-foreground">
                          {shippingInfo.address}, {shippingInfo.area}, {shippingInfo.city}
                        </p>
                        {shippingInfo.notes && (
                          <p className="mt-2 text-sm italic text-muted-foreground">
                            {t("notes")}: {shippingInfo.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment method */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{t("paymentMethod")}</h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                      {t("edit")}
                    </Button>
                  </div>
                  <div className="rounded-md bg-muted p-4">
                    <div className="flex items-center gap-2">
                      {paymentMethod === "card" ? (
                        <>
                          <CreditCard className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">{t("creditCard")}</p>
                            <p className="text-sm text-muted-foreground">
                              **** **** **** {cardInfo.cardNumber.slice(-4)}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Truck className="h-4 w-4 text-primary" />
                          <p className="font-medium">{t("cashOnDelivery")}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order summary */}
                <div className="space-y-4">
                  <h3 className="font-medium">{t("orderSummary")}</h3>
                  <div className="space-y-2">
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
                      <span className="text-lg text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <BackArrow className="mr-2 h-4 w-4" />
                  {t("back")}
                </Button>
                <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("placeOrder")
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-primary/20 p-3">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h2 className="mb-2 text-2xl font-bold">{t("orderConfirmed")}</h2>
                <p className="mb-6 text-muted-foreground">{t("orderConfirmedDescription")}</p>

                <div className="mb-6 rounded-md bg-muted p-4 text-start">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{t("orderNumber")}</span>
                    <span className="font-mono font-bold">{orderId}</span>
                  </div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{t("orderDate")}</span>
                    <span>{new Date().toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t("estimatedDelivery")}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(
                        language === "ar" ? "ar-EG" : "en-US",
                      )}
                    </span>
                  </div>
                </div>

                <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-900/20">
                  <p className="text-sm text-green-800 dark:text-green-300">{t("ecoImpactMessage")}</p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button onClick={() => router.push("/profile/orders")} variant="outline" className="w-full sm:w-auto">
                    {t("trackOrder")}
                  </Button>
                  <Button onClick={() => router.push("/home")} className="w-full sm:w-auto">
                    {t("continueShopping")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Checkout progress */}
      {!orderComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Tabs value={CheckoutSteps[currentStep].id} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {CheckoutSteps.map((step, index) => (
                <TabsTrigger
                  key={step.id}
                  value={step.id}
                  disabled={index !== currentStep}
                  className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${
                    index < currentStep ? "text-primary" : ""
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs">
                      {index + 1}
                    </span>
                  )}
                  <span className="ml-2 hidden sm:inline">{t(step.title)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
        </div>

        {!orderComplete && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle>{t("orderSummary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items summary */}
                  <div className="max-h-[300px] space-y-3 overflow-auto pr-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={language === "ar" ? item.nameAr : item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 text-sm">
                          <div className="line-clamp-1 font-medium">{language === "ar" ? item.nameAr : item.name}</div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">x{item.quantity}</span>
                            <span>{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price summary */}
                  <div className="space-y-2">
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
                      <span className="text-lg text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Eco impact */}
                  <div className="mt-4 rounded-md bg-primary/10 p-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-primary/20 p-1">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-xs">{t("ecoImpact")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
