import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, getDaysUntilExpiry } from "@/lib/utils"

export default function HomePage() {
  // Sample featured products
  const featuredProducts = [
    {
      id: "1",
      name: "Fresh Milk",
      name_ar: "حليب طازج",
      original_price: 25,
      discounted_price: 18,
      discount: 28,
      image_url: "/placeholder.svg?height=200&width=200",
      supermarket: "El Mahalla Market",
      expiry_date: "2023-06-15",
    },
    {
      id: "2",
      name: "Cheese Block",
      name_ar: "قطعة جبن",
      original_price: 45,
      discounted_price: 30,
      discount: 33,
      image_url: "/placeholder.svg?height=200&width=200",
      supermarket: "Cairo Grocery",
      expiry_date: "2023-06-18",
    },
    {
      id: "3",
      name: "Yogurt Pack",
      name_ar: "علبة زبادي",
      original_price: 35,
      discounted_price: 22,
      discount: 37,
      image_url: "/placeholder.svg?height=200&width=200",
      supermarket: "Alexandria Store",
      expiry_date: "2023-06-14",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Save Money & Reduce Food Waste</h1>
          <p className="text-lg text-gray-700 mb-6">
            Discover great deals on quality products approaching their best-before date from local Egyptian stores
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/home">Shop Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Link href="/home" className="text-emerald-600 hover:text-emerald-700">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
                  {product.discount}% OFF
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{product.supermarket}</p>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-gray-400 line-through mr-2">{formatCurrency(product.original_price)}</span>
                    <span className="text-emerald-600 font-bold">{formatCurrency(product.discounted_price)}</span>
                  </div>
                  <div className="text-amber-600 text-sm">
                    Expires in {getDaysUntilExpiry(product.expiry_date)} days
                  </div>
                </div>
                <Button asChild className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
                  <Link href={`/product/${product.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">How Edama Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-emerald-600">1</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Browse Products</h3>
            <p className="text-gray-600">Explore discounted products from local Egyptian stores</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-emerald-600">2</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Add to Cart</h3>
            <p className="text-gray-600">Select the items you want and add them to your shopping cart</p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-emerald-600">3</span>
            </div>
            <h3 className="font-bold text-lg mb-2">Pick Up In-Store</h3>
            <p className="text-gray-600">Visit the store to pick up your items and enjoy your savings</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Benefits of Shopping with Edama</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-emerald-700">Save Money</h3>
              <p className="text-gray-600">
                Get quality products at discounted prices, helping you save on your grocery bills
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-emerald-700">Reduce Food Waste</h3>
              <p className="text-gray-600">
                Help reduce food waste by purchasing products that might otherwise be discarded
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-emerald-700">Support Local Stores</h3>
              <p className="text-gray-600">
                Support local Egyptian stores and help them reduce losses from expired products
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-emerald-700">Environmental Impact</h3>
              <p className="text-gray-600">
                Contribute to environmental sustainability by reducing food waste and its impact
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 text-white rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Join thousands of Egyptians who are saving money and reducing food waste with Edama
        </p>
        <Button asChild size="lg" variant="secondary">
          <Link href="/signup">Create an Account</Link>
        </Button>
      </section>
    </main>
  )
}
