# Fluxo da Aplicação

## Visão Geral

O fluxo da aplicação no MK9 Analytics descreve como os dados se movem através das diferentes camadas do sistema, desde a interação do usuário até a persistencia no banco de dados e retorno à interface.

## Fluxo Principal de Dados

### 1. Entrada do Usuário (Camada de Apresentação)
- Usuário interage com a interface (páginas Next.js ou componentes)
- Ações como cliques, submissão de formulários ou upload de arquivos são capturadas
- Eventos são tratados por manipuladores em componentes ou hooks

### 2. Processamento na Camada de Aplicação
- Para interações que requerem dados ou modificação de estado:
  - Chamadas são feitas para rotas de API (`src/app/api/`) ou
  - Funções de serviço são invocadas diretamente (em componentes servidor)
- As rotas de API validam entrada e delegam a lógica de negócio para serviços
- Serviços aplicam regras de negócio e coordenam entre diferentes domínios

### 3. Acesso ao Domínio
- Serviços de aplicação acessam modelos de domínio e regras de negócio
- Validação de domínio ocorre através de esquemas Zod ou métodos de entidades
- Operações que modificam estado são preparadas para persistência

### 4. Interação com Infraestrutura
- Serviços chamam repositórios para operações de dados
- Repositórios implementam interfaces definidas na camada de domínio
- Operações de banco de dados são executadas usando Prisma Client
- Transações são usadas quando múltiplas operações precisam ser atômicas

### 5. Persistência no Banco de Dados
- Comandos SQL são gerados pelo Prisma e executados no PostgreSQL
- Dados são inseridos, atualizados ou recuperados conforme necessário
- Timestamps de auditoria (`createdAt`, `updatedAt`) são atualizados automaticamente

### 6. Retorno através das Camadas
- Resultados são retornados dos repositórios para os serviços
- Serviços processam resultados e aplicam transformações finais
- Respostas são formatadas e retornadas através das rotas de API
- Dados chegam aos componentes de interface via props ou hooks

### 7. Atualização da Interface
- Componentes recebem novos dados e re-renderizam conforme necessário
- Estado do cliente é atualizado (se aplicável) usando React Query ou useState
- Interface reflete o estado atual do sistema

## Fluxos Específicos

### Fluxo de Importação de Dados
1. Usuário faz upload de arquivo através da interface do módulo de importações
2. Validação inicial do arquivo (tipo, tamanho) ocorre no frontend
3. Arquivo é enviado para rota de API de importação
4. Serviço de importação cria registro de importação com status PENDING
5. Arquivo é processado (parsing com xlsx/papaparse)
6. Dados extraídos são validados contra regras de negócio
7. Dados válidos são persistidos nas entidades de domínio (visitas, promotores, etc.)
8. Status da importação é atualizado para SUCESSO ou FALHA
9. Entrada de log é criada no SyncLog para auditoria
10. Notificação é enviada ao usuário sobre o resultado

### Fluxo de Consulta do Dashboard
1. Usuário navega para uma página do dashboard
2. Componentes do servidor ou hooks de cliente iniciam buscas de dados
3. Requisições são feitas para rotas de API específicas do dashboard
4. Serviços do dashboard coordenam com repositórios de diversos módulos
5. Dados são agregados, filtrados e formatados para exibição
6. Resultados são retornados como respostas de API
7. Componentes recebem dados e renderizam visualizações (gráficos, tabelas, cards)
8. Estado de loading e tratamento de erros são manejados adequadamente

### Fluxo de Atualização de Status de Visita
1. Usuário marca uma visita como concluída na interface
2. Ação dispara uma chamada para rota de API de visita
3. Serviço de visita valida a transição de estado (PLANEJADA → REALIZADA)
4. Verifica se data de conclusão é válida (≥ data agendada)
5. Atualiza registro de visita no banco de dados
6. Retorna visita atualizada para o frontend
7. Interface atualiza a exibição da visita (possivelmente movendo para lista concluída)

## Tratamento de Erros

### Na Camada de Apresentação
- Erros de rede são capturados e exibidos como mensagens amigáveis
- Erros de validação de formulário são mostrados próximos aos campos relacionados
- Estados de loading são mostrados durante operações assíncronas

### Na Camada de Aplicação
- Exceções são capturadas e convertidas em respostas de erro apropriadas
- Erros de validação retornam status 400 com detalhes dos campos inválidos
- Erros de autorização retornam status 401 ou 403
- Erros inesperados retornam status 500 com mensagem genérica (detalhes logados)

### Na Camada de Domínio
- Violações de regras de negócio resultam em exceções específicas de domínio
- Estas exceções são capturadas pela camada de aplicação e traduzidas em respostas HTTP adequadas

### Na Camada de Infraestrutura
- Erros de banco de dados são capturados e registrados
- Erros de conexão podem tentar reconexão (dependendo da configuração do Pooler)
- Erros de constraint violação são traduzidos em mensagens de negócio significativas

## Considerações de Performance

### Cache
- Respostas de API podem ser cacheadas em nível de servidor (ISR) quando apropriado
- Dados de referência raramente alterados podem ser cacheados em aplicação
- Client-side caching é gerenciado pelo React Query

### Paginação
- Listas grandes (visitas, atividades) são paginadas no nível da API
- Clientes solicitam páginas específicas conforme necessário para rolagem infinita ou paginação tradicional

### Otimização de Consultas
- Seleção de campos específicos evita busca excessiva de dados
- Uso adequado de `include` vs `select` no Prisma para evitar problemas N+1
- Índices são utilizados efetivamente através das consultas do Prisma

## Segurança no Fluxo de Dados

### Validação de Entrada
- Toda entrada do usuário é validada nas fronteiras da API
- Esquemas Zod garantem que dados conformem-se aos modelos esperados
- Validação de domínio garante que regras de negócio sejam respeitadas

### Proteção Contra Ataques Comuns
- Injeção SQL: Prevenida pelo uso de parâmetros do Prisma
- XSS: Prevenida pelo escaping automático do React e sanitização quando necessário
- CSRF: Protegido pelas medidas internas do Next.js para rotas de API
- Exposição de Dados Sensíveis: Nunca retornamos senhas ou tokens em respostas

## Monitoramento e Observabilidade

### Logging
- Erros são registrados com contexto suficiente para depuração
- Operações importantes são auditadas no SyncLog
- Logs de acesso podem ser implementados para trilha de auditoria

### Métricas
- Tempo de resposta de API pode ser monitorado
- Taxa de erros e taxa de sucesso podem ser rastreados
- Métricas de negócio (visitas processadas, importações realizadas) podem ser coletadas

## Evolução do Fluxo

### Futuras Melhorias
- Atualizações em tempo real via WebSockets ou Server-Sent Events
- Processamento assíncrono de tarefas pesadas (importações grandes) usando filas
- Cache distribuído para escalabilidade horizontal
- Integração com sistemas externos através de webhooks aprimorados