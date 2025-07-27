class PositionResponse {
  x: number;
  y: number;
  z: number;
}

class CreatureTypeResponse {
  value: string;
  isBoss: boolean;
  isHostile: boolean;
}

class CreatureStatsResponse {
  maxHealth: number;
  maxMana: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  experience: number;
}

class StatusEffectResponse {
  type: string;
  duration: number;
  intensity: number;
}

class CreatureStateResponse {
  currentHealth: number;
  currentMana: number;
  isAlive: boolean;
  statusEffects: StatusEffectResponse[];
}

export class CreatureResponseDto {
  id: string;
  name: string;
  type: CreatureTypeResponse;
  position: PositionResponse;
  stats: CreatureStatsResponse;
  state: CreatureStateResponse;
  spawnId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CreatureListResponseDto {
  items: CreatureResponseDto[];
  total: number;
}
