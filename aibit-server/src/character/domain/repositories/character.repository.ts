import { Character } from '../entities/character.entity';

export interface CharacterRepository {
  save(character: Character): Promise<Character>;
  findById(id: string): Promise<Character | null>;
  findByName(name: string): Promise<Character | null>;
  findByAccountId(accountId: string): Promise<Character[]>;
  update(character: Character): Promise<Character>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Character[]>;
  existsByName(name: string): Promise<boolean>;
  findOnlineCharacters(): Promise<Character[]>;
  findCharactersInArea(x: number, y: number, z: number, radius: number): Promise<Character[]>;
}
