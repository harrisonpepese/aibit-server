// src/types/index.ts
export interface Player {
    id: string;
    name: string;
    level: number;
    experience: number;
    health: number;
    mana: number;
    position: Position;
}

export interface Position {
    x: number;
    y: number;
}

export interface Creature {
    id: string;
    name: string;
    type: string;
    health: number;
    position: Position;
}

export interface Item {
    id: string;
    name: string;
    type: string;
    effect: string;
}

export interface Event {
    id: string;
    type: string;
    data: any;
}