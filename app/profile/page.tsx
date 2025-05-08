"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import {
  Heart,
  LogOut,
  Edit,
  Save,
  Phone,
  Clock,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  MessageSquare,
  Camera,
  Award,
  Leaf,
  Zap,
  Recycle,
  Smile,
  Frown,
  Meh,
  MapPin,
  Search,
  Trash2,
} from "lucide-react"

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    productId: 1,
    productName: "Fresh Bananas",
    productNameAr: "موز طازج",
    rating: 5,
    comment: "Excellent quality and great value for money. Will buy again!",
    commentAr: "جودة ممتازة وقيمة رائعة مقابل المال. سأشتري مرة أخرى!",
    date: "2023-06-15",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    productId: 4,
    productName: "Red Apples",
    productNameAr: "تفاح أحمر",
    rating: 4,
    comment: "Very fresh and tasty. Delivery was prompt.",
    commentAr: "طازج جدًا ولذيذ. كان التوصيل سريعًا.",
    date: "2023-06-10",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    productId: 7,
    productName: "Greek Yogurt",
    productNameAr: "زبادي يوناني",
    rating: 3,
    comment: "Good product but packaging could be improved.",
    commentAr: "منتج جيد ولكن يمكن تحسين التعبئة.",
    date: "2023-05-28",
    image: "/placeholder.svg?height=300&width=300",
  },
]

// Sample uploaded products data (for supermarkets)
const sampleUploadedProducts = [
  {
    id: 101,
    name: "Organic Strawberries",
    nameAr: "فراولة عضوية",
    category: "fruits",
    description: "Fresh organic strawberries. Rich in vitamins and antioxidants.",
    descriptionAr: "فراولة عضوية طازجة. غنية بالفيتامينات ومضادات الأكسدة.",
    originalPrice: 45,
    discountedPrice: 30,
    discount: 33,
    image: "/placeholder.svg?height=300&width=300",
    supermarket: "Your Store",
    supermarketAr: "متجرك",
    expiryDate: "2023-07-20",
    quantity: 20,
    status: "active",
    views: 124,
    saves: 18,
  },
  {
    id: 102,
    name: "Whole Wheat Bread",
    nameAr: "خبز القمح الكامل",
    category: "bakery",
    description: "Freshly baked whole wheat bread. High in fiber and nutrients.",
    descriptionAr: "خبز القمح الكامل المخبوز طازجًا. غني بالألياف والعناصر الغذائية.",
    originalPrice: 25,
    discountedPrice: 18,
    discount: 28,
    image: "/placeholder.svg?height=300&width=300",
    supermarket: "Your Store",
    supermarketAr: "متجرك",
    expiryDate: "2023-07-18",
    quantity: 15,
    status: "active",
    views: 87,
    saves: 12,
  },
  {
    id: 103,
    name: "Organic Eggs",
    nameAr: "بيض عضوي",
    category: "dairy",
    description: "Farm-fresh organic eggs. Free-range and hormone-free.",
    descriptionAr: "بيض عضوي طازج من المزرعة. طليق وخالي من الهرمونات.",
    originalPrice: 35,
    discountedPrice: 28,
    discount: 20,
    image: "/placeholder.svg?height=300&width=300",
    supermarket: "Your Store",
    supermarketAr: "متجرك",
    expiryDate: "2023-07-25",
    quantity: 30,
    status: "active",
    views: 65,
    saves: 8,
  },
]

// Eco impact stats
const ecoImpactStats = {
  foodSaved: 45, // kg
  co2Reduced: 68, // kg
  waterSaved: 1250, // liters
  moneyTotal: 1200, // currency
  moneySaved: 450, // currency
}

