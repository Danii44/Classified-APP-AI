-- NEXUSMARKET SEED DATA
-- Insert countries, categories, attributes, and subscription plans

-- ============================================================
-- COUNTRIES & CITIES
-- ============================================================

INSERT INTO countries (country_name, country_code, flag_emoji, currency, currency_symbol, phone_code, display_order)
VALUES
  ('United Arab Emirates', 'AE', '🇦🇪', 'AED', 'د.إ', '+971', 1),
  ('Saudi Arabia', 'SA', '🇸🇦', 'SAR', 'ر.س', '+966', 2),
  ('Kuwait', 'KW', '🇰🇼', 'KWD', 'د.ك', '+965', 3),
  ('Qatar', 'QA', '🇶🇦', 'QAR', 'ر.ق', '+974', 4),
  ('Bahrain', 'BH', '🇧🇭', 'BHD', 'د.ب', '+973', 5),
  ('Oman', 'OM', '🇴🇲', 'OMR', 'ر.ع.', '+968', 6),
  ('Egypt', 'EG', '🇪🇬', 'EGP', '£', '+20', 7);

-- Insert UAE Cities
INSERT INTO cities (country_id, city_name, latitude, longitude)
SELECT id, city_name, lat, lon FROM (
  VALUES
    ('Dubai', 25.2048, 55.2708),
    ('Abu Dhabi', 24.4539, 54.3773),
    ('Sharjah', 25.3571, 55.3986),
    ('Ajman', 25.4164, 55.4437),
    ('Ras Al Khaimah', 25.7482, 55.9316),
    ('Fujairah', 25.1242, 56.3345),
    ('Umm Al Quwain', 25.5648, 55.5582)
) AS cities(city_name, lat, lon)
WHERE countries.country_code = 'AE'
LIMIT (SELECT id FROM countries WHERE country_code = 'AE');

-- ============================================================
-- SUBSCRIPTION PLANS
-- ============================================================

INSERT INTO subscription_plans (plan_name, plan_type, price, currency, max_ads, max_featured_ads, max_bump_ups_per_month, featured_listing_price, bump_up_price, duration_days, features, description)
VALUES
  ('Free Plan', 'free', 0, 'AED', 10, 0, 0, 50, 10, 30, '{"ad_posting": true, "messaging": true, "profile": true}'::jsonb, 'Basic free plan'),
  ('Premium', 'premium', 99, 'AED', 50, 5, 5, 35, 5, 30, '{"ad_posting": true, "messaging": true, "profile": true, "priority_support": true, "analytics": true}'::jsonb, 'Premium monthly plan'),
  ('Premium Plus', 'premium_plus', 299, 'AED', 200, 20, 20, 25, 2, 30, '{"ad_posting": true, "messaging": true, "profile": true, "priority_support": true, "analytics": true, "featured_badge": true, "bulk_upload": true}'::jsonb, 'Premium Plus monthly plan');

-- ============================================================
-- CATEGORIES & SUBCATEGORIES
-- ============================================================

-- MAIN CATEGORIES

-- 1. PROPERTIES
INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES ('Properties', 'properties', '🏠', 'Real estate for rent and sale', NULL, 1);

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
SELECT id, cat_slug, cat_icon, cat_desc, (SELECT id FROM categories WHERE slug = 'properties'), cat_order FROM (
  VALUES
    ('Villas', 'villas', '🏡', 'Luxury villas', 1),
    ('Apartments', 'apartments', '🏢', 'Flats and apartments', 2),
    ('Townhouses', 'townhouses', '🏘️', 'Townhouses', 3),
    ('Penthouses', 'penthouses', '🏰', 'Luxury penthouses', 4),
    ('Warehouses', 'warehouses', '🏭', 'Industrial spaces', 5),
    ('Shops', 'shops', '🏪', 'Retail spaces', 6),
    ('Land', 'land', '🌾', 'Land plots', 7),
    ('Offices', 'offices', '🏛️', 'Office spaces', 8)
) AS subcats(cat_slug, cat_icon, cat_desc, cat_order)
LIMIT (SELECT COUNT(*) FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8)) AS t(n));

