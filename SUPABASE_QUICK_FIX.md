# 🚨 URGENT: Supabase Database Setup Required

## The Problem
Your app is trying to access database tables that don't exist yet. The error shows:
```
Could not find the table 'public.symptoms' in the schema cache
```

## Quick Fix Steps

### 1. Get Your Supabase Credentials
1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project dashboard
3. Go to **Settings** → **API**
4. Copy your:
   - **Project URL** (should look like `https://nrzsbcbjzpovzdlaesmf.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Update Your Environment Variables
Create a `.env.local` file in your project root with:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Create the Database Tables
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase_setup.sql`
4. Click **Run** to execute the script

### 4. Verify Tables Are Created
1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - ✅ `users`
   - ✅ `symptoms`
   - ✅ `wellness_tips`
   - ✅ `community_posts`
   - ✅ `resources`
   - ✅ `health_reports`
   - ✅ `reminders`
   - ✅ `phc_directory`
   - ✅ `chatbot_conversations`
   - ✅ `voice_notes`
   - ✅ `user_goals`
   - ✅ `notifications`

### 5. Test the App
1. Restart your development server: `npm run dev`
2. Try signing up/logging in
3. Test the symptom tracker

## If You Don't Have a Supabase Project Yet

### Create a New Project
1. Go to [supabase.com](https://supabase.com)
2. Click **New Project**
3. Choose your organization
4. Enter project name: `sakhi-setu-sanvad`
5. Enter database password (save this!)
6. Choose region closest to you
7. Click **Create new project**

### Wait for Setup
- Project creation takes 2-3 minutes
- You'll get an email when it's ready

### Get Your Credentials
1. Go to **Settings** → **API**
2. Copy the **Project URL** and **anon key**
3. Update your `.env.local` file
4. Run the SQL setup script

## Troubleshooting

### If Tables Still Don't Appear
1. Check that you're in the right project
2. Verify the SQL script ran without errors
3. Refresh the Table Editor page
4. Check the SQL Editor logs for any errors

### If You Get Permission Errors
1. Make sure you're using the **anon** key, not the service role key
2. Check that Row Level Security (RLS) policies are enabled
3. Verify the policies in the SQL script were created

### If the App Still Shows 404 Errors
1. Double-check your `.env.local` file has the correct values
2. Restart your development server
3. Clear your browser cache
4. Check the browser console for any other errors

## Need Help?
If you're still having issues:
1. Check the Supabase dashboard for any error messages
2. Look at the browser console for detailed error logs
3. Make sure your Supabase project is active and not paused

The app will work perfectly once the database tables are created! 🚀
