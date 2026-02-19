-- ADMIN USER SETUP
-- This script sets up admin users. Run this after creating admin accounts via Supabase Auth
-- Replace the UUID values with actual user IDs from Supabase Auth

-- ============================================================
-- ADD ADMIN USERS (replace UUIDs with real admin user IDs)
-- ============================================================

-- Example: Add a superadmin user
-- First, create the user through Supabase Auth dashboard, then add their UUID below:

INSERT INTO admin_users (id, role, permissions, is_active, created_at)
VALUES
  -- Replace these UUIDs with real admin user IDs from your Supabase Auth
  -- Example format: ('550e8400-e29b-41d4-a716-446655440000', 'superadmin', '{"all": true, "users": true, "listings": true, "payments": true, "reports": true, "settings": true}'::jsonb, true, NOW())
  
  -- For now, we create a template - uncomment and fill in your admin UUID
  -- ('your-admin-uuid-here', 'superadmin', '{"all": true, "users": true, "listings": true, "payments": true, "reports": true, "settings": true}'::jsonb, true, NOW()),
  -- ('your-moderator-uuid-here', 'moderator', '{"listings": true, "reports": true, "users": true}'::jsonb, true, NOW())
ON CONFLICT DO NOTHING;

-- ============================================================
-- ADD ADMIN USER LOGS (tracks admin actions)
-- ============================================================

-- No initial logs needed, this table is for future admin action tracking

-- ============================================================
-- HOW TO ADD AN ADMIN USER:
-- ============================================================
-- 
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create a new user with admin credentials
-- 3. Copy the user's UUID (it will look like: 550e8400-e29b-41d4-a716-446655440000)
-- 4. Run this SQL query, replacing YOUR_UUID_HERE:
--
--    INSERT INTO admin_users (id, role, permissions, is_active, created_at)
--    VALUES ('YOUR_UUID_HERE', 'superadmin', '{"all": true, "users": true, "listings": true, "payments": true, "reports": true, "settings": true}'::jsonb, true, NOW());
--
-- 5. The user can now log in and access the admin panel at /admin
--
-- ROLES AVAILABLE:
-- - superadmin: Full access to all features
-- - admin: Full access to listings, users, reports
-- - moderator: Can approve/reject listings and handle reports
-- - support: Can view and respond to user support issues
-- ============================================================

-- Create a function to add admin users safely
CREATE OR REPLACE FUNCTION add_admin_user(
  admin_id UUID,
  admin_role TEXT,
  admin_permissions JSONB
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_users (id, role, permissions, is_active, created_at)
  VALUES (admin_id, admin_role, admin_permissions, true, NOW())
  ON CONFLICT (id) DO UPDATE
  SET role = admin_role, permissions = admin_permissions, is_active = true;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- CREATE ADMIN LOG ENTRY (for tracking admin actions)
-- ============================================================

CREATE OR REPLACE FUNCTION log_admin_action(
  admin_id UUID,
  action_type TEXT,
  resource_type TEXT,
  resource_id UUID,
  details JSONB
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_user_logs (admin_id, action_type, resource_type, resource_id, details, created_at)
  VALUES (admin_id, action_type, resource_type, resource_id, details, NOW());
END;
$$ LANGUAGE plpgsql;
