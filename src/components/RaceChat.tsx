import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'chat' | 'system' | 'achievement';
}

interface RaceChatProps {
  raceId: string;
  userId: string;
  userName: string;
  userAvatar: string;
}

export function RaceChat({
  raceId,
  userId,
  userName,
  userAvatar,
}: RaceChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/races/${raceId}/chat`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch messages');
      }

      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds

    // In a real app, use WebSocket for real-time chat
    // const ws = new WebSocket(`ws://your-websocket-url/races/${raceId}/chat`);
    // ws.onmessage = (event) => {
    //   const message = JSON.parse(event.data);
    //   setMessages(prev => [...prev, message]);
    // };

    return () => {
      clearInterval(interval);
      // ws.close();
    };
  }, [raceId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/races/${raceId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage,
          userId,
          userName,
          userAvatar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setNewMessage('');
      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getMessageStyle = (type: ChatMessage['type']) => {
    switch (type) {
      case 'system':
        return 'bg-gray-100 text-gray-600';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Race Chat</h3>

      <div className="h-96 overflow-y-auto mb-4">
        {isLoading ? (
          <p className="text-center py-4">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No messages yet</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${getMessageStyle(message.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {message.type === 'chat' && (
                    <img
                      src={message.avatar}
                      alt={message.userName}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">
                        {message.type === 'chat' ? message.userName : 'System'}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          Send
        </Button>
      </form>
    </Card>
  );
} 