-- 2. VEHICLES
INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES ('Vehicles', 'vehicles', '🚗', 'Cars, bikes, and automobiles', NULL, 2);

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
SELECT id, cat_slug, cat_icon, cat_desc, (SELECT id FROM categories WHERE slug = 'vehicles'), cat_order FROM (
  VALUES
    ('Cars', 'cars', '🚙', 'Sedans, SUVs, hatchbacks', 1),
    ('Motorcycles', 'motorcycles', '🏍️', 'Bikes and scooters', 2),
    ('Trucks', 'trucks', '🚚', 'Commercial vehicles', 3),
    ('Vans', 'vans', '🚐', 'Minivans and vans', 4),
    ('Buses', 'buses', '🚌', 'Coaches and buses', 5),
    ('Auto Parts', 'auto_parts', '⚙️', 'Car parts and accessories', 6),
    ('Trailers', 'trailers', '🚛', 'Trailers and caravans', 7)
) AS subcats(cat_slug, cat_icon, cat_desc, cat_order)
LIMIT (SELECT COUNT(*) FROM (VALUES (1),(2),(3),(4),(5),(6),(7)) AS t(n));

-- 3. ELECTRONICS
INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES ('Electronics', 'electronics', '📱', 'Phones, computers, and gadgets', NULL, 3);

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
SELECT id, cat_slug, cat_icon, cat_desc, (SELECT id FROM categories WHERE slug = 'electronics'), cat_order FROM (
  VALUES
    ('Smartphones', 'smartphones', '📱', 'Mobile phones', 1),
    ('Laptops', 'laptops', '💻', 'Computers and laptops', 2),
    ('Tablets', 'tablets', '📱', 'iPad and tablets', 3),
    ('Cameras', 'cameras', '📷', 'DSLR and mirrorless', 4),
    ('Audio', 'audio', '🎧', 'Headphones and speakers', 5),
    ('Gaming', 'gaming', '🎮', 'Gaming consoles', 6),
    ('Watches', 'watches', '⌚', 'Smart watches', 7),
    ('Accessories', 'accessories', '🔌', 'Chargers, cables, cases', 8)
) AS subcats(cat_slug, cat_icon, cat_desc, cat_order)
LIMIT (SELECT COUNT(*) FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8)) AS t(n));

-- 4. FURNITURE & HOME
INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES ('Furniture & Home', 'furniture_home', '🪑', 'Furniture and home items', NULL, 4);

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
SELECT id, cat_slug, cat_icon, cat_desc, (SELECT id FROM categories WHERE slug = 'furniture_home'), cat_order FROM (
  VALUES
    ('Sofas', 'sofas', '🛋️', 'Couches and sofas', 1),
    ('Beds', 'beds', '🛏️', 'Beds and mattresses', 2),
    ('Dining Sets', 'dining', '🍽️', 'Tables and chairs', 3),
    ('Wardrobes', 'wardrobes', '🚪', 'Cabinets and wardrobes', 4),
    ('Kitchen', 'kitchen', '🍳', 'Kitchen appliances', 5),
    ('Lighting', 'lighting', '💡', 'Lamps and lights', 6),
    ('Decor', 'decor', '🖼️', 'Wall art and decoration', 7),
    ('Plants', 'plants', '🌿', 'Indoor plants', 8)
) AS subcats(cat_slug, cat_icon, cat_desc, cat_order)
LIMIT (SELECT COUNT(*) FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8)) AS t(n));

-- 5. FASHION & CLOTHING
INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES ('Fashion & Clothing', 'fashion', '👗', 'Clothes, shoes, and accessories', NULL, 5);

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
SELECT id, cat_slug, cat_icon, cat_desc, (SELECT id FROM categories WHERE slug = 'fashion'), cat_order FROM (
  VALUES
    ('Mens Clothing', 'mens', '👔', 'Shirts, pants, jackets', 1),
    ('Womens Clothing', 'womens', '👚', 'Dresses, tops, skirts', 2),
    ('Shoes', 'shoes', '👞', 'Sneakers, heels, boots', 3),
    ('Bags', 'bags', '👜', 'Handbags and backpacks', 4),
    ('Jewelry', 'jewelry', '💍', 'Rings, necklaces, earrings', 5),
    ('Watches', 'watches_fashion', '⌚', 'Wristwatches', 6),
    ('Accessories', 'fashion_accessories', '🧣', 'Scarves, hats, belts', 7),
    ('Sports Wear', 'sportswear', '👟', 'Gym and athletic wear', 8)
) AS subcats(cat_slug, cat_icon, cat_desc, cat_order)
LIMIT (SELECT COUNT(*) FROM (VALUES (1),(2),(3),(4),(5),(6),(7),(8)) AS t(n));

-- 6. PETS & ANIMALS
INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES ('Pets & Animals', 'pets', '🐕', 'Pets and animal supplies', NULL, 6);

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
SELECT id, cat_slug, cat_icon, cat_desc, (SELECT id FROM categories WHERE slug = 'pets'), cat_order FROM (
  VALUES
    ('Dogs', 'dogs', '🐕', 'Dogs for sale/adoption', 1),
    ('Cats', 'cats', '🐈', 'Cats for sale/adoption', 2),
    ('Birds', 'birds', '🦜', 'Birds and aviary', 3),
    ('Fish', 'fish', '🐠', 'Aquatic pets', 4),
    ('Rabbits', 'rabbits', '🐰', 'Rabbits and rodents', 5),
    ('Pet Supplies', 'supplies', '🦴', 'Food, toys, beds', 6),
    ('Pet Services', 'services', '✂️', 'Grooming, training', 7)
) AS subcats(cat_slug, cat_icon, cat_desc, cat_order)
LIMIT (SELECT COUNT(*) FROM (VALUES (1),(2),(3),(4),(5),(6),(7)) AS t(n));

-- 7. SPORTS & OUTDOORS
INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES ('Sports & Outdoors', 'sports', '⚽', 'Sports equipment and outdoor gear', NULL, 7);

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
SELECT id, cat_slug, cat_icon, cat_desc, (SELECT id FROM categories WHERE slug = 'sports'), cat_order FROM (
  VALUES
    ('Fitness Equipment', 'fitness', '🏋️', 'Weights, treadmills', 1),
    ('Sports Gear', 'gear', '⚽', 'Balls, rackets, bats', 2),
    ('Bicycles', 'bicycles', '🚴', 'Bikes and scooters', 3),
    ('Camping', 'camping', '⛺', 'Tents, bags, gear', 4),
    ('Water Sports', 'water', '🏄', 'Surfboards, diving', 5),
    ('Team Sports', 'team', '🏀', 'Basketball, football', 6),
    ('Outdoor Gear', 'outdoor', '🧗', 'Climbing, hiking gear', 7)
) AS subcats(cat_slug, cat_icon, cat_desc, cat_order)
LIMIT (SELECT COUNT(*) FROM (VALUES (1),(2),(3),(4),(5),(6),(7)) AS t(n));

-- 8. SERVICES & JOBS
INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
VALUES ('Services & Jobs', 'services', '🔧', 'Services, jobs, and opportunities', NULL, 8);

INSERT INTO categories (category_name, slug, icon, description, parent_category_id, display_order)
SELECT id, cat_slug, cat_icon, cat_desc, (SELECT id FROM categories WHERE slug = 'services'), cat_order FROM (
  VALUES
    ('Repair Services', 'repair', '🔧', 'Electronics, auto repair', 1),
    ('Home Services', 'home_services', '🏠', 'Cleaning, plumbing', 2),
    ('Beauty Services', 'beauty', '💅', 'Salon, spa, massage', 3),
    ('Teaching', 'teaching', '📚', 'Tutoring and lessons', 4),
    ('Jobs Offered', 'jobs', '💼', 'Job postings', 5),
    ('Jobs Wanted', 'job_wanted', '📋', 'Job seekers', 6),
    ('Event Services', 'events', '🎉', 'Catering, photography', 7)
) AS subcats(cat_slug, cat_icon, cat_desc, cat_order)
LIMIT (SELECT COUNT(*) FROM (VALUES (1),(2),(3),(4),(5),(6),(7)) AS t(n));

-- ============================================================
-- CATEGORY ATTRIBUTES (EAV Model)
-- ============================================================

-- Properties attributes
INSERT INTO category_attributes (category_id, attribute_name, attribute_type, is_required, dropdown_values, unit)
SELECT id, attr_name, attr_type, attr_req, attr_vals, attr_unit
FROM (
  SELECT (SELECT id FROM categories WHERE slug = 'villas') as cat_id,
    JSONB_BUILD_OBJECT(
      ('Bedrooms'::text, 'number'::text, true, NULL::jsonb, NULL::text),
      ('Bathrooms', 'number', true, NULL, NULL),
      ('Size', 'number', true, NULL, 'sqft'),
      ('Property Type', 'dropdown', true, '["Villa", "Townhouse", "Mansion"]'::jsonb, NULL),
      ('Features', 'multiselect', false, '["Pool", "Gym", "Garden", "Parking"]'::jsonb, NULL),
      ('Furnished', 'dropdown', false, '["Yes", "Partial", "No"]'::jsonb, NULL),
      ('Amenities', 'multiselect', false, '["Air Conditioning", "Balcony", "Elevator", "Generator"]'::jsonb, NULL)
    ) as attrs
) subq
CROSS JOIN LATERAL JSONB_EACH(attrs) AS x(attr_name, attr_val)
WHERE x.attr_val->>'type' IS NOT NULL;

