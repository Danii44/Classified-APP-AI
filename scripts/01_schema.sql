-- NEXUSMARKET PRODUCTION DATABASE SCHEMA
-- Enterprise-grade classifieds platform with flexible category system
-- Supports: Properties, Cars, Electronics, Pets, Household, Jobs, Services
-- Features: EAV for category-specific attributes, Subscriptions, Wallet, Chat

-- ============================================================
-- 1. USERS & PROFILES
-- ============================================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  user_type TEXT CHECK (user_type IN ('individual', 'dealer')) DEFAULT 'individual',
  subscription_status TEXT DEFAULT 'free',
  subscription_plan TEXT DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  verified_email BOOLEAN DEFAULT FALSE,
  verified_phone BOOLEAN DEFAULT FALSE,
  kyc_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES users(id),
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  country TEXT DEFAULT 'AE',
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  total_ads_posted INTEGER DEFAULT 0,
  total_ads_sold INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 5.0,
  total_reviews INTEGER DEFAULT 0,
  response_rate DECIMAL(3, 2),
  response_time_hours INTEGER,
  website_url TEXT,
  social_instagram TEXT,
  social_whatsapp TEXT,
  last_active_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 2. SUBSCRIPTION PLANS
-- ============================================================

CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT UNIQUE NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('free', 'premium', 'premium_plus')) DEFAULT 'free',
  price DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'AED',
  max_ads INTEGER DEFAULT 10,
  max_featured_ads INTEGER DEFAULT 0,
  max_bump_ups_per_month INTEGER DEFAULT 0,
  featured_listing_price DECIMAL(10, 2),
  bump_up_price DECIMAL(10, 2),
  duration_days INTEGER DEFAULT 30,
  features JSONB,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id),
  balance DECIMAL(12, 2) DEFAULT 0,
  total_spent DECIMAL(12, 2) DEFAULT 0,
  total_earned DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'AED',
  last_updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES user_wallets(id),
  transaction_type TEXT CHECK (transaction_type IN ('credit', 'debit')),
  amount DECIMAL(12, 2),
  description TEXT,
  related_ad_id UUID,
  related_subscription_id UUID,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 3. CATEGORIES & ATTRIBUTES (EAV Model)
-- ============================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE,
  icon TEXT,
  description TEXT,
  parent_category_id UUID REFERENCES categories(id),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE category_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  attribute_name TEXT NOT NULL,
  attribute_type TEXT CHECK (attribute_type IN ('text', 'number', 'dropdown', 'multiselect', 'date', 'checkbox')),
  is_required BOOLEAN DEFAULT FALSE,
  dropdown_values JSONB,
  unit TEXT,
  min_value NUMERIC,
  max_value NUMERIC,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(category_id, attribute_name)
);

-- Sample Categories will be inserted via seed file

-- ============================================================
-- 4. ADS (LISTINGS)
-- ============================================================

CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2),
  currency TEXT DEFAULT 'AED',
  condition TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'used')),
  country TEXT DEFAULT 'AE',
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_featured BOOLEAN DEFAULT FALSE,
  featured_expires_at TIMESTAMP,
  bump_count INTEGER DEFAULT 0,
  last_bumped_at TIMESTAMP,
  status TEXT CHECK (status IN ('active', 'inactive', 'sold', 'pending', 'rejected')) DEFAULT 'pending',
  views_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  is_negotiable BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '60 days'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ad_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ad_attribute_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES category_attributes(id),
  value TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(ad_id, attribute_id)
);

-- ============================================================
-- 5. MESSAGING & CONVERSATIONS
-- ============================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES ads(id),
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES users(id),
  subject TEXT,
  status TEXT CHECK (status IN ('active', 'archived', 'blocked')) DEFAULT 'active',
  last_message_at TIMESTAMP DEFAULT NOW(),
  buyer_deleted_at TIMESTAMP,
  seller_deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 6. REVIEWS & RATINGS
-- ============================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewed_user_id UUID NOT NULL REFERENCES users(id),
  ad_id UUID NOT NULL REFERENCES ads(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  cleanliness_rating INTEGER,
  accuracy_rating INTEGER,
  communication_rating INTEGER,
  is_anonymous BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 7. FAVORITES / SAVED ADS
-- ============================================================

CREATE TABLE saved_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  ad_id UUID NOT NULL REFERENCES ads(id),
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, ad_id)
);

-- ============================================================
-- 8. REPORTS & MODERATION
-- ============================================================

