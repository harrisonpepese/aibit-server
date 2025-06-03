# contexto
este projeto é um servidor de jogo online de mundo aberto, tipo Tibia
o mapa é um tabuleiro e a movimentacao do mapa é por grade.
todo o stado do mundo é salvo no mapa assim a posicao dos jogadores das criaturas e NPCs

este servidor é reativo entao o jogador vai mandar a acao que ele quer realizar e o sevidor vai validar e atualizar o estado no mapa e retornar para o jogador o novo status do mundo

o servidor vai responder somente o estado que o jogador consegue ver que é um raido de x sqms
todos os eventos que acontecem nos sqs que o jogador ve deve ser enviado sem interacao do jogador

# Tecnologias usadas

## Frameworks
- Nest.js 
- Websocket

## Bancos de dados
- redis cache
- mongodb persistencia

## Tipos de arquitetura
- eventos para eventos do mundo e ações de jogadores
- http para eventos estaticos , criacao de contas, login, criacao de personagens e etc.

## Implementacao

- Monolito modular
- clean arhc, clean code SOLID e DRY
- typescript oriemtado a objetos

# Modulos

## Account
Entidade responsável por gerenciar as contas dos jogadores, implementada seguindo Clean Architecture e DDD.

### Estrutura do Módulo Account
```
account/
├── domain/
│   ├── entities/
│   │   └── account.entity.ts          # Entidade de domínio Account
│   ├── repositories/
│   │   ├── account.repository.ts      # Interface do repositório
│   │   └── account.repository.token.ts # Token de injeção de dependência
│   └── value-objects/
│       ├── email.vo.ts                # Value Object para email
│       └── password.vo.ts             # Value Object para senha
├── application/
│   └── use-cases/
│       ├── create-account.use-case.ts # Caso de uso: criar conta
│       ├── login.use-case.ts          # Caso de uso: fazer login
│       └── get-account.use-case.ts    # Caso de uso: buscar conta
├── infrastructure/
│   └── repositories/
│       └── in-memory-account.repository.ts # Implementação em memória
├── dto/
│   ├── create-account.dto.ts          # DTO para criação de conta
│   ├── login.dto.ts                   # DTO para login
│   └── account-response.dto.ts        # DTO de resposta
├── account.controller.ts              # Controller HTTP
├── account.service.ts                 # Service do NestJS
└── account.module.ts                  # Módulo do NestJS
```

### Responsabilidades Implementadas

#### Domain Layer
- **Account Entity**: Representa uma conta de jogador com validações de negócio
  - Gerenciamento de personagens associados
  - Controle de status da conta (ativa/inativa)
  - Atualização de último login
- **Email Value Object**: Validação e encapsulamento de emails
- **Password Value Object**: Hash e verificação segura de senhas
- **Repository Interface**: Contrato para persistência de dados

#### Application Layer
- **CreateAccountUseCase**: Criação de novas contas com validações
- **LoginUseCase**: Autenticação de jogadores
- **GetAccountUseCase**: Recuperação de dados da conta

#### Infrastructure Layer
- **InMemoryAccountRepository**: Implementação temporária para testes

#### Presentation Layer
- **AccountController**: Endpoints HTTP para:
  - `POST /account/register` - Criar conta
  - `POST /account/login` - Fazer login
  - `GET /account/:id` - Buscar conta
- **DTOs**: Validação de entrada e formatação de saída

### Funcionalidades
- ✅ Criação de contas com validação de email único
- ✅ Autenticação segura com hash de senhas
- ✅ Gerenciamento de personagens por conta
- ✅ Controle de status da conta
- ✅ Validação de dados de entrada
- ✅ Tratamento de erros apropriado

### Próximos Passos
- [ ] Implementar repositório com MongoDB
- [ ] Adicionar JWT para autenticação
- [ ] Implementar middleware de autorização
- [ ] Adicionar testes unitários e de integração

## Character
entidade que representa o personagem do jogador no jogo, incluindo atributos, inventário e habilidades.

## GameServer
entidade que gerencia a lógica do jogo, incluindo o estado do mundo, movimentação de jogadores e criaturas, e interações entre personagens e atualiza os clientes das atualizações do mundo.

## GameMap
entidade que representa o mapa do jogo, incluindo tiles, criaturas, NPCs e objetos interativos.

## Damage
entidade que gerencia o sistema de dano no jogo, incluindo ataques, defesas e efeitos de status.

## Combat
Entidade que lida com os eventos de combate entre todos os personagens do jogo, incluindo jogadores e criaturas, e suas interações.

## Movement
Entidade que gerencia a movimentação dos personagens no mapa, incluindo movimentação por tiles e interações com objetos.

## Creature
Entidade que representa as criaturas do jogo, incluindo monstros e NPCs, com suas próprias habilidades e comportamentos.

## Items
Entidade que gerencia os itens do jogo, incluindo armas, armaduras e consumíveis, e suas interações com os personagens.

## Events
Entidade que lida com eventos do jogo, como spawn de criaturas, mudanças no estado do mundo e interações entre personagens.

## Chat
Entidade que gerencia o sistema de chat do jogo por eventos, incluindo mensagens entre jogadores e canais de chat.