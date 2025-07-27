export class CreatureType {
  private readonly value: string;
  private readonly isBossFlag: boolean;
  private readonly isHostileFlag: boolean;

  constructor(value: string, isBoss: boolean = false, isHostile: boolean = true) {
    this.validateType(value);
    
    this.value = value;
    this.isBossFlag = isBoss;
    this.isHostileFlag = isHostile;
  }

  private validateType(value: string): void {
    if (!value || value.trim() === '') {
      throw new Error('Tipo de criatura não pode ser vazio');
    }

    const validTypes = [
      'monster', 'npc', 'boss', 'animal', 'elemental', 
      'undead', 'demon', 'dragon', 'insect', 'beast', 
      'humanoid', 'construct', 'plant', 'slime', 'aberration'
    ];

    if (!validTypes.includes(value.toLowerCase())) {
      throw new Error(`Tipo de criatura inválido. Tipos válidos são: ${validTypes.join(', ')}`);
    }
  }

  static fromPrimitives(data: { value: string; isBoss: boolean; isHostile: boolean }): CreatureType {
    return new CreatureType(data.value, data.isBoss, data.isHostile);
  }

  getValue(): string {
    return this.value;
  }

  isBoss(): boolean {
    return this.isBossFlag;
  }

  isHostile(): boolean {
    return this.isHostileFlag;
  }

  toPrimitives(): { value: string; isBoss: boolean; isHostile: boolean } {
    return {
      value: this.value,
      isBoss: this.isBossFlag,
      isHostile: this.isHostileFlag
    };
  }

  static monster(isBoss: boolean = false): CreatureType {
    return new CreatureType('monster', isBoss, true);
  }

  static npc(): CreatureType {
    return new CreatureType('npc', false, false);
  }

  static boss(): CreatureType {
    return new CreatureType('boss', true, true);
  }

  static animal(isHostile: boolean = false): CreatureType {
    return new CreatureType('animal', false, isHostile);
  }

  static undead(isBoss: boolean = false): CreatureType {
    return new CreatureType('undead', isBoss, true);
  }

  static dragon(isBoss: boolean = true): CreatureType {
    return new CreatureType('dragon', isBoss, true);
  }
}
