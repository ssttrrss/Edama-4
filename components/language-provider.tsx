"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "ar" | "en"

type Translations = {
  [key: string]: {
    ar: string
    en: string
  }
}

// Translation dictionary
const translations: Translations = {
  // Welcome page
  welcomeTitle: {
    ar: "إدامة",
    en: "Edama",
  },
  welcomeDescription: {
    ar: "منصة تربط بين المتاجر التي لديها منتجات قاربت على انتهاء الصلاحية والمستهلكين المهتمين بالبيئة، مما يساعد على تقليل هدر الطعام وتعزيز الاستهلاك المسؤول بأسعار مخفضة.",
    en: "A platform connecting stores with near-expiry products to eco-conscious consumers, helping reduce food waste and promoting responsible consumption at discounted prices.",
  },
  login: {
    ar: "تسجيل الدخول",
    en: "Login",
  },
  loginAr: {
    ar: "تسجيل الدخول",
    en: "تسجيل الدخول",
  },
  signup: {
    ar: "إنشاء حساب",
    en: "Sign Up",
  },
  signupAr: {
    ar: "إنشاء حساب",
    en: "إنشاء حساب",
  },
  exploreProducts: {
    ar: "استكشف المنتجات",
    en: "Explore Products",
  },
  // Feature cards
  feature1Title: {
    ar: "وفر المال",
    en: "Save Money",
  },
  feature1Description: {
    ar: "احصل على خصومات تصل إلى 50% على المنتجات عالية الجودة",
    en: "Get discounts up to 50% on high-quality products",
  },
  feature2Title: {
    ar: "قلل الهدر",
    en: "Reduce Waste",
  },
  feature2Description: {
    ar: "ساعد في تقليل هدر الطعام من خلال شراء المنتجات قبل انتهاء صلاحيتها",
    en: "Help reduce food waste by purchasing products before they expire",
  },
  feature3Title: {
    ar: "حافظ على البيئة",
    en: "Protect Environment",
  },
  feature3Description: {
    ar: "كل عملية شراء تساهم في تقليل البصمة الكربونية",
    en: "Every purchase contributes to reducing carbon footprint",
  },
  // Login page
  loginTitle: {
    ar: "تسجيل الدخول",
    en: "Login",
  },
  loginDescription: {
    ar: "أدخل بياناتك للوصول إلى حسابك",
    en: "Enter your credentials to access your account",
  },
  email: {
    ar: "البريد الإلكتروني",
    en: "Email",
  },
  emailPlaceholder: {
    ar: "أدخل بريدك الإلكتروني",
    en: "Enter your email",
  },
  password: {
    ar: "كلمة المرور",
    en: "Password",
  },
  passwordPlaceholder: {
    ar: "أدخل كلمة المرور",
    en: "Enter your password",
  },
  forgotPassword: {
    ar: "نسيت كلمة المرور؟",
    en: "Forgot password?",
  },
  dontHaveAccount: {
    ar: "ليس لديك حساب؟",
    en: "Don't have an account?",
  },
  createAccount: {
    ar: "إنشاء حساب",
    en: "Create account",
  },
  loggingIn: {
    ar: "جاري تسجيل الدخول...",
    en: "Logging in...",
  },
  // Signup page
  signupTitle: {
    ar: "إنشاء حساب",
    en: "Sign Up",
  },
  signupDescription: {
    ar: "أنشئ حسابك للوصول إلى عروض إدامة",
    en: "Create your account to access Edama offers",
  },
  fullName: {
    ar: "الاسم الكامل",
    en: "Full Name",
  },
  fullNamePlaceholder: {
    ar: "أدخل اسمك الكامل",
    en: "Enter your full name",
  },
  confirmPassword: {
    ar: "تأكيد كلمة المرور",
    en: "Confirm Password",
  },
  confirmPasswordPlaceholder: {
    ar: "أدخل كلمة المرور مرة أخرى",
    en: "Enter your password again",
  },
  passwordMinLength: {
    ar: "٨ أحرف على الأقل",
    en: "At least 8 characters",
  },
  passwordUppercase: {
    ar: "حرف كبير واحد على الأقل",
    en: "At least one uppercase letter",
  },
  passwordNumber: {
    ar: "رقم واحد على الأقل",
    en: "At least one number",
  },
  passwordsMatch: {
    ar: "كلمات المرور متطابقة",
    en: "Passwords match",
  },
  passwordsDontMatch: {
    ar: "كلمات المرور غير متطابقة",
    en: "Passwords don't match",
  },
  creatingAccount: {
    ar: "جاري إنشاء الحساب...",
    en: "Creating account...",
  },
  alreadyHaveAccount: {
    ar: "لديك حساب بالفعل؟",
    en: "Already have an account?",
  },
  // Home page
  searchProducts: {
    ar: "ابحث عن منتجات...",
    en: "Search products...",
  },
  filters: {
    ar: "الفلاتر",
    en: "Filters",
  },
  categories: {
    ar: "الفئات",
    en: "Categories",
  },
  allCategories: {
    ar: "جميع الفئات",
    en: "All Categories",
  },
  priceRange: {
    ar: "نطاق السعر",
    en: "Price Range",
  },
  currency: {
    ar: "ج.م",
    en: "LE",
  },
  expiryDate: {
    ar: "تاريخ انتهاء الصلاحية",
    en: "Expiry Date",
  },
  soonest: {
    ar: "الأقرب",
    en: "Soonest",
  },
  latest: {
    ar: "الأبعد",
    en: "Latest",
  },
  reset: {
    ar: "إعادة ضبط",
    en: "Reset",
  },
  apply: {
    ar: "تطبيق",
    en: "Apply",
  },
  featured: {
    ar: "مميز",
    en: "Featured",
  },
  off: {
    ar: "خصم",
    en: "off",
  },
  viewProduct: {
    ar: "عرض المنتج",
    en: "View Product",
  },
  noProductsFound: {
    ar: "لم يتم العثور على منتجات",
    en: "No products found",
  },
  tryDifferentSearch: {
    ar: "جرب بحثًا مختلفًا أو قم بتعديل الفلاتر",
    en: "Try a different search or adjust your filters",
  },
  resetFilters: {
    ar: "إعادة ضبط الفلاتر",
    en: "Reset Filters",
  },
  // Header & Footer
  home: {
    ar: "الرئيسية",
    en: "Home",
  },
  about: {
    ar: "عن إدامة",
    en: "About",
  },
  contact: {
    ar: "اتصل بنا",
    en: "Contact",
  },
  profile: {
    ar: "الملف الشخصي",
    en: "Profile",
  },
  profileAr: {
    ar: "الملف الشخصي",
    en: "الملف الشخصي",
  },
  cart: {
    ar: "السلة",
    en: "Cart",
  },
  cartAr: {
    ar: "السلة",
    en: "السلة",
  },
  language: {
    ar: "English",
    en: "العربية",
  },
  back: {
    ar: "رجوع",
    en: "Back",
  },
  // Product details
  addToCart: {
    ar: "أضف إلى السلة",
    en: "Add to Cart",
  },
  quantity: {
    ar: "الكمية",
    en: "Quantity",
  },
  originalPrice: {
    ar: "السعر الأصلي",
    en: "Original Price",
  },
  discountedPrice: {
    ar: "السعر بعد الخصم",
    en: "Discounted Price",
  },
  expiresOn: {
    ar: "ينتهي في",
    en: "Expires on",
  },
  soldBy: {
    ar: "يباع بواسطة",
    en: "Sold by",
  },
  description: {
    ar: "الوصف",
    en: "Description",
  },
  similarProducts: {
    ar: "منتجات مشابهة",
    en: "Similar Products",
  },
  addedToCart: {
    ar: "تمت الإضافة إلى السلة",
    en: "Added to cart",
  },
  // Cart & Checkout
  yourCart: {
    ar: "سلة التسوق",
    en: "Your Cart",
  },
  emptyCart: {
    ar: "سلة التسوق فارغة",
    en: "Your cart is empty",
  },
  startShopping: {
    ar: "ابدأ التسوق",
    en: "Start Shopping",
  },
  subtotal: {
    ar: "المجموع الفرعي",
    en: "Subtotal",
  },
  shipping: {
    ar: "الشحن",
    en: "Shipping",
  },
  total: {
    ar: "الإجمالي",
    en: "Total",
  },
  checkout: {
    ar: "إتمام الشراء",
    en: "Checkout",
  },
  continueShopping: {
    ar: "مواصلة التسوق",
    en: "Continue Shopping",
  },
  // Profile
  myProfile: {
    ar: "ملفي الشخصي",
    en: "My Profile",
  },
  myOrders: {
    ar: "طلباتي",
    en: "My Orders",
  },
  favorites: {
    ar: "المفضلة",
    en: "Favorites",
  },
  favoritesAr: {
    ar: "المفضلة",
    en: "المفضلة",
  },
  settings: {
    ar: "الإعدادات",
    en: "Settings",
  },
  logout: {
    ar: "تسجيل الخروج",
    en: "Logout",
  },
  logoutAr: {
    ar: "تسجيل الخروج",
    en: "تسجيل الخروج",
  },
  // Footer
  rights: {
    ar: "جميع الحقوق محفوظة",
    en: "All rights reserved",
  },
  termsAndConditions: {
    ar: "الشروط والأحكام",
    en: "Terms & Conditions",
  },
  privacyPolicy: {
    ar: "سياسة الخصوصية",
    en: "Privacy Policy",
  },
  // Misc
  showPassword: {
    ar: "إظهار كلمة المرور",
    en: "Show password",
  },
  hidePassword: {
    ar: "إخفاء كلمة المرور",
    en: "Hide password",
  },
  // Account types
  buyer: {
    ar: "مشتري",
    en: "Buyer",
  },
  seller: {
    ar: "بائع",
    en: "Seller",
  },
  buyerAccountDescription: {
    ar: "حساب للمستخدمين الذين يرغبون في شراء المنتجات",
    en: "Account for users who want to purchase products",
  },
  sellerAccountDescription: {
    ar: "حساب للمتاجر والبائعين الذين يرغبون في بيع المنتجات",
    en: "Account for stores and sellers who want to sell products",
  },

  // Countdown timer
  expired: {
    ar: "منتهي الصلاحية",
    en: "Expired",
  },
  expiresIn: {
    ar: "ينتهي في",
    en: "Expires in",
  },

  // Seller information
  sellerInformation: {
    ar: "معلومات البائع",
    en: "Seller Information",
  },
  shopAddress: {
    ar: "عنوان المتجر",
    en: "Shop Address",
  },
  shopAddressPlaceholder: {
    ar: "أدخل عنوان المتجر",
    en: "Enter shop address",
  },
  contactMethod: {
    ar: "طريقة التواصل",
    en: "Contact Method",
  },
  whatsapp: {
    ar: "واتساب",
    en: "WhatsApp",
  },
  contactPhonePlaceholder: {
    ar: "أدخل رقم الهاتف للتواصل",
    en: "Enter contact phone number",
  },
  contactWhatsappPlaceholder: {
    ar: "أدخل رقم الواتساب للتواصل",
    en: "Enter WhatsApp number",
  },
  contactViaWhatsapp: {
    ar: "تواصل عبر واتساب",
    en: "Contact via WhatsApp",
  },
  // Burger menu
  menu: {
    ar: "القائمة",
    en: "Menu",
  },
  orders: {
    ar: "الطلبات",
    en: "Orders",
  },
  ordersAr: {
    ar: "الطلبات",
    en: "الطلبات",
  },
  pickupInfo: {
    ar: "معلومات الاستلام",
    en: "Pickup Information",
  },
  enterPickupDetails: {
    ar: "أدخل تفاصيل الاستلام",
    en: "Enter your pickup details",
  },
  pickupNotes: {
    ar: "ملاحظات الاستلام",
    en: "Pickup Notes",
  },
  pickupNotesPlaceholder: {
    ar: "أي تعليمات خاصة للاستلام",
    en: "Any special instructions for pickup",
  },
  cashOnPickup: {
    ar: "الدفع عند الاستلام",
    en: "Cash on Pickup",
  },
  estimatedPickup: {
    ar: "الاستلام المتوقع",
    en: "Estimated Pickup",
  },
  sendSMS: {
    ar: "إرسال رسالة نصية",
    en: "Send SMS",
  },
  sendEmail: {
    ar: "إرسال بريد إلكتروني",
    en: "Send Email",
  },
  locationType: {
    ar: "نوع الموقع",
    en: "Location Type",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  dir: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [language, setLanguage] = useState<Language>("ar")
  const [dir, setDir] = useState<string>("rtl")

  useEffect(() => {
    // Update document direction based on language
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    setDir(language === "ar" ? "rtl" : "ltr")
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language]
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>{children}</LanguageContext.Provider>
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider")
  }
  return context
}
