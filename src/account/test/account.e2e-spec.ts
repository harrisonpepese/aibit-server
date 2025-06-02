import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AccountModule } from '../account.module';
import { ACCOUNT_REPOSITORY_TOKEN } from '../domain/repositories/account.repository.token';
import { InMemoryAccountRepository } from '../infrastructure/repositories/in-memory-account.repository';

describe('Account (e2e)', () => {
  let app: INestApplication;
  let accountRepository: InMemoryAccountRepository;
  
  // Dados de teste
  const testEmail = 'test@example.com';
  const testPassword = 'password123';
  let accountId: string;
  
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AccountModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    
    accountRepository = moduleFixture.get<InMemoryAccountRepository>(ACCOUNT_REPOSITORY_TOKEN);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new account', async () => {
    const response = await request(app.getHttpServer())
      .post('/account/register')
      .send({
        email: testEmail,
        password: testPassword
      })
      .expect(201);
    
    // Verificar resposta
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(testEmail);
    expect(response.body.isActive).toBe(true);
    expect(response.body.characters).toEqual([]);
    expect(response.body).toHaveProperty('createdAt');
    
    // Salvar ID para testes subsequentes
    accountId = response.body.id;
  });

  it('should not register an account with the same email', async () => {
    await request(app.getHttpServer())
      .post('/account/register')
      .send({
        email: testEmail,
        password: testPassword
      })
      .expect(400);
  });

  it('should not register an account with invalid email', async () => {
    await request(app.getHttpServer())
      .post('/account/register')
      .send({
        email: 'invalid-email',
        password: testPassword
      })
      .expect(400);
  });

  it('should not register an account with short password', async () => {
    await request(app.getHttpServer())
      .post('/account/register')
      .send({
        email: 'another@example.com',
        password: '12345'
      })
      .expect(400);
  });

  it('should login with correct credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/account/login')
      .send({
        email: testEmail,
        password: testPassword
      })
      .expect(201);
    
    // Verificar resposta
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(testEmail);
    expect(response.body.isActive).toBe(true);
    expect(response.body).toHaveProperty('lastLogin');
  });

  it('should not login with incorrect password', async () => {
    await request(app.getHttpServer())
      .post('/account/login')
      .send({
        email: testEmail,
        password: 'wrong-password'
      })
      .expect(401);
  });

  it('should not login with non-existent email', async () => {
    await request(app.getHttpServer())
      .post('/account/login')
      .send({
        email: 'nonexistent@example.com',
        password: testPassword
      })
      .expect(401);
  });

  it('should get account by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/account/${accountId}`)
      .expect(200);
    
    // Verificar resposta
    expect(response.body.id).toBe(accountId);
    expect(response.body.email).toBe(testEmail);
    expect(response.body.isActive).toBe(true);
  });

  it('should not get non-existent account', async () => {
    await request(app.getHttpServer())
      .get('/account/nonexistent-id')
      .expect(404);
  });

  // Simulando desativação da conta (chamando diretamente o repositório)
  it('should not login with inactive account', async () => {
    // Buscar a conta no repositório
    const account = await accountRepository.findById(accountId);
    expect(account).not.toBeNull();
    
    // Desativar a conta
    account.deactivate();
    await accountRepository.save(account);
    
    // Tentar fazer login
    await request(app.getHttpServer())
      .post('/account/login')
      .send({
        email: testEmail,
        password: testPassword
      })
      .expect(401);
    
    // Reativar a conta para os próximos testes
    account.activate();
    await accountRepository.save(account);
  });
});
