import { Position } from '../../../movement/domain/value-objects/position.vo';
import { Tile, TileType } from './tile.entity';

export class GameMap {
  private readonly id: string;
  private readonly name: string;
  private readonly width: number;
  private readonly height: number;
  private readonly depth: number;
  private readonly tiles: Map<string, Tile>;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  constructor(
    id: string,
    name: string,
    width: number,
    height: number,
    depth: number = 16, // Máximo de 16 níveis (0-15)
    tiles: Tile[] = [],
  ) {
    this.validateDimensions(width, height, depth);
    
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.tiles = new Map();
    this.createdAt = new Date();
    this.updatedAt = new Date();

    // Inicializa o mapa com os tiles fornecidos
    tiles.forEach(tile => {
      this.setTile(tile);
    });
  }

  private validateDimensions(width: number, height: number, depth: number): void {
    if (width <= 0 || height <= 0 || depth <= 0) {
      throw new Error('As dimensões do mapa devem ser números positivos');
    }

    if (width > 10000 || height > 10000) {
      throw new Error('Dimensões do mapa não podem exceder 10000');
    }

    if (depth > 16) {
      throw new Error('Profundidade do mapa não pode exceder 16 níveis');
    }
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getDepth(): number {
    return this.depth;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  // Métodos de acesso aos tiles
  getTile(position: Position): Tile | undefined {
    return this.tiles.get(this.positionToKey(position));
  }

  setTile(tile: Tile): void {
    const position = tile.getPosition();
    
    if (this.isPositionOutOfBounds(position)) {
      throw new Error(`Posição ${position.toString()} está fora dos limites do mapa`);
    }
    
    this.tiles.set(this.positionToKey(position), tile);
    this.touch();
  }

  hasTile(position: Position): boolean {
    return this.tiles.has(this.positionToKey(position));
  }

  removeTile(position: Position): boolean {
    const result = this.tiles.delete(this.positionToKey(position));
    if (result) {
      this.touch();
    }
    return result;
  }

  // Métodos de negócio
  isWalkable(position: Position): boolean {
    const tile = this.getTile(position);
    return tile ? tile.isWalkable() : false;
  }

  isPositionOutOfBounds(position: Position): boolean {
    return position.getX() < 0 || position.getX() >= this.width ||
           position.getY() < 0 || position.getY() >= this.height ||
           position.getZ() < 0 || position.getZ() >= this.depth;
  }

  getNeighborTiles(position: Position, includeDiagonal: boolean = true): Tile[] {
    const neighbors = position.getNeighbors(includeDiagonal);
    return neighbors
      .filter(pos => !this.isPositionOutOfBounds(pos))
      .map(pos => this.getTile(pos))
      .filter((tile): tile is Tile => tile !== undefined);
  }

  // Retorna todos os tiles em um raio específico
  getTilesInRadius(center: Position, radius: number): Tile[] {
    const tiles: Tile[] = [];
    
    for (let z = Math.max(0, center.getZ() - radius); z <= Math.min(this.depth - 1, center.getZ() + radius); z++) {
      for (let y = Math.max(0, center.getY() - radius); y <= Math.min(this.height - 1, center.getY() + radius); y++) {
        for (let x = Math.max(0, center.getX() - radius); x <= Math.min(this.width - 1, center.getX() + radius); x++) {
          const pos = new Position(x, y, z);
          const tile = this.getTile(pos);
          
          if (tile && center.manhattanDistanceTo(pos) <= radius) {
            tiles.push(tile);
          }
        }
      }
    }
    
    return tiles;
  }

  // Preenche uma área com um tipo específico de tile
  fillArea(
    start: Position,
    end: Position,
    tileType: TileType,
    walkable: boolean = true,
    friction: number = 1.0,
    damagePerTurn: number = 0,
  ): void {
    const startX = Math.min(start.getX(), end.getX());
    const endX = Math.max(start.getX(), end.getX());
    const startY = Math.min(start.getY(), end.getY());
    const endY = Math.max(start.getY(), end.getY());
    const z = start.getZ(); // Preenche apenas um nível por vez
    
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const position = new Position(x, y, z);
        
        if (!this.isPositionOutOfBounds(position)) {
          const tile = new Tile(position, tileType, walkable, friction, damagePerTurn);
          this.setTile(tile);
        }
      }
    }
  }

  // Métodos de utilidade
  private positionToKey(position: Position): string {
    return `${position.getX()},${position.getY()},${position.getZ()}`;
  }

  private touch(): void {
    this.updatedAt.setTime(Date.now());
  }

  // Converte o mapa para JSON para persistência
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      width: this.width,
      height: this.height,
      depth: this.depth,
      tiles: Array.from(this.tiles.values()).map(tile => tile.toJSON()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  // Método estático para criar um mapa vazio
  static createEmpty(
    id: string,
    name: string,
    width: number,
    height: number,
    depth: number = 16,
  ): GameMap {
    return new GameMap(id, name, width, height, depth);
  }
}
