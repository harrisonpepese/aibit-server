import { Injectable } from '@nestjs/common';

@Injectable()
export class CombatActiveParticipantsService {
  // Conjunto de IDs de participantes atualmente em combate
  private activeParticipants: Set<string> = new Set();

  // Adiciona um participante ao conjunto de ativos
  addParticipant(participantId: string): void {
    this.activeParticipants.add(participantId);
  }

  // Remove um participante do conjunto de ativos
  removeParticipant(participantId: string): void {
    this.activeParticipants.delete(participantId);
  }

  // Verifica se um participante está em combate ativo
  isParticipantActive(participantId: string): boolean {
    return this.activeParticipants.has(participantId);
  }

  // Retorna todos os participantes ativos
  getAllActiveParticipants(): string[] {
    return Array.from(this.activeParticipants);
  }

  // Retorna o número de participantes ativos
  getActiveParticipantsCount(): number {
    return this.activeParticipants.size;
  }
}
