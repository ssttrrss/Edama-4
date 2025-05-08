// Authentication utilities and storage

// User types
export interface User {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  accountType: "buyer" | "seller"
  phone?: string
  address?: string
  joinDate: string
  avatar?: string
  bio?: string
  // Seller-specific fields
  storeName?: string
  storeNameAr?: string
  storeDescription?: string
  storeDescriptionAr?: string
  storeLocation?: string
  storeLocationAr?: string
  storePhone?: string
  storeEmail?: string
  storeWebsite?: string
  storeLogo?: string
  storeCoverImage?: string
}

// Sample users for testing
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "Password123",
    accountType: "buyer",
    phone: "+20 123 456 7890",
    address: "Cairo, Egypt",
    joinDate: new Date().toISOString(),
    bio: "Eco-conscious shopper passionate about reducing food waste.",
  },
  {
    id: "2",
    name: "Fresh Market",
    email: "store@example.com",
    password: "Password123",
    accountType: "seller",
    phone: "+20 123 456 7890",
    address: "Alexandria, Egypt",
    joinDate: new Date().toISOString(),
    storeName: "Fresh Market",
    storeNameAr: "سوق الطازج",
    storeDescription: "Quality products at affordable prices.",
    storeDescriptionAr: "منتجات ذات جودة عالية بأسعار معقولة.",
    storeLocation: "Alexandria, Egypt",
    storeLocationAr: "الإسكندرية، مصر",
    storePhone: "+20 123 456 7890",
    storeEmail: "store@example.com",
  },
]

// Initialize users in localStorage if not already present
export const initializeUsers = (): void => {
  if (typeof window === "undefined") return

  const storedUsers = localStorage.getItem("edama-users")
  if (!storedUsers) {
    localStorage.setItem("edama-users", JSON.stringify(sampleUsers))
  }
}

// Get all users
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []

  const storedUsers = localStorage.getItem("edama-users")
  return storedUsers ? JSON.parse(storedUsers) : []
}

// Register a new user
export const registerUser = (userData: Omit<User, "id" | "joinDate">): User => {
  const users = getUsers()

  // Check if email already exists
  const existingUser = users.find((user) => user.email === userData.email)
  if (existingUser) {
    throw new Error("Email already registered")
  }

  // Create new user
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    joinDate: new Date().toISOString(),
  }

  // Save to localStorage
  localStorage.setItem("edama-users", JSON.stringify([...users, newUser]))

  return newUser
}

// Login user
export const loginUser = (email: string, password: string): User => {
  const users = getUsers()

  // Find user by email
  const user = users.find((user) => user.email === email)
  if (!user) {
    throw new Error("User not found")
  }

  // Check password
  if (user.password !== password) {
    throw new Error("Invalid password")
  }

  // Store current user in localStorage (simulating a session)
  const { password: _, ...userWithoutPassword } = user
  localStorage.setItem("edama-user", JSON.stringify(userWithoutPassword))

  return user
}

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false

  return !!localStorage.getItem("edama-user")
}

// Get current user
export const getCurrentUser = (): Omit<User, "password"> | null => {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem("edama-user")
  return user ? JSON.parse(user) : null
}

// Logout user
export const logoutUser = (): void => {
  if (typeof window === "undefined") return

  localStorage.removeItem("edama-user")
}

// Update user profile
export const updateUserProfile = (userData: Partial<User>): Omit<User, "password"> => {
  const users = getUsers()
  const currentUser = getCurrentUser()

  if (!currentUser) {
    throw new Error("No user logged in")
  }

  // Find and update user
  const updatedUsers = users.map((user) => {
    if (user.id === currentUser.id) {
      return { ...user, ...userData }
    }
    return user
  })

  // Save updated users
  localStorage.setItem("edama-users", JSON.stringify(updatedUsers))

  // Update current user
  const updatedUser = { ...currentUser, ...userData }
  localStorage.setItem("edama-user", JSON.stringify(updatedUser))

  return updatedUser
}
