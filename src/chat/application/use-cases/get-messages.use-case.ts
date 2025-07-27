import { Injectable, Inject } from '@nestjs/common';
import { Message } from '../../domain/entities/message.entity';
import { MessageRepository, MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';

@Injectable()
export class GetMessagesUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
  ) {}

  async getGlobalMessages(limit?: number): Promise<Message[]> {
    const messages = await this.messageRepository.findGlobalMessages();
    return limit ? messages.slice(-limit) : messages;
  }

  async getSystemMessages(limit?: number): Promise<Message[]> {
    const messages = await this.messageRepository.findSystemMessages();
    return limit ? messages.slice(-limit) : messages;
  }

  async getPrivateMessages(userId: string, limit?: number): Promise<Message[]> {
    const messages = await this.messageRepository.findMessagesByUserId(userId, limit);
    return messages.filter(message => message.isPrivate());
  }

  async getChannelMessages(channelId: string, limit?: number): Promise<Message[]> {
    const messages = await this.messageRepository.findByChannelId(channelId);
    return limit ? messages.slice(-limit) : messages;
  }

  async getUserMessages(userId: string, limit?: number): Promise<Message[]> {
    return this.messageRepository.findMessagesByUserId(userId, limit);
  }

  async getRecentMessages(limit: number = 50): Promise<Message[]> {
    return this.messageRepository.findRecentMessages(limit);
  }
}