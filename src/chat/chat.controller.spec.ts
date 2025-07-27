import { Test } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { ChannelResponseDto } from './dto/channel-response.dto';

describe('ChatController', () => {
  let chatController: ChatController;
  let mockChatService: jest.Mocked<ChatService>;

  // Mock response data
  const mockMessageResponse = {
    id: 'msg-123',
    senderId: 'user-123',
    senderName: 'Test User',
    content: 'Hello, world!',
    type: 'GLOBAL',
    timestamp: new Date(),
    channelId: undefined,
    recipientId: undefined
  };

  const mockChannelResponse = {
    id: 'channel-123',
    name: 'Test Channel',
    description: 'Test Description',
    ownerId: 'user-123',
    moderatorIds: ['user-123'],
    memberIds: ['user-123'],
    isPublic: true,
    createdAt: new Date()
  };

  beforeEach(async () => {
    // Create mock for ChatService
    mockChatService = {
      sendMessage: jest.fn(),
      getGlobalMessages: jest.fn(),
      getSystemMessages: jest.fn(),
      getPrivateMessages: jest.fn(),
      getChannelMessages: jest.fn(),
      getUserMessages: jest.fn(),
      getRecentMessages: jest.fn(),
      createChannel: jest.fn(),
      getPublicChannels: jest.fn(),
      getUserChannels: jest.fn(),
      getChannelById: jest.fn(),
      addChannelMember: jest.fn(),
      removeChannelMember: jest.fn(),
      addChannelModerator: jest.fn(),
      removeChannelModerator: jest.fn()
    } as unknown as jest.Mocked<ChatService>;

    const moduleRef = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        { provide: ChatService, useValue: mockChatService }
      ]
    }).compile();

    chatController = moduleRef.get<ChatController>(ChatController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      // Arrange
      const createMessageDto: CreateMessageDto = {
        senderId: 'user-123',
        senderName: 'Test User',
        content: 'Hello, world!',
        type: 'GLOBAL'
      };

      mockChatService.sendMessage.mockResolvedValue(
        mockMessageResponse as MessageResponseDto
      );

      // Act
      const result = await chatController.sendMessage(createMessageDto);

      // Assert
      expect(mockChatService.sendMessage).toHaveBeenCalledWith(createMessageDto);
      expect(result).toEqual(mockMessageResponse);
    });

    it('should handle errors during message sending', async () => {
      // Arrange
      const createMessageDto: CreateMessageDto = {
        senderId: 'user-123',
        senderName: 'Test User',
        content: 'Hello, world!',
        type: 'GLOBAL'
      };

      const errorMessage = 'Erro ao enviar mensagem';
      mockChatService.sendMessage.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(chatController.sendMessage(createMessageDto))
        .rejects
        .toThrow(new HttpException(errorMessage, HttpStatus.BAD_REQUEST));
      
      expect(mockChatService.sendMessage).toHaveBeenCalledWith(createMessageDto);
    });
  });

  describe('getGlobalMessages', () => {
    it('should get global messages', async () => {
      // Arrange
      const limit = 10;
      mockChatService.getGlobalMessages.mockResolvedValue(
        [mockMessageResponse] as MessageResponseDto[]
      );

      // Act
      const result = await chatController.getGlobalMessages(limit);

      // Assert
      expect(mockChatService.getGlobalMessages).toHaveBeenCalledWith(limit);
      expect(result).toEqual([mockMessageResponse]);
    });

    it('should handle errors when getting global messages', async () => {
      // Arrange
      const limit = 10;
      const errorMessage = 'Erro ao buscar mensagens globais';
      mockChatService.getGlobalMessages.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(chatController.getGlobalMessages(limit))
        .rejects
        .toThrow(new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR));
      
      expect(mockChatService.getGlobalMessages).toHaveBeenCalledWith(limit);
    });
  });

  describe('createChannel', () => {
    it('should create a channel', async () => {
      // Arrange
      const createChannelDto: CreateChannelDto = {
        name: 'Test Channel',
        description: 'Test Description',
        ownerId: 'user-123',
        isPublic: true
      };

      mockChatService.createChannel.mockResolvedValue(
        mockChannelResponse as ChannelResponseDto
      );

      // Act
      const result = await chatController.createChannel(createChannelDto);

      // Assert
      expect(mockChatService.createChannel).toHaveBeenCalledWith(createChannelDto);
      expect(result).toEqual(mockChannelResponse);
    });

    it('should handle errors during channel creation', async () => {
      // Arrange
      const createChannelDto: CreateChannelDto = {
        name: 'Test Channel',
        description: 'Test Description',
        ownerId: 'user-123',
        isPublic: true
      };

      const errorMessage = 'Canal com o mesmo nome já existe';
      mockChatService.createChannel.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(chatController.createChannel(createChannelDto))
        .rejects
        .toThrow(new HttpException(errorMessage, HttpStatus.BAD_REQUEST));
      
      expect(mockChatService.createChannel).toHaveBeenCalledWith(createChannelDto);
    });
  });

  describe('channel member management', () => {
    it('should add a channel member', async () => {
      // Arrange
      const channelId = 'channel-123';
      const userId = 'user-456';
      const byUserId = 'user-123';

      mockChatService.addChannelMember.mockResolvedValue(undefined);

      // Act
      await chatController.addChannelMember(channelId, userId, byUserId);

      // Assert
      expect(mockChatService.addChannelMember).toHaveBeenCalledWith(channelId, userId, byUserId);
    });

    it('should handle errors when adding a channel member', async () => {
      // Arrange
      const channelId = 'channel-123';
      const userId = 'user-456';
      const byUserId = 'user-123';

      const errorMessage = 'Você não tem permissão para adicionar membros a este canal';
      mockChatService.addChannelMember.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(chatController.addChannelMember(channelId, userId, byUserId))
        .rejects
        .toThrow(new HttpException(errorMessage, HttpStatus.BAD_REQUEST));
      
      expect(mockChatService.addChannelMember).toHaveBeenCalledWith(channelId, userId, byUserId);
    });
  });
});
