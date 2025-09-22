import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  BookOpen, 
  MessageCircle, 
  Target, 
  Trophy, 
  User, 
  Menu,
  X,
  Hash,
  Type,
  Brain,
  BarChart3,
  LogOut
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface NavigationProps {
  activeModule?: string;
  onModuleChange?: (module: string) => void;
  user?: any;
}

const modules = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: BarChart3,
    description: 'Your progress',
    progress: 100,
    badge: null
  },
  {
    id: 'alphabet',
    name: 'Alphabet',
    icon: BookOpen,
    description: 'Learn A-Z signs',
    progress: 19,
    badge: '5/26'
  },
  {
    id: 'numbers',
    name: 'Numbers',
    icon: Hash,
    description: 'Learn 1-100',
    progress: 0,
    badge: 'New'
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    icon: Brain,
    description: 'Common words',
    progress: 0,
    badge: 'Coming Soon'
  },
  {
    id: 'text-to-sign',
    name: 'Text to Sign',
    icon: MessageCircle,
    description: 'Translate text',
    progress: 100,
    badge: null
  },
  {
    id: 'practice',
    name: 'Practice Mode',
    icon: Target,
    description: 'Test your skills',
    progress: 0,
    badge: null
  },
  {
    id: 'social',
    name: 'Social',
    icon: Trophy,
    description: 'Connect with friends',
    progress: 0,
    badge: null
  },
  {
    id: 'achievements',
    name: 'Achievements',
    icon: Trophy,
    description: 'View progress',
    progress: 0,
    badge: null
  }
];

const Navigation = ({ activeModule = 'dashboard', onModuleChange, user }: NavigationProps) => {
  const { signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleModuleClick = (moduleId: string) => {
    onModuleChange?.(moduleId);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block w-80 border-r border-border bg-card">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
              <Type className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">Gesture Flow</h1>
            <p className="text-muted-foreground">Learn Sign Language with AI</p>
          </div>

          {/* Progress Overview */}
          <Card className="p-4 bg-gradient-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                <span className="font-medium">Your Progress</span>
              </div>
              <Badge className="bg-success text-success-foreground">Beginner</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Completion</span>
                <span>12%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </Card>

          {/* Module List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Learning Modules
            </h3>
            
            {modules.map((module) => {
              const IconComponent = module.icon;
              const isActive = activeModule === module.id;
              const isDisabled = module.badge === 'Coming Soon';
              
              return (
                <Button
                  key={module.id}
                  variant="ghost"
                  onClick={() => !isDisabled && handleModuleClick(module.id)}
                  disabled={isDisabled}
                  className={`
                    w-full justify-start h-auto p-4 text-left
                    ${isActive ? 'bg-primary/10 text-primary border-l-4 border-primary' : ''}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'}
                  `}
                >
                  <div className="flex items-center gap-3 w-full">
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{module.name}</span>
                        {module.badge && (
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              module.badge === 'New' ? 'bg-success text-success-foreground' :
                              module.badge === 'Coming Soon' ? 'bg-muted text-muted-foreground' :
                              'bg-primary text-primary-foreground'
                            }`}
                          >
                            {module.badge}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {module.description}
                      </p>
                      
                      {module.progress > 0 && (
                        <div className="mt-2">
                          <div className="w-full bg-muted rounded-full h-1">
                            <div 
                              className="bg-primary h-1 rounded-full transition-all duration-300" 
                              style={{ width: `${module.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* User Profile */}
          <Card className="p-4 bg-gradient-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{user?.email?.split('@')[0] || 'User'}</div>
                <div className="text-xs text-muted-foreground">5 signs mastered</div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Menu className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
              <Type className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gradient">Gesture Flow</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/20" onClick={toggleMobileMenu} />
            <div className="fixed top-0 left-0 right-0 bg-background border-b border-border p-4 space-y-4 animate-slide-up">
              {modules.map((module) => {
                const IconComponent = module.icon;
                const isActive = activeModule === module.id;
                const isDisabled = module.badge === 'Coming Soon';
                
                return (
                  <Button
                    key={module.id}
                    variant="ghost"
                    onClick={() => !isDisabled && handleModuleClick(module.id)}
                    disabled={isDisabled}
                    className={`
                      w-full justify-start h-auto p-3 text-left
                      ${isActive ? 'bg-primary text-primary-foreground' : ''}
                      ${isDisabled ? 'opacity-50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4" />
                      <span>{module.name}</span>
                      {module.badge && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          {module.badge}
                        </Badge>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;