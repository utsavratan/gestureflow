import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, 
  Medal, 
  Star, 
  Target, 
  Flame, 
  Calendar, 
  Users, 
  Share2,
  Lock,
  CheckCircle,
  Zap,
  Crown,
  Award
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  achievement_type: string;
  criteria: any;
  points: number;
  rarity: string;
  icon_url?: string;
  is_active: boolean;
  earned?: boolean;
  earned_at?: string;
  progress?: number;
}

interface UserLevel {
  current_level: number;
  experience_points: number;
  total_experience: number;
}

const AchievementSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: Trophy },
    { id: 'alphabet', name: 'Alphabet', icon: Target },
    { id: 'practice', name: 'Practice', icon: Zap },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'streak', name: 'Streaks', icon: Flame },
    { id: 'milestone', name: 'Milestones', icon: Crown }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'text-blue-500 border-blue-200 bg-blue-50';
      case 'epic': return 'text-purple-500 border-purple-200 bg-purple-50';
      case 'legendary': return 'text-yellow-500 border-yellow-200 bg-yellow-50';
      default: return 'text-gray-500 border-gray-200';
    }
  };

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserLevel();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      // Fetch all available achievements
      const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: false });

      // Fetch user's earned achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id, earned_at')
        .eq('user_id', user?.id);

      const userAchievementIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);
      
      // Calculate progress for each achievement
      const achievementsWithProgress = await Promise.all(
        (allAchievements || []).map(async (achievement) => {
          const earned = userAchievementIds.has(achievement.id);
          const earnedData = userAchievements?.find(ua => ua.achievement_id === achievement.id);
          
          let progress = 0;
          if (!earned) {
            progress = await calculateAchievementProgress(achievement);
          }

          return {
            ...achievement,
            earned,
            earned_at: earnedData?.earned_at,
            progress: earned ? 100 : progress
          };
        })
      );

      setAchievements(achievementsWithProgress);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLevel = async () => {
    try {
      const { data } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setUserLevel(data);
    } catch (error) {
      console.error('Error fetching user level:', error);
    }
  };

  const calculateAchievementProgress = async (achievement: Achievement): Promise<number> => {
    try {
      const { criteria } = achievement;
      
      switch (achievement.achievement_type) {
        case 'alphabet_master':
          // Count completed alphabet lessons
          const { count: alphabetCount } = await supabase
            .from('user_progress')
            .select('*', { count: 'exact' })
            .eq('user_id', user?.id)
            .eq('is_completed', true);
          
          return Math.min((alphabetCount || 0) / (criteria.required_count || 26) * 100, 100);

        case 'practice_streak':
          // Get current streak
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('current_streak')
            .eq('user_id', user?.id)
            .single();
          
          return Math.min((profile?.current_streak || 0) / (criteria.required_streak || 7) * 100, 100);

        case 'accuracy_expert':
          // Calculate average accuracy
          const { data: sessions } = await supabase
            .from('practice_sessions')
            .select('accuracy_score')
            .eq('user_id', user?.id)
            .not('accuracy_score', 'is', null);
          
          if (!sessions || sessions.length === 0) return 0;
          
          const avgAccuracy = sessions.reduce((sum, s) => sum + (s.accuracy_score || 0), 0) / sessions.length;
          return avgAccuracy >= (criteria.required_accuracy || 90) ? 100 : (avgAccuracy / (criteria.required_accuracy || 90)) * 100;

        case 'social_butterfly':
          // Count friends
          const { count: friendCount } = await supabase
            .from('friendships')
            .select('*', { count: 'exact' })
            .eq('user_id', user?.id)
            .eq('status', 'accepted');
          
          return Math.min((friendCount || 0) / (criteria.required_friends || 5) * 100, 100);

        default:
          return 0;
      }
    } catch (error) {
      console.error('Error calculating achievement progress:', error);
      return 0;
    }
  };

  const shareAchievement = async (achievement: Achievement) => {
    try {
      // Share achievement to social feed
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user?.id,
          content: `🎉 Just earned the "${achievement.name}" achievement! ${achievement.description}`,
          post_type: 'achievement',
          achievement_data: {
            name: achievement.name,
            description: achievement.description,
            rarity: achievement.rarity,
            points: achievement.points
          }
        });

      if (error) throw error;

      toast({
        title: "Achievement Shared!",
        description: "Your achievement has been shared with friends.",
      });
    } catch (error) {
      console.error('Error sharing achievement:', error);
      toast({
        title: "Error",
        description: "Failed to share achievement.",
        variant: "destructive"
      });
    }
  };

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.achievement_type.includes(selectedCategory)
  );

  const expForNextLevel = userLevel ? userLevel.current_level * 100 : 100;
  const levelProgress = userLevel ? (userLevel.experience_points / expForNextLevel) * 100 : 0;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading achievements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Level Card */}
      {userLevel && (
        <Card className="module-card bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              Level {userLevel.current_level}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to Level {userLevel.current_level + 1}</span>
              <span>{userLevel.experience_points}/{expForNextLevel} XP</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{userLevel.total_experience}</p>
                <p className="text-sm text-muted-foreground">Total XP</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{achievements.filter(a => a.earned).length}</p>
                <p className="text-sm text-muted-foreground">Achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <Card className="module-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-1"
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement) => (
          <Card 
            key={achievement.id} 
            className={`module-card transition-all duration-300 ${
              achievement.earned 
                ? `${getRarityColor(achievement.rarity)} shadow-lg` 
                : 'opacity-75 hover:opacity-100'
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {achievement.earned ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : achievement.progress > 0 ? (
                    <div className="relative">
                      <Trophy className="w-6 h-6 text-muted-foreground" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                    </div>
                  ) : (
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  )}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRarityColor(achievement.rarity)}`}
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-bold">{achievement.points}</span>
                </div>
              </div>
              <CardTitle className="text-lg">{achievement.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
              
              {!achievement.earned && achievement.progress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{Math.round(achievement.progress)}%</span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                </div>
              )}
              
              {achievement.earned && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-success">
                    Earned {new Date(achievement.earned_at!).toLocaleDateString()}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => shareAchievement(achievement)}
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <Card className="module-card">
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No achievements in this category</h3>
            <p className="text-muted-foreground">
              Try a different category or keep learning to unlock achievements!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementSystem;