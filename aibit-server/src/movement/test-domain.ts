import { Movement, MovementType, Direction, MovementStatus } from './domain/entities/movement.entity';
import { Position } from './domain/value-objects/position.vo';
import { MovementSpeed } from './domain/value-objects/movement-speed.vo';

// Testes para Position Value Object
console.log('🧪 Testando Position Value Object...');

try {
  // Teste 1: Criação de posição válida
  const position1 = new Position(100, 200, 7);
  console.log('✅ Position criada com sucesso:', position1.toString());

  // Teste 2: Validação de coordenadas negativas
  try {
    new Position(-1, 0, 0);
    console.log('❌ Deveria ter falhado para coordenadas negativas');
  } catch (error: any) {
    console.log('✅ Validação de coordenadas negativas funcionando:', error.message);
  }

  // Teste 3: Validação de coordenadas muito altas
  try {
    new Position(10000, 0, 0);
    console.log('❌ Deveria ter falhado para coordenadas muito altas');
  } catch (error: any) {
    console.log('✅ Validação de coordenadas altas funcionando:', error.message);
  }

  // Teste 4: Cálculo de distância
  const position2 = new Position(103, 204, 7);
  const distance = position1.distanceTo(position2);
  console.log('✅ Distância calculada:', distance.toFixed(2));

  // Teste 5: Distância Manhattan
  const manhattanDistance = position1.manhattanDistanceTo(position2);
  console.log('✅ Distância Manhattan:', manhattanDistance);

  // Teste 6: Posições vizinhas
  const neighbors = position1.getNeighbors();
  console.log('✅ Posições vizinhas:', neighbors.length, 'posições');

  // Teste 7: Verificar se é adjacente
  const adjacentPos = position1.moveEast();
  const isAdjacent = position1.isAdjacentTo(adjacentPos);
  console.log('✅ É adjacente:', isAdjacent);

  // Teste 8: Movimento em direções
  const northPos = position1.moveNorth();
  const southPos = position1.moveSouth();
  const eastPos = position1.moveEast();
  const westPos = position1.moveWest();
  console.log('✅ Movimentos direcionais criados com sucesso');

  // Teste 9: Verificar se está no mesmo andar
  const sameFloor = position1.isSameFloor(position2);
  console.log('✅ Mesmo andar:', sameFloor);

} catch (error: any) {
  console.error('❌ Erro nos testes de Position:', error.message);
}

// Testes para MovementSpeed Value Object
console.log('\n🧪 Testando MovementSpeed Value Object...');

try {
  // Teste 1: Velocidades predefinidas
  const walkSpeed = MovementSpeed.walk();
  const runSpeed = MovementSpeed.run();
  const teleportSpeed = MovementSpeed.teleport();

  console.log('✅ Velocidade de caminhada:', walkSpeed.getValue());
  console.log('✅ Velocidade de corrida:', runSpeed.getValue());
  console.log('✅ Velocidade de teleporte:', teleportSpeed.getValue());

  // Teste 2: Velocidade customizada
  const customSpeed = new MovementSpeed(2.5);
  console.log('✅ Velocidade customizada:', customSpeed.getValue());

  // Teste 3: Conversões
  console.log('✅ Conversão para tiles/segundo:', customSpeed.toTilesPerSecond());
  console.log('✅ Conversão para milissegundos/tile:', customSpeed.toMillisecondsPerTile());

  // Teste 4: Validação de velocidade inválida
  try {
    new MovementSpeed(-1);
    console.log('❌ Deveria ter falhado para velocidade negativa');
  } catch (error: any) {
    console.log('✅ Validação de velocidade negativa funcionando:', error.message);
  }

  // Teste 5: Validação de velocidade muito alta
  try {
    new MovementSpeed(1000);
    console.log('❌ Deveria ter falhado para velocidade muito alta');
  } catch (error: any) {
    console.log('✅ Validação de velocidade alta funcionando:', error.message);
  }

} catch (error: any) {
  console.error('❌ Erro nos testes de MovementSpeed:', error.message);
}

// Testes para Movement Entity
console.log('\n🧪 Testando Movement Entity...');

