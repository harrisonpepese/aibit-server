export interface CharacterStatsResponse {
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  vitality: number;
}

export interface CharacterPositionResponse {
  x: number;
  y: number;
  z: number;
}

export class CharacterResponseDto {
  id: string;
  accountId: string;
  name: string;
  stats: CharacterStatsResponse;
  position: CharacterPositionResponse;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(character: any) {
    this.id = character.id;
    this.accountId = character.accountId;
    this.name = character.name;
    this.stats = character.getStats();
    this.position = character.getPosition();
    this.isOnline = character.getIsOnline();
    this.createdAt = character.getCreatedAt();
    this.updatedAt = character.getUpdatedAt();
  }
}