// Achievement badges
const achievementBadges = [
  {
    id: 1,
    name: "Food Saver",
    nameAr: "منقذ الطعام",
    description: "Saved 10kg of food from being wasted",
    descriptionAr: "أنقذت 10 كجم من الطعام من الهدر",
    icon: <Leaf className="h-6 w-6 text-green-500" />,
    unlocked: true,
  },
  {
    id: 2,
    name: "Eco Warrior",
    nameAr: "محارب البيئة",
    description: "Reduced CO2 emissions by 50kg",
    descriptionAr: "خفضت انبعاثات ثاني أكسيد الكربون بمقدار 50 كجم",
    icon: <Recycle className="h-6 w-6 text-blue-500" />,
    unlocked: true,
  },
  {
    id: 3,
    name: "Smart Shopper",
    nameAr: "متسوق ذكي",
    description: "Completed 10 orders",
    descriptionAr: "أكملت 10 طلبات",
    icon: <ShoppingBag className="h-6 w-6 text-purple-500" />,
    unlocked: true,
  },
  {
    id: 4,
    name: "Water Conservationist",
    nameAr: "محافظ على المياه",
    description: "Saved 1000 liters of water",
    descriptionAr: "وفرت 1000 لتر من الماء",
    icon: <Zap className="h-6 w-6 text-cyan-500" />,
    unlocked: false,
  },
  {
    id: 5,
    name: "Feedback Champion",
    nameAr: "بطل التعليقات",
    description: "Left 5 product reviews",
    descriptionAr: "تركت 5 تعليقات على المنتجات",
    icon: <MessageSquare className="h-6 w-6 text-yellow-500" />,
    unlocked: false,
  },
  {
    id: 6,
    name: "Sustainable Lifestyle",
    nameAr: "نمط حياة مستدام",
    description: "Used Edama for 3 months",
    descriptionAr: "استخدمت إدامة لمدة 3 أشهر",
    icon: <Award className="h-6 w-6 text-amber-500" />,
    unlocked: false,
  },
]

// Sample analytics data for sellers
const sampleAnalytics = {
  views: 1245,
  saves: 87,
  orders: 32,
  revenue: 1850,
  topProducts: [
    { id: 101, name: "Organic Strawberries", sales: 12, revenue: 360 },
    { id: 102, name: "Whole Wheat Bread", sales: 8, revenue: 144 },
    { id: 103, name: "Organic Eggs", sales: 6, revenue: 168 },
  ],
  monthlySales: [
    { month: "Jan", sales: 10 },
    { month: "Feb", sales: 15 },
    { month: "Mar", sales: 12 },
    { month: "Apr", sales: 18 },
    { month: "May", sales: 22 },
    { month: "Jun", sales: 28 },
  ],
}

// Sample favorite stores for buyers
const sampleFavoriteStores = [
  {
    id: 1,
    name: "Green Market",
    nameAr: "السوق الأخضر",
    image: "/placeholder.svg?height=100&width=100",
    location: "Cairo, Egypt",
    locationAr: "القاهرة، مصر",
    productsCount: 24,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Fresh Farms",
    nameAr: "مزارع طازجة",
    image: "/placeholder.svg?height=100&width=100",
    location: "Alexandria, Egypt",
    locationAr: "الإسكندرية، مصر",
    productsCount: 18,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Organic Valley",
    nameAr: "وادي العضوية",
    image: "/placeholder.svg?height=100&width=100",
    location: "Giza, Egypt",
    locationAr: "الجيزة، مصر",
    productsCount: 32,
    rating: 4.7,
  },
]

