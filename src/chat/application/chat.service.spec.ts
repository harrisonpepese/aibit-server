import { Test } from '@nestjs/testing';
import { ChatService } from '../chat.service';
import { SendMessageUseCase } from './use-cases/send-message.use-case';
import { GetMessagesUseCase } from './use-cases/get-messages.use-case';
import { CreateChannelUseCase } from './use-cases/create-channel.use-case';
import { GetChannelsUseCase } from './use-cases/get-channels.use-case';
import { ManageChannelMembersUseCase } from './use-cases/manage-channel-members.use-case';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { Message } from '../domain/entities/message.entity';
import { Channel } from '../domain/entities/channel.entity';

describe('ChatService', () => {
  let chatService: ChatService;
  let mockSendMessageUseCase: jest.Mocked<SendMessageUseCase>;
  let mockGetMessagesUseCase: jest.Mocked<GetMessagesUseCase>;
  let mockCreateChannelUseCase: jest.Mocked<CreateChannelUseCase>;
  let mockGetChannelsUseCase: jest.Mocked<GetChannelsUseCase>;
  let mockManageChannelMembersUseCase: jest.Mocked<ManageChannelMembersUseCase>;

  // Mock data
  const mockMessageData = {
    id: 'msg-123',
    senderId: 'user-123',
    senderName: 'Test User',
    content: 'Hello, world!',
    type: 'GLOBAL',
    timestamp: new Date(),
    channelId: undefined,
    recipientId: undefined
  };

  const mockChannelData = {
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
    // Create mocks
    mockSendMessageUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<SendMessageUseCase>;

    mockGetMessagesUseCase = {
      getGlobalMessages: jest.fn(),
      getSystemMessages: jest.fn(),
      getPrivateMessages: jest.fn(),
      getChannelMessages: jest.fn(),
      getUserMessages: jest.fn(),
      getRecentMessages: jest.fn()
    } as unknown as jest.Mocked<GetMessagesUseCase>;

    mockCreateChannelUseCase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<CreateChannelUseCase>;

    mockGetChannelsUseCase = {
      getPublicChannels: jest.fn(),
      getUserChannels: jest.fn(),
      getOwnedChannels: jest.fn(),
      getChannelById: jest.fn(),
      getChannelByName: jest.fn()
    } as unknown as jest.Mocked<GetChannelsUseCase>;

    mockManageChannelMembersUseCase = {
      addMember: jest.fn(),
      removeMember: jest.fn(),
      addModerator: jest.fn(),
      removeModerator: jest.fn()
    } as unknown as jest.Mocked<ManageChannelMembersUseCase>;

    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: SendMessageUseCase, useValue: mockSendMessageUseCase },
        { provide: GetMessagesUseCase, useValue: mockGetMessagesUseCase },
        { provide: CreateChannelUseCase, useValue: mockCreateChannelUseCase },
        { provide: GetChannelsUseCase, useValue: mockGetChannelsUseCase },
        { provide: ManageChannelMembersUseCase, useValue: mockManageChannelMembersUseCase }
      ]
    }).compile();

    chatService = moduleRef.get<ChatService>(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send a message and return MessageResponseDto', async () => {
      // Arrange
      const createMessageDto: CreateMessageDto = {
        senderId: 'user-123',
        senderName: 'Test User',
        content: 'Hello, world!',
        type: 'GLOBAL'
      };

      // Mock message entity
      const mockMessage = {
        toPrimitives: jest.fn().mockReturnValue(mockMessageData)
      } as unknown as Message;

      mockSendMessageUseCase.execute.mockResolvedValue(mockMessage);

      // Act
      const result = await chatService.sendMessage(createMessageDto);

      // Assert
      expect(mockSendMessageUseCase.execute).toHaveBeenCalledWith(
        createMessageDto.senderId,
        createMessageDto.senderName,
        createMessageDto.content,
        createMessageDto.type,
        createMessageDto.channelId,
        createMessageDto.recipientId
      );
      expect(mockMessage.toPrimitives).toHaveBeenCalled();
      
      expect(result).toEqual({
        id: mockMessageData.id,
        senderId: mockMessageData.senderId,
        senderName: mockMessageData.senderName,
        content: mockMessageData.content,
        type: mockMessageData.type,
        timestamp: mockMessageData.timestamp,
        channelId: mockMessageData.channelId,
        recipientId: mockMessageData.recipientId
      });
    });
  });

  describe('getGlobalMessages', () => {
    it('should get global messages', async () => {
      // Arrange
      const mockMessages = [
        {
          toPrimitives: jest.fn().mockReturnValue(mockMessageData)
        } as unknown as Message
      ];

      mockGetMessagesUseCase.getGlobalMessages.mockResolvedValue(mockMessages);

      // Act
      const result = await chatService.getGlobalMessages();

      // Assert
      expect(mockGetMessagesUseCase.getGlobalMessages).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: mockMessageData.id,
        senderId: mockMessageData.senderId,
        senderName: mockMessageData.senderName,
        content: mockMessageData.content,
        type: mockMessageData.type,
        timestamp: mockMessageData.timestamp,
        channelId: mockMessageData.channelId,
        recipientId: mockMessageData.recipientId
      });
    });
  });

  describe('createChannel', () => {
    it('should create a channel and return ChannelResponseDto', async () => {
      // Arrange
      const createChannelDto: CreateChannelDto = {
        name: 'Test Channel',
        description: 'Test Description',
        ownerId: 'user-123',
        isPublic: true
      };

      // Mock channel entity
      const mockChannel = {
        toPrimitives: jest.fn().mockReturnValue(mockChannelData)
      } as unknown as Channel;

      mockCreateChannelUseCase.execute.mockResolvedValue(mockChannel);

      // Act
      const result = await chatService.createChannel(createChannelDto);

      // Assert
      expect(mockCreateChannelUseCase.execute).toHaveBeenCalledWith(
        createChannelDto.name,
        createChannelDto.description || '',
        createChannelDto.ownerId,
        createChannelDto.isPublic
      );
      expect(mockChannel.toPrimitives).toHaveBeenCalled();
      
      expect(result).toEqual({
        id: mockChannelData.id,
        name: mockChannelData.name,
        description: mockChannelData.description,
        ownerId: mockChannelData.ownerId,
        moderatorIds: mockChannelData.moderatorIds,
        memberIds: mockChannelData.memberIds,
        isPublic: mockChannelData.isPublic,
        createdAt: mockChannelData.createdAt
      });
    });
  });

  describe('getPublicChannels', () => {
    it('should get public channels', async () => {
      // Arrange
      const mockChannels = [
        {
          toPrimitives: jest.fn().mockReturnValue(mockChannelData)
        } as unknown as Channel
      ];

      mockGetChannelsUseCase.getPublicChannels.mockResolvedValue(mockChannels);

      // Act
      const result = await chatService.getPublicChannels();

      // Assert
      expect(mockGetChannelsUseCase.getPublicChannels).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: mockChannelData.id,
        name: mockChannelData.name,
        description: mockChannelData.description,
        ownerId: mockChannelData.ownerId,
        moderatorIds: mockChannelData.moderatorIds,
        memberIds: mockChannelData.memberIds,
        isPublic: mockChannelData.isPublic,
        createdAt: mockChannelData.createdAt
      });
    });
  });

  describe('channel member management', () => {
    it('should add channel member', async () => {
      // Arrange
      const channelId = 'channel-123';
      const userId = 'user-456';
      const byUserId = 'user-123';

      // Act
      await chatService.addChannelMember(channelId, userId, byUserId);

      // Assert
      expect(mockManageChannelMembersUseCase.addMember).toHaveBeenCalledWith(
        channelId,
        userId,
        byUserId
      );
    });

    it('should remove channel member', async () => {
      // Arrange
      const channelId = 'channel-123';
      const userId = 'user-456';
      const byUserId = 'user-123';

      // Act
      await chatService.removeChannelMember(channelId, userId, byUserId);

      // Assert
      expect(mockManageChannelMembersUseCase.removeMember).toHaveBeenCalledWith(
        channelId,
        userId,
        byUserId
      );
    });
  });
});
