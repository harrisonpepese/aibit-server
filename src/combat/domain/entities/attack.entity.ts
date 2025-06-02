import { v4 as uuidv4 } from 'uuid';

export enum AttackType {
  MELEE = 'MELEE',
  RANGED = 'RANGED',
  MAGICAL = 'MAGICAL',
  SPECIAL = 'SPECIAL',
}

export enum DamageType {
  PHYSICAL = 'PHYSICAL',
  FIRE = 'FIRE',
  ICE = 'ICE',
  ENERGY = 'ENERGY',
  EARTH = 'EARTH',
  HOLY = 'HOLY',
  DEATH = 'DEATH',
  HEALING = 'HEALING',
}

export interface AttackResult {
  damage: number;
  damageType: DamageType;
  critical: boolean;
  dodged: boolean;
  blocked: number; // Quantidade de dano bloqueado
}

export class Attack {
  private readonly id: string;
  private readonly attackerId: string;
  private readonly targetId: string;
  private readonly attackType: AttackType;
  private readonly damageType: DamageType;
  private readonly baseDamage: number;
  private readonly criticalChance: number;
  private readonly accuracy: number;
  private readonly timestamp: Date;
  private result: AttackResult | null;

  constructor(
    attackerId: string,
    targetId: string,
    attackType: AttackType,
    damageType: DamageType,
    baseDamage: number,
    criticalChance: number = 0.05, // 5% chance de crítico por padrão
    accuracy: number = 0.9, // 90% de precisão por padrão
  ) {
    this.validateAttack(baseDamage, criticalChance, accuracy);
    
    this.id = uuidv4();
    this.attackerId = attackerId;
    this.targetId = targetId;
    this.attackType = attackType;
    this.damageType = damageType;
    this.baseDamage = baseDamage;
    this.criticalChance = criticalChance;
    this.accuracy = accuracy;
    this.timestamp = new Date();
    this.result = null;
  }

  private validateAttack(baseDamage: number, criticalChance: number, accuracy: number): void {
    if (baseDamage < 0) {
      throw new Error('Dano base não pode ser negativo');
    }

    if (criticalChance < 0 || criticalChance > 1) {
      throw new Error('Chance de crítico deve estar entre 0 e 1');
    }

    if (accuracy < 0 || accuracy > 1) {
      throw new Error('Precisão deve estar entre 0 e 1');
    }
  }

  getId(): string {
    return this.id;
  }

  getAttackerId(): string {
    return this.attackerId;
  }

  getTargetId(): string {
    return this.targetId;
  }

  getAttackType(): AttackType {
    return this.attackType;
  }

  getDamageType(): DamageType {
    return this.damageType;
  }

  getBaseDamage(): number {
    return this.baseDamage;
  }

  getCriticalChance(): number {
    return this.criticalChance;
  }

  getAccuracy(): number {
    return this.accuracy;
  }

  getTimestamp(): Date {
    return new Date(this.timestamp);
  }

  getResult(): AttackResult | null {
    return this.result ? { ...this.result } : null;
  }

  setResult(result: AttackResult): void {
    this.result = { ...result };
  }

  // Método para calcular o resultado de um ataque
  calculateResult(
    targetDodgeChance: number = 0, 
    targetBlockChance: number = 0,
    targetResistance: number = 0, // Resistência ao tipo de dano (percentual de 0 a 1)
  ): AttackResult {
    // Verifica se o ataque acerta (baseado na precisão e chance de esquiva)
    const hitRoll = Math.random();
    const dodgeRoll = Math.random();
    
    if (hitRoll > this.accuracy || dodgeRoll < targetDodgeChance) {
      const result: AttackResult = {
        damage: 0,
        damageType: this.damageType,
        critical: false,
        dodged: true,
        blocked: 0,
      };
      this.setResult(result);
      return result;
    }
    
    // Calcula se é um golpe crítico
    const criticalRoll = Math.random();
    const isCritical = criticalRoll < this.criticalChance;
    
    // Calcula dano base considerando crítico
    let damage = this.baseDamage;
    if (isCritical) {
      damage *= 2; // Dano crítico causa o dobro de dano
    }
    
    // Aplica resistências
    damage *= (1 - targetResistance);
    
    // Calcula bloqueio
    const blockRoll = Math.random();
    let blocked = 0;
    if (blockRoll < targetBlockChance) {
      blocked = Math.floor(damage * 0.5); // Bloqueia 50% do dano
      damage -= blocked;
    }
    
    // Garante que o dano seja pelo menos 1 se não for esquivado
    damage = Math.max(1, Math.floor(damage));
    
    const result: AttackResult = {
      damage,
      damageType: this.damageType,
      critical: isCritical,
      dodged: false,
      blocked,
    };
    
    this.setResult(result);
    return result;
  }

  toJSON() {
    return {
      id: this.id,
      attackerId: this.attackerId,
      targetId: this.targetId,
      attackType: this.attackType,
      damageType: this.damageType,
      baseDamage: this.baseDamage,
      criticalChance: this.criticalChance,
      accuracy: this.accuracy,
      timestamp: this.timestamp.toISOString(),
      result: this.result,
    };
  }
}
