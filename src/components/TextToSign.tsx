import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Mic, MicOff, Volume2, Type, Trash2 } from 'lucide-react';

// Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface TextToSignProps {
  onTextTranslate?: (text: string) => void;
  onSpeechTranslate?: (text: string) => void;
}

const TextToSign = ({ onTextTranslate, onSpeechTranslate }: TextToSignProps) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recentTranslations, setRecentTranslations] = useState([
    'Hello World',
    'Good Morning',
    'Thank You',
    'How are you?'
  ]);

  const handleTextTranslate = () => {
    if (inputText.trim()) {
      onTextTranslate?.(inputText);
      // Add to recent translations
      setRecentTranslations(prev => [inputText, ...prev.filter(t => t !== inputText)].slice(0, 8));
    }
  };

  const handleSpeechToText = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(!isListening);

    if (!isListening) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        onSpeechTranslate?.(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const handleQuickTranslate = (text: string) => {
    setInputText(text);
    onTextTranslate?.(text);
  };

  const clearText = () => {
    setInputText('');
  };

  const speakText = () => {
    if (inputText && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(inputText);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <Card className="module-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-secondary rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            Text to Sign Language
          </CardTitle>
          <CardDescription>
            Type or speak any text to see it translated into sign language
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Input Area */}
          <div className="relative">
            <Textarea
              placeholder="Type your message here... (e.g., 'Hello, how are you today?')"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-32 pr-20 resize-none"
              maxLength={500}
            />
            
            <div className="absolute bottom-3 right-3 flex gap-2">
              {inputText && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={speakText}
                    className="h-8 w-8 p-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearText}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Character Count */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{inputText.length}/500 characters</span>
            {inputText.split(' ').filter(w => w.length > 0).length > 0 && (
              <span>{inputText.split(' ').filter(w => w.length > 0).length} words</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleTextTranslate}
              disabled={!inputText.trim()}
              className="btn-hero flex-1"
            >
              <Type className="w-4 h-4 mr-2" />
              Translate to Signs
            </Button>

            <Button
              onClick={handleSpeechToText}
              variant="outline"
              className={`flex-1 ${isListening ? 'btn-practice animate-pulse' : ''}`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Use Voice
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Translations */}
      <Card className="module-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Translations</CardTitle>
          <CardDescription>
            Click on any phrase below for instant translation
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recentTranslations.map((text, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-2"
                onClick={() => handleQuickTranslate(text)}
              >
                {text}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="module-card">
        <CardHeader>
          <CardTitle className="text-lg">Translation Tips</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Best Practices:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use simple, clear sentences</li>
                <li>• Avoid complex grammar structures</li>
                <li>• Break long sentences into parts</li>
                <li>• Focus on key words and concepts</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Voice Input:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Speak clearly and at normal speed</li>
                <li>• Use a quiet environment</li>
                <li>• Allow microphone access</li>
                <li>• Pause briefly after speaking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TextToSign;