import { Injectable } from '@nestjs/common';

@Injectable()
export class GameServerService {
    private gameState: any; // Define o estado do jogo

    constructor() {
        this.initializeGameState();
    }

    private initializeGameState() {
        // Inicializa o estado do jogo
        this.gameState = {
            players: [],
            creatures: [],
            map: {},
            events: []
        };
    }

    public getGameState() {
        return this.gameState;
    }

    public updateGameState(newState: any) {
        // Atualiza o estado do jogo com as novas informações
        this.gameState = { ...this.gameState, ...newState };
    }

    // Adicione outros métodos para gerenciar a lógica do jogo conforme necessário
}