CREATE TABLE ad_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id UUID NOT NULL REFERENCES ads(id),
  reported_by_user_id UUID NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'resolved')) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_user_id UUID NOT NULL REFERENCES users(id),
  reported_by_user_id UUID NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'resolved')) DEFAULT 'pending',
  admin_action TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 9. ADMIN & SETTINGS
-- ============================================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES users(id),
  role TEXT CHECK (role IN ('superadmin', 'moderator', 'support')) DEFAULT 'moderator',
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 10. COUNTRIES & CITIES
-- ============================================================

CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_name TEXT UNIQUE NOT NULL,
  country_code TEXT UNIQUE,
  flag_emoji TEXT,
  currency TEXT,
  currency_symbol TEXT,
  phone_code TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID NOT NULL REFERENCES countries(id),
  city_name TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(country_id, city_name)
);

-- ============================================================
-- INDEXING FOR PERFORMANCE
-- ============================================================

-- User queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_country_city ON users(country, city);
CREATE INDEX idx_user_profiles_location ON user_profiles(latitude, longitude);

-- Ad queries
CREATE INDEX idx_ads_user_id ON ads(user_id);
CREATE INDEX idx_ads_category_id ON ads(category_id);
CREATE INDEX idx_ads_status ON ads(status);
CREATE INDEX idx_ads_location ON ads(latitude, longitude);
CREATE INDEX idx_ads_created_at ON ads(created_at DESC);
CREATE INDEX idx_ads_featured ON ads(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_ads_expires_at ON ads(expires_at);

-- Search optimization
CREATE INDEX idx_ads_title_search ON ads USING GIN(to_tsvector('english', title));
CREATE INDEX idx_ads_description_search ON ads USING GIN(to_tsvector('english', description));

-- Attribute queries
CREATE INDEX idx_ad_attributes_ad_id ON ad_attribute_values(ad_id);
CREATE INDEX idx_ad_attributes_attribute_id ON ad_attribute_values(attribute_id);
CREATE INDEX idx_ad_attributes_value ON ad_attribute_values(value);

-- Messaging
CREATE INDEX idx_conversations_ad_id ON conversations(ad_id);
CREATE INDEX idx_conversations_buyer_seller ON conversations(buyer_id, seller_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_reviewed_user ON reviews(reviewed_user_id);
CREATE INDEX idx_reviews_ad_id ON reviews(ad_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Wallet
CREATE INDEX idx_wallet_user_id ON user_wallets(user_id);
CREATE INDEX idx_transactions_wallet_id ON wallet_transactions(wallet_id);

-- Saved
CREATE INDEX idx_saved_ads_user_id ON saved_ads(user_id);
CREATE INDEX idx_saved_ads_ad_id ON saved_ads(ad_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view public profiles
CREATE POLICY "users_select_public" ON users 
  FOR SELECT USING (true);

-- Users can edit own profile
CREATE POLICY "users_update_own" ON users 
  FOR UPDATE USING (auth.uid() = id);

-- Profiles visible to all
CREATE POLICY "profiles_select" ON user_profiles 
  FOR SELECT USING (true);

-- Users can edit own profile
CREATE POLICY "profiles_update_own" ON user_profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Active ads visible to all
CREATE POLICY "ads_select_active" ON ads 
  FOR SELECT USING (status IN ('active', 'sold'));

-- Users can create ads
CREATE POLICY "ads_insert" ON ads 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can edit own ads
CREATE POLICY "ads_update_own" ON ads 
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete own ads
CREATE POLICY "ads_delete_own" ON ads 
  FOR DELETE USING (auth.uid() = user_id);

-- Ad images visible with ad
CREATE POLICY "ad_images_select" ON ad_images 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM ads WHERE ads.id = ad_images.ad_id AND ads.status IN ('active', 'sold')
  ));

-- Conversations visible to participants
CREATE POLICY "conversations_select" ON conversations 
  FOR SELECT USING (auth.uid() IN (buyer_id, seller_id));

-- Messages visible to conversation participants
CREATE POLICY "messages_select" ON messages 
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE auth.uid() IN (buyer_id, seller_id)
    )
  );

-- Users can send messages in their conversations
CREATE POLICY "messages_insert" ON messages 
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM conversations WHERE auth.uid() IN (buyer_id, seller_id)
    )
  );

-- Reviews visible to all
CREATE POLICY "reviews_select" ON reviews 
  FOR SELECT USING (true);

