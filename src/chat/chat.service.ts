import { Injectable } from '@nestjs/common';
// Use Cases
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { GetMessagesUseCase } from './application/use-cases/get-messages.use-case';
import { CreateChannelUseCase } from './application/use-cases/create-channel.use-case';
import { GetChannelsUseCase } from './application/use-cases/get-channels.use-case';
import { ManageChannelMembersUseCase } from './application/use-cases/manage-channel-members.use-case';
// DTOs
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChannelResponseDto } from './dto/channel-response.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    private readonly createChannelUseCase: CreateChannelUseCase,
    private readonly getChannelsUseCase: GetChannelsUseCase,
    private readonly manageChannelMembersUseCase: ManageChannelMembersUseCase,
  ) {}

  // Métodos para gerenciar mensagens
  async sendMessage(createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    const message = await this.sendMessageUseCase.execute(
      createMessageDto.senderId,
      createMessageDto.senderName,
      createMessageDto.content,
      createMessageDto.type,
      createMessageDto.channelId,
      createMessageDto.recipientId,
    );

    const messageData = message.toPrimitives();
    return new MessageResponseDto(messageData);
  }

  async getGlobalMessages(limit?: number): Promise<MessageResponseDto[]> {
    const messages = await this.getMessagesUseCase.getGlobalMessages(limit);
    return messages.map(message => new MessageResponseDto(message.toPrimitives()));
  }

  async getSystemMessages(limit?: number): Promise<MessageResponseDto[]> {
    const messages = await this.getMessagesUseCase.getSystemMessages(limit);
    return messages.map(message => new MessageResponseDto(message.toPrimitives()));
  }

  async getUserMessages(userId: string, limit?: number): Promise<MessageResponseDto[]> {
    const messages = await this.getMessagesUseCase.getUserMessages(userId, limit);
    return messages.map(message => new MessageResponseDto(message.toPrimitives()));
  }

  async getPrivateMessages(userId: string, limit?: number): Promise<MessageResponseDto[]> {
    const messages = await this.getMessagesUseCase.getPrivateMessages(userId, limit);
    return messages.map(message => new MessageResponseDto(message.toPrimitives()));
  }

  async getChannelMessages(channelId: string, limit?: number): Promise<MessageResponseDto[]> {
    const messages = await this.getMessagesUseCase.getChannelMessages(channelId, limit);
    return messages.map(message => new MessageResponseDto(message.toPrimitives()));
  }

  async getRecentMessages(limit: number = 50): Promise<MessageResponseDto[]> {
    const messages = await this.getMessagesUseCase.getRecentMessages(limit);
    return messages.map(message => new MessageResponseDto(message.toPrimitives()));
  }

  // Métodos para gerenciar canais
  async createChannel(createChannelDto: CreateChannelDto): Promise<ChannelResponseDto> {
    const channel = await this.createChannelUseCase.execute(
      createChannelDto.name,
      createChannelDto.description || '',
      createChannelDto.ownerId,
      createChannelDto.isPublic !== undefined ? createChannelDto.isPublic : true,
    );

    const channelData = channel.toPrimitives();
    return new ChannelResponseDto(channelData);
  }

  async getPublicChannels(): Promise<ChannelResponseDto[]> {
    const channels = await this.getChannelsUseCase.getPublicChannels();
    return channels.map(channel => new ChannelResponseDto(channel.toPrimitives()));
  }

  async getUserChannels(userId: string): Promise<ChannelResponseDto[]> {
    const channels = await this.getChannelsUseCase.getUserChannels(userId);
    return channels.map(channel => new ChannelResponseDto(channel.toPrimitives()));
  }

  async getChannelById(channelId: string): Promise<ChannelResponseDto> {
    const channel = await this.getChannelsUseCase.getChannelById(channelId);
    return new ChannelResponseDto(channel.toPrimitives());
  }

  // Métodos para gerenciar membros de canais
  async addChannelMember(channelId: string, userId: string, byUserId: string): Promise<void> {
    await this.manageChannelMembersUseCase.addMember(channelId, userId, byUserId);
  }

  async removeChannelMember(channelId: string, userId: string, byUserId: string): Promise<void> {
    await this.manageChannelMembersUseCase.removeMember(channelId, userId, byUserId);
  }

  async addChannelModerator(channelId: string, userId: string, byUserId: string): Promise<void> {
    await this.manageChannelMembersUseCase.addModerator(channelId, userId, byUserId);
  }

  async removeChannelModerator(channelId: string, userId: string, byUserId: string): Promise<void> {
    await this.manageChannelMembersUseCase.removeModerator(channelId, userId, byUserId);
  }
}