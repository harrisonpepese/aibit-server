import { Test } from '@nestjs/testing';
import { ChatModule } from './chat.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { GetMessagesUseCase } from './application/use-cases/get-messages.use-case';
import { CreateChannelUseCase } from './application/use-cases/create-channel.use-case';
import { GetChannelsUseCase } from './application/use-cases/get-channels.use-case';
import { ManageChannelMembersUseCase } from './application/use-cases/manage-channel-members.use-case';
import { MESSAGE_REPOSITORY } from './domain/repositories/message.repository';
import { CHANNEL_REPOSITORY } from './domain/repositories/channel.repository';
import { InMemoryMessageRepository } from './infrastructure/repositories/in-memory-message.repository';
import { InMemoryChannelRepository } from './infrastructure/repositories/in-memory-channel.repository';

describe('ChatModule', () => {
  let chatModule: ChatModule;
  let chatService: ChatService;
  let chatController: ChatController;
  let sendMessageUseCase: SendMessageUseCase;
  let getMessagesUseCase: GetMessagesUseCase;
  let createChannelUseCase: CreateChannelUseCase;
  let getChannelsUseCase: GetChannelsUseCase;
  let manageChannelMembersUseCase: ManageChannelMembersUseCase;
  let messageRepository: InMemoryMessageRepository;
  let channelRepository: InMemoryChannelRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ChatModule],
    }).compile();

    chatModule = moduleRef.get<ChatModule>(ChatModule);
    chatService = moduleRef.get<ChatService>(ChatService);
    chatController = moduleRef.get<ChatController>(ChatController);
    sendMessageUseCase = moduleRef.get<SendMessageUseCase>(SendMessageUseCase);
    getMessagesUseCase = moduleRef.get<GetMessagesUseCase>(GetMessagesUseCase);
    createChannelUseCase = moduleRef.get<CreateChannelUseCase>(CreateChannelUseCase);
    getChannelsUseCase = moduleRef.get<GetChannelsUseCase>(GetChannelsUseCase);
    manageChannelMembersUseCase = moduleRef.get<ManageChannelMembersUseCase>(ManageChannelMembersUseCase);
    messageRepository = moduleRef.get<InMemoryMessageRepository>(MESSAGE_REPOSITORY);
    channelRepository = moduleRef.get<InMemoryChannelRepository>(CHANNEL_REPOSITORY);
  });

  it('should compile the module', () => {
    expect(chatModule).toBeDefined();
  });

  it('should provide ChatService', () => {
    expect(chatService).toBeDefined();
    expect(chatService).toBeInstanceOf(ChatService);
  });

  it('should provide ChatController', () => {
    expect(chatController).toBeDefined();
    expect(chatController).toBeInstanceOf(ChatController);
  });

  it('should provide SendMessageUseCase', () => {
    expect(sendMessageUseCase).toBeDefined();
    expect(sendMessageUseCase).toBeInstanceOf(SendMessageUseCase);
  });

  it('should provide GetMessagesUseCase', () => {
    expect(getMessagesUseCase).toBeDefined();
    expect(getMessagesUseCase).toBeInstanceOf(GetMessagesUseCase);
  });

  it('should provide CreateChannelUseCase', () => {
    expect(createChannelUseCase).toBeDefined();
    expect(createChannelUseCase).toBeInstanceOf(CreateChannelUseCase);
  });

  it('should provide GetChannelsUseCase', () => {
    expect(getChannelsUseCase).toBeDefined();
    expect(getChannelsUseCase).toBeInstanceOf(GetChannelsUseCase);
  });

  it('should provide ManageChannelMembersUseCase', () => {
    expect(manageChannelMembersUseCase).toBeDefined();
    expect(manageChannelMembersUseCase).toBeInstanceOf(ManageChannelMembersUseCase);
  });

  it('should provide MessageRepository', () => {
    expect(messageRepository).toBeDefined();
    expect(messageRepository).toBeInstanceOf(InMemoryMessageRepository);
  });

  it('should provide ChannelRepository', () => {
    expect(channelRepository).toBeDefined();
    expect(channelRepository).toBeInstanceOf(InMemoryChannelRepository);
  });
});
