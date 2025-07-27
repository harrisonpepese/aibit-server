import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';

@Injectable()
export class InMemoryMessageRepository implements MessageRepository {
  private messages: Map<string, Message> = new Map();

  async save(message: Message): Promise<void> {
    this.messages.set(message.getId(), message);
  }

  async findById(id: string): Promise<Message | null> {
    return this.messages.get(id) || null;
  }

  async findByRecipientId(recipientId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.getRecipientId() === recipientId)
      .sort((a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime());
  }

  async findByChannelId(channelId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.getChannelId() === channelId)
      .sort((a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime());
  }

  async findGlobalMessages(): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.getType() === 'GLOBAL')
      .sort((a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime());
  }

  async findSystemMessages(): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.getType() === 'SYSTEM')
      .sort((a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime());
  }

  async findRecentMessages(limit: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .sort((a, b) => b.getTimestamp().getTime() - a.getTimestamp().getTime())
      .slice(0, limit);
  }

  async findMessagesByUserId(userId: string, limit?: number): Promise<Message[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(message => 
        message.isGlobal() || 
        message.isSystem() || 
        (message.isPrivate() && (message.getSenderId() === userId || message.getRecipientId() === userId)) ||
        (message.isChannel() && message.isVisibleTo(userId))
      )
      .sort((a, b) => a.getTimestamp().getTime() - b.getTimestamp().getTime());

    return limit ? userMessages.slice(-limit) : userMessages;
  }
}