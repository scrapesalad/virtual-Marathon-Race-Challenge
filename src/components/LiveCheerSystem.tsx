'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface Cheer {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  type: 'text' | 'audio';
  audioUrl?: string;
}

interface LiveCheerSystemProps {
  runnerId: string;
  runnerName: string;
  currentCheckpoint: string;
  nextCheckpoint: string;
  distanceToNextCheckpoint: number;
}

export function LiveCheerSystem({
  runnerId,
  runnerName,
  currentCheckpoint,
  nextCheckpoint,
  distanceToNextCheckpoint
}: LiveCheerSystemProps) {
  const [cheers, setCheers] = useState<Cheer[]>([]);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Mock function to fetch cheers - in a real app, this would use WebSockets
  useEffect(() => {
    const mockCheers: Cheer[] = [
      {
        id: '1',
        sender: 'Sarah',
        message: 'You\'re doing great! Keep pushing!',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        type: 'text'
      },
      {
        id: '2',
        sender: 'Mike',
        message: 'Almost at the halfway point!',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        type: 'text'
      }
    ];
    
    setCheers(mockCheers);
    
    // Simulate new cheers coming in
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newCheer: Cheer = {
          id: Date.now().toString(),
          sender: ['Emma', 'David', 'Lisa', 'Tom'][Math.floor(Math.random() * 4)],
          message: [
            'You\'ve got this!',
            'Looking strong!',
            'Keep going!',
            'You\'re amazing!',
            'Almost there!'
          ][Math.floor(Math.random() * 5)],
          timestamp: new Date().toISOString(),
          type: 'text'
        };
        
        setCheers(prev => [newCheer, ...prev].slice(0, 10));
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newCheer: Cheer = {
      id: Date.now().toString(),
      sender: 'You',
      message,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    setCheers(prev => [newCheer, ...prev]);
    setMessage('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      // Stop all tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudioCheer = () => {
    if (!audioBlob) return;
    
    // In a real app, you would upload the audio to a server
    // For now, we'll just simulate it
    const newCheer: Cheer = {
      id: Date.now().toString(),
      sender: 'You',
      message: 'Audio cheer',
      timestamp: new Date().toISOString(),
      type: 'audio',
      audioUrl: URL.createObjectURL(audioBlob)
    };
    
    setCheers(prev => [newCheer, ...prev]);
    setAudioBlob(null);
  };

  const shareRacePage = async () => {
    setIsSharing(true);
    
    try {
      // In a real app, this would generate a shareable link
      const shareUrl = `${window.location.origin}/cheer/${runnerId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `Cheer for ${runnerName} in their virtual race!`,
          text: `Send your support to ${runnerName} as they run their virtual race!`,
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Live Cheers</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={shareRacePage}
            disabled={isSharing}
          >
            {isSharing ? 'Sharing...' : 'Request Cheers'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Current Checkpoint: {currentCheckpoint}</p>
          <p className="text-sm text-muted-foreground">
            Next Checkpoint: {nextCheckpoint} ({distanceToNextCheckpoint.toFixed(1)} km away)
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your cheer message..."
              className="flex-1 px-3 py-2 border rounded-md"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
          
          <div className="flex gap-2">
            {!isRecording ? (
              <Button 
                variant="outline" 
                onClick={startRecording}
                className="flex-1"
              >
                Record Audio Cheer
              </Button>
            ) : (
              <>
                <Button 
                  variant="secondary"
                  onClick={stopRecording}
                  className="flex-1"
                >
                  Stop Recording
                </Button>
                {audioBlob && (
                  <Button 
                    onClick={sendAudioCheer}
                    className="flex-1"
                  >
                    Send Audio
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {cheers.map((cheer) => (
            <div key={cheer.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{cheer.sender}</span>
                  <Badge variant="default" className="ml-2">
                    {cheer.type === 'audio' ? '🎤 Audio' : '💬 Text'}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(cheer.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              {cheer.type === 'text' ? (
                <p className="mt-1">{cheer.message}</p>
              ) : (
                <div className="mt-1">
                  <audio 
                    controls 
                    src={cheer.audioUrl} 
                    className="w-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 