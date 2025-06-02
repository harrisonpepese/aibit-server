import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EndCombatDto {
  @IsNotEmpty()
  @IsString()
  participantId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
