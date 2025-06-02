import { Attack } from '../domain/entities/attack.entity';
import { Combat } from '../domain/entities/combat.entity';

export class CombatResponseDto {
  id: string;
  initiatorId: string;
  targetId: string;
  startTime: string;
  endTime: string | null;
  state: string;
  attacks: Attack[];
  pvp: boolean;
  metadata: Record<string, any>;
  duration: number;
  totalDamageByInitiator: number;
  totalDamageByTarget: number;
  lastAttack: Attack | null;

  constructor(combat: Combat) {
    this.id = combat.getId();
    this.initiatorId = combat.getInitiatorId();
    this.targetId = combat.getTargetId();
    this.startTime = combat.getStartTime().toISOString();
    this.endTime = combat.getEndTime()?.toISOString() || null;
    this.state = combat.getState();
    this.attacks = combat.getAttacks();
    this.pvp = combat.isPvP();
    this.metadata = combat.getMetadata();
    this.duration = combat.getDuration();
    this.totalDamageByInitiator = combat.getTotalDamageBy(combat.getInitiatorId());
    this.totalDamageByTarget = combat.getTotalDamageBy(combat.getTargetId());
    this.lastAttack = combat.getLastAttack();
  }
}
