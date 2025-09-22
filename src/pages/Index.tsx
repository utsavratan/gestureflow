import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/auth/AuthPage';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import AlphabetModule from '@/components/AlphabetModule';
import TextToSign from '@/components/TextToSign';
import ASLAvatar from '@/components/ASLAvatar';
import WebcamPractice from '@/components/WebcamPractice';
import StepByStepGuide from '@/components/StepByStepGuide';
import SocialFeed from '@/components/social/SocialFeed';
import AchievementSystem from '@/components/achievements/AchievementSystem';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Users, Trophy } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const [activeModule, setActiveModule] = React.useState('dashboard');
  const [selectedLetter, setSelectedLetter] = React.useState<string>('A');
  const [translationText, setTranslationText] = React.useState<string>('');
  const [practiceTarget, setPracticeTarget] = React.useState<string>('');
  const [isAvatarPlaying, setIsAvatarPlaying] = React.useState(false);
  const [showStepGuide, setShowStepGuide] = React.useState(false);
  const [userLevel, setUserLevel] = React.useState<number>(1);
  const [isPlaying, setIsPlaying] = React.useState(false);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading Gesture Flow...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    // Reset states when switching modules
    setTranslationText('');
    setPracticeTarget('');
  };

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setIsAvatarPlaying(true);
  };

  const handleTextTranslate = (text: string) => {
    setTranslationText(text);
    setIsAvatarPlaying(true);
  };

  const handleStartPractice = (target: string) => {
    setPracticeTarget(target);
    setShowStepGuide(true);
  };

  const handleLevelUp = (newLevel: number) => {
    setUserLevel(newLevel);
  };

  const handleAchievement = (achievement: any) => {
    // Handle achievement unlocking
    console.log('Achievement unlocked:', achievement);
  };

  const handleNavigate = (section: string) => {
    setActiveModule(section);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'alphabet':
        return (
          <AlphabetModule 
            onLetterSelect={handleLetterSelect}
            onStartPractice={handleStartPractice}
          />
        );
      case 'text-to-sign':
        return (
          <TextToSign 
            onTextTranslate={handleTextTranslate}
            onSpeechTranslate={handleTextTranslate}
          />
        );
      case 'numbers':
        return (
          <Card className="module-card p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gradient">Numbers Module</h3>
              <p className="text-muted-foreground">Coming soon! Learn to sign numbers 1-100.</p>
              <Badge className="bg-success text-success-foreground">In Development</Badge>
            </div>
          </Card>
        );
      case 'vocabulary':
        return (
          <Card className="module-card p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gradient">Vocabulary Builder</h3>
              <p className="text-muted-foreground">Coming soon! Expand your ASL vocabulary with themed word sets.</p>
              <Badge className="bg-warning text-warning-foreground">Planning Phase</Badge>
            </div>
          </Card>
        );
      case 'practice':
        return (
          <div className="space-y-6">
            <StepByStepGuide
              letter={practiceTarget}
              text={practiceTarget}
              isPlaying={showStepGuide}
              onPlayStateChange={setShowStepGuide}
            />
          </div>
        );
      case 'social':
        return <SocialFeed />;
      case 'achievements':
        return <AchievementSystem />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        activeModule={activeModule}
        onModuleChange={handleModuleChange}
        user={user}
      />
      
      {/* Main Content Area */}
      <div className="lg:pl-80 flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Learning Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Header */}
            {activeModule === 'dashboard' && (
              <div className="mb-6 animate-slide-up">
                <h2 className="text-3xl font-bold text-gradient mb-2">
                  Welcome to Gesture Flow
                </h2>
                <p className="text-lg text-muted-foreground">
                  Your personalized journey to master Sign Language with AI-powered learning.
                </p>
              </div>
            )}
            
            {/* Module Content */}
            {renderModule()}
          </div>
        </div>

        {/* Right Panel - Avatar & Practice */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border bg-card/50 flex flex-col">
          {/* Avatar Section */}
          <div className="flex-1 p-4 lg:p-6">
            <ASLAvatar
              letter={activeModule === 'alphabet' ? selectedLetter : undefined}
              text={activeModule === 'text-to-sign' ? translationText : undefined}
              isPlaying={isAvatarPlaying}
              onPlayStateChange={setIsAvatarPlaying}
            />
          </div>

          {/* Webcam Practice Section */}
          <div className="flex-1 p-4 lg:p-6 border-t border-border">
            <WebcamPractice
              targetLetter={activeModule === 'alphabet' ? practiceTarget : undefined}
              targetText={activeModule === 'text-to-sign' ? practiceTarget : undefined}
              onLevelUp={handleLevelUp}
              onAchievement={handleAchievement}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
