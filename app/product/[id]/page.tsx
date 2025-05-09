"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { products } from "@/lib/data"
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Store,
  Calendar,
  Star,
  MessageSquare,
  Share2,
  Truck,
  ShieldCheck,
  Leaf,
  FileText,
  MapPin,
  Phone,
  Info,
  Utensils,
  Weight,
  Thermometer,
  AlertTriangle,
  Check,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CountdownTimer } from "@/components/countdown-timer"
import { useToast } from "@/components/ui/use-toast"

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t, language, dir } = useTranslation()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<any>(null)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [selectedImage, setSelectedImage] = useState(0)
  const [showAddedToCart, setShowAddedToCart] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft

  // Reset scroll position on page load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // Fetch product data
  useEffect(() => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const foundProduct = products.find((p) => p.id === Number(id))
      if (foundProduct) {
        // Add multiple images for the product (for demo)
        const productWithImages = {
          ...foundProduct,
          images: [
            foundProduct.image,
            "/placeholder.svg?height=600&width=600",
            "/placeholder.svg?height=600&width=600",
          ],
        }
        setProduct(productWithImages)
        // Find similar products (same category, excluding current product)
        const similar = products.filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
        setSimilarProducts(similar.slice(0, 4)) // Limit to 4 similar products
      } else {
        router.push("/home")
      }
      setIsLoading(false)
    }, 500)

    // Check if product is in favorites
    const savedFavorites = localStorage.getItem("edama-favorites")
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites)
        const isInFavorites = parsedFavorites.some((item: any) => item.id === Number(id))
        setIsFavorite(isInFavorites)
      } catch (error) {
        console.error("Failed to parse favorites", error)
      }
    }
  }, [id, router])

  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  // Add to cart with animation
  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.discountedPrice,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity: quantity,
        supermarket: product.supermarket,
        expiryDate: product.expiryDate,
      })

      // Show added to cart animation
      setShowAddedToCart(true)

      // Notification
      toast({
        title: t("addedToCart"),
        description: `${quantity} × ${language === "ar" ? product.nameAr : product.name}`,
        action: (
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push("/cart")}
            className="bg-primary hover:bg-primary/90"
          >
            {t("viewCart")}
          </Button>
        ),
      })

      // Hide animation after a delay
      setTimeout(() => {
        setShowAddedToCart(false)
      }, 2000)
    }
  }

  // Buy now - direct to checkout
  const handleBuyNow = () => {
    if (product) {
      // Add to cart first
      addItem({
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.discountedPrice,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity: quantity,
        supermarket: product.supermarket,
        expiryDate: product.expiryDate,
      })

      // Navigate directly to checkout
      router.push("/checkout")
    }
  }

  // Toggle favorite
  const toggleFavorite = () => {
    if (!isAuthenticated) {
      // Prompt to login if not authenticated
      toast({
        title: t("loginRequired"),
        description: t("loginToSaveFavorites"),
        action: (
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push("/login")}
            className="bg-primary hover:bg-primary/90"
          >
            {t("login")}
          </Button>
        ),
      })
      return
    }

    setIsFavorite(!isFavorite)

    // Update localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("edama-favorites") || "[]")

    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = savedFavorites.filter((item: any) => item.id !== product.id)
      localStorage.setItem("edama-favorites", JSON.stringify(updatedFavorites))

      toast({
        title: t("removedFromFavorites"),
        description: language === "ar" ? product.nameAr : product.name,
      })
    } else {
      // Add to favorites
      const favoriteItem = {
        id: product.id,
        name: product.name,
        nameAr: product.nameAr,
        discountedPrice: product.discountedPrice,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
        supermarket: product.supermarket,
        supermarketAr: product.supermarketAr,
        expiryDate: product.expiryDate,
      }
      savedFavorites.push(favoriteItem)
      localStorage.setItem("edama-favorites", JSON.stringify(savedFavorites))

      toast({
        title: t("addedToFavorites"),
        description: language === "ar" ? product.nameAr : product.name,
      })
    }
  }

  // Share product
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === "ar" ? product.nameAr : product.name,
          text: t("checkOutProduct"),
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: t("linkCopied"),
        description: t("linkCopiedDescription"),
      })
    }
  }

  // Handle image zoom
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isImageZoomed || !imageContainerRef.current) return

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (isLoading || !product) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate)

  // Mock product details for enhanced description section
  const productDetails = {
    ingredients: "Organic wheat flour, water, sea salt, yeast, olive oil",
    nutritionalInfo: {
      calories: "250 kcal per 100g",
      protein: "8g",
      carbs: "48g",
      fat: "2g",
      fiber: "3g",
    },
    storageInstructions: "Store in a cool, dry place. Once opened, consume within 2 days.",
    allergens: "Contains wheat gluten. May contain traces of nuts and sesame seeds.",
    weight: "500g",
    origin: "Local farm in Cairo, Egypt",
    certifications: ["Organic", "Non-GMO", "Vegan"],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center text-sm text-muted-foreground"
      >
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 gap-1 hover:bg-primary/10 transition-colors duration-300"
          onClick={() => router.back()}
        >
          <BackArrow className="h-4 w-4" />
          {t("back")}
        </Button>
        <Link href="/home" className="hover:text-primary transition-colors duration-300">
          {t("home")}
        </Link>
        <span className="mx-2">/</span>
        <span>{language === "ar" ? product.nameAr : product.name}</span>
      </motion.div>

      {/* Product details */}
      <div className="mb-12 grid gap-8 md:grid-cols-2">
        {/* Product image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-lg border bg-background shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative">
            <div className="relative aspect-square overflow-hidden">
              <div
                ref={imageContainerRef}
                className="relative aspect-square overflow-hidden"
                onMouseEnter={() => setIsImageZoomed(true)}
                onMouseLeave={() => setIsImageZoomed(false)}
                onMouseMove={handleImageMouseMove}
              >
                <Image
                  src={product.images ? product.images[selectedImage] : "/placeholder.svg"}
                  alt={language === "ar" ? product.nameAr : product.name}
                  fill
                  className={`object-cover transition-transform duration-300 ${isImageZoomed ? "scale-150" : ""}`}
                  style={isImageZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                />
              </div>
              <AnimatePresence>
                {showAddedToCart && (
                  <motion.div
                    className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-green-500/75 text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 text-xl font-semibold">
                      <Check className="h-6 w-6" />
                      {t("added")}!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {product.images && product.images.length > 1 && (
              <div className="mt-2 flex justify-center gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    className={`h-12 w-12 rounded-md border object-cover p-1 transition-all duration-200 hover:opacity-75 ${selectedImage === index ? "border-primary" : "border-transparent"}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${language === "ar" ? product.nameAr : product.name} - ${index + 1}`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <Badge className="absolute right-4 top-4 bg-secondary flash">
            {product.discount}% {t("off")}
          </Badge>
          {/* Replace the existing expiration date badge */}
          <div className="absolute left-4 top-4">
            <CountdownTimer expiryDate={product.expiryDate} />
          </div>
        </motion.div>

        {/* Product info */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col">
          <motion.h1 variants={fadeInUp} className="mb-2 text-3xl font-bold">
            {language === "ar" ? product.nameAr : product.name}
          </motion.h1>

          <motion.div variants={fadeInUp} className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Store className="h-4 w-4 text-primary" />
              <span>
                {t("soldBy")}: {language === "ar" ? product.supermarketAr : product.supermarket}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {t("expiresOn")}: {formatDate(product.expiryDate)}
              </span>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-6 flex items-end gap-3">
            <div className="text-3xl font-bold text-primary">
              {product.discountedPrice} {t("currency")}
            </div>
            <div className="text-lg text-muted-foreground line-through">
              {product.originalPrice} {t("currency")}
            </div>
            <Badge variant="outline" className="ml-2 bg-secondary/10">
              {product.discount}% {t("off")}
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-6 rounded-lg bg-secondary/10 p-4">
            <p className="text-sm leading-relaxed">{language === "ar" ? product.descriptionAr : product.description}</p>
          </motion.div>

          <Separator className="mb-6" />

          <motion.div variants={fadeInUp} className="mb-6">
            <h2 className="mb-3 text-lg font-medium">{t("quantity")}</h2>
            <div className="flex h-10 w-32 items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-full rounded-r-none hover:bg-primary/10 transition-colors duration-300"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex h-full flex-1 items-center justify-center border-y bg-background px-4 text-center">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
                className="h-full rounded-l-none hover:bg-primary/10 transition-colors duration-300"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-6 grid grid-cols-2 gap-4">
            <Button
              size="lg"
              className="w-full gap-2 hover:scale-105 transition-transform duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {t("addToCart")}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full gap-2 hover:scale-105 transition-transform duration-300"
              onClick={handleBuyNow}
            >
              {t("buyNow")}
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-6 flex gap-4">
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 transition-all duration-300 hover:scale-105 ${
                isFavorite ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "hover:text-red-500 hover:bg-red-50"
              }`}
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? t("savedToFavorites") : t("saveToFavorites")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-primary/10 transition-colors duration-300"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              {t("share")}
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-3 rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-primary" />
              <span>{t("fastDelivery")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>{t("qualityGuarantee")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Leaf className="h-4 w-4 text-primary" />
              <span>{t("ecoFriendly")}</span>
            </div>
          </motion.div>
          {product.shopAddress && (
            <motion.div variants={fadeInUp} className="mt-4 space-y-3 rounded-lg bg-muted/30 p-4">
              <h3 className="font-medium">{t("sellerInformation")}</h3>
              <div className="flex items-center gap-2 text-sm">
                <Store className="h-4 w-4 text-primary" />
                <span>{language === "ar" ? product.supermarketAr : product.supermarket}</span>
              </div>
              {product.shopAddress && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{product.shopAddress}</span>
                </div>
              )}
              {product.contactPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${product.contactPhone}`} className="hover:underline">
                    {product.contactPhone}
                  </a>
                </div>
              )}
              {product.contactWhatsapp && (
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <a
                    href={`https://wa.me/${product.contactWhatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {t("contactViaWhatsapp")}
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Product details tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12"
      >
        <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description" className="flex gap-2 transition-all duration-300 hover:bg-primary/10">
              <FileText className="h-4 w-4" />
              {t("description")}
            </TabsTrigger>
            <TabsTrigger value="details" className="flex gap-2 transition-all duration-300 hover:bg-primary/10">
              <Info className="h-4 w-4" />
              {t("details")}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex gap-2 transition-all duration-300 hover:bg-primary/10">
              <MessageSquare className="h-4 w-4" />
              {t("reviews")}
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex gap-2 transition-all duration-300 hover:bg-primary/10">
              <Truck className="h-4 w-4" />
              {t("shippingInfo")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card className="hover-glow transition-shadow duration-300">
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  {language === "ar" ? product.descriptionAr : product.description}
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-lg font-medium">{t("productDetails")}</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">{t("category")}:</span>
                        <span>{product.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">{t("originalPrice")}:</span>
                        <span>
                          {product.originalPrice} {t("currency")}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">{t("discountedPrice")}:</span>
                        <span className="text-primary">
                          {product.discountedPrice} {t("currency")}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">{t("discount")}:</span>
                        <span>{product.discount}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">{t("expiryDate")}:</span>
                        <span>{formatDate(product.expiryDate)}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-medium">{t("nutritionalInfo")}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{t("nutritionalInfoDescription")}</p>
                    <div className="rounded-lg border p-4">
                      <p className="text-center text-sm">{t("contactForDetails")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <Card className="hover-glow transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Ingredients & Nutrition */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-medium">
                        <Utensils className="h-5 w-5 text-primary" />
                        {t("ingredients")}
                      </h3>
                      <div className="rounded-lg bg-muted/30 p-4">
                        <p className="text-sm">{productDetails.ingredients}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-medium">
                        <Info className="h-5 w-5 text-primary" />
                        {t("nutritionalInformation")}
                      </h3>
                      <div className="rounded-lg bg-muted/30 p-4">
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="font-medium">{t("calories")}:</span>
                            <span>{productDetails.nutritionalInfo.calories}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="font-medium">{t("protein")}:</span>
                            <span>{productDetails.nutritionalInfo.protein}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="font-medium">{t("carbohydrates")}:</span>
                            <span>{productDetails.nutritionalInfo.carbs}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="font-medium">{t("fat")}:</span>
                            <span>{productDetails.nutritionalInfo.fat}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="font-medium">{t("fiber")}:</span>
                            <span>{productDetails.nutritionalInfo.fiber}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Storage & Additional Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-medium">
                        <Thermometer className="h-5 w-5 text-primary" />
                        {t("storageInstructions")}
                      </h3>
                      <div className="rounded-lg bg-muted/30 p-4">
                        <p className="text-sm">{productDetails.storageInstructions}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-medium">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        {t("allergens")}
                      </h3>
                      <div className="rounded-lg bg-muted/30 p-4">
                        <p className="text-sm">{productDetails.allergens}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-medium">
                        <Weight className="h-5 w-5 text-primary" />
                        {t("additionalInformation")}
                      </h3>
                      <div className="rounded-lg bg-muted/30 p-4">
                        <ul className="space-y-2 text-sm">
                          <li className="flex justify-between">
                            <span className="font-medium">{t("weight")}:</span>
                            <span>{productDetails.weight}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="font-medium">{t("origin")}:</span>
                            <span>{productDetails.origin}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="font-medium">{t("certifications")}:</span>
                            <span>{productDetails.certifications.join(", ")}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card className="hover-glow transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{t("customerReviews")}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">4.0 (12 {t("reviews")})</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors duration-300">
                    {t("writeReview")}
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Sample reviews */}
                  <div className="rounded-lg border p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">John Doe</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2023-06-15</span>
                    </div>
                    <div className="mb-2 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Excellent quality and great value for money. Will buy again!
                    </p>
                  </div>

                  <div className="rounded-lg border p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">Jane Smith</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2023-06-10</span>
                    </div>
                    <div className="mb-2 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Very fresh and tasty. Delivery was prompt.</p>
                  </div>

                  <Button variant="outline" className="w-full hover:bg-primary/10 transition-colors duration-300">
                    {t("loadMoreReviews")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card className="hover-glow transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">{t("shippingAndDelivery")}</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{t("deliveryOptions")}</h4>
                      <p className="text-sm text-muted-foreground">{t("deliveryOptionsDescription")}</p>
                      <div className="mt-2 rounded-md bg-muted p-3">
                        <p className="text-sm">
                          <span className="font-medium">{t("standardDelivery")}:</span> 1-2 {t("businessDays")}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">{t("expressDelivery")}:</span> {t("sameDay")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{t("deliveryAreas")}</h4>
                      <p className="text-sm text-muted-foreground">{t("deliveryAreasDescription")}</p>
                      <div className="mt-2 rounded-md bg-muted p-3">
                        <p className="text-sm">{t("deliveryAreasList")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{t("returnsPolicy")}</h4>
                      <p className="text-sm text-muted-foreground">{t("returnsPolicyDescription")}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12"
        >
          <h2 className="mb-6 text-2xl font-bold">{t("similarProducts")}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {similarProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-md product-card"
              >
                <div className="relative">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={language === "ar" ? product.nameAr : product.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  </Link>
                  <Badge className="absolute right-2 top-2 bg-secondary flash" variant="secondary">
                    {product.discount}% {t("off")}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {language === "ar" ? product.supermarketAr : product.supermarket}
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="mb-1 line-clamp-1 font-medium transition-colors duration-300 hover:text-primary">
                      {language === "ar" ? product.nameAr : product.name}
                    </h3>
                  </Link>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-bold text-primary">
                      {product.discountedPrice} {t("currency")}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice} {t("currency")}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 hover:scale-105 transition-transform duration-300"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          nameAr: product.nameAr,
                          price: product.discountedPrice,
                          originalPrice: product.originalPrice,
                          image: product.image,
                          quantity: 1,
                          supermarket: product.supermarket,
                          expiryDate: product.expiryDate,
                        })
                      }
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t("addToCart")}
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-red-50 transition-colors duration-300">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
