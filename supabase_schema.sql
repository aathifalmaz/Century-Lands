-- Century Lands Backend Schema
-- Execute this in the Supabase SQL Editor

-- 1. Agents Table
CREATE TABLE agents (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT DEFAULT 'Century Lands & Homes',
    phone TEXT,
    email TEXT UNIQUE,
    whatsapp TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Properties Table
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    location TEXT,
    address TEXT,
    price TEXT,
    price_per_sqft TEXT,
    status TEXT CHECK (status IN ('Available', 'Under Offer', 'Sold', 'For Sale', 'For Rent')),
    beds INTEGER,
    baths INTEGER,
    size TEXT,
    land_size TEXT,
    parking INTEGER,
    year_built INTEGER,
    property_type TEXT,
    listing_id TEXT UNIQUE,
    furnishing TEXT,
    ownership TEXT,
    description TEXT,
    coordinates_lat DOUBLE PRECISION,
    coordinates_lng DOUBLE PRECISION,
    agent_id INTEGER REFERENCES agents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Property Images
CREATE TABLE property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Amenities
CREATE TABLE property_amenities (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    amenity TEXT NOT NULL
);

-- 5. Nearby Places
CREATE TABLE nearby_places (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    distance TEXT,
    type TEXT
);

-- 6. Inquiries
CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    property_title TEXT,
    message TEXT NOT NULL,
    reply TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    property_id TEXT,
    property_title TEXT,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    agent_name TEXT,
    agent_phone TEXT,
    appointment_date DATE,
    appointment_time TIME,
    status TEXT DEFAULT 'Pending',
    type TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Sales Records (Accounts Module)
CREATE TABLE sales_records (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    title TEXT,
    original_price TEXT,
    sold_price NUMERIC,
    commission_percentage NUMERIC,
    commission_amount NUMERIC,
    sale_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Property Views Tracking
CREATE TABLE property_views (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Optional but recommended)
-- ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
-- ... and so on ...

-- 10. Saved Properties (Favorites Module)
CREATE TABLE IF NOT EXISTS saved_properties (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, property_id)
);

-- Migration for existing databases
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS reply TEXT;

-- 11. User Verification Documents
CREATE TABLE IF NOT EXISTS user_documents (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    size TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