try {
  const fromPos = { x: 100, y: 100, z: 7 };
  const toPos = { x: 101, y: 100, z: 7 };
  const source = {
    entityId: 'player-123',
    entityName: 'TestPlayer',
    entityType: 'character' as const
  };

  // Teste 1: Criação de movimento básico
  const movement = new Movement(
    'entity-123',
    fromPos,
    toPos,
    MovementType.WALK,
    source,
    1.0
  );

  console.log('✅ Movement criado:', movement.getId());
  console.log('✅ Direção calculada:', movement.getDirection());
  console.log('✅ Distância calculada:', movement.getDistance());
  console.log('✅ Duração calculada:', movement.getDuration(), 'ms');

  // Teste 2: Movimento diagonal
  const diagonalMovement = new Movement(
    'entity-123',
    fromPos,
    { x: 101, y: 101, z: 7 },
    MovementType.RUN,
    source,
    2.0
  );

  console.log('✅ Movimento diagonal - Direção:', diagonalMovement.getDirection());
  console.log('✅ Movimento diagonal - Distância:', diagonalMovement.getDistance().toFixed(2));

  // Teste 3: Movimento de teleporte
  const teleportMovement = new Movement(
    'entity-123',
    fromPos,
    { x: 150, y: 150, z: 7 },
    MovementType.TELEPORT,
    source,
    10.0
  );

  console.log('✅ Teleporte - Distância:', teleportMovement.getDistance().toFixed(2));
  console.log('✅ Teleporte - Duração:', teleportMovement.getDuration(), 'ms');

  // Teste 4: Validação de entidade inválida
  try {
    new Movement('', fromPos, toPos, MovementType.WALK, source);
    console.log('❌ Deveria ter falhado para entidade vazia');
  } catch (error: any) {
    console.log('✅ Validação de entidade vazia funcionando:', error.message);
  }

  // Teste 5: Validação de posições iguais
  try {
    new Movement('entity-123', fromPos, fromPos, MovementType.WALK, source);
    console.log('❌ Deveria ter falhado para posições iguais');
  } catch (error: any) {
    console.log('✅ Validação de posições iguais funcionando:', error.message);
  }

  // Teste 6: Validação de velocidade inválida
  try {
    new Movement('entity-123', fromPos, toPos, MovementType.WALK, source, 0);
    console.log('❌ Deveria ter falhado para velocidade zero');
  } catch (error: any) {
    console.log('✅ Validação de velocidade zero funcionando:', error.message);
  }

  // Teste 7: Getters
  console.log('✅ Entity ID:', movement.getEntityId());
  console.log('✅ Type:', movement.getType());
  console.log('✅ Source:', movement.getSource());
  console.log('✅ Timestamp:', movement.getTimestamp());
  console.log('✅ Speed:', movement.getSpeed());
  console.log('✅ Stamina Cost:', movement.getStaminaCost());

  // Teste 8: Teste de cálculo de custo de stamina
  const longMovement = new Movement(
    'entity-123',
    fromPos,
    { x: 110, y: 110, z: 7 },
    MovementType.RUN,
    source,
    3.0
  );
  console.log('✅ Stamina cost para movimento longo:', longMovement.getStaminaCost());

} catch (error: any) {
  console.error('❌ Erro nos testes de Movement:', error.message);
}

// Testes de cenários complexos
console.log('\n🧪 Testando cenários complexos...');

try {
  // Teste 1: Sequência de movimentos
  const entityId = 'player-456';
  const source = {
    entityId: 'system',
    entityName: 'Game System',
    entityType: 'system' as const
  };

  const movements = [];
  let currentPos = { x: 100, y: 100, z: 7 };

  // Simular uma caminhada de 5 tiles para o leste
  for (let i = 0; i < 5; i++) {
    const nextPos = { x: currentPos.x + 1, y: currentPos.y, z: currentPos.z };
    const movement = new Movement(
      entityId,
      currentPos,
      nextPos,
      MovementType.WALK,
      source,
      1.0
    );
    movements.push(movement);
    currentPos = nextPos;
  }

  console.log('✅ Sequência de 5 movimentos criada');
  console.log('✅ Posição final:', currentPos);
  console.log('✅ Tempo total estimado:', movements.reduce((total, m) => total + m.getDuration(), 0), 'ms');

  // Teste 2: Movimentos em diferentes velocidades
  const speeds = [0.5, 1.0, 1.5, 2.0, 3.0];
  speeds.forEach(speed => {
    const movement = new Movement(
      entityId,
      { x: 0, y: 0, z: 7 },
      { x: 1, y: 0, z: 7 },
      MovementType.WALK,
      source,
      speed
    );
    console.log(`✅ Velocidade ${speed}: ${movement.getDuration()}ms`);
  });

} catch (error: any) {
  console.error('❌ Erro nos testes complexos:', error.message);
}

console.log('\n🎉 Testes do domínio Movement concluídos!');
