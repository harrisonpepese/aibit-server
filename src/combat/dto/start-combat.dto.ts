import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class StartCombatDto {
  @IsNotEmpty()
  @IsString()
  initiatorId: string;

  @IsNotEmpty()
  @IsString()
  targetId: string;

  @IsOptional()
  @IsBoolean()
  isPvP?: boolean;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
