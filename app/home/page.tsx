"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { EcoImpactCalculator } from "@/components/eco-impact-calculator"
import { products, categories } from "@/lib/data"
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Clock,
  Check,
  Calendar,
  ArrowUpDown,
  TagIcon,
  Sparkles,
  Leaf,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  MapPin,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { t, language, dir } = useTranslation()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [filterByExpiry, setFilterByExpiry] = useState<string | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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

  // Filter and sort products
  useEffect(() => {
    let filtered = products

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.supermarket.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.supermarketAr.toLowerCase().includes(searchQuery.toLowerCase()),
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

    // Filter by expiry date
    if (filterByExpiry) {
      const today = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(today.getDate() + 30)
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(today.getDate() + 7)
      const threeDaysFromNow = new Date()
      threeDaysFromNow.setDate(today.getDate() + 3)

      filtered = filtered.filter((product) => {
        const expiryDate = new Date(product.expiryDate)

        switch (filterByExpiry) {
          case "30days":
            return expiryDate <= thirtyDaysFromNow && expiryDate > today
          case "7days":
            return expiryDate <= sevenDaysFromNow && expiryDate > today
          case "3days":
            return expiryDate <= threeDaysFromNow && expiryDate > today
          default:
            return true
        }
      })
    }

    // Sort products
    switch (sortBy) {
      case "priceAsc":
        filtered = [...filtered].sort((a, b) => a.discountedPrice - b.discountedPrice)
        break
      case "priceDesc":
        filtered = [...filtered].sort((a, b) => b.discountedPrice - a.discountedPrice)
        break
      case "discountDesc":
        filtered = [...filtered].sort((a, b) => b.discount - a.discount)
        break
      case "expiryAsc":
        filtered = [...filtered].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
        break
      case "newest":
        filtered = [...filtered].sort((a, b) => b.id - a.id)
        break
      default: // featured or any other case
        // Keep the order as is (products are already pre-sorted by featured status)
        break
    }

    setFilteredProducts(filtered)
  }, [searchQuery, priceRange, selectedCategory, sortBy, filterByExpiry])

  // Carousel controls
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === featuredProducts.length - 1 ? 0 : prev + 1))
  }, [featuredProducts.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1))
  }, [featuredProducts.length])

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSlide, nextSlide])

  // Add to cart handler with animation
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

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 100])
    setSelectedCategory("all")
    setSortBy("featured")
    setFilterByExpiry(null)
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search and Filter Bar with improved design */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col gap-4 md:flex-row"
      >
        <div className="relative flex-1">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full"
            >
              <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <Input
                ref={searchInputRef}
                placeholder={t("searchProducts")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 shadow-sm hover:shadow transition-shadow duration-300 border-primary/20 focus:border-primary"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <span className="sr-only">{t("clearSearch")}</span>
                  <span aria-hidden="true">×</span>
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] shadow-sm hover:shadow transition-shadow duration-300 border-primary/20">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder={t("sortBy")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t("featured")}</SelectItem>
              <SelectItem value="priceAsc">{t("priceLowToHigh")}</SelectItem>
              <SelectItem value="priceDesc">{t("priceHighToLow")}</SelectItem>
              <SelectItem value="discountDesc">{t("biggestDiscount")}</SelectItem>
              <SelectItem value="expiryAsc">{t("expiresFirst")}</SelectItem>
              <SelectItem value="newest">{t("newest")}</SelectItem>
            </SelectContent>
          </Select>

          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 hover-lift transition-all duration-300 border-primary/20 shadow-sm hover:shadow"
              >
                <Filter className="h-4 w-4" />
                {t("filters")}
              </Button>
            </SheetTrigger>
            <SheetContent
              side={dir === "rtl" ? "right" : "left"}
              className="w-[300px] bg-gradient-to-br from-background to-background/90 backdrop-blur-sm border-primary/20"
            >
              <SheetHeader>
                <SheetTitle className="flex gap-2 items-center">
                  <Filter className="h-4 w-4" />
                  {t("filters")}
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <TagIcon className="h-4 w-4 text-primary" />
                    {t("categories")}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory("all")}
                      className="justify-start hover:bg-primary/10 transition-colors duration-300"
                    >
                      {t("allCategories")}
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="justify-start hover:bg-primary/10 transition-colors duration-300"
                      >
                        {category.icon} {language === "ar" ? category.nameAr : category.nameEn}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-primary/10" />

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                      {t("priceRange")}
                    </h3>
                    <span className="text-sm">
                      {priceRange[0]} - {priceRange[1]} {t("currency")}
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={5}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                  />
                </div>

                <Separator className="bg-primary/10" />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {t("expiryDate")}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={filterByExpiry === "3days" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterByExpiry(filterByExpiry === "3days" ? null : "3days")}
                      className="justify-start hover:bg-primary/10 transition-colors duration-300"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {t("3days")}
                    </Button>
                    <Button
                      variant={filterByExpiry === "7days" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterByExpiry(filterByExpiry === "7days" ? null : "7days")}
                      className="justify-start hover:bg-primary/10 transition-colors duration-300"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {t("7days")}
                    </Button>
                    <Button
                      variant={filterByExpiry === "30days" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterByExpiry(filterByExpiry === "30days" ? null : "30days")}
                      className="justify-start hover:bg-primary/10 transition-colors duration-300"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {t("30days")}
                    </Button>
                  </div>
                </div>

                <SheetFooter className="flex flex-col gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full justify-center gap-2 hover:bg-destructive/10 transition-colors duration-300"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t("reset")}
                  </Button>
                  <SheetClose asChild>
                    <Button className="w-full hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-primary to-primary/90">
                      <Check className="mr-2 h-4 w-4" />
                      {t("apply")}
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>

      {/* Featured Products Carousel with improved design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10 overflow-hidden rounded-xl border bg-card shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <div className="relative h-[300px] md:h-[420px]">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                zIndex: index === currentSlide ? 1 : 0,
              }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div className="relative h-full w-full">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={language === "ar" ? product.nameAr : product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge className="mb-2 bg-primary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {t("featured")}
                  </Badge>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-2 text-2xl font-bold md:text-3xl"
                  >
                    {language === "ar" ? product.nameAr : product.name}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-4 max-w-xl"
                  >
                    {language === "ar" ? product.descriptionAr : product.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-4 flex items-center gap-4"
                  >
                    <span className="text-2xl font-bold">
                      {product.discountedPrice} {t("currency")}
                    </span>
                    <span className="text-lg text-white/70 line-through">
                      {product.originalPrice} {t("currency")}
                    </span>
                    <Badge variant="outline" className="border-white text-white">
                      {product.discount}% {t("off")}
                    </Badge>
                    <Badge variant="outline" className="border-white/70 text-white/90 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getDaysUntilExpiry(product.expiryDate)} {t("daysLeft")}
                    </Badge>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex gap-2"
                  >
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      {t("viewProduct")}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/40 hover:scale-105 transition-all duration-300"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {t("addToCart")}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/20 hover:bg-background/40 transition-colors duration-300 shadow-lg"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/20 hover:bg-background/40 transition-colors duration-300 shadow-lg"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary w-4" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </motion.div>

      {/* Key Benefits Section (New) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-primary/10 hover:-translate-y-1">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">{t("reduceWaste")}</h3>
              <p className="text-sm text-muted-foreground">{t("reduceWasteDesc")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-primary/10 hover:-translate-y-1">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">{t("qualityProducts")}</h3>
              <p className="text-sm text-muted-foreground">{t("qualityProductsDesc")}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border-primary/10 hover:-translate-y-1">
          <CardContent className="p-6 flex gap-4 items-center">
            <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">{t("saveMoney")}</h3>
              <p className="text-sm text-muted-foreground">{t("saveMoneyDesc")}</p>
            </div>
          </CardContent>
        </Card>
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
                <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger
                    value="all"
                    onClick={() => setSelectedCategory("all")}
                    className="transition-all duration-300 hover:bg-primary/10 data-[state=active]:bg-background rounded-lg"
                  >
                    {t("allCategories")}
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="transition-all duration-300 hover:bg-primary/10 data-[state=active]:bg-background rounded-lg"
                    >
                      {category.icon} {language === "ar" ? category.nameAr : category.nameEn}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </Tabs>
          </motion.div>

          {/* Products Grid with improved card design */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const isFavorite = favorites.includes(product.id)
                const daysUntilExpiry = getDaysUntilExpiry(product.expiryDate)

                return (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    className="group product-card"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col border-primary/10 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <Link href={`/product/${product.id}`}>
                          <div className="relative h-52 w-full overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={language === "ar" ? product.nameAr : product.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        </Link>
                        <Badge className="absolute right-2 top-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 drop-shadow-md">
                          {product.discount}% {t("off")}
                        </Badge>
                        <div className="absolute left-2 top-2">
                          <div className="bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow-md flex items-center gap-1">
                            <Clock
                              className={`h-3 w-3 ${daysUntilExpiry <= 3 ? "text-red-500" : daysUntilExpiry <= 7 ? "text-orange-500" : "text-green-500"}`}
                            />
                            <span className="text-xs font-medium">
                              {daysUntilExpiry} {t("daysLeft")}
                            </span>
                          </div>
                        </div>
                        <Badge
                          className="absolute left-2 bottom-2 bg-background/90 text-foreground flex items-center gap-1 shadow-sm"
                          variant="outline"
                        >
                          <MapPin className="h-3 w-3 text-primary" />
                          <span className="text-xs">
                            {language === "ar" ? product.supermarketAr : product.supermarket}
                          </span>
                        </Badge>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="mb-1 line-clamp-1 font-medium text-lg transition-colors duration-300 hover:text-primary">
                            {language === "ar" ? product.nameAr : product.name}
                          </h3>
                        </Link>
                        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                          {language === "ar" ? product.descriptionAr : product.description}
                        </p>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="font-bold text-lg text-primary">
                            {product.discountedPrice} {t("currency")}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.originalPrice} {t("currency")}
                          </span>
                        </div>
                        <div className="mt-auto flex gap-2">
                          <Button
                            variant="default"
                            className="flex-1 hover:scale-105 shadow-sm hover:shadow transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {t("addToCart")}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleFavorite(product)}
                            className={`transition-all duration-300 ${
                              isFavorite
                                ? "text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                : "hover:text-red-500 hover:bg-red-50 border-primary/20"
                            }`}
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
                  onClick={resetFilters}
                  className="hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-primary to-primary/90"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("resetFilters")}
                </Button>
              </div>
            )}
          </motion.div>
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
            <Card className="hover-glow transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-6 bg-gradient-to-b from-red-500 to-orange-400 rounded-full mr-2"></span>
                  {t("expiringSoon")}
                </h3>
                <div className="space-y-4">
                  {products
                    .filter((product) => {
                      const expiryDate = new Date(product.expiryDate)
                      const today = new Date()
                      const diffTime = expiryDate.getTime() - today.getTime()
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      return diffDays <= 7 && diffDays > 0
                    })
                    .slice(0, 3)
                    .map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="group flex items-center gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors duration-300"
                      >
                        <Link href={`/product/${product.id}`} className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={language === "ar" ? product.nameAr : product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link href={`/product/${product.id}`}>
                            <h4 className="line-clamp-1 font-medium transition-colors duration-300 group-hover:text-primary">
                              {language === "ar" ? product.nameAr : product.name}
                            </h4>
                          </Link>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-primary font-medium">
                              {product.discountedPrice} {t("currency")}
                            </span>
                            <div className="flex items-center gap-1 text-orange-500 text-xs font-medium">
                              <Clock className="h-3 w-3" />
                              {getDaysUntilExpiry(product.expiryDate)} {t("days")}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full hover:bg-primary/10 transition-colors duration-300 border-primary/20"
                  onClick={() => {
                    setFilterByExpiry("7days")
                    setIsFiltersOpen(true)
                  }}
                >
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
            <Card className="hover-glow transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-6 bg-gradient-to-b from-primary to-primary/70 rounded-full mr-2"></span>
                  {t("recommended")}
                </h3>
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
                        className="group flex items-center gap-3 hover:bg-muted/50 p-2 rounded-md transition-colors duration-300"
                      >
                        <Link href={`/product/${product.id}`} className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={language === "ar" ? product.nameAr : product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute -right-1 -top-1 rounded-full bg-orange-500 text-white px-1 py-0.5 text-[10px] font-bold shadow-sm">
                            {product.discount}%
                          </div>
                        </Link>
                        <div className="flex-1">
                          <Link href={`/product/${product.id}`}>
                            <h4 className="line-clamp-1 font-medium transition-colors duration-300 group-hover:text-primary">
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
                <Button
                  variant="outline"
                  className="mt-4 w-full hover:bg-primary/10 transition-colors duration-300 border-primary/20"
                  onClick={() => {
                    setSortBy("discountDesc")
                    setIsFiltersOpen(true)
                  }}
                >
                  {t("viewAll")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Login Prompt (only show when not authenticated) */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <Card className="border-primary/20 overflow-hidden bg-gradient-to-br from-background to-primary/5">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-medium flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {t("joinEdama")}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">{t("joinEdamaDescription")}</p>
                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1">
                      <Button variant="outline" className="w-full border-primary/20">
                        {t("login")}
                      </Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-primary to-primary/90">{t("signup")}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
