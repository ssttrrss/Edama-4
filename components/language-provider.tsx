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
  sustainabilityPlatform: {
    ar: "منصة الاستدامة",
    en: "Sustainability Platform",
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
  searchFavorites: {
    ar: "ابحث في المفضلة...",
    en: "Search favorites...",
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
  productDetails: {
    ar: "تفاصيل المنتج",
    en: "Product Details",
  },
  ingredients: {
    ar: "المكونات",
    en: "Ingredients",
  },
  nutritionalInfo: {
    ar: "المعلومات الغذائية",
    en: "Nutritional Information",
  },
  storageInstructions: {
    ar: "تعليمات التخزين",
    en: "Storage Instructions",
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
  favoritesDescription: {
    ar: "المنتجات التي أضفتها إلى المفضلة",
    en: "Products you've added to your favorites",
  },
  noFavorites: {
    ar: "لا توجد منتجات في المفضلة",
    en: "No favorite products yet",
  },
  noFavoritesDescription: {
    ar: "أضف منتجات إلى المفضلة لتظهر هنا",
    en: "Add products to your favorites to see them here",
  },
  noMatchingFavorites: {
    ar: "لا توجد منتجات مطابقة لبحثك",
    en: "No products match your search",
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
  days: {
    ar: "أيام",
    en: "days",
  },
  hours: {
    ar: "ساعات",
    en: "hours",
  },
  minutes: {
    ar: "دقائق",
    en: "minutes",
  },
  seconds: {
    ar: "ثواني",
    en: "seconds",
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
  contactUs: {
    ar: "اتصل بنا",
    en: "Contact Us",
  },
  phone: {
    ar: "الهاتف",
    en: "Phone",
  },
  email: {
    ar: "البريد الإلكتروني",
    en: "Email",
  },
  pickupAtStore: {
    ar: "الاستلام من المتجر",
    en: "Pickup at store",
  },
  notProvided: {
    ar: "غير متوفر",
    en: "Not provided",
  },
  readyForPickup: {
    ar: "جاهز للاستلام",
    en: "Ready for pickup",
  },
  completed: {
    ar: "مكتمل",
    en: "Completed",
  },
  // Profile page
  welcomeBack: {
    ar: "مرحبًا بعودتك",
    en: "Welcome Back",
  },
  profileDashboardDescription: {
    ar: "إدارة حسابك وتتبع طلباتك ومفضلاتك",
    en: "Manage your account, track orders, and favorites",
  },
  memberSince: {
    ar: "عضو منذ",
    en: "Member since",
  },
  editProfile: {
    ar: "تعديل الملف الشخصي",
    en: "Edit Profile",
  },
  saveChanges: {
    ar: "حفظ التغييرات",
    en: "Save Changes",
  },
  profileUpdated: {
    ar: "تم تحديث الملف الشخصي",
    en: "Profile Updated",
  },
  profileUpdatedDescription: {
    ar: "تم تحديث معلومات ملفك الشخصي بنجاح",
    en: "Your profile information has been updated successfully",
  },
  updateError: {
    ar: "خطأ في التحديث",
    en: "Update Error",
  },
  updateErrorDescription: {
    ar: "حدث خطأ أثناء تحديث ملفك الشخصي. يرجى المحاولة مرة أخرى",
    en: "An error occurred while updating your profile. Please try again",
  },
  itemRemoved: {
    ar: "تمت إزالة العنصر",
    en: "Item Removed",
  },
  itemRemovedFromFavorites: {
    ar: "تمت إزالة العنصر من المفضلة",
    en: "Item removed from favorites",
  },
  storeRemoved: {
    ar: "تمت إزالة المتجر",
    en: "Store Removed",
  },
  storeRemovedFromFavorites: {
    ar: "تمت إزالة المتجر من المفضلة",
    en: "Store removed from favorites",
  },
  productAdded: {
    ar: "تمت إضافة المنتج",
    en: "Product Added",
  },
  productAddedDescription: {
    ar: "تمت إضافة المنتج بنجاح",
    en: "Product has been added successfully",
  },
  productDeleted: {
    ar: "تم حذف المنتج",
    en: "Product Deleted",
  },
  productDeletedDescription: {
    ar: "تم حذف المنتج بنجاح",
    en: "Product has been deleted successfully",
  },
  productUpdated: {
    ar: "تم تحديث المنتج",
    en: "Product Updated",
  },
  productVisibilityUpdated: {
    ar: "تم تحديث حالة ظهور المنتج",
    en: "Product visibility has been updated",
  },
  profileCompletion: {
    ar: "اكتمال الملف الشخصي",
    en: "Profile Completion",
  },
  almostThere: {
    ar: "أنت على وشك الانتهاء",
    en: "Almost there",
  },
  excellent: {
    ar: "ممتاز",
    en: "Excellent",
  },
  completionTips: {
    ar: "نصائح لإكمال الملف الشخصي",
    en: "Completion Tips",
  },
  dismiss: {
    ar: "تجاهل",
    en: "Dismiss",
  },
  addProfilePicture: {
    ar: "أضف صورة ملفك الشخصي",
    en: "Add your profile picture",
  },
  completeContactInfo: {
    ar: "أكمل معلومات الاتصال الخاصة بك",
    en: "Complete your contact information",
  },
  writeBio: {
    ar: "اكتب نبذة عنك",
    en: "Write a bio about yourself",
  },
  leaveReview: {
    ar: "اترك تقييمًا للمنتجات التي اشتريتها",
    en: "Leave a review for products you've purchased",
  },
  foodSaved: {
    ar: "الطعام المحفوظ",
    en: "Food Saved",
  },
  co2Reduced: {
    ar: "ثاني أكسيد الكربون المخفض",
    en: "CO₂ Reduced",
  },
  moneySaved: {
    ar: "المال الموفر",
    en: "Money Saved",
  },
  overview: {
    ar: "نظرة عامة",
    en: "Overview",
  },
  reviews: {
    ar: "التقييمات",
    en: "Reviews",
  },
  savedStores: {
    ar: "المتاجر المحفوظة",
    en: "Saved Stores",
  },
  myProducts: {
    ar: "منتجاتي",
    en: "My Products",
  },
  analytics: {
    ar: "التحليلات",
    en: "Analytics",
  },
  storeSettings: {
    ar: "إعدادات المتجر",
    en: "Store Settings",
  },
  notifications: {
    ar: "الإشعارات",
    en: "Notifications",
  },
  productExpiringSoon: {
    ar: "منتج على وشك انتهاء الصلاحية",
    en: "Product Expiring Soon",
  },
  productExpiringDescription: {
    ar: "لديك منتج سينتهي خلال 24 ساعة. تحقق منه الآن!",
    en: "You have a product expiring within 24 hours. Check it now!",
  },
  orderReady: {
    ar: "طلبك جاهز",
    en: "Your Order is Ready",
  },
  orderReadyDescription: {
    ar: "طلبك جاهز للاستلام من المتجر",
    en: "Your order is ready for pickup from the store",
  },
  hoursAgo: {
    ar: "ساعات مضت",
    en: "hours ago",
  },
  viewAllNotifications: {
    ar: "عرض جميع الإشعارات",
    en: "View All Notifications",
  },
  account: {
    ar: "الحساب",
    en: "Account",
  },
  processing: {
    ar: "قيد المعالجة",
    en: "Processing",
  },
  cancelled: {
    ar: "ملغي",
    en: "Cancelled",
  },
  productViews: {
    ar: "مشاهدات المنتج",
    en: "Product Views",
  },
  productSaves: {
    ar: "حفظ المنتج",
    en: "Product Saves",
  },
  completedOrders: {
    ar: "الطلبات المكتملة",
    en: "Completed Orders",
  },
  totalRevenue: {
    ar: "إجمالي الإيرادات",
    en: "Total Revenue",
  },
  achievements: {
    ar: "الإنجازات",
    en: "Achievements",
  },
  ecoImpact: {
    ar: "التأثير البيئي",
    en: "Eco Impact",
  },
  personalInfo: {
    ar: "المعلومات الشخصية",
    en: "Personal Information",
  },
  accountSettings: {
    ar: "إعدادات الحساب",
    en: "Account Settings",
  },
  notificationsSettings: {
    ar: "إعدادات الإشعارات",
    en: "Notification Settings",
  },
  privacySettings: {
    ar: "إعدادات الخصوصية",
    en: "Privacy Settings",
  },
  deleteAccount: {
    ar: "حذف الحساب",
    en: "Delete Account",
  },
  deleteAccountWarning: {
    ar: "هذا الإجراء لا يمكن التراجع عنه. سيؤدي إلى حذف حسابك وجميع بياناتك نهائيًا.",
    en: "This action cannot be undone. It will permanently delete your account and all your data.",
  },
  confirmDelete: {
    ar: "تأكيد الحذف",
    en: "Confirm Delete",
  },
  cancel: {
    ar: "إلغاء",
    en: "Cancel",
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

// Add the useLanguage export as an alias for useTranslation
// Add this right after the useTranslation export function

export function useLanguage() {
  return useTranslation()
}
