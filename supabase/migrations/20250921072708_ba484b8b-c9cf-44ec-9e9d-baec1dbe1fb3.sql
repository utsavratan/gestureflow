-- Create social features database schema

-- Friends/Following system
CREATE TABLE public.friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  friend_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- User posts/images
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content TEXT,
  image_url TEXT,
  post_type TEXT NOT NULL DEFAULT 'general' CHECK (post_type IN ('general', 'achievement', 'practice')),
  achievement_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Post likes
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Post comments
CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User levels and experience
CREATE TABLE public.user_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_level INTEGER NOT NULL DEFAULT 1,
  experience_points INTEGER NOT NULL DEFAULT 0,
  total_experience INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced achievement tracking
CREATE TABLE public.achievement_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_achievement_id UUID NOT NULL,
  shared_by UUID NOT NULL,
  shared_with UUID, -- null means public share
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notification system
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('friend_request', 'achievement', 'like', 'comment', 'level_up')),
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Friendships policies
CREATE POLICY "Users can view their own friendships" ON public.friendships
  FOR SELECT USING (user_id = auth.uid() OR friend_id = auth.uid());

CREATE POLICY "Users can create friendship requests" ON public.friendships
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their friendship status" ON public.friendships
  FOR UPDATE USING (friend_id = auth.uid());

-- Posts policies
CREATE POLICY "Users can view posts from friends" ON public.posts
  FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.friendships 
      WHERE (user_id = auth.uid() AND friend_id = posts.user_id AND status = 'accepted')
      OR (friend_id = auth.uid() AND user_id = posts.user_id AND status = 'accepted')
    )
  );

CREATE POLICY "Users can create their own posts" ON public.posts
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (user_id = auth.uid());

-- Post likes policies
CREATE POLICY "Users can view likes on visible posts" ON public.post_likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_likes.post_id 
      AND (
        posts.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.friendships 
          WHERE (user_id = auth.uid() AND friend_id = posts.user_id AND status = 'accepted')
          OR (friend_id = auth.uid() AND user_id = posts.user_id AND status = 'accepted')
        )
      )
    )
  );

CREATE POLICY "Users can like posts" ON public.post_likes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unlike posts" ON public.post_likes
  FOR DELETE USING (user_id = auth.uid());

-- Post comments policies
CREATE POLICY "Users can view comments on visible posts" ON public.post_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.posts 
      WHERE posts.id = post_comments.post_id 
      AND (
        posts.user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM public.friendships 
          WHERE (user_id = auth.uid() AND friend_id = posts.user_id AND status = 'accepted')
          OR (friend_id = auth.uid() AND user_id = posts.user_id AND status = 'accepted')
        )
      )
    )
  );

CREATE POLICY "Users can comment on visible posts" ON public.post_comments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own comments" ON public.post_comments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments" ON public.post_comments
  FOR DELETE USING (user_id = auth.uid());

-- User levels policies
CREATE POLICY "Users can view their own level" ON public.user_levels
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view friends' levels" ON public.user_levels
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.friendships 
      WHERE (user_id = auth.uid() AND friend_id = user_levels.user_id AND status = 'accepted')
      OR (friend_id = auth.uid() AND user_id = user_levels.user_id AND status = 'accepted')
    )
  );

CREATE POLICY "Users can create their own level" ON public.user_levels
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own level" ON public.user_levels
  FOR UPDATE USING (user_id = auth.uid());

-- Achievement shares policies
CREATE POLICY "Users can view shared achievements" ON public.achievement_shares
  FOR SELECT USING (shared_with IS NULL OR shared_with = auth.uid() OR shared_by = auth.uid());

CREATE POLICY "Users can share their achievements" ON public.achievement_shares
  FOR INSERT WITH CHECK (shared_by = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Create triggers for updated_at
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON public.friendships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_levels_updated_at BEFORE UPDATE ON public.user_levels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to level up users
CREATE OR REPLACE FUNCTION public.level_up_user(user_uuid UUID, exp_gained INTEGER)
RETURNS JSONB AS $$
DECLARE
  current_level INTEGER;
  current_exp INTEGER;
  new_total_exp INTEGER;
  new_level INTEGER;
  exp_for_next_level INTEGER;
  level_changed BOOLEAN := false;
  result JSONB;
BEGIN
  -- Get current level data
  SELECT current_level, experience_points, total_experience
  INTO current_level, current_exp, new_total_exp
  FROM public.user_levels
  WHERE user_id = user_uuid;
  
  -- If no level record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_levels (user_id, current_level, experience_points, total_experience)
    VALUES (user_uuid, 1, exp_gained, exp_gained);
    current_level := 1;
    current_exp := exp_gained;
    new_total_exp := exp_gained;
  ELSE
    -- Add experience
    current_exp := current_exp + exp_gained;
    new_total_exp := new_total_exp + exp_gained;
  END IF;
  
  -- Calculate new level (each level requires level * 100 exp)
  new_level := current_level;
  WHILE current_exp >= (new_level * 100) LOOP
    current_exp := current_exp - (new_level * 100);
    new_level := new_level + 1;
    level_changed := true;
  END LOOP;
  
  -- Update user level
  UPDATE public.user_levels
  SET current_level = new_level,
      experience_points = current_exp,
      total_experience = new_total_exp,
      updated_at = NOW()
  WHERE user_id = user_uuid;
  
  -- Create notification if leveled up
  IF level_changed THEN
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (
      user_uuid,
      'level_up',
      'Level Up!',
      'Congratulations! You reached level ' || new_level || '!',
      jsonb_build_object('new_level', new_level, 'previous_level', current_level)
    );
  END IF;
  
  -- Return result
  result := jsonb_build_object(
    'level_changed', level_changed,
    'new_level', new_level,
    'current_exp', current_exp,
    'total_exp', new_total_exp,
    'exp_gained', exp_gained
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable realtime for social features
ALTER publication supabase_realtime ADD TABLE public.friendships;
ALTER publication supabase_realtime ADD TABLE public.posts;
ALTER publication supabase_realtime ADD TABLE public.post_likes;
ALTER publication supabase_realtime ADD TABLE public.post_comments;
ALTER publication supabase_realtime ADD TABLE public.notifications;
ALTER publication supabase_realtime ADD TABLE public.user_levels;
ALTER publication supabase_realtime ADD TABLE public.achievement_shares;