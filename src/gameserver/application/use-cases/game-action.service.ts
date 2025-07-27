import { Injectable, Logger } from '@nestjs/common';
import { WorldStateService } from './world-state.service';
import { ClientConnectionService } from './client-connection.service';
import { EventsService } from '../../../events/events.service';

@Injectable()
export class GameActionService {
  private readonly logger = new Logger(GameActionService.name);

  constructor(
    private readonly worldStateService: WorldStateService,
    private readonly clientConnectionService: ClientConnectionService,
    private readonly eventsService: EventsService
  ) {}

  /**
   * Processes a game action from a client
   */
  async processGameAction(actionData: {
    clientId: string;
    accountId: string;
    characterId: string;
    action: any;
  }): Promise<any> {
    const { clientId, accountId, characterId, action } = actionData;
    
    // Update client activity
    await this.clientConnectionService.updateActivity(clientId);
    
    // Process action based on type
    switch (action.type) {
      case 'movement':
        return this.handleMovementAction(characterId, action.payload);
        
      case 'combat':
        return this.handleCombatAction(characterId, action.payload);
        
      case 'chat':
        return this.handleChatAction(characterId, action.payload);
        
      case 'interaction':
        return this.handleInteractionAction(characterId, action.payload);
        
      default:
        this.logger.warn(`Unknown action type: ${action.type}`);
        return { success: false, message: 'Unknown action type' };
    }
  }
  
  /**
   * Handles a movement action
   */
  private async handleMovementAction(characterId: string, payload: any): Promise<any> {
    try {
      // Get the player from world state
      const player = await this.worldStateService.getPlayerByCharacterId(characterId);
      if (!player) {
        return { success: false, message: 'Player not found in world' };
      }
      
      // In real implementation, validate movement and update position
      // For now, we'll just emit a movement event
        // Send event to movement service via the event system
      await this.eventsService.createAndPublishEvent(
        'MOVEMENT_REQUEST' as any,
        'gameserver',
        {
          characterId,
          direction: payload.direction,
          position: player.position
        },
        { type: 'SPECIFIC_ENTITIES', entityIds: [characterId] }
      );
      
      return { success: true, message: 'Movement processed' };
    } catch (error) {
      this.logger.error(`Error processing movement: ${error.message}`, error.stack);
      return { success: false, message: 'Error processing movement' };
    }
  }
  
  /**
   * Handles a combat action
   */
  private async handleCombatAction(characterId: string, payload: any): Promise<any> {
    try {
      // Get the player from world state
      const player = await this.worldStateService.getPlayerByCharacterId(characterId);
      if (!player) {
        return { success: false, message: 'Player not found in world' };
      }
        // Send event to combat service via the event system
      await this.eventsService.createAndPublishEvent(
        'COMBAT_ACTION' as any,
        'gameserver',
        {
          characterId,
          actionType: payload.actionType,
          targetId: payload.targetId,
          skillId: payload.skillId,
          itemId: payload.itemId,
          position: player.position
        },
        { type: 'SPECIFIC_ENTITIES', entityIds: [characterId, payload.targetId].filter(Boolean) }
      );
      
      return { success: true, message: 'Combat action processed' };
    } catch (error) {
      this.logger.error(`Error processing combat action: ${error.message}`, error.stack);
      return { success: false, message: 'Error processing combat action' };
    }
  }
  
  /**
   * Handles a chat action
   */
  private async handleChatAction(characterId: string, payload: any): Promise<any> {
    try {
      // Get the player from world state
      const player = await this.worldStateService.getPlayerByCharacterId(characterId);
      if (!player) {
        return { success: false, message: 'Player not found in world' };
      }
        // Send event to chat service via the event system
      await this.eventsService.createAndPublishEvent(
        'MESSAGE_SENT' as any,
        'gameserver',
        {
          senderId: characterId,
          senderName: player.name,
          content: payload.content,
          channel: payload.channel,
          recipients: payload.recipients
        },
        { type: 'GLOBAL' }
      );
      
      return { success: true, message: 'Chat message sent' };
    } catch (error) {
      this.logger.error(`Error processing chat message: ${error.message}`, error.stack);
      return { success: false, message: 'Error processing chat message' };
    }
  }
  
  /**
   * Handles an interaction action
   */
  private async handleInteractionAction(characterId: string, payload: any): Promise<any> {
    try {
      // Get the player from world state
      const player = await this.worldStateService.getPlayerByCharacterId(characterId);
      if (!player) {
        return { success: false, message: 'Player not found in world' };
      }
        // Send event to appropriate service via the event system
      await this.eventsService.createAndPublishEvent(
        'INTERACTION' as any,
        'gameserver',
        {
          characterId,
          interactionType: payload.interactionType,
          targetId: payload.targetId,
          position: player.position
        },
        { type: 'AREA', areaCenter: player.position, radius: 10 }
      );
      
      return { success: true, message: 'Interaction processed' };
    } catch (error) {
      this.logger.error(`Error processing interaction: ${error.message}`, error.stack);
      return { success: false, message: 'Error processing interaction' };
    }
  }
}
