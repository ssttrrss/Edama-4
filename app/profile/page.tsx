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
  DollarSign,
  BarChart,
  TrendingUp,
  Settings,
  Package,
  Sparkles,
  Eye,
  Store,
  LightbulbIcon,
  User,
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
  const [filteredFavoriteStores, setFilteredFavoriteStores] = useState(sampleFavoriteStores)
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
  const [storeSearchQuery, setStoreSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showFilterOptions, setShowFilterOptions] = useState(false)

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

  // Filter favorite stores based on search query
  useEffect(() => {
    if (storeSearchQuery.trim() === "") {
      setFilteredFavoriteStores(favoriteStores)
      return
    }

    const filtered = favoriteStores.filter(
      (store) =>
        (store.name && store.name.toLowerCase().includes(storeSearchQuery.toLowerCase())) ||
        (store.nameAr && store.nameAr.toLowerCase().includes(storeSearchQuery.toLowerCase())) ||
        (store.location && store.location.toLowerCase().includes(storeSearchQuery.toLowerCase())) ||
        (store.locationAr && store.locationAr.toLowerCase().includes(storeSearchQuery.toLowerCase())),
    )

    setFilteredFavoriteStores(filtered)
  }, [storeSearchQuery, favoriteStores])

  // Handle logout
  const handleLogout = () => {
    logout()
    router.push("/")
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
    setFilteredFavoriteStores(updatedStores)

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

  // Toggle section expansion
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null)
    } else {
      setActiveSection(section)
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Loading...
          </motion.p>
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
      { value: "overview", label: t("overview"), icon: <BarChart className="h-4 w-4" /> },
      { value: "orders", label: t("myOrders"), icon: <Package className="h-4 w-4" /> },
      { value: "favorites", label: t("favorites"), icon: <Heart className="h-4 w-4" /> },
      { value: "reviews", label: t("reviews"), icon: <Star className="h-4 w-4" /> },
      { value: "settings", label: t("settings"), icon: <Settings className="h-4 w-4" /> },
    ]

    const buyerTabs = [
      ...commonTabs,
      { value: "savedStores", label: t("savedStores"), icon: <Store className="h-4 w-4" /> },
    ]

    const sellerTabs = [
      ...commonTabs,
      { value: "products", label: t("myProducts"), icon: <ShoppingBag className="h-4 w-4" /> },
      { value: "analytics", label: t("analytics"), icon: <TrendingUp className="h-4 w-4" /> },
      { value: "storeSettings", label: t("storeSettings"), icon: <Store className="h-4 w-4" /> },
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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const slideIn = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500">
            {/* Cover Image */}
            <div className="relative h-56 w-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center"
              >
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-white md:text-4xl drop-shadow-md">
                    {accountType === "seller"
                      ? language === "ar"
                        ? userData.storeNameAr
                        : userData.storeName
                      : t("welcomeBack")}
                  </h1>
                  <p className="mt-2 text-white/90 max-w-2xl mx-auto drop-shadow-md">
                    {accountType === "seller"
                      ? language === "ar"
                        ? userData.storeDescriptionAr
                        : userData.storeDescription
                      : t("profileDashboardDescription")}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="relative mx-auto -mt-20 flex w-full max-w-5xl flex-col items-center px-4 md:flex-row md:items-end md:px-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative mb-4 md:mb-0"
              >
                <Avatar className="h-36 w-36 border-4 border-background shadow-xl">
                  <AvatarImage
                    src={previewImage || (accountType === "seller" ? userData.storeLogo : userData.avatar)}
                    alt={userData.name}
                  />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/70 text-white">
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-4 flex flex-1 flex-col items-center text-center md:items-start md:pl-6 md:text-left"
              >
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <Badge
                    variant={accountType === "seller" ? "secondary" : "outline"}
                    className="ml-2 animate-pulse-slow"
                  >
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-2 md:justify-end"
              >
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="hover:bg-primary/10 transition-all duration-300 group"
                  >
                    <Edit className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    {t("editProfile")}
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="hover:scale-105 transition-transform duration-300 shadow-sm hover:shadow"
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
              </motion.div>
            </div>

            {/* Tabs */}
            <CardContent className="px-4 pb-0 pt-8 md:px-8">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-muted/50 p-1 rounded-xl">
                  {getTabs().map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="transition-all duration-300 hover:bg-primary/10 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-lg"
                    >
                      <span className="flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {t("profileCompletion")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{profileCompletion}%</span>
                      <span className="flex items-center gap-1 text-sm">
                        {getMoodIcon(profileCompletion)}
                        {profileCompletion < 80 ? t("almostThere") : t("excellent")}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${profileCompletion}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      ></motion.div>
                    </div>

                    {profileCompletion < 100 && showTips && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="mt-4 rounded-lg bg-muted/50 p-4 border border-muted"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="flex items-center gap-2 font-medium">
                            <LightbulbIcon className="h-4 w-4 text-yellow-500" />
                            {t("completionTips")}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowTips(false)}
                            className="hover:bg-muted transition-colors duration-300"
                          >
                            {t("dismiss")}
                          </Button>
                        </div>
                        <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                          {profileCompletion < 85 && <li>{t("addProfilePicture")}</li>}
                          {profileCompletion < 90 && <li>{t("completeContactInfo")}</li>}
                          {profileCompletion < 95 && <li>{t("writeBio")}</li>}
                          {profileCompletion < 100 && <li>{t("leaveReview")}</li>}
                        </ul>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Role-specific Dashboard Cards */}
            {accountType === "buyer" ? (
              // Buyer Dashboard Cards
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-400">{t("foodSaved")}</p>
                            <h3 className="mt-1 text-2xl font-bold text-green-900 dark:text-green-300">
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                              >
                                {ecoStats.foodSaved} kg
                              </motion.span>
                            </h3>
                          </div>
                          <div className="rounded-full bg-green-200 p-3 dark:bg-green-800/30">
                            <Leaf className="h-6 w-6 text-green-700 dark:text-green-400" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{t("thisMonth")}</span>
                          <span className="font-medium text-green-600 dark:text-green-400">+12%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-400">{t("co2Reduced")}</p>
                            <h3 className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-300">
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.4 }}
                              >
                                {ecoStats.co2Reduced} kg
                              </motion.span>
                            </h3>
                          </div>
                          <div className="rounded-full bg-blue-200 p-3 dark:bg-blue-800/30">
                            <Recycle className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{t("thisMonth")}</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">+8%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-400">{t("moneySaved")}</p>
                            <h3 className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-300">
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                              >
                                {ecoStats.moneySaved} {t("currency")}
                              </motion.span>
                            </h3>
                          </div>
                          <div className="rounded-full bg-amber-200 p-3 dark:bg-amber-800/30">
                            <DollarSign className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{t("thisMonth")}</span>
                          <span className="font-medium text-amber-600 dark:text-amber-400">+15%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : (
              // Seller Dashboard Cards
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-indigo-800 dark:text-indigo-400">
                              {t("productViews")}
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-indigo-900 dark:text-indigo-300">
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3 }}
                              >
                                {analytics.views}
                              </motion.span>
                            </h3>
                          </div>
                          <div className="rounded-full bg-indigo-200 p-3 dark:bg-indigo-800/30">
                            <Eye className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{t("thisMonth")}</span>
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">+22%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-pink-800 dark:text-pink-400">
                              {t("completedOrders")}
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-pink-900 dark:text-pink-300">
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.4 }}
                              >
                                {analytics.orders}
                              </motion.span>
                            </h3>
                          </div>
                          <div className="rounded-full bg-pink-200 p-3 dark:bg-pink-800/30">
                            <Package className="h-6 w-6 text-pink-700 dark:text-pink-400" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{t("thisMonth")}</span>
                          <span className="font-medium text-pink-600 dark:text-pink-400">+18%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                              {t("totalRevenue")}
                            </p>
                            <h3 className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                              >
                                {analytics.revenue} {t("currency")}
                              </motion.span>
                            </h3>
                          </div>
                          <div className="rounded-full bg-emerald-200 p-3 dark:bg-emerald-800/30">
                            <DollarSign className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{t("thisMonth")}</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">+25%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </div>

          {/* Achievements Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-accent/5 to-accent/10">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  {t("achievements")}
                </CardTitle>
                <CardDescription>{t("yourAchievements")}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * badge.id }}
                      whileHover={{ scale: 1.03 }}
                      className={`rounded-lg border p-4 transition-all duration-300 cursor-pointer ${
                        badge.unlocked
                          ? "bg-gradient-to-br from-white to-secondary/20 dark:from-secondary/5 dark:to-secondary/20"
                          : "bg-muted/30 opacity-70"
                      }`}
                      onClick={() => toggleBadgeExpansion(badge.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`rounded-full p-3 ${badge.unlocked ? "bg-secondary/30" : "bg-muted"}`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {language === "ar" ? badge.nameAr : badge.name}
                            {badge.unlocked && (
                              <span className="ml-2 inline-flex">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {language === "ar" ? badge.descriptionAr : badge.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
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
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {filteredFavorites.map((item) => (
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

        <TabsContent value="savedStores">
          <Card className="hover-glow transition-shadow duration-300">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>{t("savedStores")}</CardTitle>
                  <CardDescription>{t("savedStoresDescription")}</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t("searchStores")}
                    className="w-full max-w-xs pl-9 shadow-sm hover:shadow transition-shadow duration-300"
                    value={storeSearchQuery}
                    onChange={(e) => setStoreSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredFavoriteStores.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="mb-4 rounded-full bg-muted p-3">
                    <Store className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">
                    {storeSearchQuery ? t("noMatchingStores") : t("noSavedStores")}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {storeSearchQuery ? t("tryDifferentSearch") : t("noSavedStoresDescription")}
                  </p>
                  <Button
                    onClick={() => {
                      setStoreSearchQuery("")
                      router.push("/home")
                    }}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    {t("exploreStores")}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
                >
                  {filteredFavoriteStores.map((store) => (
                    <motion.div key={store.id} variants={fadeInUp}>
                      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start p-4">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={store.image || "/placeholder.svg"}
                              alt={language === "ar" ? store.nameAr : store.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{language === "ar" ? store.nameAr : store.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {language === "ar" ? store.locationAr : store.location}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors duration-300"
                                onClick={() => handleRemoveFavoriteStore(store.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center">
                                {renderStarRating(store.rating)}
                                <span className="ml-1 text-xs">{store.rating}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {store.productsCount} {t("products")}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 w-full hover:bg-primary/10 transition-colors duration-300"
                              onClick={() => router.push(`/store/${store.id}`)}
                            >
                              {t("viewStore")}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="hover-glow transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{t("settings")}</CardTitle>
              <CardDescription>{t("settingsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    {t("personalInfo")}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("fullName")}</label>
                        <Input
                          value={editedUser.name || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="shadow-sm hover:shadow transition-shadow duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("email")}</label>
                        <Input
                          value={editedUser.email || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          className="shadow-sm hover:shadow transition-shadow duration-300"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("phone")}</label>
                        <Input
                          value={editedUser.phone || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          className="shadow-sm hover:shadow transition-shadow duration-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">{t("address")}</label>
                        <Input
                          value={editedUser.address || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                          className="shadow-sm hover:shadow transition-shadow duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium flex items-center gap-2 text-destructive">
                    <Trash2 className="h-5 w-5" />
                    {t("deleteAccount")}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t("deleteAccountWarning")}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="mt-4 hover:bg-destructive/90 transition-colors duration-300"
                  >
                    {t("confirmDelete")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
