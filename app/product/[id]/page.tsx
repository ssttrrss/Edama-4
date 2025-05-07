"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { products } from "@/lib/data"
import { ProfileShortcut } from "@/components/profile-shortcut"
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Store,
  Calendar,
  Clock,
  Star,
  MessageSquare,
  Share2,
  Truck,
  ShieldCheck,
  Leaf,
  FileText,
  MapPin,
} from "lucide-react"
import { motion } from "framer-motion"

export default function ProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { t, language, dir } = useTranslation()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<any>(null)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

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
        setProduct(foundProduct)
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

  // Add to cart
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
    setIsFavorite(!isFavorite)

    // Update localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("edama-favorites") || "[]")

    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = savedFavorites.filter((item: any) => item.id !== product.id)
      localStorage.setItem("edama-favorites", JSON.stringify(updatedFavorites))
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
    }
  }

  // Handle image zoom
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isImageZoomed) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
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
    return diffDays
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center text-sm text-muted-foreground"
      >
        <Button variant="ghost" size="sm" className="mr-2 gap-1" onClick={() => router.back()}>
          <BackArrow className="h-4 w-4" />
          {t("back")}
        </Button>
        <Link href="/home" className="hover:text-primary">
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
          className="relative overflow-hidden rounded-lg border bg-background"
        >
          <div
            className="relative aspect-square overflow-hidden"
            onMouseEnter={() => setIsImageZoomed(true)}
            onMouseLeave={() => setIsImageZoomed(false)}
            onMouseMove={handleImageMouseMove}
          >
            <Image
              src={product.image || "/placeholder.svg"}
              alt={language === "ar" ? product.nameAr : product.name}
              fill
              className={`object-cover transition-transform duration-200 ${isImageZoomed ? "scale-150" : ""}`}
              style={isImageZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
            />
          </div>
          <Badge className="absolute right-4 top-4 bg-secondary">
            {product.discount}% {t("off")}
          </Badge>
          {daysUntilExpiry <= 3 && (
            <div className="absolute left-4 top-4 rounded-md bg-red-500/90 px-2 py-1 text-xs text-white">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {daysUntilExpiry <= 1
                  ? t("expiresInOneDay")
                  : t("expiresInDays").replace("{days}", daysUntilExpiry.toString())}
              </div>
            </div>
          )}
        </motion.div>

        {/* Product info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col"
        >
          <h1 className="mb-2 text-3xl font-bold">{language === "ar" ? product.nameAr : product.name}</h1>

          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Store className="h-4 w-4" />
              <span>
                {t("soldBy")}: {language === "ar" ? product.supermarketAr : product.supermarket}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {t("expiresOn")}: {formatDate(product.expiryDate)}
              </span>
            </div>
          </div>

          <div className="mb-6 flex items-end gap-3">
            <div className="text-3xl font-bold text-primary">
              {product.discountedPrice} {t("currency")}
            </div>
            <div className="text-lg text-muted-foreground line-through">
              {product.originalPrice} {t("currency")}
            </div>
            <Badge variant="outline" className="ml-2">
              {product.discount}% {t("off")}
            </Badge>
          </div>

          <Separator className="mb-6" />

          <div className="mb-6">
            <h2 className="mb-3 text-lg font-medium">{t("quantity")}</h2>
            <div className="flex h-10 w-32 items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-full rounded-r-none"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex h-full flex-1 items-center justify-center border-y bg-background px-4 text-center">
                {quantity}
              </div>
              <Button variant="outline" size="icon" onClick={increaseQuantity} className="h-full rounded-l-none">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4">
            <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5" />
              {t("addToCart")}
            </Button>
            <Button variant="secondary" size="lg" className="w-full gap-2" onClick={handleBuyNow}>
              {t("buyNow")}
            </Button>
          </div>

          <div className="mb-6 flex gap-4">
            <Button
              variant="outline"
              size="sm"
              className={`gap-2 ${isFavorite ? "text-red-500 hover:text-red-600" : ""}`}
              onClick={toggleFavorite}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? t("savedToFavorites") : t("saveToFavorites")}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-5 w-5" />
              {t("share")}
            </Button>
          </div>

          <div className="space-y-3 rounded-lg bg-muted/30 p-4">
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
          </div>
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
            <TabsTrigger value="description" className="flex gap-2">
              <FileText className="h-4 w-4" />
              {t("description")}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex gap-2">
              <MessageSquare className="h-4 w-4" />
              {t("reviews")}
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex gap-2">
              <Truck className="h-4 w-4" />
              {t("shippingInfo")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
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

          <TabsContent value="reviews" className="mt-6">
            <Card>
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
                  <Button variant="outline" size="sm">
                    {t("writeReview")}
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Sample reviews */}
                  <div className="rounded-lg border p-4">
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

                  <div className="rounded-lg border p-4">
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

                  <Button variant="outline" className="w-full">
                    {t("loadMoreReviews")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
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
              <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
                <div className="relative">
                  <Link href={`/product/${product.id}`}>
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={language === "ar" ? product.nameAr : product.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </Link>
                  <Badge className="absolute right-2 top-2 bg-secondary" variant="secondary">
                    {product.discount}% {t("off")}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {language === "ar" ? product.supermarketAr : product.supermarket}
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="mb-1 line-clamp-1 font-medium hover:text-primary">
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
                      className="flex-1"
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
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
      {/* Profile Shortcut */}
      <ProfileShortcut />
    </div>
  )
}