export default function ProfilePage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, updateProfile, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [filteredFavorites, setFilteredFavorites] = useState<any[]>([])
  const [favoriteStores, setFavoriteStores] = useState(sampleFavoriteStores)
  const [reviews] = useState(sampleReviews)
  const [uploadedProducts, setUploadedProducts] = useState(sampleUploadedProducts)
  const [editedUser, setEditedUser] = useState<any>({})
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer")
  const [newProduct, setNewProduct] = useState({
    name: "",
    nameAr: "",
    category: "fruits",
    description: "",
    descriptionAr: "",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    expiryDate: "",
    quantity: 1,
    shopAddress: "",
    contactPhone: "",
    contactWhatsapp: "",
  })
  const [productImage, setProductImage] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [expandedBadge, setExpandedBadge] = useState<number | null>(null)
  const [showAllStats, setShowAllStats] = useState(false)
  const [ecoStats, setEcoStats] = useState(ecoImpactStats)
  const [badges, setBadges] = useState(achievementBadges)
  const [profileCompletion, setProfileCompletion] = useState(75)
  const [showTips, setShowTips] = useState(true)
  const [analytics] = useState(sampleAnalytics)
  const [productFilter, setProductFilter] = useState("all")
  const [productSort, setProductSort] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")

  // Format date - moved outside useEffect to avoid recreation on each render
  const formatDate = useCallback(
    (dateString: string) => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    },
    [language],
  )

  // Check if user is logged in - Fixed dependency array and initialization logic
  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push("/login")
      return
    }

    // Prevent multiple initializations
    if (isInitialized) return

    const initializeUserData = async () => {
      // Get tab from URL if present
      const tab = searchParams.get("tab")
      if (tab) {
        setActiveTab(tab)
      }

      try {
        // Set user data from auth context
        setUserData(user)
        setEditedUser({
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          address: user.address || "",
          bio: user.bio || "",
          storeName: user.storeName || "",
          storeNameAr: user.storeNameAr || "",
          storeDescription: user.storeDescription || "",
          storeDescriptionAr: user.storeDescriptionAr || "",
          storeLocation: user.storeLocation || "",
          storeLocationAr: user.storeLocationAr || "",
          storePhone: user.storePhone || "",
          storeEmail: user.storeEmail || "",
          storeWebsite: user.storeWebsite || "",
        })
        setAccountType(user.accountType || "buyer")

        // Load orders
        const savedOrders = localStorage.getItem("edama-orders")
        if (savedOrders) {
          try {
            setOrders(JSON.parse(savedOrders))
          } catch (error) {
            console.error("Failed to parse orders", error)
          }
        }

        // Load favorites
        const savedFavorites = localStorage.getItem("edama-favorites")
        if (savedFavorites) {
          try {
            const parsedFavorites = JSON.parse(savedFavorites)
            setFavorites(parsedFavorites)
            setFilteredFavorites(parsedFavorites)
          } catch (error) {
            console.error("Failed to parse favorites", error)
          }
        }

        setIsLoading(false)
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to parse user data", error)
        router.push("/login")
      }
    }

    initializeUserData()
  }, [router, searchParams, isInitialized, user])

  // Filter favorites based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFavorites(favorites)
      return
    }

    const filtered = favorites.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.nameAr && item.nameAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.supermarket && item.supermarket.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.supermarketAr && item.supermarketAr.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    setFilteredFavorites(filtered)
  }, [searchQuery, favorites])

  // Handle logout
  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  // Handle save profile
  const handleSaveProfile = async () => {
    setIsLoading(true)

    try {
      // Update user profile in auth context
      await updateProfile({
        ...editedUser,
        ...(previewImage && { avatar: previewImage }),
      })

      // Update local state
      setUserData({
        ...userData,
        ...editedUser,
        ...(previewImage && { avatar: previewImage }),
      })

      setIsEditing(false)
      setPreviewImage(null)

      // Update profile completion
      setProfileCompletion(95)

      toast({
        title: t("profileUpdated"),
        description: t("profileUpdatedDescription"),
      })
    } catch (error) {
      toast({
        title: t("updateError"),
        description: t("updateErrorDescription"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle remove favorite
  const handleRemoveFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((item) => item.id !== id)
    setFavorites(updatedFavorites)
    setFilteredFavorites(updatedFavorites)
    localStorage.setItem("edama-favorites", JSON.stringify(updatedFavorites))

    toast({
      title: t("itemRemoved"),
      description: t("itemRemovedFromFavorites"),
    })
  }

  // Handle remove favorite store
  const handleRemoveFavoriteStore = (id: number) => {
    const updatedStores = favoriteStores.filter((store) => store.id !== id)
    setFavoriteStores(updatedStores)

    toast({
      title: t("storeRemoved"),
      description: t("storeRemovedFromFavorites"),
    })
  }

  // Handle file upload for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle product image upload
  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProductImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle add new product
  const handleAddProduct = () => {
    // Calculate discount percentage
    const originalPrice = Number.parseFloat(newProduct.originalPrice.toString())
    const discountedPrice = Number.parseFloat(newProduct.discountedPrice.toString())
    const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)

    const product = {
      id: Date.now(),
      ...newProduct,
      discount,
      image: productImage || "/placeholder.svg?height=300&width=300",
      supermarket: userData?.storeName || "Your Store",
      supermarketAr: userData?.storeNameAr || "متجرك",
      status: "active",
      views: 0,
      saves: 0,
    }

    setUploadedProducts([product, ...uploadedProducts])

    // Reset form
    setNewProduct({
      name: "",
      nameAr: "",
      category: "fruits",
      description: "",
      descriptionAr: "",
      originalPrice: 0,
      discountedPrice: 0,
      discount: 0,
      expiryDate: "",
      quantity: 1,
      shopAddress: "",
      contactPhone: "",
      contactWhatsapp: "",
    })
    setProductImage(null)

    toast({
      title: t("productAdded"),
      description: t("productAddedDescription"),
    })
  }

  // Handle delete product
  const handleDeleteProduct = (id: number) => {
    const updatedProducts = uploadedProducts.filter((product) => product.id !== id)
    setUploadedProducts(updatedProducts)

    toast({
      title: t("productDeleted"),
      description: t("productDeletedDescription"),
    })
  }

  // Handle toggle product visibility
  const handleToggleProductVisibility = (id: number) => {
    const updatedProducts = uploadedProducts.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          status: product.status === "active" ? "inactive" : "active",
        }
      }
      return product
    })
    setUploadedProducts(updatedProducts)

    toast({
      title: t("productUpdated"),
      description: t("productVisibilityUpdated"),
    })
  }

  // Handle contact options
  const handleContact = (method: "sms" | "email") => {
    if (method === "sms") {
      window.location.href = "sms:01274311482"
    } else if (method === "email") {
      window.location.href = "mailto:edama.team@gmail.com"
    }
  }

  // Toggle badge expansion
  const toggleBadgeExpansion = (id: number) => {
    if (expandedBadge === id) {
      setExpandedBadge(null)
    } else {
      setExpandedBadge(id)
    }
  }

  // Get order status badge
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-500">
            <Clock className="h-3 w-3" />
            {t("processing")}
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-orange-500 text-orange-500">
            <CheckCircle className="h-3 w-3" />
            {t("readyForPickup")}
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-500">
            <CheckCircle className="h-3 w-3" />
            {t("completed")}
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-red-500 text-red-500">
            <AlertCircle className="h-3 w-3" />
            {t("cancelled")}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {status}
          </Badge>
        )
    }
  }

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  // Get mood icon based on value
  const getMoodIcon = (value: number) => {
    if (value > 70) return <Smile className="h-5 w-5 text-green-500" />
    if (value > 40) return <Meh className="h-5 w-5 text-yellow-500" />
    return <Frown className="h-5 w-5 text-red-500" />
  }

  // Filter products based on status and search query
  const getFilteredProducts = () => {
    let filtered = [...uploadedProducts]

    // Filter by status
    if (productFilter !== "all") {
      filtered = filtered.filter((product) => product.status === productFilter)
    }

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

    // Sort products
    switch (productSort) {
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      case "expiringSoon":
        filtered.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
        break
      case "highestDiscount":
        filtered.sort((a, b) => b.discount - a.discount)
        break
      case "mostViewed":
        filtered.sort((a, b) => b.views - a.views)
        break
      case "mostSaved":
        filtered.sort((a, b) => b.saves - a.saves)
        break
    }

    return filtered
  }

  if (isLoading || !userData) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const categories = [
    { id: "fruits", nameEn: "Fruits", nameAr: "فواكه" },
    { id: "vegetables", nameEn: "Vegetables", nameAr: "خضروات" },
    { id: "dairy", nameEn: "Dairy", nameAr: "منتجات الألبان" },
    { id: "bakery", nameEn: "Bakery", nameAr: "مخبوزات" },
    { id: "beverages", nameEn: "Beverages", nameAr: "مشروبات" },
    { id: "snacks", nameEn: "Snacks", nameAr: "وجبات خفيفة" },
  ]

  // Get tabs based on user role
  const getTabs = () => {
    const commonTabs = [
      { value: "overview", label: t("overview") },
      { value: "orders", label: t("myOrders") },
      { value: "favorites", label: t("favorites") },
      { value: "reviews", label: t("reviews") },
      { value: "settings", label: t("settings") },
    ]

    const buyerTabs = [...commonTabs, { value: "savedStores", label: t("savedStores") }]

    const sellerTabs = [
      ...commonTabs,
      { value: "products", label: t("myProducts") },
      { value: "analytics", label: t("analytics") },
      { value: "storeSettings", label: t("storeSettings") },
    ]

    return accountType === "seller" ? sellerTabs : buyerTabs
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Cover Image */}
            <div className="relative h-48 w-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20">
              {accountType === "seller" && (
                <div className="absolute inset-0">
                  <Image
                    src={userData.storeCoverImage || "/placeholder.svg?height=400&width=1200"}
                    alt={userData.storeName}
                    fill
                    className="object-cover opacity-30"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-white md:text-4xl">
                    {accountType === "seller"
                      ? language === "ar"
                        ? userData.storeNameAr
                        : userData.storeName
                      : t("welcomeBack")}
                  </h1>
                  <p className="mt-2 text-white/80">
                    {accountType === "seller"
                      ? language === "ar"
                        ? userData.storeDescriptionAr
                        : userData.storeDescription
                      : t("profileDashboardDescription")}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="relative mx-auto -mt-16 flex w-full max-w-5xl flex-col items-center px-4 md:flex-row md:items-end md:px-8">
              <div className="relative mb-4 md:mb-0">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage
                    src={previewImage || (accountType === "seller" ? userData.storeLogo : userData.avatar)}
                    alt={userData.name}
                  />
                  <AvatarFallback className="text-4xl">
                    {accountType === "seller" ? userData.storeName?.charAt(0) || "S" : userData.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background shadow-md hover:bg-primary/10 transition-colors duration-300"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                )}
              </div>
              <div className="mb-4 flex flex-1 flex-col items-center text-center md:items-start md:pl-6 md:text-left">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <Badge variant={accountType === "seller" ? "secondary" : "outline"} className="ml-2">
                    {accountType === "seller" ? t("seller") : t("buyer")}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{userData.email}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("memberSince")}: {formatDate(userData.joinDate)}
                </p>
                {accountType === "seller" && (
                  <div className="mt-2 flex items-center gap-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {language === "ar" ? userData.storeLocationAr : userData.storeLocation}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {userData.storePhone}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:justify-end">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-primary/10 transition-colors duration-300"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t("editProfile")}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {t("saveChanges")}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-300"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <CardContent className="px-4 pb-0 pt-4 md:px-8">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                  {getTabs().map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="transition-colors duration-300 hover:bg-primary/10"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsContent value="favorites">
          <Card className="hover-glow transition-shadow duration-300">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>{t("favorites")}</CardTitle>
                  <CardDescription>{t("favoritesDescription")}</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("searchFavorites")}
                    className="w-full max-w-xs pl-9 shadow-sm hover:shadow transition-shadow duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredFavorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-muted p-3">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">
                    {searchQuery ? t("noMatchingFavorites") : t("noFavorites")}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {searchQuery ? t("tryDifferentSearch") : t("noFavoritesDescription")}
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      router.push("/home")
                    }}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    {t("exploreProducts")}
                  </Button>
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {filteredFavorites.map((item, index) => (
                    <motion.div key={item.id} variants={fadeInUp} className="product-card">
                      <Card className="overflow-hidden h-full flex flex-col">
                        <div className="relative">
                          <div className="relative h-40 w-full">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={language === "ar" ? item.nameAr : item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background/90 hover:text-red-500 transition-colors duration-300"
                            onClick={() => handleRemoveFavorite(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                          <Badge className="absolute left-2 top-2 bg-secondary flash">
                            {item.discount}% {t("off")}
                          </Badge>
                        </div>
                        <CardContent className="p-3 flex-1 flex flex-col">
                          <h3 className="line-clamp-1 font-medium">{language === "ar" ? item.nameAr : item.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            {language === "ar" ? item.supermarketAr : item.supermarket}
                          </p>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="font-medium text-primary">
                              {item.discountedPrice} {t("currency")}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {item.originalPrice} {t("currency")}
                            </span>
                          </div>
                          <div className="mt-auto pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full hover:bg-primary/10 transition-colors duration-300"
                              onClick={() => router.push(`/product/${item.id}`)}
                            >
                              {t("viewProduct")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents */}
        {/* ... */}
      </Tabs>
    </div>
  )
}
