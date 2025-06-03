import { Message } from '../entities/message.entity';

export interface MessageRepository {
  save(message: Message): Promise<void>;
  findById(id: string): Promise<Message | null>;
  findByRecipientId(recipientId: string): Promise<Message[]>;
  findByChannelId(channelId: string): Promise<Message[]>;
  findGlobalMessages(): Promise<Message[]>;
  findSystemMessages(): Promise<Message[]>;
  findRecentMessages(limit: number): Promise<Message[]>;
  findMessagesByUserId(userId: string, limit?: number): Promise<Message[]>;
}

export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';
