import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Maximize, 
  Minimize, 
  Camera, 
  Target, 
  Zap, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Star,
  User,
  Heart,
  MessageCircle,
  Share
} from 'lucide-react';

interface FullscreenUIProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  children: React.ReactNode;
  mode?: 'practice' | 'social' | 'learning';
  stats?: {
    accuracy?: number;
    streak?: number;
    level?: number;
    score?: number;
  };
}

const FullscreenUI: React.FC<FullscreenUIProps> = ({
  isFullscreen,
  onToggleFullscreen,
  children,
  mode = 'practice',
  stats = {}
}) => {
  const [showStats, setShowStats] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Auto-hide stats after 3 seconds in fullscreen
  useEffect(() => {
    if (isFullscreen && showStats) {
      const timer = setTimeout(() => setShowStats(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, showStats]);

  // Show notification
  const showNotification = (type: 'success' | 'warning' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!isFullscreen) {
    return (
      <div className="relative">
        <Button
          onClick={onToggleFullscreen}
          size="sm"
          variant="outline"
          className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
        >
          <Maximize className="w-4 h-4" />
        </Button>
        {children}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      {/* Fullscreen Header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className={`p-4 bg-background/90 backdrop-blur-sm border-b border-border transition-transform duration-300 ${
          showStats ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Left: Mode & Stats */}
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-primary text-primary-foreground capitalize">
                {mode} Mode
              </Badge>
              
              {mode === 'practice' && (
                <div className="flex items-center gap-4 text-sm">
                  {stats.accuracy !== undefined && (
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-success" />
                      <span className="font-medium">{stats.accuracy}%</span>
                    </div>
                  )}
                  {stats.streak !== undefined && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-warning" />
                      <span className="font-medium">{stats.streak}</span>
                    </div>
                  )}
                  {stats.level !== undefined && (
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="font-medium">Lv.{stats.level}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowStats(!showStats)}
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
              >
                Stats
              </Button>
              <Button
                onClick={onToggleFullscreen}
                size="sm"
                variant="outline"
              >
                <Minimize className="w-4 h-4 mr-2" />
                Exit Fullscreen
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full pt-16 pb-4 px-4">
        <div className="max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Primary Content - Takes 2/3 on desktop */}
          <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-1 p-6 overflow-hidden">
              {children}
            </Card>
          </div>

          {/* Side Panel - Stats & Info */}
          <div className="hidden lg:flex flex-col space-y-4">
            {/* Live Stats */}
            {mode === 'practice' && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Live Performance
                </h3>
                
                <div className="space-y-3">
                  {stats.accuracy !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Accuracy</span>
                        <span className="font-medium">{stats.accuracy}%</span>
                      </div>
                      <Progress value={stats.accuracy} className="h-2" />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-success-light p-2 rounded text-center">
                      <div className="text-lg font-bold text-success">{stats.streak || 0}</div>
                      <div className="text-success">Streak</div>
                    </div>
                    <div className="bg-primary-glow p-2 rounded text-center">
                      <div className="text-lg font-bold text-primary">{stats.level || 1}</div>
                      <div className="text-primary">Level</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Camera className="w-4 h-4 mr-2" />
                  New Practice Session
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Share Achievement
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Find Friends
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            {mode === 'social' && (
              <Card className="p-4 flex-1 overflow-hidden">
                <h3 className="font-semibold mb-3">Activity Feed</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <span>Completed Alphabet Module</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                    <span>Level 5 Achievement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <span>5 new friend requests</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="absolute top-20 right-4 z-30">
          <Card className={`p-3 ${
            notification.type === 'success' ? 'bg-success-light border-success' :
            notification.type === 'warning' ? 'bg-warning-light border-warning' :
            'bg-error-light border-error'
          } animate-slide-up`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-success" />}
              {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-warning" />}
              {notification.type === 'error' && <XCircle className="w-4 h-4 text-error" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </Card>
        </div>
      )}

      {/* Mobile Stats Overlay */}
      <div className="lg:hidden absolute bottom-4 left-4 right-4">
        <Card className="p-3 bg-background/90 backdrop-blur-sm">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="font-medium">Accuracy: {stats.accuracy || 0}%</span>
              <span>Streak: {stats.streak || 0}</span>
              <span>Level: {stats.level || 1}</span>
            </div>
            <Button
              onClick={onToggleFullscreen}
              size="sm"
              variant="ghost"
            >
              <Minimize className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FullscreenUI;