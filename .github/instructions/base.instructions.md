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
entidade responsavel por gerenciar as contas dos jogadores, incluindo autenticação, criação de contas e gerenciamento de personagens.

## Character
entidade que representa o personagem do jogador no jogo, incluindo atributos, inventário e habilidades.

## GameServer
entidade que gerencia a lógica do jogo, incluindo o estado do mundo, movimentação de jogadores e criaturas, e interações entre personagens.

## GameMap
entidade que representa o mapa do jogo, incluindo tiles, criaturas, NPCs e objetos interativos.

## Damage
entidade que gerencia o sistema de dano no jogo, incluindo ataques, defesas e efeitos de status.

## Combat
entidade que lida com o combate entre personagens, incluindo ataques, defesas e habilidades especiais.

## movement
entidade que gerencia a movimentação dos personagens no mapa, incluindo movimentação por tiles e interações com objetos.

## Creature
entidade que representa as criaturas do jogo, incluindo monstros e NPCs, com suas próprias habilidades e comportamentos.
