import { Damage, DamageType, StatusEffect, DamageSource, DamageResistance, StatusEffectData } from './domain/entities/damage.entity';
import { DamageValue } from './domain/value-objects/damage-value.vo';
import { Resistance } from './domain/value-objects/resistance.vo';

// Teste da entidade Damage
console.log('=== TESTANDO ENTIDADE DAMAGE ===\n');

try {
  // Teste 1: Criação de dano básico
  console.log('Teste 1: Criação de dano básico');
  const basicSource: DamageSource = {
    sourceId: 'player1',
    sourceName: 'Jogador 1',
    sourceType: 'character'
  };
  
  const basicDamage = new Damage(100, DamageType.PHYSICAL, basicSource);
  console.log('✅ Dano básico criado com sucesso');
  console.log(`ID: ${basicDamage.getId()}`);
  console.log(`Fonte: ${basicDamage.getSource().sourceName}`);
  console.log(`Quantidade: ${basicDamage.getAmount()}`);
  console.log(`Tipo: ${basicDamage.getType()}`);
  console.log(`Data: ${basicDamage.getTimestamp().toISOString()}\n`);

  // Teste 2: Dano com resistência
  console.log('Teste 2: Dano com resistência');
  const fireSource: DamageSource = {
    sourceId: 'spell1',
    sourceName: 'Fireball',
    sourceType: 'spell'
  };
  
  const fireDamage = new Damage(200, DamageType.FIRE, fireSource);
  const fireResistances: DamageResistance[] = [
    { type: DamageType.FIRE, percentage: 25 }
  ];
  
  const fireResult = fireDamage.calculateFinalDamage(fireResistances);
  console.log('✅ Dano com resistência criado com sucesso');
  console.log(`Dano original: ${fireResult.originalDamage}`);
  console.log(`Dano final: ${fireResult.finalDamage}`);
  console.log(`Resistência aplicada: ${fireResult.resistanceApplied}%`);
  console.log(`Redução: ${fireResult.originalDamage - fireResult.finalDamage}\n`);

  // Teste 3: Dano com armadura (apenas físico)
  console.log('Teste 3: Dano com armadura');
  const armoredDamage = new Damage(150, DamageType.PHYSICAL, basicSource);
  const armorResult = armoredDamage.calculateFinalDamage([], 30);
  
  console.log('✅ Dano com armadura criado com sucesso');
  console.log(`Dano original: ${armorResult.originalDamage}`);
  console.log(`Dano final: ${armorResult.finalDamage}`);
  console.log(`Redução por armadura: ${armorResult.originalDamage - armorResult.finalDamage}\n`);

  // Teste 4: Dano crítico
  console.log('Teste 4: Dano crítico');
  const criticalDamage = new Damage(100, DamageType.ENERGY, basicSource, true);
  const criticalResult = criticalDamage.calculateFinalDamage([]);
  
  console.log('✅ Dano crítico criado com sucesso');
  console.log(`Dano original: ${criticalResult.originalDamage}`);
  console.log(`Dano final: ${criticalResult.finalDamage}`);
  console.log(`Foi crítico: ${criticalResult.wasCritical}`);
  console.log(`Multiplicador aplicado: 2x\n`);

  // Teste 5: Dano com efeito de status
  console.log('Teste 5: Dano com efeito de status');
  const frozenEffect: StatusEffectData = {
    effect: StatusEffect.FROZEN,
    duration: 3,
    intensity: 1,
    source: 'Ice Spell'
  };
  
  const statusDamage = new Damage(80, DamageType.ICE, fireSource, false, [frozenEffect]);
  console.log('✅ Dano com efeito de status criado com sucesso');
  console.log(`Tipo de dano: ${statusDamage.getType()}`);
  console.log(`Efeitos: ${statusDamage.getStatusEffects().map(e => e.effect).join(', ')}`);
  console.log(`Tem efeito FROZEN: ${statusDamage.hasStatusEffect(StatusEffect.FROZEN)}\n`);

  // Teste 6: Cenário complexo (resistência + armadura + crítico)
  console.log('Teste 6: Cenário complexo (resistência + crítico + resistência)');
  const burningEffect: StatusEffectData = {
    effect: StatusEffect.BURNING,
    duration: 5,
    intensity: 2,
    source: 'Critical Fire Spell'
  };
  
  const complexDamage = new Damage(300, DamageType.FIRE, fireSource, true, [burningEffect]);
  const complexResistances: DamageResistance[] = [
    { type: DamageType.FIRE, percentage: 50 }
  ];
  
  const complexResult = complexDamage.calculateFinalDamage(complexResistances, 0, 2.0);
  console.log('✅ Dano complexo criado com sucesso');
  console.log(`Dano original: ${complexResult.originalDamage}`);
  console.log(`Dano final: ${complexResult.finalDamage}`);
  console.log(`Foi crítico: ${complexResult.wasCritical}`);
  console.log(`Resistência aplicada: ${complexResult.resistanceApplied}%`);
  console.log(`Efeitos: ${complexResult.statusEffectsApplied.map(e => e.effect).join(', ')}`);
  console.log('Cálculo: 300 * 2 [crítico] * 0.5 [resistência] = 300\n');

} catch (error: any) {
  console.error('❌ Erro nos testes da entidade Damage:', error.message);
}

