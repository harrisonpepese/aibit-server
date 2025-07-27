import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

// Casos de uso
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { GetMessagesUseCase } from './application/use-cases/get-messages.use-case';
import { CreateChannelUseCase } from './application/use-cases/create-channel.use-case';
import { GetChannelsUseCase } from './application/use-cases/get-channels.use-case';
import { ManageChannelMembersUseCase } from './application/use-cases/manage-channel-members.use-case';

// Tokens de repositório
import { MESSAGE_REPOSITORY } from './domain/repositories/message.repository';
import { CHANNEL_REPOSITORY } from './domain/repositories/channel.repository';

// Implementações de repositório
import { InMemoryMessageRepository } from './infrastructure/repositories/in-memory-message.repository';
import { InMemoryChannelRepository } from './infrastructure/repositories/in-memory-channel.repository';

@Module({
  controllers: [ChatController],
  providers: [
    // Service
    ChatService,
    
    // Casos de uso
    SendMessageUseCase,
    GetMessagesUseCase,
    CreateChannelUseCase,
    GetChannelsUseCase,
    ManageChannelMembersUseCase,
    
    // Repositórios
    {
      provide: MESSAGE_REPOSITORY,
      useClass: InMemoryMessageRepository,
    },
    {
      provide: CHANNEL_REPOSITORY,
      useClass: InMemoryChannelRepository,
    },
  ],
  exports: [ChatService],
})
export class ChatModule {}