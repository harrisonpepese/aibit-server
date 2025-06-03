import { v4 as uuidv4 } from 'uuid';

export type MessageType = 'PRIVATE' | 'CHANNEL' | 'GLOBAL' | 'SYSTEM';

export class Message {
  private readonly id: string;
  private readonly senderId: string;
  private readonly senderName: string;
  private readonly content: string;
  private readonly timestamp: Date;
  private readonly type: MessageType;
  private readonly channelId?: string;
  private readonly recipientId?: string;

  private constructor(
    id: string,
    senderId: string,
    senderName: string, 
    content: string,
    type: MessageType,
    timestamp: Date,
    channelId?: string,
    recipientId?: string,
  ) {
    this.id = id;
    this.senderId = senderId;
    this.senderName = senderName;
    this.content = content;
    this.timestamp = timestamp;
    this.type = type;
    this.channelId = channelId;
    this.recipientId = recipientId;

    this.validate();
  }

  private validate(): void {
    if (!this.content || this.content.trim() === '') {
      throw new Error('Conteúdo da mensagem não pode ser vazio');
    }

    if (this.content.length > 1000) {
      throw new Error('Mensagem muito longa (máximo 1000 caracteres)');
    }

    if (this.type === 'PRIVATE' && !this.recipientId) {
      throw new Error('Mensagem privada precisa de um destinatário');
    }

    if (this.type === 'CHANNEL' && !this.channelId) {
      throw new Error('Mensagem de canal precisa de um ID de canal');
    }
  }

  static create(
    senderId: string,
    senderName: string,
    content: string,
    type: MessageType,
    channelId?: string,
    recipientId?: string,
  ): Message {
    return new Message(
      uuidv4(),
      senderId,
      senderName,
      content,
      type,
      new Date(),
      channelId,
      recipientId,
    );
  }

  static fromPrimitives(data: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    type: MessageType;
    timestamp: Date;
    channelId?: string;
    recipientId?: string;
  }): Message {
    return new Message(
      data.id,
      data.senderId,
      data.senderName,
      data.content,
      data.type,
      data.timestamp,
      data.channelId,
      data.recipientId,
    );
  }

  getId(): string {
    return this.id;
  }

  getSenderId(): string {
    return this.senderId;
  }

  getSenderName(): string {
    return this.senderName;
  }

  getContent(): string {
    return this.content;
  }

  getTimestamp(): Date {
    return new Date(this.timestamp);
  }

  getType(): MessageType {
    return this.type;
  }

  getChannelId(): string | undefined {
    return this.channelId;
  }

  getRecipientId(): string | undefined {
    return this.recipientId;
  }

  isPrivate(): boolean {
    return this.type === 'PRIVATE';
  }

  isChannel(): boolean {
    return this.type === 'CHANNEL';
  }

  isGlobal(): boolean {
    return this.type === 'GLOBAL';
  }

  isSystem(): boolean {
    return this.type === 'SYSTEM';
  }

  isVisibleTo(userId: string): boolean {
    if (this.isGlobal() || this.isSystem()) {
      return true;
    }
    
    if (this.isPrivate()) {
      return this.senderId === userId || this.recipientId === userId;
    }
    
    return true; // Para mensagens de canal, a visibilidade é verificada em outro lugar
  }

  toPrimitives(): {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    type: MessageType;
    timestamp: Date;
    channelId?: string;
    recipientId?: string;
  } {
    return {
      id: this.id,
      senderId: this.senderId,
      senderName: this.senderName,
      content: this.content,
      type: this.type,
      timestamp: this.timestamp,
      channelId: this.channelId,
      recipientId: this.recipientId,
    };
  }
}