// Teste dos Value Objects
console.log('=== TESTANDO VALUE OBJECTS ===\n');

try {
  // Teste DamageValue
  console.log('Teste 1: DamageValue válido');
  const validDamageValue = new DamageValue(150, DamageType.PHYSICAL);
  console.log('✅ DamageValue criado com sucesso');
  console.log(`Quantidade: ${validDamageValue.getAmount()}`);
  console.log(`Tipo: ${validDamageValue.getType()}`);
  console.log(`É físico: ${validDamageValue.isPhysical()}`);
  console.log(`É mágico: ${validDamageValue.isMagical()}`);
  console.log(`É cura: ${validDamageValue.isHealing()}\n`);

  console.log('Teste 2: DamageValue inválido (valor negativo)');
  try {
    new DamageValue(-10, DamageType.FIRE);
    console.log('❌ Deveria ter falhado');
  } catch (error: any) {
    console.log('✅ Erro capturado corretamente:', error.message);
  }
  console.log();

  console.log('Teste 3: DamageValue inválido (valor muito alto)');
  try {
    new DamageValue(100000, DamageType.FIRE);
    console.log('❌ Deveria ter falhado');
  } catch (error: any) {
    console.log('✅ Erro capturado corretamente:', error.message);
  }
  console.log();

  // Teste Resistance
  console.log('Teste 4: Resistance válida');
  const validResistance = new Resistance(DamageType.ICE, 30);
  console.log('✅ Resistance criada com sucesso');
  console.log(`Tipo: ${validResistance.getType()}`);
  console.log(`Percentual: ${validResistance.getPercentage()}%`);
  console.log(`É imune: ${validResistance.isImmune()}`);
  console.log(`Redução para 100 de dano: ${validResistance.calculateReduction(100)}\n`);

  console.log('Teste 5: Resistance inválida (valor acima de 100%)');
  try {
    new Resistance(DamageType.ENERGY, 150);
    console.log('❌ Deveria ter falhado');
  } catch (error: any) {
    console.log('✅ Erro capturado corretamente:', error.message);
  }
  console.log();

  console.log('Teste 6: Resistance inválida (valor negativo)');
  try {
    new Resistance(DamageType.PHYSICAL, -25);
    console.log('❌ Deveria ter falhado');
  } catch (error: any) {
    console.log('✅ Erro capturado corretamente:', error.message);
  }
  console.log();

  console.log('Teste 7: Resistance inválida (resistência a cura)');
  try {
    new Resistance(DamageType.HEALING, 50);
    console.log('❌ Deveria ter falhado');
  } catch (error: any) {
    console.log('✅ Erro capturado corretamente:', error.message);
  }
  console.log();

} catch (error: any) {
  console.error('❌ Erro nos testes de value objects:', error.message);
}

// Teste dos Enums
console.log('=== TESTANDO ENUMS ===\n');

console.log('Teste 1: DamageType enum');
console.log('Tipos de dano disponíveis:');
Object.values(DamageType).forEach(type => {
  console.log(`- ${type}`);
});
console.log();

console.log('Teste 2: StatusEffect enum');
console.log('Efeitos de status disponíveis:');
Object.values(StatusEffect).forEach(effect => {
  console.log(`- ${effect}`);
});
console.log();

console.log('=== TODOS OS TESTES CONCLUÍDOS ===');
