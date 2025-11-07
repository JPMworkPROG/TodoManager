# TodoManager — Desenvolvedor Full Stack Pleno

Este projeto implementa o sistema de **Planejamento de Demandas** da empresa fictícia **Latinhas LLC**, conforme o desafio técnico proposto.  
O objetivo é demonstrar habilidades de **desenvolvimento full stack**, englobando **API (backend)**, **interface web (front-end)**, **integração**, **dockerização** e **boas práticas de engenharia de software**.

---

## 🚀 Objetivo

Desenvolver uma aplicação completa (API + Front-End) que permita o **gerenciamento de demandas de produção**, contendo cadastro, listagem, edição e exclusão de registros.

---

## 🧱 Tecnologias Utilizadas

### **Front-End**
- **ReactJS 18**
- **NextJS 14**
- **React Hook Form** - Gerenciamento de formulários
- **TanStack Query** - Gerenciamento de estado assíncrono e cache
- Framework CSS: **TailwindCSS 4** 
- Framework de componentes: **Shadcn/UI**
- **Lucide React** - Ícones
- **TypeScript** - Tipagem estática

### **Backend**
- Runtime: **Node.js 20**
- Linguagem: **Javascript + TypeScript**
- Framework: **Express 4**
- Banco de dados: **SQLite**
- ORM: **Prisma 5.19**
- Validação: **Express Validator 7**
- Logger: **Pino**
- Documentação: **Swagger UI Express** (OpenAPI 3.0)

### **Infraestrutura**
- **Docker** com Multi-stage builds
  - Backend: Node 20 Alpine (Porta 3000)
  - Frontend: Node 20 Alpine (Porta 3001)
  - Container único via Docker Compose

---

**Padrões de Desenvolvimento do Backend**
- **Clean Architecture**: Separação clara entre camadas
- **Dependency Inversion**: UseCases dependem de uma abstração (interface) do repositorio que realiza operações de banco
- **Repository Pattern**: Abstração da camada de persistência
- **DTO Pattern**: Transferência de dados entre camadas

---

## 🚀 Como Executar

### **Pré-requisitos**
- Node.js 20+
- NPM
- Docker e Docker Compose (para containerização)

### **Opção 1: Desenvolvimento Local**

**Backend:**
```bash
cd apps/backend
npm install
npm run db:prepare      # Gera Prisma Client e aplica migrations
npm run start:dev       # Inicia em modo desenvolvimento (nodemon)
```

**Frontend:**
```bash
cd apps/frontend
npm install
npm run start:dev       # Inicia Next.js em modo desenvolvimento
```

### **Opção 2: Docker Compose**

```bash
# Na raiz do projeto
docker-compose up --build
```

Acessos:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/docs

---

## 🧪 Testes e Qualidade

- Testes manuais realizados antes da entrega  
- Código **organizado, tipado e documentado**  
- Segue princípios de **Clean Architecture** e **boas práticas REST**
- **Prettier** configurado para formatação consistente
- **TypeScript** em modo strict para segurança de tipos

---

## 📈 Recursos Implementados

### **Backend**
- [X] CRUD completo de Demandas e Itens
- [X] Validação de entrada com Express Validator
- [X] Tratamento centralizado de erros
- [X] Logging estruturado com Pino
- [X] Documentação OpenAPI/Swagger
- [X] Paginação de resultados
- [X] Relacionamento em cascata (delete)
- [X] Health check endpoint

### **Frontend**
- [X] Listagem paginada de demandas
- [X] Criação de demandas com itens
- [X] Edição de demandas e itens
- [X] Exclusão com confirmação
- [X] Atualização em tempo real via React Query
- [X] UI/UX moderna e responsiva
- [X] Dark mode (via next-themes)
- [X] Loading states e error handling
- [X] Validação de formulários

---

## 📚 Referências Técnicas

- [ReactJS](https://react.dev/)
- [Next.js 14](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query)
- [Prisma](https://www.prisma.io/docs)
- [Express](https://expressjs.com/)
- [Docker](https://docs.docker.com/)
- [SQLite](https://www.sqlite.org/docs.html)
- [Shadcn/UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

## 📝 Diagramas

Para visualizar os diagramas de fluxo de dados e requisições, consulte:
- [Diagrama de Arquitetura](./documentation/diagrams/architecture.md)
- [Diagrama de Entidades](./documentation/diagrams/entities.md)

---

**Desenvolvido para o desafio técnico Full Stack Pleno**