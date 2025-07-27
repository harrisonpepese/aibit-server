import { Message, MessageType } from './message.entity';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid')
}));

describe('Message Entity', () => {
  it('should create a valid global message', () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'John Doe';
    const content = 'Hello, world!';
    const type: MessageType = 'GLOBAL';
    
    // Act
    const message = Message.create(senderId, senderName, content, type);
    
    // Assert
    expect(message.getId()).toBe('mocked-uuid');
    expect(message.getSenderId()).toBe(senderId);
    expect(message.getSenderName()).toBe(senderName);
    expect(message.getContent()).toBe(content);
    expect(message.getType()).toBe(type);
    expect(message.getTimestamp()).toBeInstanceOf(Date);
    expect(message.isGlobal()).toBe(true);
    expect(message.isPrivate()).toBe(false);
    expect(message.isChannel()).toBe(false);
    expect(message.isSystem()).toBe(false);
  });

  it('should create a valid private message', () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'John Doe';
    const content = 'Private message';
    const type: MessageType = 'PRIVATE';
    const recipientId = 'user-456';
    
    // Act
    const message = Message.create(senderId, senderName, content, type, undefined, recipientId);
    
    // Assert
    expect(message.getId()).toBe('mocked-uuid');
    expect(message.getSenderId()).toBe(senderId);
    expect(message.getContent()).toBe(content);
    expect(message.getType()).toBe(type);
    expect(message.getRecipientId()).toBe(recipientId);
    expect(message.isPrivate()).toBe(true);
  });

  it('should create a valid channel message', () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'John Doe';
    const content = 'Channel message';
    const type: MessageType = 'CHANNEL';
    const channelId = 'channel-789';
    
    // Act
    const message = Message.create(senderId, senderName, content, type, channelId);
    
    // Assert
    expect(message.getId()).toBe('mocked-uuid');
    expect(message.getSenderId()).toBe(senderId);
    expect(message.getContent()).toBe(content);
    expect(message.getType()).toBe(type);
    expect(message.getChannelId()).toBe(channelId);
    expect(message.isChannel()).toBe(true);
  });

  it('should create a valid system message', () => {
    // Arrange
    const senderId = 'system';
    const senderName = 'System';
    const content = 'System announcement';
    const type: MessageType = 'SYSTEM';
    
    // Act
    const message = Message.create(senderId, senderName, content, type);
    
    // Assert
    expect(message.getId()).toBe('mocked-uuid');
    expect(message.getSenderId()).toBe(senderId);
    expect(message.getContent()).toBe(content);
    expect(message.getType()).toBe(type);
    expect(message.isSystem()).toBe(true);
  });

  it('should throw error for empty content', () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'John Doe';
    const content = '';
    const type: MessageType = 'GLOBAL';
    
    // Act & Assert
    expect(() => {
      Message.create(senderId, senderName, content, type);
    }).toThrow('Conteúdo da mensagem não pode ser vazio');
  });

  it('should throw error for too long content', () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'John Doe';
    const content = 'A'.repeat(1001); // 1001 characters
    const type: MessageType = 'GLOBAL';
    
    // Act & Assert
    expect(() => {
      Message.create(senderId, senderName, content, type);
    }).toThrow('Mensagem muito longa (máximo 1000 caracteres)');
  });

  it('should throw error for private message without recipient', () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'John Doe';
    const content = 'Private message';
    const type: MessageType = 'PRIVATE';
    
    // Act & Assert
    expect(() => {
      Message.create(senderId, senderName, content, type);
    }).toThrow('Mensagem privada precisa de um destinatário');
  });

  it('should throw error for channel message without channel id', () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'John Doe';
    const content = 'Channel message';
    const type: MessageType = 'CHANNEL';
    
    // Act & Assert
    expect(() => {
      Message.create(senderId, senderName, content, type);
    }).toThrow('Mensagem de canal precisa de um ID de canal');
  });

  it('should correctly determine message visibility', () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'John Doe';
    const recipientId = 'user-456';
    
    // Create a private message
    const privateMessage = Message.create(
      senderId, 
      senderName, 
      'Private message', 
      'PRIVATE', 
      undefined, 
      recipientId
    );
    
    // Create a global message
    const globalMessage = Message.create(
      senderId,
      senderName,
      'Global message',
      'GLOBAL'
    );
    
    // Act & Assert - Private message
    expect(privateMessage.isVisibleTo(senderId)).toBe(true);
    expect(privateMessage.isVisibleTo(recipientId)).toBe(true);
    expect(privateMessage.isVisibleTo('other-user')).toBe(false);
    
    // Act & Assert - Global message
    expect(globalMessage.isVisibleTo(senderId)).toBe(true);
    expect(globalMessage.isVisibleTo(recipientId)).toBe(true);
    expect(globalMessage.isVisibleTo('other-user')).toBe(true);
  });

  it('should create message from primitives', () => {
    // Arrange
    const messageData = {
      id: 'msg-123',
      senderId: 'user-123',
      senderName: 'John Doe',
      content: 'Hello from primitives',
      type: 'GLOBAL' as MessageType,
      timestamp: new Date(),
      channelId: undefined,
      recipientId: undefined
    };
    
    // Act
    const message = Message.fromPrimitives(messageData);
    
    // Assert
    expect(message.getId()).toBe(messageData.id);
    expect(message.getSenderId()).toBe(messageData.senderId);
    expect(message.getSenderName()).toBe(messageData.senderName);
    expect(message.getContent()).toBe(messageData.content);
    expect(message.getType()).toBe(messageData.type);
    expect(message.getTimestamp()).toEqual(messageData.timestamp);
  });

  it('should convert to primitives correctly', () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'John Doe';
    const content = 'Hello, world!';
    const type: MessageType = 'GLOBAL';
    
    const message = Message.create(senderId, senderName, content, type);
    
    // Act
    const primitives = message.toPrimitives();
    
    // Assert
    expect(primitives).toEqual({
      id: 'mocked-uuid',
      senderId,
      senderName,
      content,
      type,
      timestamp: expect.any(Date),
      channelId: undefined,
      recipientId: undefined
    });
  });
});