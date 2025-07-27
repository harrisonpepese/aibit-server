import { GameEventType, GameEventStatus } from '../domain/entities/game-event.entity';

export class EventResponseDto {
  id: string;
  type: GameEventType;
  status: GameEventStatus;
  data: any;
  createdAt: string;
  processedAt: string | null;
  result: any | null;
  priority: number;
  visibility: {
    type: 'GLOBAL' | 'AREA' | 'SPECIFIC_ENTITIES';
    areaCenter?: { x: number; y: number; z: number };
    radius?: number;
    entityIds?: string[];
  };
}

export class EventsForEntityResponseDto {
  entityId: string;
  events: EventResponseDto[];
}

export class EventsInAreaResponseDto {
  area: {
    x: number;
    y: number;
    z: number;
    radius: number;
  };
  events: EventResponseDto[];
}

export class EventCountResponseDto {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  byModule: Record<string, number>;
}
