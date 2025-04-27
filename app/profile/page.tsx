"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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
import { motion } from "framer-motion"
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Edit,
  Save,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  ShoppingBag,
  Truck,
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
  const [reviews, setReviews] = useState(sampleReviews)
  const [uploadedProducts, setUploadedProducts] = useState(sampleUploadedProducts)
  const [editedUser, setEditedUser] = useState<any>({})
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [accountType, setAccountType] = useState<"consumer" | "supermarket">("consumer")
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
  })
  const [productImage, setProductImage] = useState<string | null>(null)

  // Check if user is logged in
  useEffect(() => {
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

    // Load user data
    try {
      const parsedUser = JSON.parse(user)
      setUserData({
        name: parsedUser.name || "User Name",
        email: parsedUser.email || "user@example.com",
        phone: parsedUser.phone || "+20 123 456 7890",
        address: parsedUser.address || "Cairo, Egypt",
        joinDate: parsedUser.joinDate || new Date().toISOString(),
        avatar: parsedUser.avatar || "/placeholder.svg?height=100&width=100",
        bio: parsedUser.bio || "Eco-conscious shopper passionate about reducing food waste.",
        accountType: parsedUser.accountType || "consumer",
      })
      setEditedUser({
        name: parsedUser.name || "User Name",
        email: parsedUser.email || "user@example.com",
        phone: parsedUser.phone || "+20 123 456 7890",
        address: parsedUser.address || "Cairo, Egypt",
        bio: parsedUser.bio || "Eco-conscious shopper passionate about reducing food waste.",
      })
      setAccountType(parsedUser.accountType || "consumer")
    } catch (error) {
      console.error("Failed to parse user data", error)
      router.push("/login")
    }

    // Load orders
    const savedOrders = localStorage.getItem("edama-orders")
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders)
        setOrders(parsedOrders)
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
      } catch (error) {
        console.error("Failed to parse favorites", error)
      }
    }

    setIsLoading(false)
  }, [router, searchParams])

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
      supermarket: userData.name,
      supermarketAr: userData.name,
      status: "active",
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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
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
      case "shipped":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-orange-500 text-orange-500">
            <Truck className="h-3 w-3" />
            {t("shipped")}
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-500">
            <CheckCircle className="h-3 w-3" />
            {t("delivered")}
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-4">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-1"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={previewImage || userData.avatar} alt={userData.name} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
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
                <h2 className="mb-1 text-xl font-bold">{userData.name}</h2>
                <p className="mb-2 text-sm text-muted-foreground">{userData.email}</p>
                <Badge variant={accountType === "supermarket" ? "secondary" : "outline"} className="mb-4">
                  {accountType === "supermarket" ? t("supermarket") : t("consumer")}
                </Badge>

                <div className="mb-6 w-full rounded-md bg-primary/10 p-3 text-center text-sm">
                  <p className="font-medium text-primary">{t("ecoMember")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("memberSince")}: {formatDate(userData.joinDate)}
                  </p>
                </div>

                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-1 gap-2">
                    <TabsTrigger value="overview" className="justify-start">
                      <User className="mr-2 h-4 w-4" />
                      {t("overview")}
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      {t("myOrders")}
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="justify-start">
                      <Heart className="mr-2 h-4 w-4" />
                      {t("favorites")}
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {t("reviews")}
                    </TabsTrigger>
                    {accountType === "supermarket" && (
                      <TabsTrigger value="products" className="justify-start">
                        <Store className="mr-2 h-4 w-4" />
                        {t("myProducts")}
                      </TabsTrigger>
                    )}
                    <TabsTrigger value="settings" className="justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      {t("settings")}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Button
                  variant="outline"
                  className="mt-6 w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-3"
        >
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="mt-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{t("profileOverview")}</CardTitle>
                      <CardDescription>{t("profileOverviewDescription")}</CardDescription>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("edit")}
                      </Button>
                    ) : (
                      <Button variant="default" size="sm" onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="mr-2 h-4 w-4" />
                        )}
                        {t("save")}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("fullName")}</Label>
                          <Input
                            id="name"
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("email")}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t("phone")}</Label>
                          <Input
                            id="phone"
                            value={editedUser.phone}
                            onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">{t("address")}</Label>
                          <Input
                            id="address"
                            value={editedUser.address}
                            onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">{t("bio")}</Label>
                        <Textarea
                          id="bio"
                          value={editedUser.bio}
                          onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("accountType")}</Label>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <Switch
                            checked={accountType === "supermarket"}
                            onCheckedChange={(checked) => setAccountType(checked ? "supermarket" : "consumer")}
                          />
                          <span>{accountType === "supermarket" ? t("supermarket") : t("consumer")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {accountType === "supermarket"
                            ? t("supermarketAccountDescription")
                            : t("consumerAccountDescription")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="italic text-muted-foreground">{userData.bio}</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-primary" />
                            <span className="font-medium">{t("fullName")}</span>
                          </div>
                          <p>{userData.name}</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-primary" />
                            <span className="font-medium">{t("email")}</span>
                          </div>
                          <p>{userData.email}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="font-medium">{t("phone")}</span>
                          </div>
                          <p>{userData.phone}</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="font-medium">{t("address")}</span>
                          </div>
                          <p>{userData.address}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">{t("memberSince")}</span>
                          </div>
                          <p>{formatDate(userData.joinDate)}</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <ShoppingBag className="h-4 w-4 text-primary" />
                            <span className="font-medium">{t("totalOrders")}</span>
                          </div>
                          <p>{orders.length}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent activity */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {/* Recent orders */}
                {orders.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{t("recentOrders")}</CardTitle>
                        <Button variant="link" size="sm" onClick={() => setActiveTab("orders")}>
                          {t("viewAll")}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order, index) => (
                          <div key={order.id} className="flex items-start gap-4">
                            <div className="rounded-md bg-primary/10 p-2">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">
                                  {t("order")}: {order.id}
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
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent favorites */}
                {favorites.length > 0 && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{t("recentFavorites")}</CardTitle>
                        <Button variant="link" size="sm" onClick={() => setActiveTab("favorites")}>
                          {t("viewAll")}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {favorites.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-md">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={language === "ar" ? item.nameAr : item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="line-clamp-1 font-medium">
                                {language === "ar" ? item.nameAr : item.name}
                              </h3>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-primary">
                                  {item.discountedPrice} {t("currency")}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {item.discount}% {t("off")}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("myOrders")}</CardTitle>
                  <CardDescription>{t("myOrdersDescription")}</CardDescription>
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
                          <Card>
                            <CardContent className="p-4">
                              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <h3 className="font-medium">
                                    {t("order")}: {order.id}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getOrderStatusBadge(order.status)}
                                  <span className="font-medium">
                                    {order.total} {t("currency")}
                                  </span>
                                </div>
                              </div>

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
                                  <h4 className="mb-2 text-sm font-medium">{t("shippingInfo")}</h4>
                                  <div className="rounded-md bg-muted p-3 text-sm">
                                    <p className="font-medium">{order.shipping.fullName}</p>
                                    <p className="text-muted-foreground">{order.shipping.phone}</p>
                                    <p className="text-muted-foreground">
                                      {order.shipping.address}, {order.shipping.area}, {order.shipping.city}
                                    </p>
                                  </div>

                                  <h4 className="mb-2 mt-4 text-sm font-medium">{t("paymentMethod")}</h4>
                                  <div className="rounded-md bg-muted p-3 text-sm">
                                    <p className="font-medium">
                                      {order.payment.method === "card" ? t("creditCard") : t("cashOnDelivery")}
                                    </p>
                                    {order.payment.method === "card" && (
                                      <p className="text-muted-foreground">{order.payment.cardInfo.cardNumber}</p>
                                    )}
                                  </div>
                                </div>
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

            <TabsContent value="favorites" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("favorites")}</CardTitle>
                  <CardDescription>{t("favoritesDescription")}</CardDescription>
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
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {favorites.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className="overflow-hidden">
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
                            <CardContent className="p-3">
                              <h3 className="line-clamp-1 font-medium">
                                {language === "ar" ? item.nameAr : item.name}
                              </h3>
                              <div className="mb-2 flex items-center gap-2">
                                <span className="font-medium text-primary">
                                  {item.discountedPrice} {t("currency")}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {item.originalPrice} {t("currency")}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => router.push(`/product/${item.id}`)}
                              >
                                {t("viewProduct")}
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

            <TabsContent value="reviews" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t("myReviews")}</CardTitle>
                  <CardDescription>{t("myReviewsDescription")}</CardDescription>
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

            {accountType === "supermarket" && (
              <TabsContent value="products" className="mt-0">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{t("myProducts")}</CardTitle>
                        <CardDescription>{t("myProductsDescription")}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("addProductForm")?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {t("addProduct")}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {uploadedProducts.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                          <Store className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium">{t("noProducts")}</h3>
                        <p className="mb-4 text-sm text-muted-foreground">{t("noProductsDescription")}</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {uploadedProducts.map((product, index) => (
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
                                      <h3 className="font-medium">
                                        {language === "ar" ? product.nameAr : product.name}
                                      </h3>
                                      <Badge variant={product.status === "active" ? "outline" : "secondary"}>
                                        {product.status === "active" ? t("active") : t("inactive")}
                                      </Badge>
                                    </div>
                                    <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                                      {language === "ar" ? product.descriptionAr : product.description}
                                    </p>
                                    <div className="mb-2 flex items-center gap-4">
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
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                          {t("expires")}: {formatDate(product.expiryDate)}
                                        </span>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                          <Edit className="mr-2 h-4 w-4" />
                                          {t("edit")}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                          onClick={() => handleDeleteProduct(product.id)}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          {t("delete")}
                                        </Button>
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
                    <div id="addProductForm" className="mt-8 rounded-lg border p-6">
                      <h3 className="mb-4 text-lg font-medium">{t("addNewProduct")}</h3>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="productName">
                              {t("productName")} ({t("english")})
                            </Label>
                            <Input
                              id="productName"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="productNameAr">
                              {t("productName")} ({t("arabic")})
                            </Label>
                            <Input
                              id="productNameAr"
                              value={newProduct.nameAr}
                              onChange={(e) => setNewProduct({ ...newProduct, nameAr: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor="category">{t("category")}</Label>
                            <select
                              id="category"
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              value={newProduct.category}
                              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {language === "ar" ? category.nameAr : category.nameEn}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="originalPrice">{t("originalPrice")}</Label>
                            <Input
                              id="originalPrice"
                              type="number"
                              value={newProduct.originalPrice}
                              onChange={(e) =>
                                setNewProduct({ ...newProduct, originalPrice: Number.parseFloat(e.target.value) })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="discountedPrice">{t("discountedPrice")}</Label>
                            <Input
                              id="discountedPrice"
                              type="number"
                              value={newProduct.discountedPrice}
                              onChange={(e) =>
                                setNewProduct({ ...newProduct, discountedPrice: Number.parseFloat(e.target.value) })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">{t("expiryDate")}</Label>
                            <Input
                              id="expiryDate"
                              type="date"
                              value={newProduct.expiryDate}
                              onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="quantity">{t("quantity")}</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={newProduct.quantity}
                              onChange={(e) =>
                                setNewProduct({ ...newProduct, quantity: Number.parseInt(e.target.value) })
                              }
                            />
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

                        <Button
                          onClick={handleAddProduct}
                          disabled={!newProduct.name || !newProduct.nameAr || !newProduct.expiryDate}
                        >
                          {t("addProduct")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="settings" className="mt-0">
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
                        <div className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-primary px-1">
                          <div className="h-4 w-4 rounded-full bg-white transition-transform"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{t("smsNotifications")}</h4>
                          <p className="text-sm text-muted-foreground">{t("smsNotificationsDescription")}</p>
                        </div>
                        <div className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-muted px-1">
                          <div className="h-4 w-4 translate-x-5 rounded-full bg-muted-foreground transition-transform"></div>
                        </div>
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
        </motion.div>
      </div>
    </div>
  )
}
