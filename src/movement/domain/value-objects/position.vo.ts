export class Position {
  private readonly x: number;
  private readonly y: number;
  private readonly z: number;

  constructor(x: number, y: number, z: number = 0) {
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

    if (x > 9999 || y > 9999) {
      throw new Error('Coordenadas X e Y não podem exceder 9999');
    }

    if (z > 15) {
      throw new Error('Coordenada Z (andar) não pode exceder 15');
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

  // Métodos de negócio
  distanceTo(other: Position): number {
    const deltaX = this.x - other.x;
    const deltaY = this.y - other.y;
    const deltaZ = this.z - other.z;
    
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
  }

  manhattanDistanceTo(other: Position): number {
    return Math.abs(this.x - other.x) + 
           Math.abs(this.y - other.y) + 
           Math.abs(this.z - other.z);
  }

  isAdjacentTo(other: Position): boolean {
    const deltaX = Math.abs(this.x - other.x);
    const deltaY = Math.abs(this.y - other.y);
    const deltaZ = Math.abs(this.z - other.z);
    
    // Adjacente se a distância for 1 em qualquer direção (incluindo diagonal)
    // e estiver no mesmo andar
    return deltaZ === 0 && deltaX <= 1 && deltaY <= 1 && (deltaX + deltaY) > 0;
  }

  isSameFloor(other: Position): boolean {
    return this.z === other.z;
  }

  moveBy(deltaX: number, deltaY: number, deltaZ: number = 0): Position {
    return new Position(this.x + deltaX, this.y + deltaY, this.z + deltaZ);
  }

  moveNorth(steps: number = 1): Position {
    return new Position(this.x, this.y - steps, this.z);
  }

  moveSouth(steps: number = 1): Position {
    return new Position(this.x, this.y + steps, this.z);
  }

  moveEast(steps: number = 1): Position {
    return new Position(this.x + steps, this.y, this.z);
  }

  moveWest(steps: number = 1): Position {
    return new Position(this.x - steps, this.y, this.z);
  }

  moveUp(floors: number = 1): Position {
    return new Position(this.x, this.y, this.z + floors);
  }

  moveDown(floors: number = 1): Position {
    return new Position(this.x, this.y, Math.max(0, this.z - floors));
  }

  getNeighbors(includeDiagonal: boolean = true): Position[] {
    const neighbors: Position[] = [];
    
    try {
      // Cardinais
      neighbors.push(this.moveNorth());
      neighbors.push(this.moveSouth());
      neighbors.push(this.moveEast());
      neighbors.push(this.moveWest());

      if (includeDiagonal) {
        // Diagonais
        neighbors.push(this.moveNorth().moveEast());
        neighbors.push(this.moveNorth().moveWest());
        neighbors.push(this.moveSouth().moveEast());
        neighbors.push(this.moveSouth().moveWest());
      }
    } catch (error) {
      // Ignora posições inválidas (fora dos limites)
    }

    return neighbors.filter(pos => this.isValidPosition(pos));
  }

  private isValidPosition(position: Position): boolean {
    try {
      new Position(position.getX(), position.getY(), position.getZ());
      return true;
    } catch {
      return false;
    }
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

  // Métodos estáticos
  static zero(): Position {
    return new Position(0, 0, 0);
  }

  static fromObject(obj: { x: number; y: number; z?: number }): Position {
    return new Position(obj.x, obj.y, obj.z || 0);
  }

  static isValid(x: number, y: number, z: number = 0): boolean {
    try {
      new Position(x, y, z);
      return true;
    } catch {
      return false;
    }
  }
}
