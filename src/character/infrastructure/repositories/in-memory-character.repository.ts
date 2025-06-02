import { Injectable } from '@nestjs/common';
import { Character, CharacterPosition, CharacterStats } from '../../domain/entities/character.entity';
import { CharacterRepository } from '../../domain/repositories/character.repository';

@Injectable()
export class InMemoryCharacterRepository implements CharacterRepository {
  private characters: Map<string, Character> = new Map();

  async save(character: Character): Promise<Character> {
    this.characters.set(character.id, character);
    return character;
  }

  async findById(id: string): Promise<Character | null> {
    const characterData = this.characters.get(id);
    return characterData || null;
  }

  async findByName(name: string): Promise<Character | null> {
    for (const character of this.characters.values()) {
      if (character.name.toLowerCase() === name.toLowerCase()) {
        return character;
      }
    }
    return null;
  }

  async findByAccountId(accountId: string): Promise<Character[]> {
    const result: Character[] = [];
    for (const character of this.characters.values()) {
      if (character.accountId === accountId) {
        result.push(character);
      }
    }
    return result;
  }

  async update(character: Character): Promise<Character> {
    if (!this.characters.has(character.id)) {
      throw new Error('Personagem não encontrado para atualização');
    }
    
    this.characters.set(character.id, character);
    return character;
  }

  async delete(id: string): Promise<void> {
    if (!this.characters.has(id)) {
      throw new Error('Personagem não encontrado para exclusão');
    }
    
    this.characters.delete(id);
  }

  async findAll(): Promise<Character[]> {
    return Array.from(this.characters.values());
  }

  async existsByName(name: string): Promise<boolean> {
    for (const character of this.characters.values()) {
      if (character.name.toLowerCase() === name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  async findOnlineCharacters(): Promise<Character[]> {
    const result: Character[] = [];
    for (const character of this.characters.values()) {
      if (character.getIsOnline()) {
        result.push(character);
      }
    }
    return result;
  }

  async findCharactersInArea(x: number, y: number, z: number, radius: number): Promise<Character[]> {
    const result: Character[] = [];
    
    for (const character of this.characters.values()) {
      if (!character.getIsOnline()) {
        continue; // Só considera personagens online
      }
      
      const position = character.getPosition();
      
      // Verifica se está no mesmo andar
      if (position.z !== z) {
        continue;
      }
      
      // Calcula distância
      const dx = position.x - x;
      const dy = position.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= radius) {
        result.push(character);
      }
    }
    
    return result;
  }

  // Métodos auxiliares para testes
  clear(): void {
    this.characters.clear();
  }

  size(): number {
    return this.characters.size;
  }
}
