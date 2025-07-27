import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventsService } from '../../../events/events.service';
import { GameServerService } from '../../gameserver.service';
import { WorldStateService } from '../../application/use-cases/world-state.service';
import { GameEvent, GameEventType } from '../../../events/domain/entities/game-event.entity';
import { Subscription } from 'rxjs';

/**
 * Service adapter that connects the events module to the GameServer.
 * Responsible for subscribing the GameServer to relevant events and
 * updating the game state as events occur.
 */
@Injectable()
export class GameEventAdapterService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GameEventAdapterService.name);
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly eventsService: EventsService,
    private readonly gameServerService: GameServerService,
    private readonly worldStateService: WorldStateService,
  ) {}

  onModuleInit() {
    // Assina todos os eventos relevantes
    this.subscribeToAllEvents();
  }

  private subscribeToAllEvents() {
    // Assina todos os eventos
    const allEventsSubscription = this.eventsService.subscribeToAll()
      .subscribe(event => {
        this.processEvent(event);
      });
    
    this.subscriptions.push(allEventsSubscription);
    
    console.log('[GameEventAdapter] Assinatura de eventos iniciada');
  }
  private async processEvent(event: GameEvent) {
    const eventType = event.getType();
    const eventData = event.getData();
    
    console.log(`[GameEventAdapter] Processando evento: ${eventType}`);
    
    try {      // Add the event to the world state as an event record
      await this.worldStateService.addEvent({
        type: eventType,
        data: eventData
      });

      // Process specific event types for state changes
      switch (eventType) {
        case GameEventType.MOVEMENT_COMPLETED:
          await this.processMovementEvent(eventData);
          break;
        
        case GameEventType.ENTITY_TELEPORTED:
          await this.processEntityTeleportEvent(eventData);
          break;
        
        case GameEventType.COMBAT_STARTED:
        case GameEventType.ATTACK_PERFORMED:
        case GameEventType.DAMAGE_DEALT:
          await this.processCombatEvent(eventType, eventData);
          break;
        
        case GameEventType.ENTITY_SPAWNED:
        case GameEventType.ENTITY_DESPAWNED:
          await this.processEntityEvent(eventType, eventData);
          break;
        
        case GameEventType.ITEM_DROPPED:
        case GameEventType.ITEM_PICKED:
          await this.processItemEvent(eventType, eventData);
          break;
        
        case GameEventType.MESSAGE_SENT:
          await this.processChatEvent(eventData);
          break;
        
        case GameEventType.TILE_CHANGED:
        case GameEventType.AREA_EFFECT_TRIGGERED:
          await this.processMapEvent(eventType, eventData);
          break;
        
        // System events
        case GameEventType.SYSTEM_NOTIFICATION:
          await this.processSystemEvent(eventData);
          break;
        
        default:
          console.log(`[GameEventAdapter] Tipo de evento não tratado: ${eventType}`);
      }
      
      // Notify clients about the event
      this.notifyClients(event);
      
    } catch (error) {
      console.error(`[GameEventAdapter] Erro ao processar evento ${eventType}:`, error);
    }
  }  private async processMovementEvent(eventData: any) {
    try {
      // Update entity position using the appropriate method
      await this.updateEntityPosition(eventData.entityId, eventData.toPosition);
      
      this.logger.log(`Entity ${eventData.entityId} moved to position ${JSON.stringify(eventData.toPosition)}`);
    } catch (error) {
      this.logger.error(`Failed to process movement event for entity ${eventData.entityId}:`, error);
    }
  }

  private async updateEntityPosition(entityId: string, newPosition: { x: number; y: number; z: number }): Promise<void> {
    // Try to find and update the entity as a player first
    let player = await this.worldStateService.getPlayerById(entityId);
    if (player) {
      player.position = newPosition;
      await this.worldStateService.addOrUpdatePlayer(player);
      return;
    }

    // If not found as player, try as creature
    let creature = await this.worldStateService.getCreatureById(entityId);
    if (creature) {
      creature.position = newPosition;
      await this.worldStateService.addOrUpdateCreature(creature);
      return;
    }

    this.logger.warn(`Entity ${entityId} not found for position update`);
  }
  private async processEntityTeleportEvent(eventData: any) {
    // Similar to movement, but immediate position change
    await this.processMovementEvent(eventData);
  }
  private async processCombatEvent(eventType: GameEventType, eventData: any) {
    try {
      // Add the combat event to the world state
      await this.worldStateService.addEvent({
        type: eventType,
        data: eventData
      });

      // Update entity health if damage was dealt
      if (eventType === GameEventType.DAMAGE_DEALT && eventData.targetId && eventData.damage) {
        await this.updateEntityHealth(eventData.targetId, -eventData.damage);
      }

      this.logger.log(`Combat event ${eventType} processed for entities`);
    } catch (error) {
      this.logger.error(`Failed to process combat event ${eventType}:`, error);
    }
  }

  private async updateEntityHealth(entityId: string, healthChange: number): Promise<void> {
    // Try to find the entity as a player first
    let player = await this.worldStateService.getPlayerById(entityId);
    if (player) {
      player.health = Math.max(0, Math.min(player.maxHealth, player.health + healthChange));
      await this.worldStateService.addOrUpdatePlayer(player);
      return;
    }

    // If not found as player, try as creature
    let creature = await this.worldStateService.getCreatureById(entityId);
    if (creature) {
      creature.health = Math.max(0, Math.min(creature.maxHealth, creature.health + healthChange));
      await this.worldStateService.addOrUpdateCreature(creature);
      return;
    }

    this.logger.warn(`Entity ${entityId} not found for health update`);
  }
  private async processEntityEvent(eventType: GameEventType, eventData: any) {
    try {
      if (eventType === GameEventType.ENTITY_SPAWNED) {
        // Add the entity to the world state
        if (eventData.entityType === 'player' && eventData.entity) {
          await this.worldStateService.addOrUpdatePlayer(eventData.entity);
          this.logger.log(`Player ${eventData.entity.id} spawned`);
        } else if (eventData.entityType === 'creature' && eventData.entity) {
          await this.worldStateService.addOrUpdateCreature(eventData.entity);
          this.logger.log(`Creature ${eventData.entity.id} spawned`);
        }
      } else if (eventType === GameEventType.ENTITY_DESPAWNED) {
        // Remove the entity from the world state
        if (eventData.entityType === 'player' && eventData.entityId) {
          await this.worldStateService.removePlayer(eventData.entityId);
          this.logger.log(`Player ${eventData.entityId} despawned`);
        } else if (eventData.entityType === 'creature' && eventData.entityId) {
          await this.worldStateService.removeCreature(eventData.entityId);
          this.logger.log(`Creature ${eventData.entityId} despawned`);
        }
      }

      // Add the event to the world state
      await this.worldStateService.addEvent({
        type: eventType,
        data: eventData
      });
    } catch (error) {
      this.logger.error(`Failed to process entity event ${eventType}:`, error);
    }
  }
  private async processItemEvent(eventType: GameEventType, eventData: any) {
    try {
      // Add the item event to the world state
      await this.worldStateService.addEvent({
        type: eventType,
        data: eventData
      });

      this.logger.log(`Item event ${eventType} processed`);
    } catch (error) {
      this.logger.error(`Failed to process item event ${eventType}:`, error);
    }
  }
  private async processChatEvent(eventData: any) {
    try {
      // Add the chat event to the world state
      await this.worldStateService.addEvent({
        type: 'CHAT',
        data: {
          senderId: eventData.senderId,
          senderName: eventData.senderName,
          message: eventData.message,
          channel: eventData.channel,
        }
      });

      this.logger.log(`Chat message from ${eventData.senderName} processed`);
    } catch (error) {
      this.logger.error(`Failed to process chat event:`, error);
    }
  }  private async processMapEvent(eventType: GameEventType, eventData: any) {
    try {
      if (eventType === GameEventType.TILE_CHANGED) {
        // Update the specific tile in the world state
        const { x, y, z } = eventData.position;        const tileData = {
          id: `${x}_${y}_${z}`, // Generate unique ID for the tile
          position: { x, y, z },
          type: eventData.tileData.type,
          walkable: eventData.tileData.walkable,
          friction: eventData.tileData.friction || 1.0, // Default friction
          items: eventData.tileData.items || [],
          metadata: eventData.tileData.metadata || {}
        };
        
        await this.worldStateService.addOrUpdateTile(tileData);
        this.logger.log(`Tile at (${x}, ${y}, ${z}) updated`);
      }

      // Add the map event to the world state
      await this.worldStateService.addEvent({
        type: eventType,
        data: eventData
      });

      this.logger.log(`Map event ${eventType} processed`);
    } catch (error) {
      this.logger.error(`Failed to process map event ${eventType}:`, error);
    }
  }
  private async processSystemEvent(eventData: any) {
    try {
      // Add the system event to the world state
      await this.worldStateService.addEvent({
        type: 'SYSTEM',
        data: {
          message: eventData.message,
          severity: eventData.severity,
        }
      });

      this.logger.log(`System event processed: ${eventData.message}`);
    } catch (error) {
      this.logger.error(`Failed to process system event:`, error);
    }
  }
  private async notifyClients(event: GameEvent) {
    try {
      const visibility = event.getVisibility();
      const eventType = event.getType();
      const eventData = event.getData();
      
      if (visibility.type === 'GLOBAL') {
        // Notify all connected clients
        this.gameServerService.broadcastToAll('gameEvent', {
          type: eventType,
          data: eventData,
          timestamp: new Date().toISOString()
        });
        this.logger.debug(`Global broadcast sent for event: ${eventType}`);
      } else if (visibility.type === 'AREA') {
        // Notify clients in a specific area
        await this.gameServerService.broadcastToArea(
          'gameEvent',
          {
            type: eventType,
            data: eventData,
            timestamp: new Date().toISOString()
          },
          visibility.areaCenter,
          visibility.radius
        );
        this.logger.debug(`Area broadcast sent for event: ${eventType}`);
      } else if (visibility.type === 'SPECIFIC_ENTITIES') {
        // Notify only specific entities
        await this.gameServerService.broadcastToEntities(
          'gameEvent',
          {
            type: eventType,
            data: eventData,
            timestamp: new Date().toISOString()
          },
          visibility.entityIds
        );
        this.logger.debug(`Specific entities broadcast sent for event: ${eventType}`);
      }
    } catch (error) {
      this.logger.error(`Failed to notify clients about event ${event.getType()}:`, error);
    }
  }

  // Limpa as assinaturas ao destruir o serviço
  onModuleDestroy() {
    // Clean up all subscriptions
    this.subscriptions.forEach(subscription => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
    this.subscriptions = [];
    this.logger.log('GameEventAdapterService destroyed and subscriptions cleaned up');
  }
}
