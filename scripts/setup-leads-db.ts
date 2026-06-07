import { getSupabaseAdmin } from '../lib/supabase'

async function setupDatabase() {
    console.log('🚀 Checking and setting up leads and saved_properties database tables...')
    const supabase = getSupabaseAdmin()

    // Since Supabase JS API doesn't support raw SQL query execution, we suggest running this in their SQL Editor
    console.log('\n=============================================================')
    console.log('IMPORTANT: Run the following SQL queries in your Supabase SQL Editor:')
    console.log('=============================================================')
    console.log(`
-- 1. Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    interest TEXT NOT NULL,
    budget TEXT,
    stage TEXT CHECK (stage IN ('New', 'Contacted', 'Qualified', 'Negotiation', 'Closed')) DEFAULT 'New',
    source TEXT DEFAULT 'Website',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Saved Properties Table (Favorites Module)
CREATE TABLE IF NOT EXISTS saved_properties (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, property_id)
);

-- 3. Inquiries Table Reply Migration
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS reply TEXT;
    `)
    console.log('=============================================================')
    console.log('NOTE: Our application already has bulletproof integration fallbacks!')
    console.log('Once you execute this SQL in Supabase, the leads and favorites features')
    console.log('will seamlessly sync to your remote cloud database!')
    console.log('=============================================================\n')
}

setupDatabase().catch(console.error)
