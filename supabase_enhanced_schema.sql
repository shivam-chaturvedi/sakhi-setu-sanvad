-- Enhanced Supabase Schema for Sakhi Setu Sanvad
-- This script adds new tables for video library, chat, and enhanced profile features

-- Create video_library table
CREATE TABLE IF NOT EXISTS video_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT NOT NULL DEFAULT 'wellness',
    tags TEXT[] DEFAULT '{}',
    published_date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    reply_to UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table for enhanced profile features
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    bio TEXT,
    location TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    profile_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_video_library_user_id ON video_library(user_id);
CREATE INDEX IF NOT EXISTS idx_video_library_category ON video_library(category);
CREATE INDEX IF NOT EXISTS idx_video_library_public ON video_library(is_public);
CREATE INDEX IF NOT EXISTS idx_video_library_created_at ON video_library(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Create RLS (Row Level Security) policies

-- Video Library policies
ALTER TABLE video_library ENABLE ROW LEVEL SECURITY;

-- Users can view public videos
CREATE POLICY "Public videos are viewable by everyone" ON video_library
    FOR SELECT USING (is_public = true);

-- Users can insert their own videos
CREATE POLICY "Users can insert their own videos" ON video_library
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own videos
CREATE POLICY "Users can update their own videos" ON video_library
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own videos
CREATE POLICY "Users can delete their own videos" ON video_library
    FOR DELETE USING (auth.uid() = user_id);

-- Chat Rooms policies
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;

-- Everyone can view public rooms
CREATE POLICY "Public rooms are viewable by everyone" ON chat_rooms
    FOR SELECT USING (is_public = true);

-- Authenticated users can create rooms
CREATE POLICY "Authenticated users can create rooms" ON chat_rooms
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Room creators can update their rooms
CREATE POLICY "Room creators can update their rooms" ON chat_rooms
    FOR UPDATE USING (auth.uid() = created_by);

-- Room creators can delete their rooms
CREATE POLICY "Room creators can delete their rooms" ON chat_rooms
    FOR DELETE USING (auth.uid() = created_by);

-- Chat Messages policies
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in public rooms
CREATE POLICY "Users can view messages in public rooms" ON chat_messages
    FOR SELECT USING (
        room_id IN (
            SELECT id FROM chat_rooms WHERE is_public = true
        )
    );

-- Users can insert messages
CREATE POLICY "Users can insert messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages
CREATE POLICY "Users can update their own messages" ON chat_messages
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own messages" ON chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- User Profiles policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
CREATE POLICY "Users can view all profiles" ON user_profiles
    FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_video_library_updated_at BEFORE UPDATE ON video_library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, bio, location, website, social_links, interests, privacy_settings, profile_views)
    VALUES (
        NEW.id,
        '',
        '',
        '',
        '{}',
        '{}',
        '{}',
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('video-thumbnails', 'video-thumbnails', true);

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Create storage policies for video thumbnails
CREATE POLICY "Video thumbnails are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'video-thumbnails');

CREATE POLICY "Users can upload video thumbnails" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'video-thumbnails' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update video thumbnails" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'video-thumbnails' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete video thumbnails" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'video-thumbnails' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Insert some sample data
INSERT INTO chat_rooms (name, description, created_by) VALUES 
('General Wellness', 'General discussion about wellness and health', (SELECT id FROM auth.users LIMIT 1)),
('Menopause Support', 'Support group for menopause-related discussions', (SELECT id FROM auth.users LIMIT 1)),
('Nutrition & Diet', 'Share healthy recipes and nutrition tips', (SELECT id FROM auth.users LIMIT 1)),
('Exercise & Fitness', 'Fitness routines and exercise discussions', (SELECT id FROM auth.users LIMIT 1));

-- Insert sample wellness tips
INSERT INTO wellness_tips (title, content, category, language) VALUES 
('Morning Meditation', 'Start your day with 10 minutes of meditation to set a positive tone for the day.', 'mental-health', 'en'),
('Hydration Reminder', 'Drink at least 8 glasses of water throughout the day to stay hydrated.', 'wellness', 'en'),
('Evening Stretching', 'Do gentle stretching exercises before bed to improve sleep quality.', 'exercise', 'en'),
('Healthy Snacking', 'Keep nuts and fruits handy for healthy snacking between meals.', 'nutrition', 'en'),
('Digital Detox', 'Take a 30-minute break from screens every 2 hours to rest your eyes.', 'wellness', 'en');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
