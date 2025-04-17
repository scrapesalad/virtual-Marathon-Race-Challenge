export type ChatMessageType = 'user' | 'system' | 'achievement';

export interface ChatMessage {
  id: string;
  raceId: string;
  type: ChatMessageType;
  content: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userAvatar: string | null;
} 