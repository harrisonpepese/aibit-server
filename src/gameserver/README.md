# GameServer Implementation

This document describes the completed GameServer implementation for the Aibit online game server.

## ✅ Completed Features

### 🏗️ Core Architecture
- **Clean Architecture**: Domain-driven design with clear separation of concerns
- **Event-Driven**: Integrated with the Events module for real-time communication
- **WebSocket Support**: Real-time bidirectional communication with clients
- **JWT Authentication**: Secure token-based authentication system

### 🔐 Authentication System
- **AuthService**: JWT token generation and validation
- **WebSocket Authentication**: Token-based WebSocket connection authentication
- **Account Integration**: Seamless integration with AccountModule

### 🌍 World State Management
- **WorldStateService**: Centralized game world state management
- **Entity Management**: Players, creatures, items, and tiles
- **Event Tracking**: All game events are recorded and processed
- **Area-based Updates**: Efficient updates for specific game areas

### 📡 Real-time Communication
- **GameWebSocketGateway**: WebSocket gateway for client connections
- **Event Broadcasting**: Area-based and entity-specific event broadcasting
- **Client Connection Management**: Secure connection handling with authentication

### 🎮 Game Actions
- **GameActionService**: Handles all player actions (movement, combat, chat, interactions)
- **Event Integration**: Actions are processed through the event system
- **Validation**: Proper validation and error handling for all actions

### 🔄 Event Processing
- **GameEventAdapterService**: Adapts events from other modules to GameServer
- **Real-time Updates**: Immediate processing and broadcasting of game events
- **State Synchronization**: Automatic world state updates based on events

## 🏃‍♂️ How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

### 3. Start the Development Server
```bash
npm run start:dev
```

### 4. Test the GameServer
```bash
# Run the GameServer test
npx ts-node src/gameserver/test-gameserver.ts

# Or use the launcher directly
npx ts-node src/gameserver/gameserver-launcher.ts
```

## 🔌 WebSocket Connection

### Connect to the GameServer
```javascript
const socket = io('ws://localhost:3000/game', {
  auth: {
    token: 'your-jwt-token-here'
  }
});

// Listen for connection status
socket.on('connection_status', (data) => {
  console.log('Connection status:', data);
});

// Listen for game events
socket.on('gameEvent', (event) => {
  console.log('Game event received:', event);
});
```

### Available WebSocket Events

#### Client → Server
- `select_character`: Select a character to play
- `game_action`: Send game actions (movement, combat, chat, etc.)

#### Server → Client
- `connection_status`: Connection and authentication status
- `character_selected`: Character selection confirmation
- `action_result`: Result of game actions
- `gameEvent`: Real-time game events
- `error`: Error messages

## 🎯 Game Actions

### Movement
```javascript
socket.emit('game_action', {
  type: 'movement',
  direction: 'north', // north, south, east, west
  speed: 1
});
```

### Combat
```javascript
socket.emit('game_action', {
  type: 'combat',
  actionType: 'attack',
  targetId: 'target-character-id',
  skillId: 'skill-id' // optional
});
```

### Chat
```javascript
socket.emit('game_action', {
  type: 'chat',
  content: 'Hello, world!',
  channel: 'public' // public, private, guild, etc.
});
```

### Interactions
```javascript
socket.emit('game_action', {
  type: 'interaction',
  interactionType: 'use_item',
  targetId: 'item-id'
});
```

## 🏛️ Architecture Overview

```
GameServer Module
├── GameServerService (Main orchestrator)
├── GameWebSocketGateway (WebSocket communication)
├── GameActionService (Action processing)
├── WorldStateService (World state management)
├── ClientConnectionService (Connection management)
└── GameEventAdapterService (Event integration)

External Dependencies
├── AccountModule (Authentication)
├── EventsModule (Event system)
├── CharacterModule (Character data)
└── Other game modules (Combat, Movement, etc.)
```

## 🔧 Configuration

### Environment Variables
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `WORLD_UPDATE_INTERVAL_MS`: World update frequency
- `MAX_CLIENTS_PER_SERVER`: Maximum concurrent clients

## 🚀 Next Steps

To further enhance the GameServer:

1. **Database Integration**: Replace in-memory repositories with persistent storage
2. **Load Balancing**: Implement multiple GameServer instances
3. **Performance Optimization**: Add caching and optimization layers
4. **Monitoring**: Add metrics and logging
5. **Testing**: Comprehensive unit and integration tests
6. **Security**: Enhanced security measures and rate limiting

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket Connection Fails**
   - Check JWT token validity
   - Verify server is running on correct port
   - Check CORS configuration

2. **Authentication Errors**
   - Ensure JWT_SECRET is set
   - Verify token format and expiration
   - Check AccountModule integration

3. **Build Errors**
   - Run `npm install` to ensure dependencies
   - Check TypeScript configuration
   - Verify all imports are correct

## 📝 API Documentation

The GameServer provides REST API endpoints at `/api/gameserver/` for:
- Server status
- Connected clients information
- World state queries
- Administrative functions

WebSocket API is available at `/game` namespace for real-time communication.
