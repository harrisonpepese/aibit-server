import { DamageType } from '../entities/damage.entity';

export class DamageValue {
  private readonly amount: number;
  private readonly type: DamageType;

  constructor(amount: number, type: DamageType) {
    this.validate(amount, type);
    this.amount = amount;
    this.type = type;
  }

  private validate(amount: number, type: DamageType): void {
    if (amount < 0) {
      throw new Error('Quantidade de dano não pode ser negativa');
    }

    if (amount > 99999) {
      throw new Error('Quantidade de dano não pode exceder 99999');
    }

    if (!Object.values(DamageType).includes(type)) {
      throw new Error('Tipo de dano inválido');
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getType(): DamageType {
    return this.type;
  }

  isHealing(): boolean {
    return this.type === DamageType.HEALING;
  }

  isPhysical(): boolean {
    return this.type === DamageType.PHYSICAL;
  }

  isMagical(): boolean {
    return !this.isPhysical() && !this.isHealing();
  }

  equals(other: DamageValue): boolean {
    return this.amount === other.amount && this.type === other.type;
  }

  toString(): string {
    return `${this.amount} ${this.type} damage`;
  }

  toJSON() {
    return {
      amount: this.amount,
      type: this.type,
    };
  }
}
