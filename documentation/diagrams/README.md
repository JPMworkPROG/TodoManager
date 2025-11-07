# Diagramas do TodoManager

Este diretório contém diagramas Mermaid que explicam a arquitetura, fluxos de dados e estrutura do sistema TodoManager.

## 📋 Índice de Diagramas

### 1. [Arquitetura do Sistema](./architecture.md)
Diagramas que mostram a estrutura geral do projeto:
- **Visão Geral da Arquitetura**: Visão completa do sistema (Frontend + Backend + DB)
- **Arquitetura em Camadas - Backend**: Clean Architecture aplicada no backend
- **Stack Tecnológica Completa**: Todas as tecnologias utilizadas
- **Fluxo de Deploy com Docker**: Como o projeto é containerizado e executado

### 2. [Fluxo de Requisições](./request-flow.md)
Diagramas de sequência mostrando o fluxo completo das requisições:
- **Criar Demanda**: Fluxo desde o formulário até o banco de dados
- **Listar Demandas (Paginação)**: Como funciona a listagem com cache
- **Atualizar Item**: Edição de itens com invalidação de cache
- **Deletar Demanda**: Remoção com confirmação e cascata
- **Tratamento de Erros**: Como os erros são tratados em cada camada
- **Cache do React Query**: Estratégia de cache e invalidação

### 3. [Entidades e Relacionamentos](./entities.md)
Diagramas de dados e modelos:
- **ERD (Entity Relationship Diagram)**: Modelo de dados do banco
- **Relacionamentos**: Cardinalidade entre entidades
- **Schema do Prisma**: Classes e relacionamentos ORM
- **Estados da Demanda**: Máquina de estados do status
- **Fluxo de Criação**: Como os dados fluem na criação
- **Agregação de Dados**: Cálculo do total produzido
- **Tipos TypeScript**: Estrutura de tipos no frontend
- **Camadas de DTOs**: Transformação de dados no backend
- **Índices do Banco**: Otimizações de performance

### 4. [Componentes Frontend](./frontend-components.md)
Diagramas da arquitetura React/Next.js:
- **Arquitetura de Componentes**: Hierarquia de componentes
- **Hooks Customizados**: Estrutura dos hooks do React Query
- **Fluxo de Estado**: Como o estado é gerenciado
- **Composição de Componentes**: Exemplo do DemandCard
- **React Hook Form**: Fluxo de validação de formulários
- **Estado Global**: Gerenciamento com React Query e Context
- **Loading & Error States**: Renderização condicional
- **Padrão de Dialog**: Composição de modais
- **Otimizações**: Estratégias de performance

## 🎨 Como Visualizar os Diagramas

### Opção 1: GitHub/GitLab
Os arquivos `.md` com diagramas Mermaid são renderizados automaticamente no GitHub e GitLab.

### Opção 2: VS Code
Instale uma das extensões:
- [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid)
- [Mermaid Editor](https://marketplace.visualstudio.com/items?itemName=tomoyukim.vscode-mermaid-editor)

### Opção 3: Mermaid Live Editor
Copie o código Mermaid e cole em: https://mermaid.live/

### Opção 4: CLI
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i arquivo.md -o output.svg
```

## 📝 Convenções dos Diagramas

### Cores Padrão
- **Verde (#90ee90)**: Sucesso, entidades principais, lógica de negócio
- **Azul (#61dafb)**: Frontend, React, UI
- **Laranja (#ffa07a)**: Camadas intermediárias, transformações
- **Vermelho (#ff6b6b)**: Erros, falhas
- **Amarelo (#ffcc00)**: Avisos, validações

### Tipos de Diagramas
- **Sequence Diagram**: Fluxo temporal de requisições
- **Flowchart**: Processos e decisões
- **Class Diagram**: Estrutura de dados
- **ER Diagram**: Relacionamentos de banco de dados
- **State Diagram**: Máquinas de estado
- **Graph**: Arquiteturas e hierarquias

## 🔗 Relacionamento com o Código

Os diagramas refletem a estrutura real do código:

- **Backend**: `apps/backend/src/`
  - Rotas: `demands/routes/`
  - Controllers: `demands/controllers/`
  - Use Cases: `demands/usecases/`
  - Repositories: `demands/repositories/`

- **Frontend**: `apps/frontend/`
  - Páginas: `app/demand/`
  - Hooks: `app/hooks/`
  - API: `app/api/`
  - Componentes: `components/`

- **Banco de Dados**: `apps/backend/prisma/schema.prisma`

## 📚 Referências

- [Mermaid Documentation](https://mermaid.js.org/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [React Query](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma](https://www.prisma.io/docs)

---

**Última atualização**: Novembro 2025

