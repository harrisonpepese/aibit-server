export class MovementSpeed {
  private readonly value: number;
  private readonly unit: 'tiles_per_second' | 'milliseconds_per_tile';

  constructor(value: number, unit: 'tiles_per_second' | 'milliseconds_per_tile' = 'tiles_per_second') {
    this.validate(value, unit);
    this.value = value;
    this.unit = unit;
  }

  private validate(value: number, unit: string): void {
    if (value <= 0) {
      throw new Error('Velocidade deve ser maior que zero');
    }

    if (unit === 'tiles_per_second' && value > 10) {
      throw new Error('Velocidade não pode exceder 10 tiles por segundo');
    }

    if (unit === 'milliseconds_per_tile' && value < 100) {
      throw new Error('Tempo por tile não pode ser menor que 100ms');
    }

    if (!['tiles_per_second', 'milliseconds_per_tile'].includes(unit)) {
      throw new Error('Unidade de velocidade inválida');
    }
  }

  getValue(): number {
    return this.value;
  }

  getUnit(): string {
    return this.unit;
  }

  // Conversões
  toTilesPerSecond(): number {
    if (this.unit === 'tiles_per_second') {
      return this.value;
    }
    return 1000 / this.value; // Converte de ms/tile para tiles/s
  }

  toMillisecondsPerTile(): number {
    if (this.unit === 'milliseconds_per_tile') {
      return this.value;
    }
    return 1000 / this.value; // Converte de tiles/s para ms/tile
  }

  // Métodos de negócio
  calculateDuration(distance: number): number {
    const msPerTile = this.toMillisecondsPerTile();
    return Math.round(distance * msPerTile);
  }

  isSlower(other: MovementSpeed): boolean {
    return this.toTilesPerSecond() < other.toTilesPerSecond();
  }

  isFaster(other: MovementSpeed): boolean {
    return this.toTilesPerSecond() > other.toTilesPerSecond();
  }

  multiply(factor: number): MovementSpeed {
    if (factor <= 0) {
      throw new Error('Fator multiplicador deve ser positivo');
    }
    
    if (this.unit === 'tiles_per_second') {
      return new MovementSpeed(this.value * factor, this.unit);
    } else {
      return new MovementSpeed(this.value / factor, this.unit);
    }
  }

  // Velocidades predefinidas
  static walk(): MovementSpeed {
    return new MovementSpeed(1.0, 'tiles_per_second');
  }

  static run(): MovementSpeed {
    return new MovementSpeed(2.0, 'tiles_per_second');
  }

  static sprint(): MovementSpeed {
    return new MovementSpeed(3.0, 'tiles_per_second');
  }

  static teleport(): MovementSpeed {
    return new MovementSpeed(10.0, 'tiles_per_second');
  }

  static slow(): MovementSpeed {
    return new MovementSpeed(0.5, 'tiles_per_second');
  }

  static fromStamina(stamina: number): MovementSpeed {
    // Velocidade baseada na stamina (0-100)
    if (stamina < 0 || stamina > 100) {
      throw new Error('Stamina deve estar entre 0 e 100');
    }

    if (stamina === 0) {
      return MovementSpeed.slow();
    } else if (stamina < 20) {
      return new MovementSpeed(0.7, 'tiles_per_second');
    } else if (stamina < 50) {
      return MovementSpeed.walk();
    } else if (stamina < 80) {
      return new MovementSpeed(1.5, 'tiles_per_second');
    } else {
      return MovementSpeed.run();
    }
  }

  equals(other: MovementSpeed): boolean {
    const thisSpeed = this.toTilesPerSecond();
    const otherSpeed = other.toTilesPerSecond();
    return Math.abs(thisSpeed - otherSpeed) < 0.01; // Tolerância para comparação de floats
  }

  toString(): string {
    return `${this.value} ${this.unit}`;
  }

  toJSON() {
    return {
      value: this.value,
      unit: this.unit,
      tilesPerSecond: this.toTilesPerSecond(),
      millisecondsPerTile: this.toMillisecondsPerTile(),
    };
  }
}
