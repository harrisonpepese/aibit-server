# Aibit Server

Aibit Server é um servidor de jogo online de mundo aberto, inspirado em jogos como Tibia. Este projeto utiliza o framework Nest.js para gerenciar a lógica do jogo, a movimentação de jogadores e criaturas, e as interações entre personagens.

## Estrutura do Projeto

O projeto é organizado em módulos, cada um responsável por uma parte específica da lógica do jogo:

- **Account**: Gerencia as contas dos jogadores, incluindo autenticação e criação de contas.
- **Character**: Representa os personagens dos jogadores, incluindo atributos, inventário e habilidades.
- **GameServer**: Gerencia a lógica do jogo, incluindo o estado do mundo e interações entre personagens.
- **GameMap**: Representa o mapa do jogo, incluindo tiles, criaturas, NPCs e objetos interativos.
- **Damage**: Gerencia o sistema de dano, incluindo ataques, defesas e efeitos de status.
- **Combat**: Lida com o combate entre personagens, incluindo ataques e habilidades especiais.
- **Movement**: Gerencia a movimentação dos personagens no mapa.
- **Creature**: Representa as criaturas do jogo, incluindo monstros e NPCs.
- **Itens**: Gerencia os itens do jogo, incluindo armas, armaduras e consumíveis.
- **Events**: Lida com eventos do jogo, como spawn de criaturas e mudanças no estado do mundo.
- **Chat**: Gerencia o sistema de chat, permitindo comunicação entre jogadores e NPCs.

## Tecnologias Utilizadas

- **Frameworks**: Nest.js, Websocket
- **Bancos de Dados**: Redis (cache), MongoDB (persistência)
- **Arquitetura**: Monolito modular, seguindo princípios de Clean Architecture, Clean Code, SOLID e DRY.
- **Linguagem**: TypeScript orientado a objetos.

## Como Executar o Projeto

1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Inicie o servidor com `npm run start`.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.