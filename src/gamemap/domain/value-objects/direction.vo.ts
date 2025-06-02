export enum Direction {
  NORTH = 'NORTH',
  NORTHEAST = 'NORTHEAST',
  EAST = 'EAST',
  SOUTHEAST = 'SOUTHEAST',
  SOUTH = 'SOUTH',
  SOUTHWEST = 'SOUTHWEST',
  WEST = 'WEST',
  NORTHWEST = 'NORTHWEST',
  UP = 'UP',
  DOWN = 'DOWN',
}

export class DirectionUtils {
  static isCardinal(direction: Direction): boolean {
    return [
      Direction.NORTH,
      Direction.EAST,
      Direction.SOUTH,
      Direction.WEST,
    ].includes(direction);
  }

  static isDiagonal(direction: Direction): boolean {
    return [
      Direction.NORTHEAST,
      Direction.SOUTHEAST,
      Direction.SOUTHWEST,
      Direction.NORTHWEST,
    ].includes(direction);
  }

  static isVertical(direction: Direction): boolean {
    return [Direction.UP, Direction.DOWN].includes(direction);
  }

  static getOpposite(direction: Direction): Direction {
    switch (direction) {
      case Direction.NORTH: return Direction.SOUTH;
      case Direction.NORTHEAST: return Direction.SOUTHWEST;
      case Direction.EAST: return Direction.WEST;
      case Direction.SOUTHEAST: return Direction.NORTHWEST;
      case Direction.SOUTH: return Direction.NORTH;
      case Direction.SOUTHWEST: return Direction.NORTHEAST;
      case Direction.WEST: return Direction.EAST;
      case Direction.NORTHWEST: return Direction.SOUTHEAST;
      case Direction.UP: return Direction.DOWN;
      case Direction.DOWN: return Direction.UP;
    }
  }

  static getDirectionFromDelta(dx: number, dy: number, dz: number = 0): Direction | null {
    if (dz > 0) return Direction.UP;
    if (dz < 0) return Direction.DOWN;

    if (dx === 0 && dy === -1) return Direction.NORTH;
    if (dx === 1 && dy === -1) return Direction.NORTHEAST;
    if (dx === 1 && dy === 0) return Direction.EAST;
    if (dx === 1 && dy === 1) return Direction.SOUTHEAST;
    if (dx === 0 && dy === 1) return Direction.SOUTH;
    if (dx === -1 && dy === 1) return Direction.SOUTHWEST;
    if (dx === -1 && dy === 0) return Direction.WEST;
    if (dx === -1 && dy === -1) return Direction.NORTHWEST;

    return null;
  }

  static getDeltaFromDirection(direction: Direction): { dx: number; dy: number; dz: number } {
    switch (direction) {
      case Direction.NORTH: return { dx: 0, dy: -1, dz: 0 };
      case Direction.NORTHEAST: return { dx: 1, dy: -1, dz: 0 };
      case Direction.EAST: return { dx: 1, dy: 0, dz: 0 };
      case Direction.SOUTHEAST: return { dx: 1, dy: 1, dz: 0 };
      case Direction.SOUTH: return { dx: 0, dy: 1, dz: 0 };
      case Direction.SOUTHWEST: return { dx: -1, dy: 1, dz: 0 };
      case Direction.WEST: return { dx: -1, dy: 0, dz: 0 };
      case Direction.NORTHWEST: return { dx: -1, dy: -1, dz: 0 };
      case Direction.UP: return { dx: 0, dy: 0, dz: 1 };
      case Direction.DOWN: return { dx: 0, dy: 0, dz: -1 };
    }
  }
}
