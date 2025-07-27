/**
 * DTO for client authentication request
 */
export class AuthenticationDto {
  token: string;
}

/**
 * DTO for character selection request
 */
export class SelectCharacterDto {
  characterId: string;
}

/**
 * DTO for game action requests
 */
export class GameActionDto {
  type: string;
  payload: any;
}

/**
 * DTO for client connection status
 */
export class ConnectionStatusDto {
  status: 'connected' | 'disconnected';
  authenticated: boolean;
  accountId?: string;
  username?: string;
  message?: string;
}

/**
 * DTO for error responses
 */
export class ErrorResponseDto {
  message: string;
  code?: string;
  details?: any;
}

/**
 * DTO for world state updates sent to clients
 */
export class WorldUpdateDto {
  timestamp: string;
  players: PlayerUpdateDto[];
  creatures: CreatureUpdateDto[];
  events: GameEventDto[];
  tiles?: TileUpdateDto[];
}

/**
 * DTO for player updates
 */
export class PlayerUpdateDto {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  level: number;
  // Only necessary visible properties will be sent to clients
}

/**
 * DTO for creature updates
 */
export class CreatureUpdateDto {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number; z: number };
  health: number;
  maxHealth: number;
  level: number;
}

/**
 * DTO for tile updates
 */
export class TileUpdateDto {
  position: { x: number; y: number; z: number };
  type: string;
  walkable: boolean;
  items?: any[];
}

/**
 * DTO for game events
 */
export class GameEventDto {
  id: string;
  type: string;
  data: any;
  timestamp: string;
}

/**
 * DTO for chat messages
 */
export class ChatMessageDto {
  id: string;
  sender: string;
  content: string;
  channel: string;
  timestamp: string;
  private: boolean;
  recipients?: string[];
}

/**
 * DTO for movement requests
 */
export class MovementRequestDto {
  direction: 'north' | 'south' | 'east' | 'west' | 'up' | 'down';
  position?: { x: number; y: number; z: number };
}

/**
 * DTO for combat action requests
 */
export class CombatActionDto {
  actionType: 'attack' | 'cast' | 'defend' | 'use';
  targetId?: string;
  skillId?: string;
  itemId?: string;
}

/**
 * DTO for interaction requests
 */
export class InteractionDto {
  interactionType: 'examine' | 'pickup' | 'use' | 'talk' | 'trade';
  targetId: string;
  position?: { x: number; y: number; z: number };
}
