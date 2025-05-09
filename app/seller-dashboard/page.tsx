"use client"

import { useState } from "react"
import { ShoppingBag, Package, TrendingUp, Clock, Plus, Filter, ArrowUpDown, Search } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { RoleGuard } from "@/components/role-guard"
import { AnimatedContainer } from "@/components/animated-container"
import { ProductCard } from "@/components/product-card"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Mock data for seller dashboard
const mockProducts = [
  {
    id: "1",
    name: "Organic Apples",
    price: 2.99,
    originalPrice: 3.99,
    image: "/placeholder.svg?height=300&width=300",
    shop: {
      id: "1",
      name: "Green Grocers",
    },
    category: "Fruits",
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    isVisible: true,
  },
  {
    id: "2",
    name: "Fresh Bread",
    price: 1.99,
    originalPrice: 2.49,
    image: "/placeholder.svg?height=300&width=300",
    shop: {
      id: "1",
      name: "Green Grocers",
    },
    category: "Bakery",
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    isVisible: true,
  },
  {
    id: "3",
    name: "Yogurt Pack",
    price: 4.99,
    originalPrice: 6.99,
    image: "/placeholder.svg?height=300&width=300",
    shop: {
      id: "1",
      name: "Green Grocers",
    },
    category: "Dairy",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    isVisible: false,
  },
  {
    id: "4",
    name: "Pasta Sauce",
    price: 3.49,
    originalPrice: 4.99,
    image: "/placeholder.svg?height=300&width=300",
    shop: {
      id: "1",
      name: "Green Grocers",
    },
    category: "Pantry",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isVisible: true,
  },
]

const mockStats = {
  totalProducts: 12,
  activeProducts: 10,
  totalOrders: 45,
  revenue: 1250.75,
}

export default function SellerDashboard() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("expiry")
  const [filterExpiring, setFilterExpiring] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handleFilterChange = (checked: boolean) => {
    setFilterExpiring(checked)
  }

  // Filter and sort products
  const filteredProducts = mockProducts.filter((product) => {
    if (searchQuery) {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    if (filterExpiring) {
      // Show products expiring within 3 days
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      return product.expiryDate <= threeDaysFromNow
    }
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "expiry":
        return a.expiryDate.getTime() - b.expiryDate.getTime()
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <RoleGuard allowedRoles={["seller", "admin"]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100">{t("sellerDashboard")}</h1>

        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-3 gap-2 sm:w-auto">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400"
            >
              {t("overview")}
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400"
            >
              {t("products")}
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400"
            >
              {t("orders")}
            </TabsTrigger>
          </TabsList>

          <AnimatedContainer animation="fadeIn" duration={0.3} key={activeTab}>
            <TabsContent value="overview" className="mt-0">
              <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{t("totalProducts")}</CardTitle>
                    <Package className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {mockStats.activeProducts} {t("active")}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{t("totalOrders")}</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">+12% {t("fromLastMonth")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{t("revenue")}</CardTitle>
                    <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${mockStats.revenue.toFixed(2)}</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">+8% {t("fromLastMonth")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{t("expiringProducts")}</CardTitle>
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t("expiringIn3Days")}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">{t("recentOrders")}</h2>
                <div className="rounded-xl bg-white shadow-md dark:bg-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {t("orderId")}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {t("customer")}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {t("date")}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {t("amount")}
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            {t("status")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            #ORD-001
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            John Doe
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            May 8, 2023
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            $45.99
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              {t("completed")}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            #ORD-002
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            Jane Smith
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            May 7, 2023
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            $32.50
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {t("processing")}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            #ORD-003
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            Robert Johnson
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            May 6, 2023
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                            $78.25
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              {t("completed")}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {t("expiringProductsTitle")}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {mockProducts
                    .filter((product) => {
                      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                      return product.expiryDate <= threeDaysFromNow
                    })
                    .map((product) => (
                      <ProductCard key={product.id} {...product} isSeller={true} />
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-md">
                  <SearchBar placeholder={t("searchProducts")} onSearch={handleSearch} />
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Switch id="expiring-filter" checked={filterExpiring} onCheckedChange={handleFilterChange} />
                    <Label htmlFor="expiring-filter" className="text-sm">
                      {t("showExpiringOnly")}
                    </Label>
                  </div>

                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <ArrowUpDown className="h-4 w-4" />
                        <SelectValue placeholder={t("sortBy")} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expiry">{t("expiryDateAsc")}</SelectItem>
                      <SelectItem value="price-low">{t("priceLowToHigh")}</SelectItem>
                      <SelectItem value="price-high">{t("priceHighToLow")}</SelectItem>
                      <SelectItem value="name">{t("nameAZ")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {t("addProduct")}
                  </Button>
                </div>
              </div>

              {sortedProducts.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} isSeller={true} />
                  ))}
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800">
                  <Package className="mb-2 h-10 w-10 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">{t("noProductsFound")}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t("searchOrders")}
                      className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-green-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder={t("filterByStatus")} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("allOrders")}</SelectItem>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                      <SelectItem value="processing">{t("processing")}</SelectItem>
                      <SelectItem value="completed">{t("completed")}</SelectItem>
                      <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-xl bg-white shadow-md dark:bg-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t("orderId")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t("customer")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t("date")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t("items")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t("amount")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t("status")}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {t("actions")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          #ORD-001
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          John Doe
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          May 8, 2023
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">3</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">$45.99</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {t("completed")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <Button variant="ghost" size="sm">
                            {t("view")}
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          #ORD-002
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          Jane Smith
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          May 7, 2023
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">2</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">$32.50</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {t("processing")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <Button variant="ghost" size="sm">
                            {t("view")}
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          #ORD-003
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          Robert Johnson
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          May 6, 2023
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">5</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">$78.25</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {t("completed")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <Button variant="ghost" size="sm">
                            {t("view")}
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          #ORD-004
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          Sarah Williams
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          May 5, 2023
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">1</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">$12.99</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            {t("pending")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <Button variant="ghost" size="sm">
                            {t("view")}
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          #ORD-005
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          Michael Brown
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          May 4, 2023
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">2</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">$29.99</td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            {t("cancelled")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <Button variant="ghost" size="sm">
                            {t("view")}
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </AnimatedContainer>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
