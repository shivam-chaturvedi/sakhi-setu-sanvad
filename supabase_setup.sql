-- Sakhi Setu Menopause Support App - Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  age INTEGER,
  location TEXT,
  phone TEXT,
  emergency_contact TEXT,
  medical_conditions TEXT[],
  current_medications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create symptoms table
CREATE TABLE IF NOT EXISTS public.symptoms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  symptom_type TEXT NOT NULL,
  severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wellness_tips table
CREATE TABLE IF NOT EXISTS public.wellness_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- 'video', 'article', 'recipe', 'expert_talk'
  url TEXT NOT NULL,
  language TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_minutes INTEGER,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health_reports table
CREATE TABLE IF NOT EXISTS public.health_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL, -- 'weekly', 'monthly', 'custom'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  symptoms_summary JSONB,
  recommendations JSONB,
  insights JSONB,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'medication', 'hydration', 'sleep', 'exercise', 'appointment'
  title TEXT NOT NULL,
  description TEXT,
  scheduled_time TIME NOT NULL,
  days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7], -- 1=Monday, 7=Sunday
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create phc_directory table (Primary Health Centers)
CREATE TABLE IF NOT EXISTS public.phc_directory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT,
  phone TEXT,
  email TEXT,
  services TEXT[],
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chatbot_conversations table
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  language TEXT DEFAULT 'en',
  is_user_message BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voice_notes table
CREATE TABLE IF NOT EXISTS public.voice_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  transcript TEXT,
  audio_url TEXT,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_goals table
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL, -- 'exercise', 'sleep', 'meditation', 'diet'
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER,
  current_value INTEGER DEFAULT 0,
  unit TEXT, -- 'minutes', 'hours', 'days', 'times'
  target_date DATE,
  is_achieved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'reminder', 'tip', 'achievement', 'community'
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_symptoms_user_id ON public.symptoms(user_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_recorded_at ON public.symptoms(recorded_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_scheduled_time ON public.reminders(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_health_reports_user_id ON public.health_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_phc_directory_location ON public.phc_directory(city, state);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phc_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for symptoms table
CREATE POLICY "Users can view own symptoms" ON public.symptoms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptoms" ON public.symptoms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptoms" ON public.symptoms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptoms" ON public.symptoms
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for wellness_tips table
CREATE POLICY "Anyone can view wellness tips" ON public.wellness_tips
  FOR SELECT USING (true);

-- Create RLS policies for community_posts table
CREATE POLICY "Anyone can view community posts" ON public.community_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert community posts" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own community posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own community posts" ON public.community_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for resources table
CREATE POLICY "Anyone can view resources" ON public.resources
  FOR SELECT USING (true);

-- Create RLS policies for health_reports table
CREATE POLICY "Users can view own health reports" ON public.health_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health reports" ON public.health_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for reminders table
CREATE POLICY "Users can view own reminders" ON public.reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" ON public.reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON public.reminders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON public.reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for phc_directory table
CREATE POLICY "Anyone can view PHC directory" ON public.phc_directory
  FOR SELECT USING (is_active = true);

-- Create RLS policies for chatbot_conversations table
CREATE POLICY "Users can view own chatbot conversations" ON public.chatbot_conversations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert chatbot conversations" ON public.chatbot_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create RLS policies for voice_notes table
CREATE POLICY "Users can view own voice notes" ON public.voice_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voice notes" ON public.voice_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice notes" ON public.voice_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice notes" ON public.voice_notes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_goals table
CREATE POLICY "Users can view own goals" ON public.user_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.user_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.user_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals" ON public.user_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for notifications table
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, preferred_language)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'en');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample wellness tips
INSERT INTO public.wellness_tips (title, content, category, language) VALUES
('Morning Yoga for Menopause', 'Start your day with gentle yoga poses like cat-cow stretch and child pose to reduce stiffness and improve circulation.', 'exercise', 'en'),
('हॉट फ्लैश के लिए योग', 'हॉट फ्लैश को कम करने के लिए शीतली प्राणायाम और चंद्रभेदी प्राणायाम का अभ्यास करें।', 'exercise', 'hi'),
('मेनोपॉजसाठी सकाळचे योग', 'सकाळी कोमल योग आसनांनी दिवस सुरू करा. कॅट-काऊ स्ट्रेच आणि चाइल्ड पोज करा.', 'exercise', 'mr'),
('Hydration Tips', 'Drink 8-10 glasses of water daily. Add lemon or cucumber for flavor and extra nutrients.', 'nutrition', 'en'),
('पोषण सलाह', 'दिन में 8-10 गिलास पानी पिएं। स्वाद के लिए नींबू या खीरा मिलाएं।', 'nutrition', 'hi'),
('पोषण सल्ले', 'दररोज 8-10 ग्लास पाणी प्या. चवीसाठी लिंबू किंवा काकडी घाला.', 'nutrition', 'mr');

-- Insert sample resources
INSERT INTO public.resources (title, description, type, url, language, category, duration_minutes) VALUES
('Yoga for Menopause Relief', 'A comprehensive 30-minute yoga session designed specifically for women experiencing menopause symptoms.', 'video', 'https://www.youtube.com/watch?v=example1', 'en', 'exercise', 30),
('मेनोपॉज के लिए योग', 'मेनोपॉज के लक्षणों का अनुभव करने वाली महिलाओं के लिए विशेष रूप से डिज़ाइन किया गया योग सत्र।', 'video', 'https://www.youtube.com/watch?v=example2', 'hi', 'exercise', 30),
('मेनोपॉजसाठी योग', 'मेनोपॉजच्या लक्षणांचा अनुभव घेणाऱ्या महिलांसाठी विशेषतः डिझाइन केलेले योग सत्र.', 'video', 'https://www.youtube.com/watch?v=example3', 'mr', 'exercise', 30),
('Nutritional Guidelines', 'Essential dietary recommendations to support your body during menopause transition.', 'article', 'https://example.com/nutrition-guide', 'en', 'nutrition', 5),
('Meditation for Hot Flashes', 'Breathing techniques and meditation practices to help manage hot flash episodes.', 'video', 'https://www.youtube.com/watch?v=example4', 'en', 'meditation', 15);

-- Insert sample PHC directory
INSERT INTO public.phc_directory (name, address, city, state, pincode, phone, services) VALUES
('Primary Health Center - Pune', '123 Main Street, Pune', 'Pune', 'Maharashtra', '411001', '+91-20-12345678', ARRAY['General Medicine', 'Gynecology', 'Mental Health']),
('Community Health Center - Mumbai', '456 Health Lane, Mumbai', 'Mumbai', 'Maharashtra', '400001', '+91-22-87654321', ARRAY['General Medicine', 'Gynecology', 'Nutrition Counseling']),
('Rural Health Center - Nashik', '789 Village Road, Nashik', 'Nashik', 'Maharashtra', '422001', '+91-253-9876543', ARRAY['General Medicine', 'Maternal Health', 'Community Health']);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
