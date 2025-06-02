export class Position {
  private readonly x: number;
  private readonly y: number;
  private readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.validate(x, y, z);
    this.x = x;
    this.y = y;
    this.z = z;
  }

  private validate(x: number, y: number, z: number): void {
    if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z)) {
      throw new Error('Coordenadas devem ser números inteiros');
    }

    if (x < 0 || y < 0 || z < 0) {
      throw new Error('Coordenadas não podem ser negativas');
    }

    // Limites do mapa (podem ser ajustados conforme necessário)
    const MAX_X = 2048;
    const MAX_Y = 2048;
    const MAX_Z = 15;

    if (x > MAX_X || y > MAX_Y || z > MAX_Z) {
      throw new Error(`Coordenadas devem estar dentro dos limites: x(0-${MAX_X}), y(0-${MAX_Y}), z(0-${MAX_Z})`);
    }
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getZ(): number {
    return this.z;
  }

  distanceTo(other: Position): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  isAdjacent(other: Position): boolean {
    if (this.z !== other.z) {
      return false; // Não são adjacentes se estão em andares diferentes
    }

    const dx = Math.abs(this.x - other.x);
    const dy = Math.abs(this.y - other.y);

    return dx <= 1 && dy <= 1 && (dx + dy) > 0;
  }

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }
}
