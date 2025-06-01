import 'reflect-metadata';
import { Account } from './domain/entities/account.entity';
import { Email } from './domain/value-objects/email.vo';
import { Password } from './domain/value-objects/password.vo';

async function testDomain() {
  console.log('🧪 Testando entidades de domínio...\n');

  try {
    // Teste 1: Email Value Object
    console.log('1️⃣ Testando Email Value Object...');
    const email = new Email('jogador@aibit.com');
    console.log('✅ Email criado:', email.getValue());

    // Teste 2: Password Value Object
    console.log('\n2️⃣ Testando Password Value Object...');
    const password = new Password('senha123');
    console.log('✅ Senha hasheada criada');
    
    const isValid = await password.verify('senha123');
    console.log('✅ Verificação de senha:', isValid ? 'VÁLIDA' : 'INVÁLIDA');

    // Teste 3: Account Entity
    console.log('\n3️⃣ Testando Account Entity...');
    const account = Account.create(
      'acc-001',
      email.getValue(),
      password.getHash()
    );
    
    console.log('✅ Conta criada:', {
      id: account.id,
      email: account.email,
      isActive: account.isActive,
      characters: account.characters
    });

    // Teste 4: Adicionar personagem
    console.log('\n4️⃣ Testando adição de personagem...');
    account.addCharacter('char-001');
    account.addCharacter('char-002');
    console.log('✅ Personagens adicionados:', account.characters);

    // Teste 5: Serialização
    console.log('\n5️⃣ Testando serialização...');
    const accountData = account.toPrimitives();
    console.log('✅ Dados serializados:', {
      id: accountData.id,
      email: accountData.email,
      charactersCount: accountData.characters.length
    });

    console.log('\n🎉 Todos os testes de domínio passaram!');

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('❌ Erro no teste:', message);
  }
}

testDomain();
