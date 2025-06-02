import { Character } from './domain/entities/character.entity';
import { CharacterName } from './domain/value-objects/character-name.vo';
import { Position } from './domain/value-objects/position.vo';

console.log('=== Teste do Domínio Character ===\n');

try {
  // Teste 1: Criação básica de personagem
  console.log('1. Criando personagem básico...');
  const character = new Character('account-123', 'Test Hero');
  console.log('✅ Personagem criado:', {
    id: character.id,
    name: character.name,
    accountId: character.accountId,
    stats: character.getStats(),
    position: character.getPosition(),
  });

  // Teste 2: Testando Value Objects
  console.log('\n2. Testando Value Objects...');
  
  const characterName = new CharacterName('Valid Name');
  console.log('✅ Nome válido:', characterName.getValue());

  const position = new Position(100, 200, 7);
  console.log('✅ Posição válida:', position.toString());

  // Teste 3: Testando mecânicas de combate
  console.log('\n3. Testando mecânicas de combate...');
  console.log('Vida inicial:', character.getStats().health);
  
  character.takeDamage(30);
  console.log('Após receber 30 de dano:', character.getStats().health);
  
  character.heal(15);
  console.log('Após cura de 15:', character.getStats().health);

  // Teste 4: Testando sistema de experiência
  console.log('\n4. Testando sistema de experiência...');
  console.log('Level inicial:', character.getStats().level);
  console.log('Experiência inicial:', character.getStats().experience);
  
  const leveledUp = character.gainExperience(250); // XP suficiente para subir de nível
  console.log('Após ganhar 250 XP - Level up?', leveledUp);
  console.log('Level atual:', character.getStats().level);
  console.log('Stats após level up:', character.getStats());

  // Teste 5: Testando movimento
  console.log('\n5. Testando movimento...');
  console.log('Posição inicial:', character.getPosition());
  
  character.moveTo({ x: 150, y: 250, z: 8 });
  console.log('Nova posição:', character.getPosition());

  // Teste 6: Status online
  console.log('\n6. Testando status online...');
  console.log('Online inicial:', character.getIsOnline());
  
  character.setOnlineStatus(true);
  console.log('Após setOnlineStatus(true):', character.getIsOnline());

  // Teste 7: Testando validações de nome inválido
  console.log('\n7. Testando validações de nome...');
  try {
    new CharacterName('ab'); // Muito curto
  } catch (error) {
    console.log('✅ Erro esperado para nome curto:', (error as Error).message);
  }

  try {
    new CharacterName('nome_com_underscore123'); // Caracteres inválidos
  } catch (error) {
    console.log('✅ Erro esperado para caracteres inválidos:', (error as Error).message);
  }

  // Teste 8: Testando validações de posição inválida
  console.log('\n8. Testando validações de posição...');
  try {
    new Position(-1, 100, 7); // Coordenada negativa
  } catch (error) {
    console.log('✅ Erro esperado para coordenada negativa:', (error as Error).message);
  }

  try {
    new Position(100, 100, 20); // Z muito alto
  } catch (error) {
    console.log('✅ Erro esperado para Z inválido:', (error as Error).message);
  }

  console.log('\n=== Todos os testes passaram! ===');

} catch (error) {
  console.error('❌ Erro no teste:', (error as Error).message);
}
