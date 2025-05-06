"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export async function setupDatabase() {
  const supabase = createServerSupabaseClient()

  try {
    // Enable the pgcrypto extension for UUID generation
    const { error: extensionError } = await supabase.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `)

    if (extensionError) throw extensionError

    // Create users table
    const { error: usersError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        bio TEXT,
        avatar_url TEXT,
        account_type VARCHAR(20) NOT NULL DEFAULT 'consumer' CHECK (account_type IN ('consumer', 'supermarket')),
        join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        is_admin BOOLEAN DEFAULT FALSE
      );
    `)

    if (usersError) throw usersError

    // Create products table
    const { error: productsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        description_ar TEXT,
        original_price DECIMAL(10, 2) NOT NULL,
        discounted_price DECIMAL(10, 2) NOT NULL,
        discount INTEGER NOT NULL,
        image_url TEXT,
        supermarket VARCHAR(255),
        supermarket_ar VARCHAR(255),
        expiry_date DATE NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        featured BOOLEAN DEFAULT FALSE
      );
    `)

    if (productsError) throw productsError

    // Create orders table
    const { error: ordersError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'shipped', 'delivered', 'cancelled')),
        subtotal DECIMAL(10, 2) NOT NULL,
        shipping_cost DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        shipping_info JSONB NOT NULL,
        payment_info JSONB NOT NULL
      );
    `)

    if (ordersError) throw ordersError

    // Create order_items table
    const { error: orderItemsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        original_price DECIMAL(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        image_url TEXT,
        supermarket VARCHAR(255),
        expiry_date DATE
      );
    `)

    if (orderItemsError) throw orderItemsError

    // Create favorites table
    const { error: favoritesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      );
    `)

    if (favoritesError) throw favoritesError

    // Create reviews table
    const { error: reviewsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        comment_ar TEXT,
        date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `)

    if (reviewsError) throw reviewsError

    // Check if admin user already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", "admin@edama.com")
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    // Only create admin if it doesn't exist
    if (!existingAdmin) {
      // Insert admin user directly into our users table
      const { error: insertAdminError } = await supabase.from("users").insert({
        username: "Edama_Admin",
        email: "admin@edama.com",
        password: "hashed_password", // In a real app, you would hash this
        name: "Edama Administrator",
        account_type: "consumer",
        is_admin: true,
      })

      if (insertAdminError) throw insertAdminError
    }

    return { success: true, message: "Database setup completed successfully" }
  } catch (error) {
    console.error("Database setup error:", error)
    return { success: false, message: `Database setup failed: ${error.message}` }
  }
}
