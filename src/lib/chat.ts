import { prisma } from './prisma';

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

export async function addSystemMessage(
  raceId: string,
  content: string,
  type: ChatMessageType = 'system'
): Promise<ChatMessage> {
  const message = await prisma.chatMessage.create({
    data: {
      raceId,
      content,
      type,
      userId: 'system',
      userName: 'System',
      userAvatar: null,
    },
  });

  return message;
} 