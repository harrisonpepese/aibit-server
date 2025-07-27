# Módulo de Creature - Documentação

Este documento descreve a implementação do módulo de Creature para o servidor de jogo AiBit, seguindo os princípios de Clean Architecture e Domain-Driven Design.

## Estrutura do Módulo

```
creature/
├── domain/
│   ├── entities/
│   │   └── creature.entity.ts        # Entidade principal de Criatura
│   ├── repositories/
│   │   ├── creature.repository.ts    # Interface do repositório
│   │   └── creature.repository.token.ts # Token de injeção
│   └── value-objects/
│       ├── position.vo.ts            # Value Object para posição no mapa
│       ├── creature-type.vo.ts       # Value Object para tipo de criatura
│       ├── creature-stats.vo.ts      # Value Object para estatísticas
│       └── creature-state.vo.ts      # Value Object para estado atual
├── application/
│   └── use-cases/
│       ├── create-creature.use-case.ts # Caso de uso: criar criatura
│       ├── get-creatures.use-case.ts   # Caso de uso: buscar criaturas
│       └── update-creature.use-case.ts # Caso de uso: atualizar criatura
├── infrastructure/
│   └── repositories/
│       └── in-memory-creature.repository.ts # Implementação em memória
├── dto/
│   ├── create-creature.dto.ts        # DTO para criação de criatura
│   ├── update-creature.dto.ts        # DTO para atualização de criatura
│   └── creature-response.dto.ts      # DTO de resposta
├── creature.controller.ts            # Controller HTTP
├── creature.service.ts               # Service do NestJS
├── creature.module.ts                # Módulo do NestJS
└── test-domain.ts                    # Testes do domínio
```

## Componentes Principais

### Domain Layer

#### Entidades
- **Creature**: Representa uma criatura no jogo (monstro, NPC, boss) com validações de negócio
  - Gerenciamento de posição no mapa
  - Controle de estado (vivo/morto, efeitos de status)
  - Estatísticas e atributos
  - Comportamentos (receber dano, curar, usar mana, etc.)

#### Value Objects
- **Position**: Gerencia coordenadas x, y, z no mapa com validações
- **CreatureType**: Define o tipo da criatura (monstro, NPC, boss) e comportamentos associados
- **CreatureStats**: Encapsula estatísticas como vida, mana, ataque, defesa
- **CreatureState**: Gerencia o estado atual da criatura (vida atual, efeitos de status)

#### Repository Interface
- **CreatureRepository**: Contrato para persistência de dados de criaturas

### Application Layer
- **CreateCreatureUseCase**: Criação de novas criaturas
- **GetCreaturesUseCase**: Recuperação de criaturas por diversos critérios
- **UpdateCreatureUseCase**: Atualização de criaturas (posição, stats, estado)

### Infrastructure Layer
- **InMemoryCreatureRepository**: Implementação temporária para testes

### Presentation Layer
- **CreatureController**: Endpoints HTTP para gerenciar criaturas
- **DTOs**: Validação de entrada e formatação de saída

## Funcionalidades Implementadas

### Gerenciamento de Criaturas
- ✅ Criação de criaturas com validações
- ✅ Recuperação de criaturas por ID, nome, tipo, posição
- ✅ Atualização de posição, stats e estado

### Controle de Estado
- ✅ Sistema de vida e mana
- ✅ Gerenciamento de dano e cura
- ✅ Sistema de efeitos de status (poison, burn, etc.)
- ✅ Morte e revivimento de criaturas

### Posicionamento no Mapa
- ✅ Validação de coordenadas
- ✅ Cálculo de distância entre posições
- ✅ Busca de criaturas por raio

## Endpoints da API

### Criação
- `POST /creatures`: Criar uma nova criatura
- `POST /creatures/batch`: Criar múltiplas criaturas

### Consulta
- `GET /creatures`: Listar todas as criaturas
- `GET /creatures/:id`: Buscar criatura por ID
- `GET /creatures/search/name`: Buscar criaturas por nome
- `GET /creatures/search/type`: Buscar criaturas por tipo
- `GET /creatures/search/position`: Buscar criaturas por posição
- `GET /creatures/search/radius`: Buscar criaturas em um raio
- `GET /creatures/search/spawn/:spawnId`: Buscar criaturas por spawn

### Atualização
- `PATCH /creatures/:id/position`: Atualizar posição
- `PATCH /creatures/:id/stats`: Atualizar estatísticas
- `PATCH /creatures/:id/name`: Atualizar nome
- `PATCH /creatures/:id/damage`: Aplicar dano
- `PATCH /creatures/:id/heal`: Curar
- `PATCH /creatures/:id/use-mana`: Usar mana
- `PATCH /creatures/:id/restore-mana`: Restaurar mana
- `PATCH /creatures/:id/status-effect/add`: Adicionar efeito de status
- `PATCH /creatures/:id/status-effect/remove`: Remover efeito de status
- `PATCH /creatures/:id/kill`: Matar criatura
- `PATCH /creatures/:id/revive`: Reviver criatura

## Próximos Passos
- [ ] Implementar repositório com MongoDB
- [ ] Adicionar testes automatizados unitários e de integração
- [ ] Implementar comportamentos de IA para criaturas
- [ ] Integrar com o sistema de combate
- [ ] Implementar spawns de criaturas no mapa
