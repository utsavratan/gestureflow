import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Target, 
  Calendar, 
  BarChart3, 
  User, 
  Flame,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';

interface UserProfile {
  id: string;
  display_name: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  current_streak: number;
  total_practice_time: number;
  daily_goal: number;
}

interface UserStats {
  totalLessonsCompleted: number;
  totalPoints: number;
  weeklyPoints: number;
  accuracyAverage: number;
  achievementsCount: number;
}

const Dashboard = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch user statistics
      const { data: leaderboardData } = await supabase
        .from('leaderboards')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      const { count: achievementsCount } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id);

      if (leaderboardData) {
        setStats({
          totalLessonsCompleted: leaderboardData.total_lessons_completed || 0,
          totalPoints: leaderboardData.total_points || 0,
          weeklyPoints: leaderboardData.weekly_points || 0,
          accuracyAverage: leaderboardData.accuracy_average || 0,
          achievementsCount: achievementsCount || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const todayProgress = profile ? Math.min((profile.total_practice_time % 1440) / profile.daily_goal * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">
            Welcome back, {profile?.display_name || 'Learner'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to continue your ASL journey?
          </p>
        </div>
        <Badge 
          variant="outline" 
          className={`px-3 py-1 ${
            profile?.skill_level === 'beginner' ? 'border-success' :
            profile?.skill_level === 'intermediate' ? 'border-warning' : 'border-primary'
          }`}
        >
          {profile?.skill_level?.charAt(0).toUpperCase() + profile?.skill_level?.slice(1) || 'Beginner'}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold text-orange-500">{profile?.current_streak || 0}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold text-primary">{stats?.totalPoints || 0}</p>
              </div>
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lessons Done</p>
                <p className="text-2xl font-bold text-success">{stats?.totalLessonsCompleted || 0}</p>
              </div>
              <Target className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-secondary">{stats?.accuracyAverage || 0}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Progress */}
      <Card className="module-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Today's Progress
          </CardTitle>
          <CardDescription>
            Daily goal: {profile?.daily_goal || 5} minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(todayProgress)}%</span>
            </div>
            <Progress value={todayProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {todayProgress >= 100 ? "🎉 Goal achieved! Great work!" : "Keep going, you're doing great!"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="module-card hover:shadow-glow transition-all duration-300 cursor-pointer" onClick={() => onNavigate('alphabet')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Continue Learning
            </CardTitle>
            <CardDescription>
              Pick up where you left off with the ASL alphabet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full btn-hero">
              Start Learning
            </Button>
          </CardContent>
        </Card>

        <Card className="module-card hover:shadow-glow transition-all duration-300 cursor-pointer" onClick={() => onNavigate('practice')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Practice Session
            </CardTitle>
            <CardDescription>
              Test your skills with AI-powered practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full btn-practice">
              Start Practice
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="module-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Recent Achievements
          </CardTitle>
          <CardDescription>
            You've earned {stats?.achievementsCount || 0} achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.achievementsCount === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Complete your first lesson to earn achievements!</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {/* Placeholder for achievement badges */}
              <Badge variant="outline" className="py-1">
                <Trophy className="w-3 h-3 mr-1" />
                First Steps
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;