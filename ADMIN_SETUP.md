# ADMIN USER SETUP & CONFIGURATION

## Creating Admin Account

### Option 1: Via Supabase Admin Panel
1. Go to your Supabase Project → Authentication → Users
2. Click "Add user"
3. Enter:
   - Email: `admin@nexusmarket.ae`
   - Password: `SecureAdminPassword123!` (change this!)
4. Click "Create user"

### Option 2: Via SQL (After user account created)
```sql
-- Make user admin (run in Supabase SQL Editor after creating the user)
UPDATE public.profiles 
SET 
  role = 'superadmin',
  first_name = 'Admin',
  last_name = 'User',
  verified = TRUE,
  email_verified = TRUE,
  phone_verified = FALSE
WHERE email = 'admin@nexusmarket.ae';
```

## Admin Credentials

**Email:** `admin@nexusmarket.ae`  
**Password:** Set during creation  
**Role:** `superadmin`  
**Access:** http://localhost:3000/admin

## Admin Features Available

✓ Feature toggles (enable/disable features)  
✓ Manage subscription plans  
✓ View payment settings  
✓ User moderation  
✓ Content approval  
✓ Analytics dashboard  

## Regular User Setup

Any user can:
- Sign up with email
- Create listings (become seller)
- Browse and buy products
- Message other users
- Leave reviews
- Manage favorites

## Product Image Upload

Users can upload images when creating listings:
1. Click "Create Listing"
2. Upload images (JPG, PNG, WebP)
3. Images stored in `/storage/products/`
4. Multiple images supported
5. Auto-generated thumbnails

## Database Tables for Products

All product-related tables are ready:
- `products` - Main product/listing table
- `product_images` - Images for products
- `favorites` - User favorites/wishlist
- `conversations` - Buyer-seller messages
- `messages` - Message content
- `reviews` - Ratings & reviews

## First Time Admin Actions

1. **Login as admin**
   - Email: admin@nexusmarket.ae
   - Go to: /admin

2. **Configure Features**
   - Enable/disable payment processing
   - Set subscription plans
   - Configure messaging
   - Enable featured listings

3. **Review Settings**
   - Check payment settings
   - Review moderation queue
   - Check user reports

4. **Monitor Activity**
   - View analytics
   - Check new listings
   - Monitor user behavior

## Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Image Upload Configuration

Images are stored in Supabase Storage:
- Folder: `products/`
- Bucket: `nexus-market-uploads`
- Max size: 10MB per image
- Formats: JPG, PNG, WebP

## Troubleshooting Admin Access

**Issue:** Can't access /admin
- Solution: Make sure role is set to 'superadmin' in database

**Issue:** Features not working
- Solution: Check feature_flags table for enabled flags

**Issue:** Image upload fails
- Solution: Check Supabase Storage bucket permissions

## Creating Test Users

Use SQL to create test users for development:

```sql
-- Create test seller profile (user must exist in auth.users first)
INSERT INTO public.profiles (
  id, first_name, last_name, email, role, is_seller, is_buyer
) VALUES (
  'user-uuid-here', 'Test', 'Seller', 'seller@test.com', 'user', TRUE, FALSE
);

-- Create test buyer profile
INSERT INTO public.profiles (
  id, first_name, last_name, email, role, is_seller, is_buyer
) VALUES (
  'user-uuid-here', 'Test', 'Buyer', 'buyer@test.com', 'user', FALSE, TRUE
);
```

---

**All system is ready for admin and user management!**
