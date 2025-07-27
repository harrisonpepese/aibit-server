import { Test } from '@nestjs/testing';
import { GetMessagesUseCase } from './get-messages.use-case';
import { MessageRepository, MESSAGE_REPOSITORY } from '../../domain/repositories/message.repository';
import { Message } from '../../domain/entities/message.entity';

describe('GetMessagesUseCase', () => {
  let getMessagesUseCase: GetMessagesUseCase;
  let mockMessageRepository: jest.Mocked<MessageRepository>;
  
  beforeEach(async () => {
    // Create mock
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

    const moduleRef = await Test.createTestingModule({
      providers: [
        GetMessagesUseCase,
        {
          provide: MESSAGE_REPOSITORY,
          useValue: mockMessageRepository
        }
      ]
    }).compile();

    getMessagesUseCase = moduleRef.get<GetMessagesUseCase>(GetMessagesUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get global messages', async () => {
    // Arrange
    const mockMessages = [
      { getType: () => 'GLOBAL' } as Message,
      { getType: () => 'GLOBAL' } as Message
    ];
    mockMessageRepository.findGlobalMessages.mockResolvedValue(mockMessages);
    
    // Act
    const result = await getMessagesUseCase.getGlobalMessages();
    
    // Assert
    expect(mockMessageRepository.findGlobalMessages).toHaveBeenCalled();
    expect(result).toBe(mockMessages);
  });

  it('should get global messages with limit', async () => {
    // Arrange
    const mockMessages = [
      { getType: () => 'GLOBAL' } as Message,
      { getType: () => 'GLOBAL' } as Message,
      { getType: () => 'GLOBAL' } as Message
    ];
    const limit = 2;
    mockMessageRepository.findGlobalMessages.mockResolvedValue(mockMessages);
    
    // Act
    const result = await getMessagesUseCase.getGlobalMessages(limit);
    
    // Assert
    expect(mockMessageRepository.findGlobalMessages).toHaveBeenCalled();
    expect(result).toHaveLength(limit);
    expect(result[0]).toBe(mockMessages[1]);
    expect(result[1]).toBe(mockMessages[2]);
  });

  it('should get system messages', async () => {
    // Arrange
    const mockMessages = [
      { getType: () => 'SYSTEM' } as Message,
      { getType: () => 'SYSTEM' } as Message
    ];
    mockMessageRepository.findSystemMessages.mockResolvedValue(mockMessages);
    
    // Act
    const result = await getMessagesUseCase.getSystemMessages();
    
    // Assert
    expect(mockMessageRepository.findSystemMessages).toHaveBeenCalled();
    expect(result).toBe(mockMessages);
  });

  it('should get private messages', async () => {
    // Arrange
    const userId = 'user-123';
    const mockMessages = [
      { isPrivate: () => true } as Message,
      { isPrivate: () => false } as Message,
      { isPrivate: () => true } as Message
    ];
    mockMessageRepository.findMessagesByUserId.mockResolvedValue(mockMessages);
    
    // Act
    const result = await getMessagesUseCase.getPrivateMessages(userId);
    
    // Assert
    expect(mockMessageRepository.findMessagesByUserId).toHaveBeenCalledWith(userId, undefined);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(mockMessages[0]);
    expect(result[1]).toBe(mockMessages[2]);
  });

  it('should get channel messages', async () => {
    // Arrange
    const channelId = 'channel-123';
    const mockMessages = [
      { getChannelId: () => channelId } as Message,
      { getChannelId: () => channelId } as Message
    ];
    mockMessageRepository.findByChannelId.mockResolvedValue(mockMessages);
    
    // Act
    const result = await getMessagesUseCase.getChannelMessages(channelId);
    
    // Assert
    expect(mockMessageRepository.findByChannelId).toHaveBeenCalledWith(channelId);
    expect(result).toBe(mockMessages);
  });

  it('should get user messages', async () => {
    // Arrange
    const userId = 'user-123';
    const limit = 10;
    const mockMessages = [
      { getSenderId: () => userId } as Message,
      { getSenderId: () => userId } as Message
    ];
    mockMessageRepository.findMessagesByUserId.mockResolvedValue(mockMessages);
    
    // Act
    const result = await getMessagesUseCase.getUserMessages(userId, limit);
    
    // Assert
    expect(mockMessageRepository.findMessagesByUserId).toHaveBeenCalledWith(userId, limit);
    expect(result).toBe(mockMessages);
  });

  it('should get recent messages', async () => {
    // Arrange
    const limit = 50;
    const mockMessages = [
      {} as Message,
      {} as Message,
      {} as Message
    ];
    mockMessageRepository.findRecentMessages.mockResolvedValue(mockMessages);
    
    // Act
    const result = await getMessagesUseCase.getRecentMessages(limit);
    
    // Assert
    expect(mockMessageRepository.findRecentMessages).toHaveBeenCalledWith(limit);
    expect(result).toBe(mockMessages);
  });
});
