export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          password: string
          name: string | null
          phone: string | null
          address: string | null
          bio: string | null
          avatar_url: string | null
          account_type: string
          join_date: string
          is_admin: boolean
        }
        Insert: {
          id?: string
          username: string
          email: string
          password: string
          name?: string | null
          phone?: string | null
          address?: string | null
          bio?: string | null
          avatar_url?: string | null
          account_type?: string
          join_date?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          username?: string
          email?: string
          password?: string
          name?: string | null
          phone?: string | null
          address?: string | null
          bio?: string | null
          avatar_url?: string | null
          account_type?: string
          join_date?: string
          is_admin?: boolean
        }
      }
      products: {
        Row: {
          id: string
          user_id: string
          name: string
          name_ar: string
          category: string
          description: string | null
          description_ar: string | null
          original_price: number
          discounted_price: number
          discount: number
          image_url: string | null
          supermarket: string | null
          supermarket_ar: string | null
          expiry_date: string
          quantity: number
          status: string
          created_at: string
          featured: boolean
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          name_ar: string
          category: string
          description?: string | null
          description_ar?: string | null
          original_price: number
          discounted_price: number
          discount: number
          image_url?: string | null
          supermarket?: string | null
          supermarket_ar?: string | null
          expiry_date: string
          quantity?: number
          status?: string
          created_at?: string
          featured?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          name_ar?: string
          category?: string
          description?: string | null
          description_ar?: string | null
          original_price?: number
          discounted_price?: number
          discount?: number
          image_url?: string | null
          supermarket?: string | null
          supermarket_ar?: string | null
          expiry_date?: string
          quantity?: number
          status?: string
          created_at?: string
          featured?: boolean
        }
      }
    }
  }
}
