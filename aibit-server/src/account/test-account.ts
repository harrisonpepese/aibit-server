import { Test } from '@nestjs/testing';
import { AccountModule } from '../account.module';
import { AccountService } from '../account.service';

async function testAccountModule() {
  try {
    // Criar o módulo de teste
    const moduleRef = await Test.createTestingModule({
      imports: [AccountModule],
    }).compile();

    const accountService = moduleRef.get<AccountService>(AccountService);

    // Teste 1: Criar uma conta
    console.log('🧪 Testando criação de conta...');
    const newAccount = await accountService.createAccount({
      email: 'teste@example.com',
      password: '123456',
    });
    
    console.log('✅ Conta criada com sucesso:', {
      id: newAccount.id,
      email: newAccount.email,
      isActive: newAccount.isActive,
    });

    // Teste 2: Fazer login
    console.log('\n🧪 Testando login...');
    const loginResult = await accountService.login({
      email: 'teste@example.com',
      password: '123456',
    });
    
    console.log('✅ Login realizado com sucesso:', {
      id: loginResult.id,
      email: loginResult.email,
      lastLogin: loginResult.lastLogin,
    });

    // Teste 3: Buscar conta por ID
    console.log('\n🧪 Testando busca por ID...');
    const foundAccount = await accountService.getAccount(newAccount.id);
    
    console.log('✅ Conta encontrada:', {
      id: foundAccount.id,
      email: foundAccount.email,
      characters: foundAccount.characters,
    });

    console.log('\n🎉 Todos os testes passaram!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executar teste
testAccountModule();
