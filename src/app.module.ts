import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { CharacterModule } from './character/character.module';
import { GameServerModule } from './gameserver/gameserver.module';
import { GameMapModule } from './gamemap/gamemap.module';
import { DamageModule } from './damage/damage.module';
import { CombatModule } from './combat/combat.module';
import { MovementModule } from './movement/movement.module';
import { CreatureModule } from './creature/creature.module';
import { ItensModule } from './itens/itens.module';
import { EventsModule } from './events/events.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    AccountModule,
    CharacterModule,
    GameServerModule,
    GameMapModule,
    DamageModule,
    CombatModule,
    MovementModule,
    CreatureModule,
    ItensModule,
    EventsModule,
    ChatModule,
  ],
})
export class AppModule {}