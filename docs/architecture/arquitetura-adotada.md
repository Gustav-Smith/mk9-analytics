# Arquitetura Adotada

## Visão Geral

A arquitetura do MK9 Analytics combina princípios de Domain-Driven Design (DDD) com organização modular para garantir escalabilidade, manutenibilidade e clara separação de preocupações.

## Camadas da Arquitetura

### 1. Camada de Apresentação
- **Localização**: `src/app/` (páginas Next.js), `src/components/` (componentes UI reutilizáveis)
- **Responsabilidade**: Renderização da interface, tratamento de interações do usuário, gerenciamento de estado local de componentes
- **Tecnologias**: Componentes do Servidor React, Componentes do Cliente React, Hooks do React, Tailwind CSS, Shadcn/UI

### 2. Camada de Aplicação
- **Localização**: `src/app/api/` (rotas de API Next.js), `src/modules/*/services/` (serviços de aplicação)
- **Responsabilidade**: Orquestração de casos de uso, coordenação entre domínios, gerenciamento de transações, aplicação de regras de negócio entre entidades
- **Padrões**: Serviços de Aplicação, CQRS implícito através de endpoints RESTful

### 3. Camada de Domínio
- **Localização**: `prisma/schema.prisma` (modelos de domínio), `src/modules/*/types/` (tipos de domínio ricos), `src/modules/*/schemas/` (validação de domínio com Zod)
- **Responsabilidade**: Definição de entidades de negócio, objetos de valor, agregados, invariantes e lógica de negócio pura
- **Tecnologias**: ORM Prisma (como mapeador objeto-relacional), Interfaces/Tipos TypeScript, Zod para validação de domínio

### 4. Camada de Infraestrutura
- **Localização**: `src/lib/` (utilitários compartilhados), `src/modules/*/repositories/` (implementações de acesso a dados), `prisma/` (migrações, seed)
- **Responsabilidade**: Implementação de detalhes técnicos como acesso ao banco de dados, integrações com serviços externos, processamento de arquivos
- **Tecnologias**: Cliente Prisma, drivers de banco de dados, bibliotecas de parsing (xlsx, papaparse), clientes HTTP (axios)

## Comunicação Entre Camadas

- **Apresentação → Aplicação**: Via chamadas de API REST (usando fetch/axios) ou Server Actions (implementações futuras)
- **Aplicação → Domínio**: Através de chamadas diretas para serviços de aplicação que utilizam modelos de domínio e repositórios
- **Domínio → Infraestrutura**: Via interfaces de repositório (TypeScript) implementadas usando Cliente Prisma
- **Infraestrutura → Apresentação**: Através de respostas de API consumidas por componentes React para atualizar a UI

## Padrões Arquiteturais

### Domain-Driven Design (DDD)
- Núcleo modelado em torno dos conceitos centrais de Trade Marketing (Operação, Visita, Promotor, Loja, Indústria)
- Limites claros de módulo correspondem a contextos delimitados (importações, painel, operações)

### Modularidade Baseada em Recursos
- Código organizado por capacidades de negócio piuttosto que camadas técnicas
- Cada módulo contém tudo relacionado a um recurso (importações, painel, análises, etc.) com suas próprias camadas de aplicação, domínio e infraestrutura

### Padrão Repositório
- Cada entidade de domínio tem um repositório abstrato definido em sua camada de domínio
- Implementações concretas na camada de infraestrutura
- Desacopla a lógica de negócio dos detalhes de persistência

### Camada de Serviço
- Orquestradores de aplicação contendo lógica de casos de uso que não pertencem a entidades ou repositórios
- Exemplo: ImportService coordenando upload → parsing → validação → persistência → logging

### Arquitetura Orientada a Eventos Implícita
- Por meio do n8n e webhooks, o sistema reage a eventos externos (novo arquivo no Google Drive) sem acoplamento forte