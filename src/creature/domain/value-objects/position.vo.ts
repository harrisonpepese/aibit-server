export class Position {
  private readonly x: number;
  private readonly y: number;
  private readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.validateCoordinates(x, y, z);
    
    this.x = x;
    this.y = y;
    this.z = z;
  }

  private validateCoordinates(x: number, y: number, z: number): void {
    if (x < 0 || y < 0 || z < 0) {
      throw new Error('Coordenadas não podem ser negativas');
    }

    // Assumindo um mapa com limites máximos
    const MAX_COORDINATE = 5000; 
    if (x >= MAX_COORDINATE || y >= MAX_COORDINATE) {
      throw new Error(`Coordenadas não podem exceder ${MAX_COORDINATE}`);
    }

    const MAX_FLOORS = 15;
    if (z >= MAX_FLOORS) {
      throw new Error(`Andar não pode exceder ${MAX_FLOORS}`);
    }
  }

  static fromPrimitives(data: { x: number; y: number; z: number }): Position {
    return new Position(data.x, data.y, data.z);
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

  equals(position: Position): boolean {
    return this.x === position.x && this.y === position.y && this.z === position.z;
  }

  distanceTo(position: Position): number {
    if (this.z !== position.z) {
      return Infinity; // Se estiver em andares diferentes, a distância é infinita
    }
    
    const dx = this.x - position.x;
    const dy = this.y - position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  manhattanDistanceTo(position: Position): number {
    if (this.z !== position.z) {
      return Infinity; // Se estiver em andares diferentes, a distância é infinita
    }
    
    return Math.abs(this.x - position.x) + Math.abs(this.y - position.y);
  }

  isSameFloor(position: Position): boolean {
    return this.z === position.z;
  }

  isAdjacentTo(position: Position): boolean {
    if (!this.isSameFloor(position)) {
      return false;
    }
    
    const dx = Math.abs(this.x - position.x);
    const dy = Math.abs(this.y - position.y);
    
    // Adjacente se estiver a uma distância Manhattan de 1 (cima, baixo, esquerda, direita)
    // ou se estiver nas diagonais (distância em cada eixo é 1)
    return (dx <= 1 && dy <= 1) && !(dx === 0 && dy === 0);
  }

  moveNorth(): Position {
    return new Position(this.x, this.y - 1, this.z);
  }

  moveSouth(): Position {
    return new Position(this.x, this.y + 1, this.z);
  }

  moveEast(): Position {
    return new Position(this.x + 1, this.y, this.z);
  }

  moveWest(): Position {
    return new Position(this.x - 1, this.y, this.z);
  }

  getNeighbors(): Position[] {
    return [
      this.moveNorth(),
      this.moveNorthEast(),
      this.moveEast(),
      this.moveSouthEast(),
      this.moveSouth(),
      this.moveSouthWest(),
      this.moveWest(),
      this.moveNorthWest()
    ];
  }

  moveNorthEast(): Position {
    return new Position(this.x + 1, this.y - 1, this.z);
  }

  moveSouthEast(): Position {
    return new Position(this.x + 1, this.y + 1, this.z);
  }

  moveSouthWest(): Position {
    return new Position(this.x - 1, this.y + 1, this.z);
  }

  moveNorthWest(): Position {
    return new Position(this.x - 1, this.y - 1, this.z);
  }

  toString(): string {
    return `(${this.x}, ${this.y}, ${this.z})`;
  }

  toPrimitives(): { x: number; y: number; z: number } {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }
}
