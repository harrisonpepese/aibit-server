import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GameServerController } from './gameserver.controller';
import { GameServerService } from './gameserver.service';
import { EventsModule } from '../events/events.module';
import { GameWebSocketGateway } from './infrastructure/gateways/websocket.gateway';
import { ClientConnectionService } from './application/use-cases/client-connection.service';
import { WorldStateService } from './application/use-cases/world-state.service';
import { GameActionService } from './application/use-cases/game-action.service';
import { InMemoryClientConnectionRepository } from './infrastructure/repositories/in-memory-client-connection.repository';
import { InMemoryWorldStateRepository } from './infrastructure/repositories/in-memory-world-state.repository';
import { AccountModule } from '../account/account.module';
import { CharacterModule } from '../character/character.module';
import { GameEventAdapterService } from './infrastructure/services/game-event-adapter.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // For scheduled tasks
    EventsModule, // For event system
    AccountModule, // For authentication
    CharacterModule, // For character data
  ],
  controllers: [GameServerController],  providers: [
    GameServerService,
    GameWebSocketGateway,
    ClientConnectionService,
    WorldStateService,
    GameActionService,
    GameEventAdapterService,
    {
      provide: 'IClientConnectionRepository',
      useClass: InMemoryClientConnectionRepository,
    },
    {
      provide: 'IWorldStateRepository',
      useClass: InMemoryWorldStateRepository,
    },
  ],
  exports: [GameServerService],
})
export class GameServerModule {}