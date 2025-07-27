/**
 * GameServer Launch Script
 * Simple script to start the GameServer with proper configuration
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('GameServerBootstrap');
  
  try {
    logger.log('🚀 Starting Aibit Game Server...');
    
    // Create the NestJS application
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS for web clients
    app.enableCors({
      origin: true, // In production, specify your frontend domains
      credentials: true,
    });
    
    // Set global prefix for API routes
    app.setGlobalPrefix('api');
    
    // Get port from environment or default to 3000
    const port = process.env.PORT || 3000;
    
    // Start the server
    await app.listen(port);
    
    logger.log(`🎮 Game Server is running on: http://localhost:${port}`);
    logger.log(`📡 WebSocket GameServer available at: ws://localhost:${port}/game`);
    logger.log(`📚 API Documentation available at: http://localhost:${port}/api`);
    
    // Log environment info
    logger.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.log(`🔑 JWT Secret configured: ${!!process.env.JWT_SECRET}`);
    
  } catch (error) {
    logger.error('❌ Failed to start Game Server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
bootstrap();
