-- Create enum types for the platform
CREATE TYPE public.skill_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.lesson_type AS ENUM ('alphabet', 'numbers', 'vocabulary', 'phrases', 'conversation');
CREATE TYPE public.challenge_type AS ENUM ('daily', 'weekly', 'special');
CREATE TYPE public.achievement_type AS ENUM ('streak', 'accuracy', 'completion', 'social');

-- Create user profiles table for extended user information
CREATE TABLE public.user_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    skill_level skill_level DEFAULT 'beginner',
    daily_goal INTEGER DEFAULT 5, -- minutes per day
    current_streak INTEGER DEFAULT 0,
    total_practice_time INTEGER DEFAULT 0, -- in minutes
    preferred_learning_pace TEXT DEFAULT 'moderate',
    accessibility_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create learning paths table for personalized curricula
CREATE TABLE public.learning_paths (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    skill_level skill_level NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    completion_percentage INTEGER DEFAULT 0,
    estimated_duration INTEGER, -- in hours
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create lessons table for sign language content
CREATE TABLE public.lessons (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    lesson_type lesson_type NOT NULL,
    skill_level skill_level NOT NULL,
    content JSONB NOT NULL, -- stores lesson data, video URLs, etc.
    order_index INTEGER NOT NULL,
    estimated_duration INTEGER, -- in minutes
    prerequisites JSONB DEFAULT '[]', -- array of lesson IDs
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user progress table to track learning advancement
CREATE TABLE public.user_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE SET NULL,
    completion_percentage INTEGER DEFAULT 0,
    accuracy_score INTEGER, -- 0-100
    time_spent INTEGER DEFAULT 0, -- in minutes
    is_completed BOOLEAN DEFAULT FALSE,
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Create practice sessions table for detailed tracking
CREATE TABLE public.practice_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    session_type TEXT NOT NULL, -- 'practice', 'quiz', 'challenge'
    duration INTEGER NOT NULL, -- in seconds
    accuracy_score INTEGER, -- 0-100
    feedback_data JSONB, -- detailed AI feedback
    mistakes_count INTEGER DEFAULT 0,
    signs_attempted INTEGER DEFAULT 0,
    signs_correct INTEGER DEFAULT 0,
    session_data JSONB, -- additional session metadata
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create achievements table for gamification
CREATE TABLE public.achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    achievement_type achievement_type NOT NULL,
    icon_url TEXT,
    criteria JSONB NOT NULL, -- criteria for earning the achievement
    points INTEGER DEFAULT 0,
    rarity TEXT DEFAULT 'common', -- common, rare, epic, legendary
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user achievements table to track earned achievements
CREATE TABLE public.user_achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    progress_data JSONB,
    UNIQUE(user_id, achievement_id)
);

-- Create daily challenges table
CREATE TABLE public.daily_challenges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    challenge_type challenge_type NOT NULL,
    difficulty skill_level NOT NULL,
    challenge_data JSONB NOT NULL, -- challenge configuration
    points_reward INTEGER DEFAULT 10,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create user challenge progress table
CREATE TABLE public.user_challenge_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- Create leaderboards table for community features
CREATE TABLE public.leaderboards (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    weekly_points INTEGER DEFAULT 0,
    monthly_points INTEGER DEFAULT 0,
    accuracy_average INTEGER DEFAULT 0,
    practice_streak INTEGER DEFAULT 0,
    total_lessons_completed INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for learning paths
CREATE POLICY "Users can view their own learning paths" ON public.learning_paths FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own learning paths" ON public.learning_paths FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own learning paths" ON public.learning_paths FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for lessons (public read access)
CREATE POLICY "Anyone can view published lessons" ON public.lessons FOR SELECT USING (is_published = true);

-- Create RLS policies for user progress
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for practice sessions
CREATE POLICY "Users can view their own practice sessions" ON public.practice_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own practice sessions" ON public.practice_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for achievements (public read access)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (is_active = true);

-- Create RLS policies for user achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for daily challenges (public read access)
CREATE POLICY "Anyone can view active challenges" ON public.daily_challenges FOR SELECT USING (is_active = true);

-- Create RLS policies for user challenge progress
CREATE POLICY "Users can view their own challenge progress" ON public.user_challenge_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own challenge progress" ON public.user_challenge_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own challenge progress" ON public.user_challenge_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for leaderboards (public read access with privacy controls)
CREATE POLICY "Anyone can view leaderboards" ON public.leaderboards FOR SELECT USING (true);
CREATE POLICY "Users can update their own leaderboard entry" ON public.leaderboards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own leaderboard entry" ON public.leaderboards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    return NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON public.user_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
    
    INSERT INTO public.leaderboards (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample lessons for the alphabet module
INSERT INTO public.lessons (title, description, lesson_type, skill_level, content, order_index, estimated_duration) VALUES
('Letter A', 'Learn to sign the letter A in ASL', 'alphabet', 'beginner', '{"letter": "A", "description": "Make a fist with your thumb resting against the side of your index finger.", "tips": ["Keep your thumb visible", "Make a firm fist", "Hold steady for 2 seconds"]}', 1, 3),
('Letter B', 'Learn to sign the letter B in ASL', 'alphabet', 'beginner', '{"letter": "B", "description": "Hold your hand upright with all four fingers extended and close together, thumb folded across your palm.", "tips": ["Keep fingers straight and together", "Thumb should be folded across palm", "Hand should be upright"]}', 2, 3),
('Letter C', 'Learn to sign the letter C in ASL', 'alphabet', 'beginner', '{"letter": "C", "description": "Curve your hand to form the shape of the letter C.", "tips": ["Curve all fingers uniformly", "Thumb should mirror the curve", "Leave space to form clear C shape"]}', 3, 3),
('Letter D', 'Learn to sign the letter D in ASL', 'alphabet', 'beginner', '{"letter": "D", "description": "Touch your thumb to your middle, ring, and pinky fingers, leaving your index finger pointing up.", "tips": ["Index finger should be straight", "Other fingers touch thumb tip", "Keep hand steady"]}', 4, 3),
('Letter E', 'Learn to sign the letter E in ASL', 'alphabet', 'beginner', '{"letter": "E", "description": "Curl all four fingers down to touch your thumb, making a claw-like shape.", "tips": ["All fingertips should touch thumb", "Form a tight curl", "Keep wrist straight"]}', 5, 3);

-- Insert sample achievements
INSERT INTO public.achievements (name, description, achievement_type, criteria, points, rarity) VALUES
('First Steps', 'Complete your first lesson', 'completion', '{"lessons_completed": 1}', 10, 'common'),
('Alphabet Master', 'Complete all alphabet lessons', 'completion', '{"alphabet_lessons_completed": 26}', 100, 'rare'),
('Perfect Practice', 'Achieve 100% accuracy in a practice session', 'accuracy', '{"accuracy_score": 100}', 25, 'uncommon'),
('Week Warrior', 'Practice for 7 consecutive days', 'streak', '{"daily_streak": 7}', 50, 'uncommon'),
('Speed Demon', 'Complete a lesson in under 2 minutes', 'completion', '{"lesson_duration_max": 120}', 30, 'uncommon');

-- Insert sample daily challenge
INSERT INTO public.daily_challenges (title, description, challenge_type, difficulty, challenge_data, points_reward, start_date, end_date) VALUES
('Alphabet Sprint', 'Sign all letters A-E correctly within 2 minutes', 'daily', 'beginner', '{"target_letters": ["A", "B", "C", "D", "E"], "time_limit": 120, "accuracy_required": 80}', 20, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day');