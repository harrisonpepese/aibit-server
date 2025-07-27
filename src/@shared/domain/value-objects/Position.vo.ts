
export interface PositionProps {
    x: number;
    y: number;
    z: number;
}

export class Position {
    private readonly x: number;
    private readonly y: number;
    private readonly z: number;

    constructor({ x, y, z = 0 }: PositionProps) {
        this.x = x;
        this.y = y;
        this.z = z; //is the floor by default
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

    equals(other: Position): boolean {
        return this.x === other.getX() && this.y === other.getY() && this.z === other.getZ();
    }

    // Distância Chebyshev 2D - adequada para movimento em 8 direções (cardinal + diagonal)
    // Representa o número mínimo de movimentos para chegar ao destino
    chebyshevDistance2D(other: Position): number {
        return Math.max(Math.abs(this.x - other.getX()), Math.abs(this.y - other.getY()));
    }

    toJSON(): { x: number; y: number; z: number } {
        return {
            x: this.getX(),
            y: this.getY(),
            z: this.getZ()
        };
    }

    static zero(): Position {
        return new Position({ x: 0, y: 0, z: 0 });
    }

    static fromCoordinates(x: number, y: number, z: number = 0): Position {
        return new Position({ x, y, z });
    }

    static isAdjacent(a: Position, b: Position): boolean {
        // Utiliza o método específico para o mesmo andar (8 direções)
        return Position.isAdjacentInSameFloor(a, b);
    }

    static isInSameFloor(a: Position, b: Position): boolean {
        return a.getZ() === b.getZ();
    }

    // Verifica se duas posições são adjacentes (movimento em 8 direções) no mesmo andar
    static isAdjacentInSameFloor(a: Position, b: Position): boolean {
        if (!Position.isInSameFloor(a, b)) return false;
        
        const dx = Math.abs(a.getX() - b.getX());
        const dy = Math.abs(a.getY() - b.getY());
        
        // Adjacente: exatamente 1 tile de distância (cardinal ou diagonal)
        return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
    }

    // Retorna todas as 8 posições adjacentes no mesmo andar
    getAllNeighbors(): Position[] {
        const neighbors: Position[] = [];
        
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue; // Pula a posição atual
                
                neighbors.push(new Position({
                    x: this.x + dx,
                    y: this.y + dy,
                    z: this.z
                }));
            }
        }
        
        return neighbors;
    }


    static distance(a: Position, b: Position): number {
        const dx = a.getX() - b.getX();
        const dy = a.getY() - b.getY();
        const dz = a.getZ() - b.getZ();
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    static midpoint(a: Position, b: Position): Position {
        return new Position({
            x: (a.getX() + b.getX()) / 2,
            y: (a.getY() + b.getY()) / 2,
            z: (a.getZ() + b.getZ()) / 2
        });
    }
}