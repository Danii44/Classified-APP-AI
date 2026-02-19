-- NEXUSMARKET SEED DATA
-- Insert countries, categories, attributes, and subscription plans

-- ============================================================
-- COUNTRIES
-- ============================================================

INSERT INTO countries (country_name, country_code, flag_emoji, currency, currency_symbol, phone_code, display_order)
VALUES
  ('United Arab Emirates', 'AE', '🇦🇪', 'AED', 'د.إ', '+971', 1),
  ('Saudi Arabia', 'SA', '🇸🇦', 'SAR', 'ر.س', '+966', 2),
  ('Kuwait', 'KW', '🇰🇼', 'KWD', 'د.ك', '+965', 3),
  ('Qatar', 'QA', '🇶🇦', 'QAR', 'ر.ق', '+974', 4),
  ('Bahrain', 'BH', '🇧🇭', 'BHD', 'د.ب', '+973', 5),
  ('Oman', 'OM', '🇴🇲', 'OMR', 'ر.ع.', '+968', 6),
  ('Egypt', 'EG', '🇪🇬', 'EGP', '£', '+20', 7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CITIES (UAE)
-- ============================================================

INSERT INTO cities (country_id, city_name, latitude, longitude)
VALUES
  ((SELECT id FROM countries WHERE country_code = 'AE'), 'Dubai', 25.2048, 55.2708),
  ((SELECT id FROM countries WHERE country_code = 'AE'), 'Abu Dhabi', 24.4539, 54.3773),
  ((SELECT id FROM countries WHERE country_code = 'AE'), 'Sharjah', 25.3571, 55.3986),
  ((SELECT id FROM countries WHERE country_code = 'AE'), 'Ajman', 25.4164, 55.4437),
  ((SELECT id FROM countries WHERE country_code = 'AE'), 'Ras Al Khaimah', 25.7482, 55.9316),
  ((SELECT id FROM countries WHERE country_code = 'AE'), 'Fujairah', 25.1242, 56.3345),
  ((SELECT id FROM countries WHERE country_code = 'AE'), 'Umm Al Quwain', 25.5648, 55.5582)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUBSCRIPTION PLANS
-- ============================================================

INSERT INTO subscription_plans (plan_name, plan_type, price, currency, max_ads, max_featured_ads, max_bump_ups_per_month, featured_listing_price, bump_up_price, duration_days, features, description)
VALUES
  ('Free Plan', 'free', 0, 'AED', 10, 0, 0, 50, 10, 30, '{"ad_posting": true, "messaging": true, "profile": true}'::jsonb, 'Basic free plan'),
  ('Premium', 'premium', 99, 'AED', 50, 5, 5, 35, 5, 30, '{"ad_posting": true, "messaging": true, "profile": true, "priority_support": true, "analytics": true}'::jsonb, 'Premium monthly plan'),
  ('Premium Plus', 'premium_plus', 299, 'AED', 200, 20, 20, 25, 2, 30, '{"ad_posting": true, "messaging": true, "profile": true, "priority_support": true, "analytics": true, "featured_badge": true, "bulk_upload": true}'::jsonb, 'Premium Plus monthly plan')
ON CONFLICT DO NOTHING;

-- ============================================================
-- MAIN CATEGORIES
-- ============================================================

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES
  ('Properties', 'properties', '🏠', 'Real estate for rent and sale', NULL, 1),
  ('Vehicles', 'vehicles', '🚗', 'Cars, bikes, and automobiles', NULL, 2),
  ('Electronics', 'electronics', '📱', 'Phones, computers, and gadgets', NULL, 3),
  ('Furniture & Home', 'furniture_home', '🪑', 'Furniture and home items', NULL, 4),
  ('Fashion & Clothing', 'fashion', '👗', 'Clothes, shoes, and accessories', NULL, 5),
  ('Pets & Animals', 'pets', '🐕', 'Pets and animal supplies', NULL, 6),
  ('Sports & Outdoors', 'sports', '⚽', 'Sports equipment and outdoor gear', NULL, 7),
  ('Services & Jobs', 'services', '🔧', 'Services, jobs, and opportunities', NULL, 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUBCATEGORIES - PROPERTIES
-- ============================================================

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES
  ('Villas', 'villas', '🏡', 'Luxury villas', (SELECT id FROM categories WHERE slug = 'properties'), 1),
  ('Apartments', 'apartments', '🏢', 'Flats and apartments', (SELECT id FROM categories WHERE slug = 'properties'), 2),
  ('Townhouses', 'townhouses', '🏘️', 'Townhouses', (SELECT id FROM categories WHERE slug = 'properties'), 3),
  ('Penthouses', 'penthouses', '🏰', 'Luxury penthouses', (SELECT id FROM categories WHERE slug = 'properties'), 4),
  ('Warehouses', 'warehouses', '🏭', 'Industrial spaces', (SELECT id FROM categories WHERE slug = 'properties'), 5),
  ('Shops', 'shops', '🏪', 'Retail spaces', (SELECT id FROM categories WHERE slug = 'properties'), 6),
  ('Land', 'land', '🌾', 'Land plots', (SELECT id FROM categories WHERE slug = 'properties'), 7),
  ('Offices', 'offices', '🏛️', 'Office spaces', (SELECT id FROM categories WHERE slug = 'properties'), 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUBCATEGORIES - VEHICLES
-- ============================================================

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES
  ('Cars', 'cars', '🚙', 'Sedans, SUVs, hatchbacks', (SELECT id FROM categories WHERE slug = 'vehicles'), 1),
  ('Motorcycles', 'motorcycles', '🏍️', 'Bikes and scooters', (SELECT id FROM categories WHERE slug = 'vehicles'), 2),
  ('Trucks', 'trucks', '🚚', 'Commercial vehicles', (SELECT id FROM categories WHERE slug = 'vehicles'), 3),
  ('Vans', 'vans', '🚐', 'Minivans and vans', (SELECT id FROM categories WHERE slug = 'vehicles'), 4),
  ('Buses', 'buses', '🚌', 'Coaches and buses', (SELECT id FROM categories WHERE slug = 'vehicles'), 5),
  ('Auto Parts', 'auto_parts', '⚙️', 'Car parts and accessories', (SELECT id FROM categories WHERE slug = 'vehicles'), 6),
  ('Trailers', 'trailers', '🚛', 'Trailers and caravans', (SELECT id FROM categories WHERE slug = 'vehicles'), 7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUBCATEGORIES - ELECTRONICS
-- ============================================================

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES
  ('Smartphones', 'smartphones', '📱', 'Mobile phones', (SELECT id FROM categories WHERE slug = 'electronics'), 1),
  ('Laptops', 'laptops', '💻', 'Computers and laptops', (SELECT id FROM categories WHERE slug = 'electronics'), 2),
  ('Tablets', 'tablets', '📱', 'iPad and tablets', (SELECT id FROM categories WHERE slug = 'electronics'), 3),
  ('Cameras', 'cameras', '📷', 'DSLR and mirrorless', (SELECT id FROM categories WHERE slug = 'electronics'), 4),
  ('Audio', 'audio', '🎧', 'Headphones and speakers', (SELECT id FROM categories WHERE slug = 'electronics'), 5),
  ('Gaming', 'gaming', '🎮', 'Gaming consoles', (SELECT id FROM categories WHERE slug = 'electronics'), 6),
  ('Watches', 'watches', '⌚', 'Smart watches', (SELECT id FROM categories WHERE slug = 'electronics'), 7),
  ('Accessories', 'accessories', '🔌', 'Chargers, cables, cases', (SELECT id FROM categories WHERE slug = 'electronics'), 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUBCATEGORIES - FURNITURE & HOME
-- ============================================================

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES
  ('Sofas', 'sofas', '🛋️', 'Couches and sofas', (SELECT id FROM categories WHERE slug = 'furniture_home'), 1),
  ('Beds', 'beds', '🛏️', 'Beds and mattresses', (SELECT id FROM categories WHERE slug = 'furniture_home'), 2),
  ('Dining Sets', 'dining', '🍽️', 'Tables and chairs', (SELECT id FROM categories WHERE slug = 'furniture_home'), 3),
  ('Wardrobes', 'wardrobes', '🚪', 'Cabinets and wardrobes', (SELECT id FROM categories WHERE slug = 'furniture_home'), 4),
  ('Kitchen', 'kitchen', '🍳', 'Kitchen appliances', (SELECT id FROM categories WHERE slug = 'furniture_home'), 5),
  ('Lighting', 'lighting', '💡', 'Lamps and lights', (SELECT id FROM categories WHERE slug = 'furniture_home'), 6),
  ('Decor', 'decor', '🖼️', 'Wall art and decoration', (SELECT id FROM categories WHERE slug = 'furniture_home'), 7),
  ('Plants', 'plants', '🌿', 'Indoor plants', (SELECT id FROM categories WHERE slug = 'furniture_home'), 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUBCATEGORIES - FASHION
-- ============================================================

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES
  ('Mens Clothing', 'mens', '👔', 'Shirts, pants, jackets', (SELECT id FROM categories WHERE slug = 'fashion'), 1),
  ('Womens Clothing', 'womens', '👚', 'Dresses, tops, skirts', (SELECT id FROM categories WHERE slug = 'fashion'), 2),
  ('Shoes', 'shoes', '👞', 'Sneakers, heels, boots', (SELECT id FROM categories WHERE slug = 'fashion'), 3),
  ('Bags', 'bags', '👜', 'Handbags and backpacks', (SELECT id FROM categories WHERE slug = 'fashion'), 4),
  ('Jewelry', 'jewelry', '💍', 'Rings, necklaces, earrings', (SELECT id FROM categories WHERE slug = 'fashion'), 5),
  ('Watches', 'watches_fashion', '⌚', 'Wristwatches', (SELECT id FROM categories WHERE slug = 'fashion'), 6),
  ('Accessories', 'fashion_accessories', '🧣', 'Scarves, hats, belts', (SELECT id FROM categories WHERE slug = 'fashion'), 7),
  ('Sports Wear', 'sportswear', '👟', 'Gym and athletic wear', (SELECT id FROM categories WHERE slug = 'fashion'), 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUBCATEGORIES - PETS
-- ============================================================

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES
  ('Dogs', 'dogs', '🐕', 'Dogs for sale/adoption', (SELECT id FROM categories WHERE slug = 'pets'), 1),
  ('Cats', 'cats', '🐈', 'Cats for sale/adoption', (SELECT id FROM categories WHERE slug = 'pets'), 2),
  ('Birds', 'birds', '🦜', 'Birds and aviary', (SELECT id FROM categories WHERE slug = 'pets'), 3),
  ('Fish', 'fish', '🐠', 'Aquatic pets', (SELECT id FROM categories WHERE slug = 'pets'), 4),
  ('Rabbits', 'rabbits', '🐰', 'Rabbits and rodents', (SELECT id FROM categories WHERE slug = 'pets'), 5),
  ('Pet Supplies', 'supplies', '🦴', 'Food, toys, beds', (SELECT id FROM categories WHERE slug = 'pets'), 6),
  ('Pet Services', 'services_pets', '✂️', 'Grooming, training', (SELECT id FROM categories WHERE slug = 'pets'), 7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUBCATEGORIES - SPORTS
-- ============================================================

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES
  ('Fitness Equipment', 'fitness', '🏋️', 'Weights, treadmills', (SELECT id FROM categories WHERE slug = 'sports'), 1),
  ('Sports Gear', 'gear', '⚽', 'Balls, rackets, bats', (SELECT id FROM categories WHERE slug = 'sports'), 2),
  ('Bicycles', 'bicycles', '🚴', 'Bikes and scooters', (SELECT id FROM categories WHERE slug = 'sports'), 3),
  ('Camping', 'camping', '⛺', 'Tents, bags, gear', (SELECT id FROM categories WHERE slug = 'sports'), 4),
  ('Water Sports', 'water', '🏄', 'Surfboards, diving', (SELECT id FROM categories WHERE slug = 'sports'), 5),
  ('Team Sports', 'team', '🏀', 'Basketball, football', (SELECT id FROM categories WHERE slug = 'sports'), 6),
  ('Outdoor Gear', 'outdoor', '🧗', 'Climbing, hiking gear', (SELECT id FROM categories WHERE slug = 'sports'), 7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SUBCATEGORIES - SERVICES
-- ============================================================

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES
  ('Repair Services', 'repair', '🔧', 'Electronics, auto repair', (SELECT id FROM categories WHERE slug = 'services'), 1),
  ('Home Services', 'home_services', '🏠', 'Cleaning, plumbing', (SELECT id FROM categories WHERE slug = 'services'), 2),
  ('Beauty Services', 'beauty', '💅', 'Salon, spa, massage', (SELECT id FROM categories WHERE slug = 'services'), 3),
  ('Teaching', 'teaching', '📚', 'Tutoring and lessons', (SELECT id FROM categories WHERE slug = 'services'), 4),
  ('Jobs Offered', 'jobs', '💼', 'Job postings', (SELECT id FROM categories WHERE slug = 'services'), 5),
  ('Jobs Wanted', 'job_wanted', '📋', 'Job seekers', (SELECT id FROM categories WHERE slug = 'services'), 6),
  ('Event Services', 'events', '🎉', 'Catering, photography', (SELECT id FROM categories WHERE slug = 'services'), 7)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CATEGORY ATTRIBUTES - PROPERTIES
-- ============================================================

INSERT INTO category_attributes (category_id, attribute_name, attribute_type, is_required, dropdown_values, unit)
VALUES
  ((SELECT id FROM categories WHERE slug = 'villas'), 'Bedrooms', 'number', true, NULL, NULL),
  ((SELECT id FROM categories WHERE slug = 'villas'), 'Bathrooms', 'number', true, NULL, NULL),
  ((SELECT id FROM categories WHERE slug = 'villas'), 'Size', 'number', true, NULL, 'sqft'),
  ((SELECT id FROM categories WHERE slug = 'villas'), 'Property Type', 'dropdown', true, '["Villa", "Townhouse", "Mansion"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'villas'), 'Features', 'multiselect', false, '["Pool", "Gym", "Garden", "Parking"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'villas'), 'Furnished', 'dropdown', false, '["Yes", "Partial", "No"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'apartments'), 'Bedrooms', 'number', true, NULL, NULL),
  ((SELECT id FROM categories WHERE slug = 'apartments'), 'Bathrooms', 'number', true, NULL, NULL),
  ((SELECT id FROM categories WHERE slug = 'apartments'), 'Size', 'number', true, NULL, 'sqft'),
  ((SELECT id FROM categories WHERE slug = 'apartments'), 'Floor', 'number', false, NULL, NULL),
  ((SELECT id FROM categories WHERE slug = 'apartments'), 'Furnished', 'dropdown', false, '["Yes", "Partial", "No"]'::jsonb, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CATEGORY ATTRIBUTES - VEHICLES
-- ============================================================

INSERT INTO category_attributes (category_id, attribute_name, attribute_type, is_required, dropdown_values, unit)
VALUES
  ((SELECT id FROM categories WHERE slug = 'cars'), 'Brand', 'dropdown', true, '["Toyota", "BMW", "Audi", "Mercedes", "Nissan", "Ford", "Honda", "Volkswagen", "Hyundai", "Kia", "Other"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'cars'), 'Model', 'text', true, NULL, NULL),
  ((SELECT id FROM categories WHERE slug = 'cars'), 'Year', 'number', true, NULL, NULL),
  ((SELECT id FROM categories WHERE slug = 'cars'), 'Mileage', 'number', true, NULL, 'km'),
  ((SELECT id FROM categories WHERE slug = 'cars'), 'Transmission', 'dropdown', true, '["Automatic", "Manual"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'cars'), 'Fuel Type', 'dropdown', true, '["Petrol", "Diesel", "Hybrid", "Electric"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'cars'), 'Color', 'dropdown', false, '["White", "Black", "Silver", "Gray", "Red", "Blue", "Gold", "Brown", "Green"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'cars'), 'Body Type', 'dropdown', true, '["Sedan", "SUV", "Coupe", "Hatchback", "Wagon", "Convertible", "Minivan", "Pickup", "Truck"]'::jsonb, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- CATEGORY ATTRIBUTES - ELECTRONICS
-- ============================================================

INSERT INTO category_attributes (category_id, attribute_name, attribute_type, is_required, dropdown_values, unit)
VALUES
  ((SELECT id FROM categories WHERE slug = 'smartphones'), 'Brand', 'dropdown', true, '["Apple", "Samsung", "Xiaomi", "OnePlus", "Huawei", "Google", "Realme", "Oppo", "Vivo", "Honor", "Other"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'smartphones'), 'Model', 'text', true, NULL, NULL),
  ((SELECT id FROM categories WHERE slug = 'smartphones'), 'Storage', 'dropdown', true, '["64GB", "128GB", "256GB", "512GB", "1TB"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'smartphones'), 'RAM', 'dropdown', true, '["4GB", "6GB", "8GB", "12GB", "16GB"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'smartphones'), 'Condition', 'dropdown', true, '["New Sealed", "Like New", "Good", "Fair", "Parts Only"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'smartphones'), 'Warranty', 'dropdown', false, '["Yes", "No", "Partial"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'laptops'), 'Brand', 'dropdown', true, '["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Razer", "Other"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'laptops'), 'Model', 'text', true, NULL, NULL),
  ((SELECT id FROM categories WHERE slug = 'laptops'), 'RAM', 'dropdown', true, '["8GB", "16GB", "32GB", "64GB"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'laptops'), 'Storage', 'dropdown', true, '["256GB", "512GB", "1TB", "2TB"]'::jsonb, NULL),
  ((SELECT id FROM categories WHERE slug = 'laptops'), 'Condition', 'dropdown', true, '["New", "Like New", "Good", "Fair"]'::jsonb, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================
-- WEBSITE SETTINGS
-- ============================================================

INSERT INTO website_settings (setting_key, setting_value, setting_type, description)
VALUES
  ('website_name', 'NexusMarket', 'text', 'Website name'),
  ('website_logo_url', '/logo.png', 'text', 'Logo URL'),
  ('primary_color', '#3B82F6', 'text', 'Primary brand color'),
  ('secondary_color', '#1F2937', 'text', 'Secondary brand color'),
  ('accent_color', '#F59E0B', 'text', 'Accent color'),
  ('support_email', 'support@nexusmarket.ae', 'text', 'Support email'),
  ('support_phone', '+971-4-XXXXXX', 'text', 'Support phone'),
  ('commission_percentage', '5', 'number', 'Platform commission percentage'),
  ('featured_listing_boost_days', '7', 'number', 'Days featured listing lasts'),
  ('ad_expiry_days', '60', 'number', 'Days until ad expires'),
  ('min_review_rating', '1', 'number', 'Minimum review rating'),
  ('max_ads_free_plan', '10', 'number', 'Max ads for free users'),
  ('enable_phone_verification', 'true', 'boolean', 'Require phone verification'),
  ('enable_email_verification', 'true', 'boolean', 'Require email verification'),
  ('maintenance_mode', 'false', 'boolean', 'Put site in maintenance mode')
ON CONFLICT DO NOTHING;
