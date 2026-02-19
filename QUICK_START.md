# Quick Start Checklist

## Before You Begin
- [ ] Supabase is connected (confirmed with environment variables)
- [ ] You have access to Supabase dashboard
- [ ] Git repository is set up

## Step 1: Database Setup (5 minutes)

1. Open Supabase dashboard → SQL Editor
2. Create new query and paste contents of `scripts/001_schema.sql`
3. Execute the query
4. Create another query and paste contents of `scripts/002_seed.sql`  
5. Execute the query
6. Verify tables are created: Check "Tables" section in left sidebar

## Step 2: Local Development (2 minutes)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:3000
```

## Step 3: Test Authentication (3 minutes)

1. Go to http://localhost:3000/auth/sign-up
2. Enter email and password
3. Check email inbox for confirmation link (check spam!)
4. Click confirmation link
5. You should now be able to login at http://localhost:3000/auth/login

## Step 4: Test Marketplace (5 minutes)

1. Go to homepage http://localhost:3000
2. You should see seeded listings (if database setup was successful)
3. Try searching and filtering
4. Click a listing to view details
5. Click "Contact Seller" (you'll need another account to test messaging)

## Step 5: Create Your First Listing (3 minutes)

1. Login with your account (http://localhost:3000/auth/login)
2. Go to Dashboard http://localhost:3000/dashboard
3. Click "Create Listing"
4. Fill in the form:
   - Title: "Test Item"
   - Description: "This is a test listing"
   - Category: "Electronics"
   - Country: "United States"
   - Price: "100"
   - Currency: "USD"
5. Click "Create Listing"
6. You should see your listing on the homepage!

## Step 6: Deploy (10 minutes)

### Option A: Deploy to Vercel (Recommended)

1. Push your code to GitHub
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Go to https://vercel.com/new
3. Select your GitHub repository
4. Environment variables are auto-detected from Supabase integration
5. Click "Deploy"
6. Your app will be live in 1-2 minutes!

### Option B: Deploy Elsewhere

For other platforms, ensure these are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Troubleshooting

### Issue: "Tables don't exist" error
**Solution**: Make sure you executed BOTH SQL files (001_schema.sql and 002_seed.sql) in order

### Issue: "Listings not showing"
**Solution**: 
1. Check Supabase dashboard → Tables → listings
2. Make sure listings have status='active' and deleted_at IS NULL

### Issue: "Can't signup"
**Solution**: 
1. Check Supabase → Authentication → Settings
2. Look for email confirmation requirement
3. Check spam folder for confirmation email

### Issue: "API returning 401"
**Solution**: 
1. Test auth by visiting http://localhost:3000/protected
2. You should be redirected to login if not authenticated
3. Login and try again

### Issue: ".env variables not loading"
**Solution**:
1. Verify `.env.local` exists in project root
2. Variables must start with `NEXT_PUBLIC_` to be visible on client
3. Restart dev server after changing `.env.local`

## What's Included

### Frontend Pages (7 total)
✓ Homepage with listings
✓ Authentication (signup, login, confirmation)
✓ User dashboard
✓ Create listing form
✓ Listing detail view
✓ Messaging interface
✓ User profile

### Backend APIs (12 endpoints)
✓ Auth: signup, login, logout
✓ Listings: search, create, get, update, delete
✓ Profiles: get, update
✓ Messages: list, get, send
✓ Metadata: countries, categories, attributes

### Database (14 tables)
✓ User authentication
✓ Listings with media
✓ Search and filtering
✓ Direct messaging
✓ User profiles
✓ Reviews and ratings
✓ Content moderation

### Security
✓ Row Level Security (RLS)
✓ Email authentication
✓ Protected routes
✓ Input validation
✓ SQL injection prevention

## Next Steps After Deployment

1. **Customize Branding**
   - Edit `app/globals.css` for colors
   - Update logo in navigation

2. **Add Payments**
   - Integrate Stripe (guide in docs)
   - Add payment processing

3. **Setup Email**
   - Configure email service for notifications
   - Customize email templates

4. **Add More Features**
   - Advanced filters
   - User recommendations
   - Analytics dashboard

## Files You Should Know About

| File | Purpose |
|------|---------|
| `scripts/001_schema.sql` | Database schema - MUST RUN FIRST |
| `scripts/002_seed.sql` | Initial data - MUST RUN SECOND |
| `app/page.tsx` | Homepage |
| `lib/db.ts` | All database functions |
| `lib/supabase/client.ts` | Supabase client setup |
| `.env.local` | Environment variables |

## Performance Tips

1. **Images**: Implement Next.js Image component for optimization
2. **Queries**: Use React Query for data caching
3. **Database**: Indexes are already set up
4. **Search**: Full-text search ready for optimization
5. **Monitoring**: Setup Vercel Analytics after deployment

## Security Reminders

1. Never commit `.env.local` to git
2. Keep `SUPABASE_SERVICE_ROLE_KEY` secret
3. Always use RLS policies for data
4. Validate input on frontend AND backend
5. Keep dependencies updated

## Success Indicators

✓ You can sign up and receive confirmation email
✓ You can create a listing
✓ Listing appears on marketplace search
✓ You can search and filter listings
✓ You can login and logout
✓ You can view your dashboard
✓ You can edit your profile
✓ You can message other users

## Common Commands

```bash
# Start development
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start

# Check for TypeScript errors
pnpm type-check

# Format code
pnpm lint
```

## Getting Help

1. Check `PROJECT_COMPLETE.md` for full documentation
2. Check `SETUP_GUIDE.md` for detailed instructions
3. Review database schema in Supabase dashboard
4. Check API responses in browser DevTools Network tab
5. Look at server logs from `pnpm dev` output

---

**You now have a complete, working classifieds marketplace!**

Next: Deploy to Vercel and invite beta users to test it.
