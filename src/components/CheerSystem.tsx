'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { toast } from '@/components/ui/Toast';

interface Cheer {
  id: string;
  message: string;
  audioUrl?: string;
  milestone: number;
  senderName?: string;
  isPublic: boolean;
  createdAt: string;
}

interface Checkpoint {
  id: string;
  name: string;
  description?: string;
  distance: number;
  coordinates: [number, number];
}

interface CheerSystemProps {
  userRaceId: string;
  checkpoints: Checkpoint[];
  currentProgress: number;
  raceName: string;
  raceDistance: number;
}

export function CheerSystem({ userRaceId, checkpoints, currentProgress, raceName, raceDistance }: CheerSystemProps) {
  const [cheers, setCheers] = useState<Cheer[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);

  useEffect(() => {
    fetchCheers();
  }, [userRaceId]);

  const fetchCheers = async () => {
    try {
      const response = await fetch(`/api/cheers?userRaceId=${userRaceId}`);
      const data = await response.json();
      setCheers(data);
    } catch (error) {
      console.error('Error fetching cheers:', error);
    }
  };

  const handleSendCheer = async () => {
    if (!selectedCheckpoint || !newMessage) return;

    try {
      const formData = new FormData();
      formData.append('message', newMessage);
      formData.append('milestone', selectedCheckpoint.distance.toString());
      formData.append('userRaceId', userRaceId);
      if (audioBlob) {
        formData.append('audio', audioBlob);
      }

      const response = await fetch('/api/cheers', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your message will be delivered at the checkpoint.',
          variant: 'success',
        });
        setNewMessage('');
        setAudioBlob(null);
        setSelectedCheckpoint(null);
        fetchCheers();
      }
    } catch (error) {
      console.error('Error sending cheer:', error);
      toast({
        title: 'Error',
        description: 'Failed to send cheer. Please try again.',
        variant: 'error',
      });
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Stop recording after 30 seconds
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
      }, 30000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Error',
        description: 'Could not access microphone. Please check your permissions.',
        variant: 'error',
      });
    }
  };

  const handleShareRace = async () => {
    const shareUrl = `${window.location.origin}/races/share/${userRaceId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Success',
        description: 'Share link copied to clipboard!',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleSocialShare = async (platform: 'twitter' | 'facebook') => {
    const shareUrl = `${window.location.origin}/races/share/${userRaceId}`;
    const text = `Cheer me on as I complete the virtual ${raceName}! 🏃‍♂️`;
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Cheers</span>
            <Button onClick={() => setShowShareDialog(true)}>Request Cheers</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checkpoints.map((checkpoint) => (
              <div
                key={checkpoint.id}
                className={`p-4 border rounded-lg ${
                  currentProgress >= checkpoint.distance ? 'bg-green-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{checkpoint.name}</h3>
                  <Badge variant={currentProgress >= checkpoint.distance ? 'success' : 'default'}>
                    {checkpoint.distance}km
                  </Badge>
                </div>
                {checkpoint.description && (
                  <p className="text-sm text-gray-600 mb-2">{checkpoint.description}</p>
                )}
                <div className="space-y-2">
                  {cheers
                    .filter((cheer) => Math.abs(cheer.milestone - checkpoint.distance) < 0.1)
                    .map((cheer) => (
                      <div key={cheer.id} className="bg-white p-2 rounded border">
                        <p className="text-sm">{cheer.message}</p>
                        {cheer.audioUrl && (
                          <audio controls className="mt-2 w-full h-8">
                            <source src={cheer.audioUrl} type="audio/wav" />
                          </audio>
                        )}
                        {cheer.senderName && (
                          <p className="text-xs text-gray-500 mt-1">From: {cheer.senderName}</p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Race</DialogTitle>
            <DialogDescription>
              Share your race with friends and family to receive cheers along the way!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={handleShareRace} className="w-full">
              Copy Share Link
            </Button>
            <div className="flex gap-4">
              <Button
                onClick={() => handleSocialShare('twitter')}
                className="flex-1 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              >
                Share on Twitter
              </Button>
              <Button
                onClick={() => handleSocialShare('facebook')}
                className="flex-1 bg-[#4267B2] hover:bg-[#4267B2]/90"
              >
                Share on Facebook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Send a Cheer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Checkpoint
              </label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm"
                value={selectedCheckpoint?.id || ''}
                onChange={(e) => {
                  const checkpoint = checkpoints.find(c => c.id === e.target.value);
                  setSelectedCheckpoint(checkpoint || null);
                }}
              >
                <option value="">Choose a checkpoint...</option>
                {checkpoints.map((checkpoint) => (
                  <option key={checkpoint.id} value={checkpoint.id}>
                    {checkpoint.name} ({checkpoint.distance}km)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write your encouraging message..."
                className="mb-2"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleStartRecording}
                disabled={isRecording}
              >
                {isRecording ? 'Recording...' : 'Record Audio'}
              </Button>
              <Button
                type="button"
                onClick={handleSendCheer}
                disabled={!selectedCheckpoint || !newMessage}
              >
                Send Cheer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 