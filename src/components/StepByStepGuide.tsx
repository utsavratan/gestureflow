import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  CheckCircle, 
  Circle,
  Hand,
  Eye,
  Target
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  instruction: string;
  handPosition: string;
  movement: string;
  tip: string;
}

interface StepByStepGuideProps {
  letter?: string;
  text?: string;
  onStepComplete?: (stepId: number) => void;
  onAllStepsComplete?: () => void;
  isPlaying?: boolean;
  onPlayStateChange?: (playing: boolean) => void;
}

const StepByStepGuide = ({
  letter,
  text,
  onStepComplete,
  onAllStepsComplete,
  isPlaying = false,
  onPlayStateChange
}: StepByStepGuideProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [autoPlay, setAutoPlay] = useState(false);
  const [stepTimer, setStepTimer] = useState<NodeJS.Timeout | null>(null);

  // Generate steps based on letter or text
  const generateSteps = (): Step[] => {
    if (letter) {
      return generateLetterSteps(letter);
    } else if (text) {
      return generateTextSteps(text);
    }
    return [];
  };

  const generateLetterSteps = (letter: string): Step[] => {
    const letterSteps: Record<string, Step[]> = {
      'A': [
        {
          id: 1,
          title: 'Form the Fist',
          description: 'Close your fingers into a fist',
          instruction: 'Make a closed fist with your dominant hand',
          handPosition: 'Fingers closed, thumb against side',
          movement: 'Close all fingers simultaneously',
          tip: 'Keep your thumb against the side of your index finger'
        },
        {
          id: 2,
          title: 'Position the Thumb',
          description: 'Place thumb against the side of your fist',
          instruction: 'Your thumb should rest against the side of your closed fingers',
          handPosition: 'Thumb flat against index finger',
          movement: 'Gently press thumb against fist',
          tip: 'The thumb should be straight and flat'
        },
        {
          id: 3,
          title: 'Final Position',
          description: 'Hold the A handshape clearly',
          instruction: 'Present your hand with palm facing away from you',
          handPosition: 'Fist with thumb at side, palm forward',
          movement: 'Hold steady for 2-3 seconds',
          tip: 'Make sure your hand is clearly visible to others'
        }
      ],
      'B': [
        {
          id: 1,
          title: 'Extend Fingers',
          description: 'Straighten your four fingers',
          instruction: 'Hold your four fingers straight up and together',
          handPosition: 'Four fingers extended upward',
          movement: 'Straighten fingers from closed position',
          tip: 'Keep fingers close together and straight'
        },
        {
          id: 2,
          title: 'Fold the Thumb',
          description: 'Bend your thumb across your palm',
          instruction: 'Fold your thumb across your palm, touching the base of your fingers',
          handPosition: 'Thumb folded across palm',
          movement: 'Bend thumb inward to palm',
          tip: 'Thumb should touch the palm near the base of fingers'
        },
        {
          id: 3,
          title: 'Present the Sign',
          description: 'Show the B handshape clearly',
          instruction: 'Hold your hand with palm facing forward',
          handPosition: 'Four fingers up, thumb folded, palm forward',
          movement: 'Hold steady position',
          tip: 'Ensure clear visibility of the handshape'
        }
      ]
    };

    return letterSteps[letter.toUpperCase()] || [
      {
        id: 1,
        title: `Form Letter ${letter.toUpperCase()}`,
        description: `Create the handshape for ${letter.toUpperCase()}`,
        instruction: `Follow the standard ASL handshape for ${letter.toUpperCase()}`,
        handPosition: 'Standard ASL position',
        movement: 'Form and hold',
        tip: 'Practice the handshape slowly and clearly'
      }
    ];
  };

  const generateTextSteps = (text: string): Step[] => {
    const words = text.toLowerCase().split(' ');
    const steps: Step[] = [];
    
    words.forEach((word, wordIndex) => {
      word.split('').forEach((char, charIndex) => {
        steps.push({
          id: steps.length + 1,
          title: `Letter ${char.toUpperCase()}`,
          description: `Form the letter ${char.toUpperCase()} in word "${word}"`,
          instruction: `Create the handshape for ${char.toUpperCase()}`,
          handPosition: `ASL handshape for ${char.toUpperCase()}`,
          movement: 'Form, hold, then transition',
          tip: `Part of word: ${word} (${charIndex + 1}/${word.length})`
        });
      });
      
      if (wordIndex < words.length - 1) {
        steps.push({
          id: steps.length + 1,
          title: 'Word Transition',
          description: 'Brief pause between words',
          instruction: 'Lower hand slightly and pause',
          handPosition: 'Neutral position',
          movement: 'Small downward movement',
          tip: 'Clear separation between words'
        });
      }
    });

    return steps;
  };

  const steps = generateSteps();
  const progress = (completedSteps.size / steps.length) * 100;

  useEffect(() => {
    if (autoPlay && isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        handleNextStep();
      }, 3000); // 3 seconds per step
      
      setStepTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [autoPlay, isPlaying, currentStep, steps.length]);

  const handlePlayPause = () => {
    console.log('Play/Pause clicked. Current isPlaying:', isPlaying);
    const newPlayState = !autoPlay; // Toggle autoPlay, not isPlaying
    setAutoPlay(newPlayState);
    onPlayStateChange?.(newPlayState);
    
    if (!newPlayState && stepTimer) {
      clearTimeout(stepTimer);
      setStepTimer(null);
    }
    
    console.log('New autoPlay state:', newPlayState);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(steps[currentStep].id);
    setCompletedSteps(newCompleted);
    onStepComplete?.(steps[currentStep].id);
    
    if (newCompleted.size === steps.length) {
      onAllStepsComplete?.();
      setAutoPlay(false);
      onPlayStateChange?.(false);
    }
  };

  const handleStepSelect = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setAutoPlay(false);
    onPlayStateChange?.(false);
  };

  if (steps.length === 0) {
    return (
      <Card className="module-card">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Select a letter or enter text to see step-by-step guidance</p>
        </CardContent>
      </Card>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="space-y-4">
      {/* Progress Overview */}
      <Card className="module-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Step-by-Step Guide</CardTitle>
            <Badge variant="outline">
              {completedSteps.size} / {steps.length} completed
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Current Step Details */}
      <Card className="module-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {completedSteps.has(currentStepData.id) ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                Step {currentStep + 1}: {currentStepData.title}
              </CardTitle>
              <p className="text-muted-foreground mt-1">{currentStepData.description}</p>
            </div>
            <Badge variant={completedSteps.has(currentStepData.id) ? "default" : "outline"}>
              {currentStep + 1} / {steps.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step Instructions */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Hand className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Hand Position</p>
                  <p className="text-sm text-muted-foreground">{currentStepData.handPosition}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Movement</p>
                  <p className="text-sm text-muted-foreground">{currentStepData.movement}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Eye className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Instruction</p>
                  <p className="text-sm text-muted-foreground">{currentStepData.instruction}</p>
                </div>
              </div>
              
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium text-warning">💡 Tip</p>
                <p className="text-sm text-muted-foreground">{currentStepData.tip}</p>
              </div>
            </div>
          </div>

          {/* Step Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevStep}
                disabled={currentStep === 0}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                className="min-w-[80px]"
              >
                {autoPlay ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextStep}
                disabled={currentStep === steps.length - 1}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={handleStepComplete}
              disabled={completedSteps.has(currentStepData.id)}
              className="btn-success"
            >
              {completedSteps.has(currentStepData.id) ? 'Completed' : 'Mark Complete'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps Overview */}
      <Card className="module-card">
        <CardHeader>
          <CardTitle className="text-sm">All Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepSelect(index)}
                className={`flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                  index === currentStep
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50'
                }`}
              >
                {completedSteps.has(step.id) ? (
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{step.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                </div>
                <Badge variant={index === currentStep ? "default" : "outline"} className="text-xs">
                  {index + 1}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepByStepGuide;