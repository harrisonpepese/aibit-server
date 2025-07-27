import { Test } from '@nestjs/testing';
import { SendMessageUseCase } from './send-message.use-case';
import { MessageRepository, MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';
import { ChannelRepository, CHANNEL_REPOSITORY } from '../../domain/repositories/channel.repository';
import { Message } from '../../domain/entities/message.entity';
import { Channel } from '../../domain/entities/channel.entity';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid')
}));

describe('SendMessageUseCase', () => {
  let sendMessageUseCase: SendMessageUseCase;
  let mockMessageRepository: jest.Mocked<MessageRepository>;
  let mockChannelRepository: jest.Mocked<ChannelRepository>;
  
  beforeEach(async () => {
    // Create mocks
    mockMessageRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByRecipientId: jest.fn(),
      findByChannelId: jest.fn(),
      findGlobalMessages: jest.fn(),
      findSystemMessages: jest.fn(),
      findRecentMessages: jest.fn(),
      findMessagesByUserId: jest.fn(),
    };

    mockChannelRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findPublicChannels: jest.fn(),
      findChannelsByMember: jest.fn(),
      findChannelsByOwner: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SendMessageUseCase,
        {
          provide: MESSAGE_REPOSITORY,
          useValue: mockMessageRepository
        },
        {
          provide: CHANNEL_REPOSITORY,
          useValue: mockChannelRepository
        }
      ]
    }).compile();

    sendMessageUseCase = moduleRef.get<SendMessageUseCase>(SendMessageUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a global message successfully', async () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'Test User';
    const content = 'Hello, world!';
    const type = 'GLOBAL';
    
    const mockMessage = {} as Message;
    jest.spyOn(Message, 'create').mockReturnValue(mockMessage);
    
    // Act
    const result = await sendMessageUseCase.execute(senderId, senderName, content, type);
    
    // Assert
    expect(Message.create).toHaveBeenCalledWith(
      senderId,
      senderName,
      content,
      type,
      undefined,
      undefined
    );
    expect(mockMessageRepository.save).toHaveBeenCalledWith(mockMessage);
    expect(result).toBe(mockMessage);
  });

  it('should send a private message successfully', async () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'Test User';
    const content = 'Private message';
    const type = 'PRIVATE';
    const recipientId = 'user-456';
    
    const mockMessage = {} as Message;
    jest.spyOn(Message, 'create').mockReturnValue(mockMessage);
    
    // Act
    const result = await sendMessageUseCase.execute(senderId, senderName, content, type, undefined, recipientId);
    
    // Assert
    expect(Message.create).toHaveBeenCalledWith(
      senderId,
      senderName,
      content,
      type,
      undefined,
      recipientId
    );
    expect(mockMessageRepository.save).toHaveBeenCalledWith(mockMessage);
    expect(result).toBe(mockMessage);
  });

  it('should send a channel message successfully if user is member', async () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'Test User';
    const content = 'Channel message';
    const type = 'CHANNEL';
    const channelId = 'channel-789';
    
    const mockChannel = {
      isMember: jest.fn().mockReturnValue(true)
    } as unknown as Channel;
    
    const mockMessage = {} as Message;
    
    mockChannelRepository.findById.mockResolvedValue(mockChannel);
    jest.spyOn(Message, 'create').mockReturnValue(mockMessage);
    
    // Act
    const result = await sendMessageUseCase.execute(senderId, senderName, content, type, channelId);
    
    // Assert
    expect(mockChannelRepository.findById).toHaveBeenCalledWith(channelId);
    expect(mockChannel.isMember).toHaveBeenCalledWith(senderId);
    expect(Message.create).toHaveBeenCalledWith(
      senderId,
      senderName,
      content,
      type,
      channelId,
      undefined
    );
    expect(mockMessageRepository.save).toHaveBeenCalledWith(mockMessage);
    expect(result).toBe(mockMessage);
  });

  it('should throw error if channel not found', async () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'Test User';
    const content = 'Channel message';
    const type = 'CHANNEL';
    const channelId = 'nonexistent-channel';
    
    mockChannelRepository.findById.mockResolvedValue(null);
    
    // Act & Assert
    await expect(
      sendMessageUseCase.execute(senderId, senderName, content, type, channelId)
    ).rejects.toThrow('Canal não encontrado');
    
    expect(mockChannelRepository.findById).toHaveBeenCalledWith(channelId);
    expect(mockMessageRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error if user is not member of channel', async () => {
    // Arrange
    const senderId = 'user-123';
    const senderName = 'Test User';
    const content = 'Channel message';
    const type = 'CHANNEL';
    const channelId = 'channel-789';
    
    const mockChannel = {
      isMember: jest.fn().mockReturnValue(false)
    } as unknown as Channel;
    
    mockChannelRepository.findById.mockResolvedValue(mockChannel);
    
    // Act & Assert
    await expect(
      sendMessageUseCase.execute(senderId, senderName, content, type, channelId)
    ).rejects.toThrow('Você não é membro deste canal');
    
    expect(mockChannelRepository.findById).toHaveBeenCalledWith(channelId);
    expect(mockChannel.isMember).toHaveBeenCalledWith(senderId);
    expect(mockMessageRepository.save).not.toHaveBeenCalled();
  });
});
