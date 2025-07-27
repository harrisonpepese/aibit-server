import { MessageType } from '../domain/entities/message.entity';

export class MessageResponseDto {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  channelId?: string;
  recipientId?: string;

  constructor(data: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    type: MessageType;
    timestamp: Date;
    channelId?: string;
    recipientId?: string;
  }) {
    this.id = data.id;
    this.senderId = data.senderId;
    this.senderName = data.senderName;
    this.content = data.content;
    this.type = data.type;
    this.timestamp = data.timestamp;
    this.channelId = data.channelId;
    this.recipientId = data.recipientId;
  }
}