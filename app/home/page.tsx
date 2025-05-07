"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { EcoImpactCalculator } from "@/components/eco-impact-calculator"
import { products, categories } from "@/lib/data"
import { Search, Filter, ChevronLeft, ChevronRight, ShoppingCart, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ProfileShortcut } from "@/components/profile-shortcut"
import { CountdownTimer } from "@/components/countdown-timer"

export default function HomePage() {
  const { t, language, dir } = useTranslation()
  const { addItem } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Reset scroll position on page load
  useEffect(() => {
    window.scrollTo(0, 0)

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("edama-favorites")
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites)
        setFavorites(parsedFavorites.map((item: any) => item.id))
      } catch (error) {
        console.error("Failed to parse favorites", error)
      }
    }
  }, [])

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  // Featured products for carousel
  const featuredProducts = products.filter((product) => product.featured)

  // Filter products based on search, price range, and category
  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) => product.discountedPrice >= priceRange[0] && product.discountedPrice <= priceRange[1],
    )

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [searchQuery, priceRange, selectedCategory])

  // Carousel controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1))
  }

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide])

  // Add to cart handler
  const handleAddToCart = (product: any) => {
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

  // Toggle favorite
  const toggleFavorite = (product: any) => {
    const isFavorite = favorites.includes(product.id)
    let updatedFavorites = []

    if (isFavorite) {
      // Remove from favorites
      updatedFavorites = favorites.filter((id) => id !== product.id)
      setFavorites(updatedFavorites)

      // Update localStorage
      const savedFavorites = JSON.parse(localStorage.getItem("edama-favorites") || "[]")
      const updatedSavedFavorites = savedFavorites.filter((item: any) => item.id !== product.id)
      localStorage.setItem("edama-favorites", JSON.stringify(updatedSavedFavorites))
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, product.id]
      setFavorites(updatedFavorites)

      // Update localStorage
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

      const savedFavorites = JSON.parse(localStorage.getItem("edama-favorites") || "[]")
      savedFavorites.push(favoriteItem)
      localStorage.setItem("edama-favorites", JSON.stringify(savedFavorites))
    }
  }

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col gap-4 md:flex-row"
      >
        <div className="relative flex-1">
          <AnimatePresence>
            {showSearch ? (
              <motion.div
                initial={{ opacity: 0, width: "50%" }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: "50%" }}
                transition={{ duration: 0.3 }}
                className="relative w-full"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder={t("searchProducts")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                  onBlur={() => {
                    if (!searchQuery) {
                      setShowSearch(false)
                    }
                  }}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <span className="sr-only">Clear search</span>
                    <span aria-hidden="true">×</span>
                  </Button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button variant="outline" className="w-full gap-2" onClick={() => setShowSearch(true)}>
                  <Search className="h-4 w-4" />
                  {t("searchProducts")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <Filter className="h-4 w-4" />
              {t("filters")}
            </Button>
          </SheetTrigger>
          <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-[300px]">
            <SheetHeader>
              <SheetTitle>{t("filters")}</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t("categories")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className="justify-start"
                  >
                    {t("allCategories")}
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="justify-start"
                    >
                      {category.icon} {language === "ar" ? category.nameAr : category.nameEn}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">{t("priceRange")}</h3>
                  <span className="text-sm">
                    {priceRange[0]} - {priceRange[1]} {t("currency")}
                  </span>
                </div>
                <Slider defaultValue={[0, 100]} max={100} step={5} value={priceRange} onValueChange={setPriceRange} />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">{t("expiryDate")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    {t("soonest")}
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    {t("latest")}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPriceRange([0, 100])
                      setSelectedCategory("all")
                    }}
                  >
                    {t("reset")}
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button>{t("apply")}</Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>

      {/* Featured Products Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10 overflow-hidden rounded-xl border bg-card shadow-sm"
      >
        <div className="relative h-[300px] md:h-[400px]">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={language === "ar" ? product.nameAr : product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge className="mb-2 bg-primary">{t("featured")}</Badge>
                  <h2 className="mb-2 text-2xl font-bold md:text-3xl">
                    {language === "ar" ? product.nameAr : product.name}
                  </h2>
                  <p className="mb-4 max-w-xl">{language === "ar" ? product.descriptionAr : product.description}</p>
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-2xl font-bold">
                      {product.discountedPrice} {t("currency")}
                    </span>
                    <span className="text-lg text-white/70 line-through">
                      {product.originalPrice} {t("currency")}
                    </span>
                    <Badge variant="outline" className="border-white text-white">
                      {product.discount}% {t("off")}
                    </Badge>
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      {t("viewProduct")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/20 hover:bg-background/40"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/20 hover:bg-background/40"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentSlide ? "bg-primary" : "bg-white/50"}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          {/* Categories Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs defaultValue="all" className="mb-8">
              <ScrollArea className="w-full whitespace-nowrap pb-2">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
                    {t("allCategories")}
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id} onClick={() => setSelectedCategory(category.id)}>
                      {category.icon} {language === "ar" ? category.nameAr : category.nameEn}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </Tabs>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => {
                const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate)
                const isFavorite = favorites.includes(product.id)

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <div className="relative">
                        <Link href={`/product/${product.id}`}>
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={language === "ar" ? product.nameAr : product.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        </Link>
                        <Badge className="absolute right-2 top-2 bg-secondary" variant="secondary">
                          {product.discount}% {t("off")}
                        </Badge>
                        <div className="absolute left-2 top-2">
                          <CountdownTimer expiryDate={product.expiryDate} />
                        </div>
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
                        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                          {language === "ar" ? product.descriptionAr : product.description}
                        </p>
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
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {t("addToCart")}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleFavorite(product)}
                            className={isFavorite ? "text-red-500 hover:text-red-600" : ""}
                          >
                            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="mb-4 text-4xl">🔍</div>
                <h3 className="mb-2 text-xl font-medium">{t("noProductsFound")}</h3>
                <p className="mb-4 text-muted-foreground">{t("tryDifferentSearch")}</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setPriceRange([0, 100])
                    setSelectedCategory("all")
                  }}
                >
                  {t("resetFilters")}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Eco Impact Calculator */}
          <EcoImpactCalculator />

          {/* Expiring Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">{t("expiringSoon")}</h3>
                <div className="space-y-4">
                  {products
                    .filter((product) => getDaysUntilExpiry(product.expiryDate) <= 30) // Changed to 30 days since we have future dates
                    .slice(0, 3)
                    .map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group flex items-center gap-3"
                      >
                        <Link href={`/product/${product.id}`} className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={language === "ar" ? product.nameAr : product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link href={`/product/${product.id}`}>
                            <h4 className="line-clamp-1 font-medium group-hover:text-primary">
                              {language === "ar" ? product.nameAr : product.name}
                            </h4>
                          </Link>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-primary font-medium">
                              {product.discountedPrice} {t("currency")}
                            </span>
                            <CountdownTimer expiryDate={product.expiryDate} className="text-xs" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setSelectedCategory("all")}>
                  {t("viewAll")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">{t("recommended")}</h3>
                <div className="space-y-4">
                  {products
                    .filter((product) => product.discount >= 30)
                    .slice(0, 3)
                    .map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group flex items-center gap-3"
                      >
                        <Link href={`/product/${product.id}`} className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={language === "ar" ? product.nameAr : product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute -right-1 -top-1 rounded-full bg-secondary px-1 py-0.5 text-[10px] font-bold">
                            {product.discount}%
                          </div>
                        </Link>
                        <div className="flex-1">
                          <Link href={`/product/${product.id}`}>
                            <h4 className="line-clamp-1 font-medium group-hover:text-primary">
                              {language === "ar" ? product.nameAr : product.name}
                            </h4>
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primary">
                              {product.discountedPrice} {t("currency")}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              {product.originalPrice} {t("currency")}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setSelectedCategory("all")}>
                  {t("viewAll")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      {/* Profile Shortcut */}
      <ProfileShortcut />
    </div>
  )
}