-- Vehicles (Cars) attributes
INSERT INTO category_attributes (category_id, attribute_name, attribute_type, is_required, dropdown_values, unit)
SELECT id, attr_name, attr_type, attr_req, attr_vals, attr_unit
FROM (
  SELECT (SELECT id FROM categories WHERE slug = 'cars') as cat_id,
    JSONB_BUILD_ARRAY(
      JSONB_BUILD_OBJECT('name', 'Brand', 'type', 'dropdown', 'required', true, 'values', '["Toyota", "BMW", "Audi", "Mercedes", "Nissan", "Ford", "Honda", "Volkswagen", "Hyundai", "Kia", "Other"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Model', 'type', 'text', 'required', true),
      JSONB_BUILD_OBJECT('name', 'Year', 'type', 'number', 'required', true, 'min', 1990, 'max', 2025),
      JSONB_BUILD_OBJECT('name', 'Mileage', 'type', 'number', 'required', true, 'unit', 'km'),
      JSONB_BUILD_OBJECT('name', 'Transmission', 'type', 'dropdown', 'required', true, 'values', '["Automatic", "Manual"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Fuel Type', 'type', 'dropdown', 'required', true, 'values', '["Petrol", "Diesel", "Hybrid", "Electric"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Color', 'type', 'dropdown', 'required', false, 'values', '["White", "Black", "Silver", "Gray", "Red", "Blue", "Gold", "Brown", "Green"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Body Type', 'type', 'dropdown', 'required', true, 'values', '["Sedan", "SUV", "Coupe", "Hatchback", "Wagon", "Convertible", "Minivan", "Pickup", "Truck"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Features', 'type', 'multiselect', 'required', false, 'values', '["Air Conditioning", "Power Steering", "ABS", "Airbags", "Sunroof", "Alloy Wheels", "Navigation", "Cruise Control", "Parking Sensors"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Owner Type', 'type', 'dropdown', 'required', false, 'values', '["Personal Use", "Taxi", "Rental"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Service History', 'type', 'dropdown', 'required', false, 'values', '["Full Service History", "Partial", "No History"]'::jsonb)
    ) as attrs
) subq, LATERAL JSONB_ARRAY_ELEMENTS(attrs) AS x(attr_obj)
WHERE TRUE;

-- Electronics (Smartphones) attributes
INSERT INTO category_attributes (category_id, attribute_name, attribute_type, is_required, dropdown_values, unit)
SELECT id, attr_name, attr_type, attr_req, attr_vals, attr_unit
FROM (
  SELECT (SELECT id FROM categories WHERE slug = 'smartphones') as cat_id,
    JSONB_BUILD_ARRAY(
      JSONB_BUILD_OBJECT('name', 'Brand', 'type', 'dropdown', 'required', true, 'values', '["Apple", "Samsung", "Xiaomi", "OnePlus", "Huawei", "Google", "Realme", "Oppo", "Vivo", "Honor", "Other"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Model', 'type', 'text', 'required', true),
      JSONB_BUILD_OBJECT('name', 'Storage', 'type', 'dropdown', 'required', true, 'values', '["64GB", "128GB", "256GB", "512GB", "1TB"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'RAM', 'type', 'dropdown', 'required', true, 'values', '["4GB", "6GB", "8GB", "12GB", "16GB"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Color', 'type', 'text', 'required', false),
      JSONB_BUILD_OBJECT('name', 'Screen Size', 'type', 'number', 'required', false, 'unit', 'inches'),
      JSONB_BUILD_OBJECT('name', 'Camera MP', 'type', 'number', 'required', false, 'unit', 'MP'),
      JSONB_BUILD_OBJECT('name', 'Battery', 'type', 'number', 'required', false, 'unit', 'mAh'),
      JSONB_BUILD_OBJECT('name', 'Condition', 'type', 'dropdown', 'required', true, 'values', '["New Sealed", "Like New", "Good", "Fair", "Parts Only"]'::jsonb),
      JSONB_BUILD_OBJECT('name', 'Warranty', 'type', 'dropdown', 'required', false, 'values', '["Yes", "No", "Partial"]'::jsonb)
    ) as attrs
) subq, LATERAL JSONB_ARRAY_ELEMENTS(attrs) AS x(attr_obj)
WHERE TRUE;

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
  ('maintenance_mode', 'false', 'boolean', 'Put site in maintenance mode');

-- ============================================================
-- SAMPLE ADMIN USER (change password after first login!)
-- ============================================================

-- Note: You need to create admin user via Supabase Auth first
-- Then use the following to set admin role:
-- INSERT INTO admin_users (id, role, permissions)
-- VALUES ('<admin_uuid>', 'superadmin', '{"all": true}'::jsonb);