-- Users can insert reviews
CREATE POLICY "reviews_insert" ON reviews 
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Saved ads visible to owner
CREATE POLICY "saved_ads_select" ON saved_ads 
  FOR SELECT USING (auth.uid() = user_id);

-- Users can manage own saved ads
CREATE POLICY "saved_ads_manage" ON saved_ads 
  FOR ALL USING (auth.uid() = user_id);

-- Wallet visible only to owner
CREATE POLICY "wallet_select_own" ON user_wallets 
  FOR SELECT USING (auth.uid() = user_id);

-- Transactions visible only to wallet owner
CREATE POLICY "transactions_select_own" ON wallet_transactions 
  FOR SELECT USING (
    wallet_id IN (
      SELECT id FROM user_wallets WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- STORED PROCEDURES & FUNCTIONS
-- ============================================================

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET total_ads_posted = (SELECT COUNT(*) FROM ads WHERE user_id = NEW.user_id AND status != 'rejected')
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_stats_on_ad
AFTER INSERT ON ads
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();

-- Function to handle ad expiry
CREATE OR REPLACE FUNCTION expire_old_ads()
RETURNS integer AS $$
DECLARE
  expired_count integer;
BEGIN
  UPDATE ads
  SET status = 'inactive'
  WHERE status = 'active' AND expires_at < NOW()
  AND id NOT IN (SELECT ad_id FROM conversations);
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql;

-- Function to process subscription upgrade
CREATE OR REPLACE FUNCTION upgrade_subscription(
  p_user_id UUID,
  p_plan_id UUID,
  p_amount DECIMAL
)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance DECIMAL;
  v_plan_name TEXT;
BEGIN
  -- Get wallet and current balance
  SELECT id, balance INTO v_wallet_id, v_current_balance
  FROM user_wallets
  WHERE user_id = p_user_id;

  -- Get plan name
  SELECT plan_name INTO v_plan_name
  FROM subscription_plans
  WHERE id = p_plan_id;

  -- Check balance
  IF v_current_balance < p_amount THEN
    RETURN QUERY SELECT false, 'Insufficient balance'::text;
    RETURN;
  END IF;

  -- Update user subscription
  UPDATE users
  SET subscription_plan = v_plan_name,
      subscription_status = 'active',
      subscription_expires_at = NOW() + INTERVAL '30 days'
  WHERE id = p_user_id;

  -- Deduct from wallet
  UPDATE user_wallets
  SET balance = balance - p_amount,
      total_spent = total_spent + p_amount
  WHERE id = v_wallet_id;

  -- Record transaction
  INSERT INTO wallet_transactions (wallet_id, transaction_type, amount, description, status)
  VALUES (v_wallet_id, 'debit', p_amount, 'Subscription upgrade: ' || v_plan_name, 'completed');

  RETURN QUERY SELECT true, 'Subscription upgraded successfully'::text;
END;
$$ LANGUAGE plpgsql;

-- Function for location-based search (PostGIS alternative using Haversine formula)
CREATE OR REPLACE FUNCTION search_ads_by_location(
  p_latitude DECIMAL,
  p_longitude DECIMAL,
  p_radius_km DECIMAL DEFAULT 10,
  p_category_id UUID DEFAULT NULL
)
RETURNS TABLE (
  ad_id UUID,
  title TEXT,
  price DECIMAL,
  distance_km NUMERIC,
  image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.price,
    ROUND(
      (6371 * 2 * ASIN(SQRT(
        SIN(RADIANS((p_latitude - a.latitude) / 2)) ^ 2 +
        COS(RADIANS(p_latitude)) * COS(RADIANS(a.latitude)) *
        SIN(RADIANS((p_longitude - a.longitude) / 2)) ^ 2
      )))::NUMERIC,
      2
    ) as distance_km,
    (SELECT image_url FROM ad_images WHERE ad_id = a.id ORDER BY image_order LIMIT 1)
  FROM ads a
  WHERE a.status = 'active'
    AND (p_category_id IS NULL OR a.category_id = p_category_id)
    AND (6371 * 2 * ASIN(SQRT(
      SIN(RADIANS((p_latitude - a.latitude) / 2)) ^ 2 +
      COS(RADIANS(p_latitude)) * COS(RADIANS(a.latitude)) *
      SIN(RADIANS((p_longitude - a.longitude) / 2)) ^ 2
    ))) <= p_radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- GRANTS & FINAL SETUP
-- ============================================================

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE conversations, messages, ads;
