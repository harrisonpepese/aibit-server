import { DamageType } from '../entities/damage.entity';

export class Resistance {
  private readonly type: DamageType;
  private readonly percentage: number;

  constructor(type: DamageType, percentage: number) {
    this.validate(type, percentage);
    this.type = type;
    this.percentage = percentage;
  }

  private validate(type: DamageType, percentage: number): void {
    if (!Object.values(DamageType).includes(type)) {
      throw new Error('Tipo de dano inválido para resistência');
    }

    if (percentage < 0 || percentage > 100) {
      throw new Error('Percentual de resistência deve estar entre 0 e 100');
    }

    // Não pode ter resistência a cura
    if (type === DamageType.HEALING) {
      throw new Error('Não é possível ter resistência a cura');
    }
  }

  getType(): DamageType {
    return this.type;
  }

  getPercentage(): number {
    return this.percentage;
  }

  calculateReduction(damage: number): number {
    return Math.floor(damage * (this.percentage / 100));
  }

  isImmune(): boolean {
    return this.percentage >= 100;
  }

  isVulnerable(): boolean {
    return this.percentage < 0; // Resistência negativa = vulnerabilidade
  }

  equals(other: Resistance): boolean {
    return this.type === other.type && this.percentage === other.percentage;
  }

  toString(): string {
    if (this.isImmune()) {
      return `Immune to ${this.type}`;
    }
    
    if (this.isVulnerable()) {
      return `Vulnerable to ${this.type} (${Math.abs(this.percentage)}% extra damage)`;
    }
    
    return `${this.percentage}% resistance to ${this.type}`;
  }

  toJSON() {
    return {
      type: this.type,
      percentage: this.percentage,
    };
  }
}
