"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useTranslation } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import {
  Package,
  Heart,
  LogOut,
  Edit,
  Save,
  Phone,
  Mail,
  Clock,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Upload,
  Star,
  MessageSquare,
  Store,
  Camera,
  Plus,
  Award,
  Leaf,
  BadgePercent,
  Zap,
  ChevronRight,
  Recycle,
  Lightbulb,
  Smile,
  Frown,
  Meh,
  Calendar,
  DollarSign,
  Eye,
  EyeOff,
  MoreHorizontal,
  FileText,
  Share2,
  MapPin,
  Filter,
  ArrowUpDown,
  Search,
  HelpCircle,
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
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
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
    // Prevent multiple initializations
    if (isInitialized) return

    const initializeUserData = async () => {
      const user = localStorage.getItem("edama-user")
      if (!user) {
        router.push("/login")
        return
      }

      // Get tab from URL if present
      const tab = searchParams.get("tab")
      if (tab) {
        setActiveTab(tab)
      }

      try {
        // Load user data
        const parsedUser = JSON.parse(user)
        const userData = {
          name: parsedUser.name || "User Name",
          email: parsedUser.email || "user@example.com",
          phone: parsedUser.phone || "+20 123 456 7890",
          address: parsedUser.address || "Cairo, Egypt",
          joinDate: parsedUser.joinDate || new Date().toISOString(),
          avatar: parsedUser.avatar || "/placeholder.svg?height=100&width=100",
          bio: parsedUser.bio || "Eco-conscious shopper passionate about reducing food waste.",
          accountType: parsedUser.accountType || "buyer",
          storeName: parsedUser.storeName || "Your Store",
          storeNameAr: parsedUser.storeNameAr || "متجرك",
          storeDescription: parsedUser.storeDescription || "Quality products at affordable prices.",
          storeDescriptionAr: parsedUser.storeDescriptionAr || "منتجات ذات جودة عالية بأسعار معقولة.",
          storeLocation: parsedUser.storeLocation || "Cairo, Egypt",
          storeLocationAr: parsedUser.storeLocationAr || "القاهرة، مصر",
          storePhone: parsedUser.storePhone || "+20 123 456 7890",
          storeEmail: parsedUser.storeEmail || "store@example.com",
          storeWebsite: parsedUser.storeWebsite || "",
          storeLogo: parsedUser.storeLogo || "/placeholder.svg?height=100&width=100",
          storeCoverImage: parsedUser.storeCoverImage || "/placeholder.svg?height=400&width=1200",
        }

        setUserData(userData)
        setEditedUser({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          bio: userData.bio,
          storeName: userData.storeName,
          storeNameAr: userData.storeNameAr,
          storeDescription: userData.storeDescription,
          storeDescriptionAr: userData.storeDescriptionAr,
          storeLocation: userData.storeLocation,
          storeLocationAr: userData.storeLocationAr,
          storePhone: userData.storePhone,
          storeEmail: userData.storeEmail,
          storeWebsite: userData.storeWebsite,
        })
        setAccountType(parsedUser.accountType || "buyer")

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
            setFavorites(JSON.parse(savedFavorites))
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
  }, [router, searchParams, isInitialized]) // Removed dependencies that change on every render

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("edama-user")
    router.push("/login")
  }

  // Handle save profile
  const handleSaveProfile = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update user data
      const updatedUser = {
        ...userData,
        ...editedUser,
        accountType,
        ...(previewImage && { avatar: previewImage }),
      }
      setUserData(updatedUser)

      // Save to localStorage
      localStorage.setItem("edama-user", JSON.stringify(updatedUser))

      setIsEditing(false)
      setIsLoading(false)
      setPreviewImage(null)

      // Update profile completion
      setProfileCompletion(95)

      toast({
        title: t("profileUpdated"),
        description: t("profileUpdatedDescription"),
      })
    }, 1000)
  }

  // Handle remove favorite
  const handleRemoveFavorite = (id: number) => {
    const updatedFavorites = favorites.filter((item) => item.id !== id)
    setFavorites(updatedFavorites)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="overflow-hidden">
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
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background shadow-md"
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
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("editProfile")}
                  </Button>
                ) : (
                  <Button variant="default" size="sm" onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {t("saveChanges")}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                    <TabsTrigger key={tab.value} value={tab.value}>
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
        <TabsContent value="overview" className="space-y-8">
          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{t("profileCompletion")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{profileCompletion}%</span>
                    <span className="flex items-center gap-1 text-sm">
                      {getMoodIcon(profileCompletion)}
                      {profileCompletion < 80 ? t("almostThere") : t("excellent")}
                    </span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />

                  {profileCompletion < 100 && showTips && (
                    <div className="mt-4 rounded-lg bg-muted p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="flex items-center gap-2 font-medium">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          {t("completionTips")}
                        </h4>
                        <Button variant="ghost" size="sm" onClick={() => setShowTips(false)}>
                          {t("dismiss")}
                        </Button>
                      </div>
                      <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
                        {profileCompletion < 85 && <li>{t("addProfilePicture")}</li>}
                        {profileCompletion < 90 && <li>{t("completeContactInfo")}</li>}
                        {profileCompletion < 95 && <li>{t("writeBio")}</li>}
                        {profileCompletion < 100 && <li>{t("leaveReview")}</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Role-specific Dashboard Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {accountType === "buyer" ? (
              // Buyer Dashboard Cards
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-400">{t("foodSaved")}</p>
                          <h3 className="mt-1 text-2xl font-bold text-green-900 dark:text-green-300">
                            {ecoStats.foodSaved} kg
                          </h3>
                        </div>
                        <div className="rounded-full bg-green-200 p-3 dark:bg-green-800/30">
                          <Leaf className="h-6 w-6 text-green-700 dark:text-green-400" />
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
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-400">{t("co2Reduced")}</p>
                          <h3 className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-300">
                            {ecoStats.co2Reduced} kg
                          </h3>
                        </div>
                        <div className="rounded-full bg-blue-200 p-3 dark:bg-blue-800/30">
                          <Recycle className="h-6 w-6 text-blue-700 dark:text-blue-400" />
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
                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-400">{t("moneySaved")}</p>
                          <h3 className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-300">
                            {ecoStats.moneySaved} {t("currency")}
                          </h3>
                        </div>
                        <div className="rounded-full bg-amber-200 p-3 dark:bg-amber-800/30">
                          <BadgePercent className="h-6 w-6 text-amber-700 dark:text-amber-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-800 dark:text-purple-400">{t("orders")}</p>
                          <h3 className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-300">
                            {orders.length}
                          </h3>
                        </div>
                        <div className="rounded-full bg-purple-200 p-3 dark:bg-purple-800/30">
                          <ShoppingBag className="h-6 w-6 text-purple-700 dark:text-purple-400" />
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
                  <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-400">
                            {t("productViews")}
                          </p>
                          <h3 className="mt-1 text-2xl font-bold text-indigo-900 dark:text-indigo-300">
                            {analytics.views}
                          </h3>
                        </div>
                        <div className="rounded-full bg-indigo-200 p-3 dark:bg-indigo-800/30">
                          <Eye className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
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
                  <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-pink-800 dark:text-pink-400">{t("productSaves")}</p>
                          <h3 className="mt-1 text-2xl font-bold text-pink-900 dark:text-pink-300">
                            {analytics.saves}
                          </h3>
                        </div>
                        <div className="rounded-full bg-pink-200 p-3 dark:bg-pink-800/30">
                          <Heart className="h-6 w-6 text-pink-700 dark:text-pink-400" />
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
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-400">
                            {t("completedOrders")}
                          </p>
                          <h3 className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-300">
                            {analytics.orders}
                          </h3>
                        </div>
                        <div className="rounded-full bg-orange-200 p-3 dark:bg-orange-800/30">
                          <Package className="h-6 w-6 text-orange-700 dark:text-orange-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                            {t("totalRevenue")}
                          </p>
                          <h3 className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                            {analytics.revenue} {t("currency")}
                          </h3>
                        </div>
                        <div className="rounded-full bg-emerald-200 p-3 dark:bg-emerald-800/30">
                          <DollarSign className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{t("recentActivity")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders.slice(0, 3).map((order, index) => (
                      <div key={order.id} className="flex items-start gap-4">
                        <div className="rounded-md bg-primary/10 p-2">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">
                              {t("placedOrder")}: #{order.id}
                            </h3>
                            {getOrderStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.date)} • {order.items.length} {t("items")}
                          </p>
                          <p className="mt-1 font-medium">
                            {order.total} {t("currency")}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("orders")}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                      <div className="mb-3 rounded-full bg-muted p-3">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mb-1 text-lg font-medium">{t("noActivity")}</h3>
                      <p className="mb-4 text-sm text-muted-foreground">{t("noActivityDescription")}</p>
                      <Button onClick={() => router.push("/home")}>{t("startShopping")}</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{t("achievements")}</CardTitle>
                <CardDescription>{t("achievementsDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary/50 hover:bg-muted/50 ${
                        !badge.unlocked && "opacity-60 grayscale"
                      }`}
                      onClick={() => toggleBadgeExpansion(badge.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">{badge.icon}</div>
                        <div>
                          <h3 className="font-medium">{language === "ar" ? badge.nameAr : badge.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {language === "ar" ? badge.descriptionAr : badge.description}
                          </p>
                          {expandedBadge === badge.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2"
                            >
                              <p className="text-xs text-muted-foreground">
                                {badge.unlocked
                                  ? t("badgeUnlockedOn", { date: formatDate(new Date().toISOString()) })
                                  : t("badgeLockedDescription")}
                              </p>
                              {!badge.unlocked && (
                                <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs">
                                  {t("howToUnlock")}
                                </Button>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>{t("myOrders")}</CardTitle>
                  <CardDescription>{t("myOrdersDescription")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter className="h-4 w-4" />
                        {t("filter")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("filterBy")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>{t("all")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("processing")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("readyForPickup")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("completed")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("cancelled")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ArrowUpDown className="h-4 w-4" />
                        {t("sort")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("sortBy")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>{t("newest")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("oldest")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("highestTotal")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("lowestTotal")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-muted p-3">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{t("noOrders")}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{t("noOrdersDescription")}</p>
                  <Button onClick={() => router.push("/home")}>{t("startShopping")}</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Accordion type="single" collapsible>
                        <AccordionItem value={`order-${order.id}`} className="border rounded-lg">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div>
                                <h3 className="font-medium text-left">
                                  {t("order")}: #{order.id}
                                </h3>
                                <p className="text-sm text-muted-foreground text-left">{formatDate(order.date)}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                {getOrderStatusBadge(order.status)}
                                <span className="font-medium">
                                  {order.total} {t("currency")}
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <Separator className="mb-4" />
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="mb-2 text-sm font-medium">{t("items")}</h4>
                                <div className="space-y-2">
                                  {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                      <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                        <Image
                                          src={item.image || "/placeholder.svg"}
                                          alt={language === "ar" ? item.nameAr : item.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div className="flex-1 text-sm">
                                        <div className="line-clamp-1 font-medium">
                                          {language === "ar" ? item.nameAr : item.name}
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-muted-foreground">x{item.quantity}</span>
                                          <span>
                                            {item.price} {t("currency")}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="mb-2 text-sm font-medium">{t("pickupInfo")}</h4>
                                <div className="rounded-md bg-muted p-3 text-sm">
                                  <p className="font-medium">{order.pickup?.contactName || t("notProvided")}</p>
                                  <p className="text-muted-foreground">{order.pickup?.phone || t("notProvided")}</p>
                                  <p className="text-muted-foreground">
                                    {order.pickup?.location || t("pickupAtStore")}
                                  </p>
                                </div>

                                <h4 className="mb-2 mt-4 text-sm font-medium">{t("paymentMethod")}</h4>
                                <div className="rounded-md bg-muted p-3 text-sm">
                                  <p className="font-medium">
                                    {order.payment?.method === "card" ? t("creditCard") : t("cashOnPickup")}
                                  </p>
                                  {order.payment?.method === "card" && order.payment.cardInfo && (
                                    <p className="text-muted-foreground">{order.payment.cardInfo.cardNumber}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
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
                    className="w-full max-w-xs pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-muted p-3">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{t("noFavorites")}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{t("noFavoritesDescription")}</p>
                  <Button onClick={() => router.push("/home")}>{t("exploreProducts")}</Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {favorites.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden h-full flex flex-col">
                        <div className="relative">
                          <div className="relative h-40 w-full">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={language === "ar" ? item.nameAr : item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background/90"
                            onClick={() => handleRemoveFavorite(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                          <Badge className="absolute left-2 top-2 bg-secondary">
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
                              className="w-full"
                              onClick={() => router.push(`/product/${item.id}`)}
                            >
                              {t("viewProduct")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="savedStores">
          <Card>
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
                    className="w-full max-w-xs pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {favoriteStores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-muted p-3">
                    <Store className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{t("noSavedStores")}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{t("noSavedStoresDescription")}</p>
                  <Button onClick={() => router.push("/home")}>{t("exploreStores")}</Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {favoriteStores.map((store, index) => (
                    <motion.div
                      key={store.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden h-full flex flex-col">
                        <div className="flex items-center p-4 gap-3">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={store.image || "/placeholder.svg"}
                              alt={language === "ar" ? store.nameAr : store.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{language === "ar" ? store.nameAr : store.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{language === "ar" ? store.locationAr : store.location}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs ml-1">{store.rating}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {store.productsCount} {t("products")}
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/store/${store.id}`)}>
                                <Store className="mr-2 h-4 w-4" />
                                {t("viewStore")}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                {t("shareStore")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleRemoveFavoriteStore(store.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("removeFromSaved")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardContent className="pt-0 pb-4 px-4 mt-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => router.push(`/store/${store.id}`)}
                          >
                            {t("browseProducts")}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>{t("myReviews")}</CardTitle>
                  <CardDescription>{t("myReviewsDescription")}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter className="h-4 w-4" />
                        {t("filter")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("filterBy")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>{t("all")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("highestRated")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("lowestRated")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <ArrowUpDown className="h-4 w-4" />
                        {t("sort")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t("sortBy")}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>{t("newest")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("oldest")}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 rounded-full bg-muted p-3">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">{t("noReviews")}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{t("noReviewsDescription")}</p>
                  <Button onClick={() => router.push("/home")}>{t("exploreProducts")}</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                              <Image
                                src={review.image || "/placeholder.svg"}
                                alt={language === "ar" ? review.productNameAr : review.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="mb-1 flex items-center justify-between">
                                <h3 className="font-medium">
                                  {language === "ar" ? review.productNameAr : review.productName}
                                </h3>
                                <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                              </div>
                              <div className="mb-2">{renderStarRating(review.rating)}</div>
                              <p className="text-sm text-muted-foreground">
                                {language === "ar" ? review.commentAr : review.comment}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t("editReview")}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  {t("shareReview")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t("deleteReview")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {accountType === "seller" && (
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>{t("myProducts")}</CardTitle>
                    <CardDescription>{t("myProductsDescription")}</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder={t("searchProducts")}
                        className="w-full sm:w-[200px] pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Filter className="h-4 w-4" />
                            {t("filter")}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t("filterBy")}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setProductFilter("all")}>{t("all")}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setProductFilter("active")}>{t("active")}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setProductFilter("inactive")}>
                            {t("inactive")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <ArrowUpDown className="h-4 w-4" />
                            {t("sort")}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t("sortBy")}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setProductSort("newest")}>{t("newest")}</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setProductSort("expiringSoon")}>
                            {t("expiringSoon")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setProductSort("highestDiscount")}>
                            {t("highestDiscount")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setProductSort("mostViewed")}>
                            {t("mostViewed")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setProductSort("mostSaved")}>
                            {t("mostSaved")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        onClick={() =>
                          document.getElementById("addProductForm")?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("addProduct")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getFilteredProducts().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 rounded-full bg-muted p-3">
                      <Store className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">{t("noProducts")}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{t("noProductsDescription")}</p>
                    <Button
                      onClick={() => document.getElementById("addProductForm")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      {t("addYourFirstProduct")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {getFilteredProducts().map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col gap-4 sm:flex-row">
                              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={language === "ar" ? product.nameAr : product.name}
                                  fill
                                  className="object-cover"
                                />
                                <Badge className="absolute right-0 top-0 rounded-bl-md rounded-tr-md">
                                  {product.discount}%
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <div className="mb-1 flex items-center justify-between">
                                  <h3 className="font-medium">{language === "ar" ? product.nameAr : product.name}</h3>
                                  <Badge variant={product.status === "active" ? "outline" : "secondary"}>
                                    {product.status === "active" ? t("active") : t("inactive")}
                                  </Badge>
                                </div>
                                <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                                  {language === "ar" ? product.descriptionAr : product.description}
                                </p>
                                <div className="mb-2 flex flex-wrap items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium">{t("originalPrice")}:</span>
                                    <span className="text-sm text-muted-foreground">
                                      {product.originalPrice} {t("currency")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium">{t("discountedPrice")}:</span>
                                    <span className="text-sm text-primary">
                                      {product.discountedPrice} {t("currency")}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      {t("expires")}: {formatDate(product.expiryDate)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Eye className="h-4 w-4" />
                                      <span>{product.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                      <Heart className="h-4 w-4" />
                                      <span>{product.saves}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                      <Edit className="mr-2 h-4 w-4" />
                                      {t("edit")}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleToggleProductVisibility(product.id)}
                                    >
                                      {product.status === "active" ? (
                                        <>
                                          <EyeOff className="mr-2 h-4 w-4" />
                                          {t("hide")}
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="mr-2 h-4 w-4" />
                                          {t("show")}
                                        </>
                                      )}
                                    </Button>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <FileText className="mr-2 h-4 w-4" />
                                          {t("viewDetails")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Share2 className="mr-2 h-4 w-4" />
                                          {t("shareProduct")}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          className="text-destructive focus:text-destructive"
                                          onClick={() => handleDeleteProduct(product.id)}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          {t("delete")}
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Add Product Form */}
                <div id="addProductForm" className="mt-8 rounded-lg border p-6 bg-card shadow-sm">
                  <h3 className="mb-4 text-xl font-bold">{t("addNewProduct")}</h3>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="productName">
                          {t("productName")} ({t("english")}) *
                        </Label>
                        <Input
                          id="productName"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="productNameAr">
                          {t("productName")} ({t("arabic")}) *
                        </Label>
                        <Input
                          id="productNameAr"
                          value={newProduct.nameAr}
                          onChange={(e) => setNewProduct({ ...newProduct, nameAr: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="category">{t("category")} *</Label>
                        <select
                          id="category"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                          required
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {language === "ar" ? category.nameAr : category.nameEn}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">{t("originalPrice")} *</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          value={newProduct.originalPrice}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, originalPrice: Number.parseFloat(e.target.value) })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discountedPrice">{t("discountedPrice")} *</Label>
                        <Input
                          id="discountedPrice"
                          type="number"
                          value={newProduct.discountedPrice}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, discountedPrice: Number.parseFloat(e.target.value) })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">{t("expiryDate")} *</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={newProduct.expiryDate}
                          onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">{t("quantity")} *</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newProduct.quantity}
                          onChange={(e) => setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shopAddress">{t("shopAddress")} *</Label>
                      <Input
                        id="shopAddress"
                        value={newProduct.shopAddress || ""}
                        onChange={(e) => setNewProduct({ ...newProduct, shopAddress: e.target.value })}
                        placeholder={t("shopAddressPlaceholder")}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactMethod">{t("contactMethod")} *</Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">{t("phone")}</Label>
                          <Input
                            id="contactPhone"
                            value={newProduct.contactPhone || ""}
                            onChange={(e) => setNewProduct({ ...newProduct, contactPhone: e.target.value })}
                            placeholder={t("contactPhonePlaceholder")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactWhatsapp">{t("whatsapp")}</Label>
                          <Input
                            id="contactWhatsapp"
                            value={newProduct.contactWhatsapp || ""}
                            onChange={(e) => setNewProduct({ ...newProduct, contactWhatsapp: e.target.value })}
                            placeholder={t("contactWhatsappPlaceholder")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        {t("description")} ({t("english")})
                      </Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descriptionAr">
                        {t("description")} ({t("arabic")})
                      </Label>
                      <Textarea
                        id="descriptionAr"
                        value={newProduct.descriptionAr}
                        onChange={(e) => setNewProduct({ ...newProduct, descriptionAr: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productImage">{t("productImage")}</Label>
                      <div className="flex items-center gap-4">
                        {productImage ? (
                          <div className="relative h-24 w-24 overflow-hidden rounded-md">
                            <Image
                              src={productImage || "/placeholder.svg"}
                              alt="Product preview"
                              fill
                              className="object-cover"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1 h-6 w-6 rounded-full bg-background/80"
                              onClick={() => setProductImage(null)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-muted-foreground/50 hover:border-muted-foreground/80"
                            onClick={() => document.getElementById("productImageInput")?.click()}
                          >
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <input
                              id="productImageInput"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleProductImageChange}
                            />
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {productImage ? t("clickToChange") : t("clickToUpload")}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
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
                        }}
                      >
                        {t("reset")}
                      </Button>
                      <Button
                        onClick={handleAddProduct}
                        disabled={
                          !newProduct.name ||
                          !newProduct.nameAr ||
                          !newProduct.expiryDate ||
                          !newProduct.originalPrice ||
                          !newProduct.discountedPrice
                        }
                      >
                        {t("addProduct")}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {accountType === "seller" && (
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>{t("analytics")}</CardTitle>
                    <CardDescription>{t("analyticsDescription")}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Calendar className="h-4 w-4" />
                          {t("thisMonth")}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>{t("today")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("thisWeek")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("thisMonth")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("last3Months")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("thisYear")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("allTime")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      {t("exportReport")}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-indigo-800 dark:text-indigo-400">
                            {t("productViews")}
                          </p>
                          <h3 className="mt-1 text-2xl font-bold text-indigo-900 dark:text-indigo-300">
                            {analytics.views}
                          </h3>
                        </div>
                        <div className="rounded-full bg-indigo-200 p-3 dark:bg-indigo-800/30">
                          <Eye className="h-6 w-6 text-indigo-700 dark:text-indigo-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-pink-800 dark:text-pink-400">{t("productSaves")}</p>
                          <h3 className="mt-1 text-2xl font-bold text-pink-900 dark:text-pink-300">
                            {analytics.saves}
                          </h3>
                        </div>
                        <div className="rounded-full bg-pink-200 p-3 dark:bg-pink-800/30">
                          <Heart className="h-6 w-6 text-pink-700 dark:text-pink-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-800 dark:text-orange-400">
                            {t("completedOrders")}
                          </p>
                          <h3 className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-300">
                            {analytics.orders}
                          </h3>
                        </div>
                        <div className="rounded-full bg-orange-200 p-3 dark:bg-orange-800/30">
                          <Package className="h-6 w-6 text-orange-700 dark:text-orange-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                            {t("totalRevenue")}
                          </p>
                          <h3 className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                            {analytics.revenue} {t("currency")}
                          </h3>
                        </div>
                        <div className="rounded-full bg-emerald-200 p-3 dark:bg-emerald-800/30">
                          <DollarSign className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("topSellingProducts")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.topProducts.map((product, index) => (
                          <div key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {product.sales} {t("sales")}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">
                              {product.revenue} {t("currency")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t("monthlySales")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px] w-full">
                        <div className="flex h-full items-end gap-2">
                          {analytics.monthlySales.map((month) => (
                            <div key={month.month} className="flex flex-1 flex-col items-center">
                              <div
                                className="w-full rounded-t-sm bg-primary"
                                style={{ height: `${(month.sales / 30) * 100}%` }}
                              ></div>
                              <p className="mt-2 text-xs">{month.month}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {accountType === "seller" && (
          <TabsContent value="storeSettings">
            <Card>
              <CardHeader>
                <CardTitle>{t("storeSettings")}</CardTitle>
                <CardDescription>{t("storeSettingsDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("storeInformation")}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">
                        {t("storeName")} ({t("english")})
                      </Label>
                      <Input
                        id="storeName"
                        value={editedUser.storeName || userData.storeName}
                        onChange={(e) => setEditedUser({ ...editedUser, storeName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeNameAr">
                        {t("storeName")} ({t("arabic")})
                      </Label>
                      <Input
                        id="storeNameAr"
                        value={editedUser.storeNameAr || userData.storeNameAr}
                        onChange={(e) => setEditedUser({ ...editedUser, storeNameAr: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="storeLocation">
                        {t("storeLocation")} ({t("english")})
                      </Label>
                      <Input
                        id="storeLocation"
                        value={editedUser.storeLocation || userData.storeLocation}
                        onChange={(e) => setEditedUser({ ...editedUser, storeLocation: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeLocationAr">
                        {t("storeLocation")} ({t("arabic")})
                      </Label>
                      <Input
                        id="storeLocationAr"
                        value={editedUser.storeLocationAr || userData.storeLocationAr}
                        onChange={(e) => setEditedUser({ ...editedUser, storeLocationAr: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">
                      {t("storeDescription")} ({t("english")})
                    </Label>
                    <Textarea
                      id="storeDescription"
                      value={editedUser.storeDescription || userData.storeDescription}
                      onChange={(e) => setEditedUser({ ...editedUser, storeDescription: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeDescriptionAr">
                      {t("storeDescription")} ({t("arabic")})
                    </Label>
                    <Textarea
                      id="storeDescriptionAr"
                      value={editedUser.storeDescriptionAr || userData.storeDescriptionAr}
                      onChange={(e) => setEditedUser({ ...editedUser, storeDescriptionAr: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("contactInformation")}</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="storePhone">{t("phone")}</Label>
                      <Input
                        id="storePhone"
                        value={editedUser.storePhone || userData.storePhone}
                        onChange={(e) => setEditedUser({ ...editedUser, storePhone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeEmail">{t("email")}</Label>
                      <Input
                        id="storeEmail"
                        value={editedUser.storeEmail || userData.storeEmail}
                        onChange={(e) => setEditedUser({ ...editedUser, storeEmail: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeWebsite">
                      {t("website")} ({t("optional")})
                    </Label>
                    <Input
                      id="storeWebsite"
                      value={editedUser.storeWebsite || userData.storeWebsite}
                      onChange={(e) => setEditedUser({ ...editedUser, storeWebsite: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("storeVisibility")}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t("storeActive")}</h4>
                        <p className="text-sm text-muted-foreground">{t("storeActiveDescription")}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t("featuredStore")}</h4>
                        <p className="text-sm text-muted-foreground">{t("featuredStoreDescription")}</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">{t("cancel")}</Button>
                  <Button onClick={handleSaveProfile}>{t("saveChanges")}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings")}</CardTitle>
              <CardDescription>{t("settingsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Account settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("accountSettings")}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="changeEmail">{t("email")}</Label>
                    <Input id="changeEmail" defaultValue={userData.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="changePassword">{t("password")}</Label>
                    <Input id="changePassword" type="password" defaultValue="********" />
                  </div>
                </div>
                <Button className="mt-2">{t("updateAccount")}</Button>
              </div>

              <Separator />

              {/* Notification settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("notificationSettings")}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t("emailNotifications")}</h4>
                      <p className="text-sm text-muted-foreground">{t("emailNotificationsDescription")}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t("smsNotifications")}</h4>
                      <p className="text-sm text-muted-foreground">{t("smsNotificationsDescription")}</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t("expiryAlerts")}</h4>
                      <p className="text-sm text-muted-foreground">{t("expiryAlertsDescription")}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Language and appearance */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("languageAndAppearance")}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t("language")}</Label>
                    <select
                      id="language"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      defaultValue={language}
                    >
                      <option value="ar">العربية</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme">{t("theme")}</Label>
                    <select
                      id="theme"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="light">{t("light")}</option>
                      <option value="dark">{t("dark")}</option>
                      <option value="system">{t("system")}</option>
                    </select>
                  </div>
                </div>
                <Button className="mt-2">{t("savePreferences")}</Button>
              </div>

              <Separator />

              {/* Help & Support */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t("helpAndSupport")}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-muted/50">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <HelpCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{t("helpCenter")}</h4>
                        <p className="text-sm text-muted-foreground">{t("helpCenterDescription")}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="rounded-full bg-primary/10 p-3">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{t("contactSupport")}</h4>
                        <p className="text-sm text-muted-foreground">{t("contactSupportDescription")}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Delete account */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-destructive">{t("dangerZone")}</h3>
                <p className="text-sm text-muted-foreground">{t("deleteAccountWarning")}</p>
                <Button variant="destructive">{t("deleteAccount")}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
