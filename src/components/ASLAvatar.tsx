import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ASLAvatarProps {
  text?: string;
  letter?: string;
  isPlaying?: boolean;
  onPlayStateChange?: (playing: boolean) => void;
}

const ASLAvatar = ({ text, letter, isPlaying = false, onPlayStateChange }: ASLAvatarProps) => {
  const [playing, setPlaying] = useState(isPlaying);
  const [currentSign, setCurrentSign] = useState(letter || text || '');

  useEffect(() => {
    setCurrentSign(letter || text || '');
  }, [letter, text]);

  const handlePlayPause = () => {
    const newState = !playing;
    setPlaying(newState);
    onPlayStateChange?.(newState);
  };

  const handleReplay = () => {
    setPlaying(false);
    setTimeout(() => setPlaying(true), 100);
    onPlayStateChange?.(true);
  };

  return (
    <div className="avatar-container w-full h-full flex flex-col items-center justify-center p-6 relative">
      {/* Avatar Display Area */}
      <div className="flex-1 w-full flex items-center justify-center mb-4">
        <div className="w-64 h-64 bg-gradient-hero rounded-full flex items-center justify-center shadow-glow animate-float">
          <div className="text-6xl font-bold text-white">
            {currentSign.charAt(0).toUpperCase() || '👋'}
          </div>
        </div>
      </div>

      {/* Current Sign Display */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gradient mb-2">
          {letter ? `Letter: ${letter.toUpperCase()}` : text ? `Signing: "${text}"` : 'ASL Avatar'}
        </h3>
        <p className="text-muted-foreground">
          {letter ? 'Watch the hand position carefully' : 'Demonstrating sign language'}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={handlePlayPause}
          variant="outline"
          size="sm"
          className="btn-hero"
        >
          {playing ? (
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
          onClick={handleReplay}
          variant="outline"
          size="sm"
          className="btn-practice"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Replay
        </Button>
      </div>

      {/* Playing Indicator */}
      {playing && (
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse-slow"></div>
        </div>
      )}
    </div>
  );
};

export default ASLAvatar;