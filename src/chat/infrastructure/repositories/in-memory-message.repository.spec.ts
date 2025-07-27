import { InMemoryMessageRepository } from './in-memory-message.repository';
import { Message, MessageType } from '../../domain/entities/message.entity';

describe('InMemoryMessageRepository', () => {
  let repository: InMemoryMessageRepository;
  
  const senderId = 'user-123';
  const senderName = 'Test User';
  const content = 'Test message';
  const channelId = 'channel-123';
  const recipientId = 'user-456';
  
  beforeEach(() => {
    repository = new InMemoryMessageRepository();
  });
  
  it('should save a message', async () => {
    // Arrange
    const message = Message.create(senderId, senderName, content, 'GLOBAL');
    
    // Act
    await repository.save(message);
    
    // Assert
    const result = await repository.findById(message.getId());
    expect(result).toBe(message);
  });
  
  it('should find message by id', async () => {
    // Arrange
    const message = Message.create(senderId, senderName, content, 'GLOBAL');
    await repository.save(message);
    
    // Act
    const result = await repository.findById(message.getId());
    
    // Assert
    expect(result).toBe(message);
  });
  
  it('should return null when message not found by id', async () => {
    // Act
    const result = await repository.findById('nonexistent-id');
    
    // Assert
    expect(result).toBeNull();
  });
  
  it('should find messages by recipient id', async () => {
    // Arrange
    const privateMessage = Message.create(senderId, senderName, 'Private message', 'PRIVATE', undefined, recipientId);
    const otherMessage = Message.create(senderId, senderName, 'Other message', 'GLOBAL');
    
    await repository.save(privateMessage);
    await repository.save(otherMessage);
    
    // Act
    const result = await repository.findByRecipientId(recipientId);
    
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(privateMessage);
  });
  
  it('should find messages by channel id', async () => {
    // Arrange
    const channelMessage = Message.create(senderId, senderName, 'Channel message', 'CHANNEL', channelId);
    const otherMessage = Message.create(senderId, senderName, 'Other message', 'GLOBAL');
    
    await repository.save(channelMessage);
    await repository.save(otherMessage);
    
    // Act
    const result = await repository.findByChannelId(channelId);
    
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(channelMessage);
  });
  
  it('should find global messages', async () => {
    // Arrange
    const globalMessage = Message.create(senderId, senderName, 'Global message', 'GLOBAL');
    const privateMessage = Message.create(senderId, senderName, 'Private message', 'PRIVATE', undefined, recipientId);
    
    await repository.save(globalMessage);
    await repository.save(privateMessage);
    
    // Act
    const result = await repository.findGlobalMessages();
    
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(globalMessage);
  });
  
  it('should find system messages', async () => {
    // Arrange
    const systemMessage = Message.create('system', 'System', 'System message', 'SYSTEM');
    const globalMessage = Message.create(senderId, senderName, 'Global message', 'GLOBAL');
    
    await repository.save(systemMessage);
    await repository.save(globalMessage);
    
    // Act
    const result = await repository.findSystemMessages();
    
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(systemMessage);
  });
  
  it('should find recent messages with limit', async () => {
    // Arrange
    const message1 = Message.create(senderId, senderName, 'Message 1', 'GLOBAL');
    const message2 = Message.create(senderId, senderName, 'Message 2', 'GLOBAL');
    const message3 = Message.create(senderId, senderName, 'Message 3', 'GLOBAL');
    
    // Mock timestamp to ensure order
    jest.spyOn(message1 as any, 'getTimestamp').mockReturnValue(new Date(2023, 0, 1));
    jest.spyOn(message2 as any, 'getTimestamp').mockReturnValue(new Date(2023, 0, 2));
    jest.spyOn(message3 as any, 'getTimestamp').mockReturnValue(new Date(2023, 0, 3));
    
    await repository.save(message1);
    await repository.save(message2);
    await repository.save(message3);
    
    // Act
    const result = await repository.findRecentMessages(2);
    
    // Assert
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(message3);
    expect(result[1]).toBe(message2);
  });
  
  it('should find messages by user id', async () => {
    // Arrange
    const globalMessage = Message.create(senderId, senderName, 'Global message', 'GLOBAL');
    const privateMessageSent = Message.create(senderId, senderName, 'Private message sent', 'PRIVATE', undefined, recipientId);
    const privateMessageReceived = Message.create(recipientId, 'Other User', 'Private message received', 'PRIVATE', undefined, senderId);
    const channelMessage = Message.create('other-user', 'Other User', 'Channel message', 'CHANNEL', channelId);
    
    await repository.save(globalMessage);
    await repository.save(privateMessageSent);
    await repository.save(privateMessageReceived);
    await repository.save(channelMessage);
    
    // Act
    const result = await repository.findMessagesByUserId(senderId);
    
    // Assert
    expect(result).toContain(globalMessage);
    expect(result).toContain(privateMessageSent);
    expect(result).toContain(privateMessageReceived);
    // Channel message visibility is determined elsewhere
  });
});
