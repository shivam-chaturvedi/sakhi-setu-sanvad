# Sakhi Setu - Menopause Support App

## Setup Instructions

### 1. Environment Variables
The app is configured to use the provided Supabase credentials:
- URL: https://euulnxqmtkkaaxltqmke.supabase.co
- Anon Key: [configured in client.ts]

### 2. Database Schema
The following tables have been created in Supabase:
- `users` - User profiles and preferences
- `symptoms` - Symptom tracking data
- `wellness_tips` - AI-generated wellness recommendations
- `community_posts` - Community chat messages
- `resources` - Educational content and resources

### 3. Features Implemented

#### Authentication
- Sign up/Sign in with email and password
- User profile management
- Protected routes

#### Language Support
- English (default)
- Marathi (मराठी)
- Hindi (हिन्दी)
- Free translation API integration

#### Symptom Tracking
- 15 different menopause symptoms
- Severity scale (1-10)
- Notes and timestamps
- Data visualization

#### AI Analytics
- Predictive health insights
- Personalized recommendations
- Sleep and mood scoring
- Trend analysis

#### Community Features
- Real-time chat
- Message likes
- Community guidelines
- User avatars

#### Resource Repository
- Video content
- Articles and guides
- Categorized resources
- External links

### 4. Running the App

```bash
npm install
npm run dev
```

### 5. Database Setup
You'll need to create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Symptoms table
CREATE TABLE symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  symptom_type TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wellness tips table
CREATE TABLE wellness_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts table
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  language TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Features Overview

The app provides comprehensive menopause support including:
- Personalized symptom tracking
- AI-powered health insights
- Community support and chat
- Educational resources
- Multi-language support
- Modern, accessible UI

### 7. Technology Stack
- React 18 with TypeScript
- Vite for build tooling
- Supabase for backend
- Tailwind CSS for styling
- Framer Motion for animations
- Radix UI for components
