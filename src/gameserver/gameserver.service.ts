import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ClientConnectionService } from './application/use-cases/client-connection.service';
import { WorldStateService } from './application/use-cases/world-state.service';
import { GameActionService } from './application/use-cases/game-action.service';
import { WorldUpdateDto } from './dto/websocket.dto';

@Injectable()
export class GameServerService implements OnModuleInit {
    private readonly logger = new Logger(GameServerService.name);
    private clientConnections: Map<string, any> = new Map(); // Stores raw client connections (sockets)
    private webSocketGateway: any; // Will be set by the WebSocketGateway
    
    constructor(
        private readonly clientConnectionService: ClientConnectionService,
        private readonly worldStateService: WorldStateService,
        private readonly gameActionService: GameActionService
    ) {}

    async onModuleInit() {
        this.logger.log('GameServerService initialized');
        await this.initializeGameWorld();
    }

    private async initializeGameWorld() {
        this.logger.log('Initializing game world...');
        // Here you would load initial game state, spawn creatures, etc.
        // For now, we'll just set up a simple world
        
        // This would typically be loaded from a database or configuration
        try {
            const worldState = await this.worldStateService.getCurrentWorldState();
            if (!worldState) {
                this.logger.log('No world state found, creating initial state');
                // Initial setup would go here
            } else {
                this.logger.log('World state loaded successfully');
            }
        } catch (error) {
            this.logger.error('Error initializing game world', error.stack);
        }
    }

    /**
     * Set the WebSocket gateway to use for client communication
     */
    public setWebSocketGateway(gateway: any) {
        this.webSocketGateway = gateway;
    }

    /**
     * Get the current game state
     */
    public async getGameState(): Promise<any> {
        return this.worldStateService.getCurrentWorldState();
    }
    
    /**
     * Register a new client connection
     */
    public registerClient(clientId: string, connection: any) {
        this.clientConnections.set(clientId, connection);
        this.logger.log(`Client connected: ${clientId}`);
    }

    /**
     * Remove a client connection
     */
    public removeClient(clientId: string) {
        this.clientConnections.delete(clientId);
        this.logger.log(`Client disconnected: ${clientId}`);
    }

    /**
     * Process a game action from a client
     */
    public async processGameAction(actionData: {
        clientId: string;
        accountId: string;
        characterId: string;
        action: any;
    }): Promise<any> {
        return this.gameActionService.processGameAction(actionData);
    }

    /**
     * Send an update to a specific client
     */
    public sendToClient(clientId: string, event: string, data: any): boolean {
        if (this.webSocketGateway) {
            return this.webSocketGateway.sendToClient(clientId, event, data);
        }
        
        const connection = this.clientConnections.get(clientId);
        if (connection) {
            try {
                connection.emit(event, data);
                return true;
            } catch (error) {
                this.logger.error(`Error sending to client ${clientId}:`, error.stack);
                return false;
            }
        }
        return false;
    }

    /**
     * Send an update to all connected clients
     */
    public broadcastToAll(event: string, data: any): void {
        if (this.webSocketGateway) {
            this.webSocketGateway.broadcastToAll(event, data);
            return;
        }
        
        for (const [clientId, connection] of this.clientConnections.entries()) {
            try {
                connection.emit(event, data);
            } catch (error) {
                this.logger.error(`Error broadcasting to client ${clientId}:`, error.stack);
            }
        }
    }

    /**
     * Send an update to clients in a specific area
     */
    public async broadcastToArea(event: string, data: any, center: { x: number; y: number; z: number }, radius: number): Promise<void> {
        // Get players in the area
        const { players } = await this.worldStateService.getEntitiesInArea(center, radius);
        
        // Find client connections for these players
        for (const player of players) {
            if (player.clientId) {
                this.sendToClient(player.clientId, event, data);
            }
        }
    }

    /**
     * Send an update to specific entities
     */
    public async broadcastToEntities(event: string, data: any, entityIds: string[]): Promise<void> {
        for (const entityId of entityIds) {
            // Find the player by ID
            const player = await this.worldStateService.getPlayerById(entityId);
            if (player && player.clientId) {
                this.sendToClient(player.clientId, event, data);
            }
        }
    }

    /**
     * Get the status of the game server
     */
    public async getStatus(): Promise<any> {
        const connections = await this.clientConnectionService.getAllConnections();
        const worldState = await this.worldStateService.getCurrentWorldState();
        
        return {
            status: 'online',
            connections: connections.length,
            lastUpdate: worldState ? worldState.getLastUpdate() : null,
            players: worldState ? worldState.getAllPlayers().length : 0,
            creatures: worldState ? worldState.getAllCreatures().length : 0
        };
    }

    /**
     * Scheduled task to update game state and send updates to clients
     */
    @Interval(1000) // Every second
    async updateGameState(): Promise<void> {
        try {
            // Update game state (e.g., creature AI, respawns, etc.)
            // This would call other services to update the world
            
            // Process unprocessed events
            const events = await this.worldStateService.getUnprocessedEvents();
            for (const event of events) {
                // Process event based on type
                await this.worldStateService.markEventAsProcessed(event.id);
            }
            
            // Clean up old processed events
            await this.worldStateService.clearOldProcessedEvents();
            
        } catch (error) {
            this.logger.error('Error in game state update', error.stack);
        }
    }

    /**
     * Perform a game action (used by the controller)
     */
    public async performAction(actionDto: any): Promise<any> {
        // This would be used by REST API calls
        return { success: true, message: 'Action performed' };
    }
}