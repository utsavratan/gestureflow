import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, Trophy, Target } from 'lucide-react';

interface AlphabetModuleProps {
  onLetterSelect?: (letter: string) => void;
  onStartPractice?: (letter: string) => void;
}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const AlphabetModule = ({ onLetterSelect, onStartPractice }: AlphabetModuleProps) => {
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [learnedLetters, setLearnedLetters] = useState<string[]>(['A', 'B', 'C', 'D', 'E']);
  const [currentProgress] = useState(19); // 5 out of 26 letters

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    onLetterSelect?.(letter);
  };

  const handlePracticeClick = (letter: string) => {
    onStartPractice?.(letter);
  };

  const isLearned = (letter: string) => learnedLetters.includes(letter);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <Card className="module-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>ASL Alphabet</CardTitle>
                <CardDescription>Learn all 26 letters in American Sign Language</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gradient">{learnedLetters.length}/26</div>
              <div className="text-sm text-muted-foreground">Letters Learned</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Letter Grid */}
      <Card className="module-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Select a Letter to Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 mb-6">
            {alphabet.map((letter) => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? "default" : "outline"}
                size="sm"
                onClick={() => handleLetterClick(letter)}
                className={`
                  relative h-12 w-12 p-0 font-bold text-lg
                  ${selectedLetter === letter ? 'btn-hero' : ''}
                  ${isLearned(letter) ? 'border-success' : ''}
                `}
              >
                {letter}
                {isLearned(letter) && (
                  <div className="absolute -top-1 -right-1">
                    <Trophy className="w-3 h-3 text-success" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Letter Details */}
      {selectedLetter && (
        <Card className="module-card animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                    {selectedLetter}
                  </div>
                  Letter {selectedLetter}
                  {isLearned(selectedLetter) && (
                    <Badge className="bg-success text-success-foreground">
                      <Trophy className="w-3 h-3 mr-1" />
                      Learned
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {isLearned(selectedLetter) 
                    ? `Great job! You've mastered the letter ${selectedLetter}.`
                    : `Learn how to sign the letter ${selectedLetter} in ASL.`
                  }
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => onLetterSelect?.(selectedLetter)}
                  className="btn-hero"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Show Sign
                </Button>
                
                <Button 
                  onClick={() => handlePracticeClick(selectedLetter)}
                  variant="outline"
                  className="btn-practice"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Practice
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Letter Description */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">How to Sign "{selectedLetter}"</h4>
                <p className="text-muted-foreground">
                  Position your hand to form the letter {selectedLetter}. The avatar will demonstrate the correct hand position and movement.
                </p>
                
                <div className="space-y-2">
                  <h5 className="font-medium">Tips:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Keep your hand steady and clear</li>
                    <li>• Practice the movement slowly at first</li>
                    <li>• Make sure your fingers are positioned correctly</li>
                    <li>• Practice in front of a mirror for better form</li>
                  </ul>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Your Progress</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {isLearned(selectedLetter) ? '100%' : '0%'}
                    </div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-secondary">
                      {isLearned(selectedLetter) ? '5' : '0'}
                    </div>
                    <div className="text-sm text-muted-foreground">Practice Sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlphabetModule;