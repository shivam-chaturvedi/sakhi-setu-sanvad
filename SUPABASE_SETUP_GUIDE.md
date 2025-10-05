# 🗄️ Supabase Setup Guide for Sakhi Setu

This guide will help you set up your Supabase database with all the necessary tables, policies, and sample data for the Sakhi Setu Menopause Support App.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Project Created**: Create a new project in your Supabase dashboard
3. **Database URL and Keys**: Get your project URL and anon key from Settings > API

## 🚀 Step-by-Step Setup

### 1. Run the SQL Script

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `supabase_setup.sql`
5. Click **Run** to execute the script

### 2. Verify Tables Created

After running the script, you should see these tables in your **Table Editor**:

- ✅ `users` - Extended user profiles
- ✅ `symptoms` - Symptom tracking data
- ✅ `wellness_tips` - AI-generated tips
- ✅ `community_posts` - Community interactions
- ✅ `resources` - Educational content
- ✅ `health_reports` - Generated reports
- ✅ `reminders` - User reminders
- ✅ `phc_directory` - Health center directory
- ✅ `chatbot_conversations` - AI chat history
- ✅ `voice_notes` - Voice recordings
- ✅ `user_goals` - Wellness goals
- ✅ `notifications` - Push notifications

### 3. Check Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Users**: Can only access their own data
- **Symptoms**: Can only access their own data
- **Community Posts**: Public read, authenticated write
- **Resources**: Public read access
- **PHC Directory**: Public read access
- **Other tables**: User-specific access

### 4. Verify Sample Data

The script includes sample data for:
- ✅ Wellness tips in English, Hindi, and Marathi
- ✅ Sample resources (videos, articles)
- ✅ PHC directory entries
- ✅ Sample chatbot conversations

## 🔧 Configuration

### Environment Variables

Make sure your `.env.local` file has:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Authentication Setup

1. Go to **Authentication** > **Settings** in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Enable email confirmations if desired
4. Set up any OAuth providers you want to use

## 📊 Database Schema Overview

### Core Tables

#### `users`
- Extended user profiles with additional fields
- Links to Supabase auth.users
- Stores preferences and profile information

#### `symptoms`
- Tracks user symptom entries
- Severity levels (1-10)
- Notes and timestamps
- Used for AI analytics

#### `community_posts`
- Community chat messages
- Likes and engagement tracking
- Anonymous posting option

#### `resources`
- Educational content library
- Videos, articles, recipes
- Multi-language support

### Analytics Tables

#### `health_reports`
- AI-generated wellness reports
- Weekly/monthly summaries
- Doctor-sharing capabilities

#### `wellness_tips`
- AI-generated recommendations
- Categorized by type
- Multi-language support

### Support Tables

#### `phc_directory`
- Primary Health Center listings
- Location and contact information
- Service offerings

#### `reminders`
- User wellness reminders
- Medication, exercise, sleep tracking
- Customizable schedules

## 🔐 Security Features

### Row Level Security (RLS)
- All tables protected with RLS policies
- Users can only access their own data
- Public read access for resources and PHC directory
- Community posts are public but user-specific for modifications

### Data Privacy
- User data is properly isolated
- Sensitive information is protected
- Anonymous posting options available

## 🚀 Testing the Setup

### 1. Test Authentication
- Try signing up a new user
- Verify user profile is created in `users` table
- Test login/logout functionality

### 2. Test Symptom Tracking
- Log some sample symptoms
- Verify data appears in `symptoms` table
- Check AI analytics are generated

### 3. Test Community Features
- Post a message in community chat
- Verify it appears in `community_posts` table
- Test real-time updates

### 4. Test Resources
- Browse the resources section
- Verify content loads from `resources` table
- Test filtering and search

## 🐛 Troubleshooting

### Common Issues

1. **RLS Policy Errors**
   - Check if policies are properly created
   - Verify user authentication is working
   - Check table permissions

2. **Data Not Loading**
   - Verify Supabase URL and keys are correct
   - Check browser console for errors
   - Verify tables exist and have data

3. **Authentication Issues**
   - Check site URL configuration
   - Verify email settings
   - Check for CORS issues

### Debug Steps

1. Check Supabase logs in the dashboard
2. Use browser developer tools to inspect network requests
3. Verify environment variables are loaded
4. Test with a simple query in SQL Editor

## 📈 Monitoring

### Database Metrics
- Monitor table sizes and growth
- Check query performance
- Review error logs

### User Analytics
- Track user engagement
- Monitor symptom patterns
- Analyze community activity

## 🔄 Maintenance

### Regular Tasks
- Monitor database performance
- Update sample data as needed
- Review and update RLS policies
- Backup important data

### Scaling Considerations
- Consider read replicas for heavy traffic
- Implement proper indexing for large tables
- Monitor storage usage
- Plan for data archiving

## 📞 Support

If you encounter issues:

1. Check the Supabase documentation
2. Review the error logs in your dashboard
3. Test with a minimal setup first
4. Contact Supabase support if needed

## ✅ Verification Checklist

- [ ] All tables created successfully
- [ ] RLS policies are active
- [ ] Sample data is loaded
- [ ] Authentication is working
- [ ] Symptom tracking works
- [ ] Community chat functions
- [ ] Resources load properly
- [ ] AI analytics generate
- [ ] No console errors
- [ ] App runs without issues

Your Supabase database is now ready to power the Sakhi Setu Menopause Support App! 🌸
