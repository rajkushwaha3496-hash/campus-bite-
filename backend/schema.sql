-- ====================================================================
-- CampusBite - Supabase PostgreSQL Schema & Migrations
-- Developed by #TEAMSQUAD
-- "Your Campus. Your Food. Your Way."
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin', 'kitchen', 'delivery');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_fulfillment_type AS ENUM ('pickup', 'delivery');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM ('placed', 'accepted', 'preparing', 'ready', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('UPI', 'Wallet', 'Cash', 'Razorpay');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role DEFAULT 'student',
    phone_number TEXT,
    student_id_number TEXT UNIQUE,
    wallet_balance NUMERIC(10, 2) DEFAULT 300.00 CHECK (wallet_balance >= 0),
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    batch_year TEXT,
    default_hostel_block TEXT,
    emergency_contact TEXT,
    dietary_preference TEXT DEFAULT 'All',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HOSTEL ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.hostel_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    label TEXT NOT NULL, -- e.g. "My Room", "Study Room"
    hostel_name TEXT NOT NULL,
    building_name TEXT NOT NULL,
    block TEXT NOT NULL,
    floor_number TEXT NOT NULL,
    room_number TEXT NOT NULL,
    student_phone_number TEXT NOT NULL,
    delivery_instructions TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FOOD CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.food_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_order INT DEFAULT 0,
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. FOOD ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2),
    is_veg BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 2) DEFAULT 4.80,
    rating_count INT DEFAULT 1,
    prep_time_minutes INT DEFAULT 10,
    description TEXT,
    image_url TEXT,
    is_special BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT TRUE,
    calories INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CUSTOMIZATION OPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.customization_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE,
    option_type TEXT NOT NULL, -- 'spice_level', 'extra_topping', 'removable_ingredient'
    name TEXT NOT NULL,
    price_delta NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CART TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE,
    quantity INT DEFAULT 1 CHECK (quantity > 0),
    customization JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DELIVERY SLOTS TABLE
CREATE TABLE IF NOT EXISTS public.delivery_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    time_window TEXT NOT NULL,
    slot_type TEXT NOT NULL, -- 'Lunch', 'Snacks', 'Dinner', 'Night Canteen'
    max_capacity INT DEFAULT 35,
    booked_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DELIVERY PARTNERS TABLE
CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    phone TEXT NOT NULL,
    active_orders_count INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 4.90,
    status TEXT DEFAULT 'Available',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    type order_fulfillment_type NOT NULL,
    status order_status_type DEFAULT 'placed',
    item_total NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 0.00,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    promo_code_applied TEXT,
    final_amount NUMERIC(10, 2) NOT NULL,
    student_name TEXT NOT NULL,
    student_phone TEXT NOT NULL,
    student_id TEXT NOT NULL,
    
    -- Hostel Delivery fields
    hostel_address_id UUID REFERENCES public.hostel_addresses(id) ON DELETE SET NULL,
    delivery_slot TEXT,
    delivery_partner_id UUID REFERENCES public.delivery_partners(id) ON DELETE SET NULL,
    delivery_pin TEXT,
    
    -- Pickup fields
    pickup_slot TEXT,
    pickup_counter TEXT,
    pickup_qr_code TEXT,
    
    -- Tracking timestamps
    estimated_time TEXT,
    accepted_at TIMESTAMPTZ,
    prepared_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    -- Payment
    payment_method payment_method_type NOT NULL,
    payment_status TEXT DEFAULT 'Paid',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES public.food_items(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    is_veg BOOLEAN DEFAULT TRUE,
    customization JSONB DEFAULT '{}'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- 14. PAYMENTS TABLE (Razorpay & Wallet)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    gateway TEXT DEFAULT 'Razorpay',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'captured',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostel_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile; admins can read all
CREATE POLICY users_self_policy ON public.users
    FOR ALL
    USING (auth.uid() = id OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Students can manage only their own hostel addresses
CREATE POLICY addresses_owner_policy ON public.hostel_addresses
    FOR ALL
    USING (auth.uid() = user_id);

-- Students can read/write their own cart
CREATE POLICY cart_owner_policy ON public.cart_items
    FOR ALL
    USING (auth.uid() = user_id);

-- Students see their own orders; Kitchen and Delivery partners see active orders
CREATE POLICY orders_access_policy ON public.orders
    FOR ALL
    USING (
        auth.uid() = user_id 
        OR (SELECT role FROM public.users WHERE id = auth.uid()) IN ('admin', 'kitchen', 'delivery')
    );

-- Food menu is publicly readable by everyone
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY food_items_read_all ON public.food_items
    FOR SELECT USING (true);
CREATE POLICY food_items_admin_write ON public.food_items
    FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- ====================================================================
-- SEED DATA (CampusBite Initial Catalog)
-- ====================================================================
INSERT INTO public.food_categories (name, display_order) VALUES
('Breakfast', 1),
('Lunch', 2),
('Snacks', 3),
('Fast Food', 4),
('Beverages', 5),
('Desserts', 6),
('Combos', 7)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.delivery_slots (time_window, slot_type, max_capacity, booked_count, is_active) VALUES
('12:30 PM - 01:00 PM', 'Lunch', 35, 18, true),
('01:15 PM - 01:45 PM', 'Lunch', 35, 29, true),
('04:45 PM - 05:15 PM', 'Snacks', 40, 12, true),
('08:00 PM - 08:30 PM', 'Dinner', 30, 22, true),
('10:30 PM - 11:00 PM', 'Night Canteen', 50, 38, true)
ON CONFLICT DO NOTHING;
