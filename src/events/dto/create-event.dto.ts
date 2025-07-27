import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { GameEventType } from '../domain/entities/game-event.entity';

class AreaCenterDto {
  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsNumber()
  z: number;
}

class EventVisibilityDto {
  @IsNotEmpty()
  @IsString()
  type: 'GLOBAL' | 'AREA' | 'SPECIFIC_ENTITIES';

  @IsOptional()
  @ValidateNested()
  @Type(() => AreaCenterDto)
  areaCenter?: AreaCenterDto;

  @IsOptional()
  @IsNumber()
  radius?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  entityIds?: string[];
}

export class CreateEventDto {
  @IsNotEmpty()
  @IsEnum(GameEventType)
  type: GameEventType;

  @IsNotEmpty()
  @IsString()
  sourceModule: string;

  @IsOptional()
  @IsString()
  sourceEvent?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EventVisibilityDto)
  visibility: EventVisibilityDto;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsNotEmpty()
  data: Record<string, any>;
}
