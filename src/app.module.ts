import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { CharacterModule } from './character/character.module';
import { GameServerModule } from './gameserver/gameserver.module';
import { GameMapModule } from './gamemap/gamemap.module';
import { CreatureModule } from './creature/creature.module';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AccountModule,
    CharacterModule,
    GameServerModule,
    GameMapModule,
    CreatureModule,
    EventsModule,
    ChatModule
  ],
})
export class AppModule {}