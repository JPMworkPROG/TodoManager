# Diagramas de Fluxo de Requisições

## Fluxo Completo: Criar Demanda

```mermaid
sequenceDiagram
    actor User as Usuário
    participant UI as React Component
    participant Hook as useDemands Hook
    participant RQ as React Query
    participant API as API Client
    participant Routes as Express Routes
    participant MW as Middlewares
    participant Ctrl as Controller
    participant UC as Use Case
    participant Repo as Repository
    participant Prisma as Prisma Client
    participant DB as SQLite

    User->>UI: Preenche formulário
    User->>UI: Clica em "Criar"
    
    UI->>Hook: createDemand.mutate(data)
    Hook->>RQ: Executa mutation
    RQ->>API: POST /api/demands
    
    API->>Routes: HTTP POST /demands
    Routes->>MW: requestLogger
    MW->>MW: Log da requisição
    MW->>MW: Validação (express-validator)
    
    alt Validação falha
        MW-->>API: 400 Bad Request
        API-->>RQ: Error
        RQ-->>Hook: onError
        Hook-->>UI: Exibe erro
        UI-->>User: Mensagem de erro
    end
    
    MW->>Ctrl: createDemand(req, res)
    Ctrl->>UC: execute(createDemandDto)
    UC->>UC: Validação de negócio
    UC->>Repo: createDemand(demand)
    Repo->>Prisma: demand.create({ ... })
    Prisma->>DB: INSERT INTO Demand
    DB->>DB: INSERT INTO DemandItem (múltiplos)
    DB-->>Prisma: Demand criada
    Prisma-->>Repo: Demand entity
    Repo-->>UC: Demand entity
    UC-->>Ctrl: Demand DTO
    Ctrl-->>Routes: 201 Created + JSON
    Routes-->>API: Response
    
    API-->>RQ: Success
    RQ->>RQ: Invalida cache ['demands']
    RQ->>RQ: Refetch queries
    RQ-->>Hook: onSuccess
    Hook-->>UI: Atualiza UI
    UI-->>User: Demanda criada!
```

## Fluxo: Listar Demandas (com Paginação)

```mermaid
sequenceDiagram
    actor User as Usuário
    participant UI as Demand List Page
    participant Hook as useFetchDemands
    participant RQ as React Query
    participant API as API Client
    participant Routes as Express Routes
    participant Ctrl as Controller
    participant UC as ListDemandsUseCase
    participant Repo as Repository
    participant Prisma as Prisma Client
    participant DB as SQLite

    User->>UI: Acessa página
    UI->>Hook: useFetchDemands(page, pageSize)
    Hook->>RQ: useQuery(['demands', 1, 20])
    
    alt Cache válido (staleTime: 5s)
        RQ-->>Hook: Retorna dados do cache
        Hook-->>UI: Renderiza lista
    else Cache inválido ou não existe
        RQ->>API: fetchDemands(1, 20)
        API->>Routes: GET /demands?page=1&pageSize=20
        Routes->>Ctrl: listDemands(req, res)
        Ctrl->>UC: execute({ page, pageSize, filters })
        UC->>Repo: findMany({ pagination })
        Repo->>Prisma: demand.findMany({ skip, take, include: items })
        Prisma->>DB: SELECT * FROM Demand ... LIMIT 20 OFFSET 0
        Prisma->>DB: SELECT * FROM DemandItem WHERE demandId IN (...)
        DB-->>Prisma: Resultados
        Prisma-->>Repo: Demands + Items
        Repo->>Repo: Calcula prodTotalTons
        Repo-->>UC: Demands entities
        UC->>Repo: count()
        Repo->>Prisma: demand.count()
        Prisma->>DB: SELECT COUNT(*) FROM Demand
        DB-->>Prisma: Total
        Prisma-->>Repo: Count
        Repo-->>UC: totalItems
        UC-->>Ctrl: { data, meta: { page, totalPages, totalItems } }
        Ctrl-->>Routes: 200 OK + JSON
        Routes-->>API: Response
        API-->>RQ: PaginatedDemandsResponse
        RQ->>RQ: Armazena no cache
        RQ-->>Hook: Dados
        Hook-->>UI: Renderiza lista
    end
    
    UI-->>User: Exibe demandas

    User->>UI: Clica em "Próxima página"
    UI->>Hook: useFetchDemands(2, 20)
    Note over RQ: Novo ciclo com page=2
```

## Fluxo: Atualizar Item da Demanda

```mermaid
sequenceDiagram
    actor User as Usuário
    participant UI as Item Edit Component
    participant Hook as useUpdateDemandItem
    participant RQ as React Query
    participant API as API Client
    participant Routes as Express Routes
    participant MW as Middlewares
    participant Ctrl as Controller
    participant UC as UpdateDemandItemUseCase
    participant Repo as Repository
    participant Prisma as Prisma Client
    participant DB as SQLite

    User->>UI: Edita "Produzido (ton)"
    User->>UI: Salva alteração
    
    UI->>Hook: updateItem.mutate({ demandId, itemId, payload })
    Hook->>RQ: Executa mutation
    RQ->>API: PATCH /demands/:id/items/:sku
    
    API->>Routes: HTTP PATCH /demands/uuid-123/items/42
    Routes->>MW: Validação
    MW->>Ctrl: updateDemandItem(req, res)
    Ctrl->>UC: execute(demandId, sku, updateDto)
    
    UC->>Repo: findDemandById(demandId)
    Repo->>Prisma: demand.findUnique({ where: { id } })
    Prisma->>DB: SELECT * FROM Demand WHERE id = ?
    
    alt Demanda não encontrada
        DB-->>Prisma: null
        Prisma-->>Repo: null
        Repo-->>UC: null
        UC-->>Ctrl: throw DemandNotFoundError
        Ctrl-->>MW: Error
        MW->>MW: errorHandler
        MW-->>API: 404 Not Found
        API-->>RQ: Error
        RQ-->>Hook: onError
        Hook-->>UI: Exibe erro
    end
    
    DB-->>Prisma: Demand
    Prisma-->>Repo: Demand
    
    UC->>Repo: updateDemandItem(demandId, sku, data)
    Repo->>Prisma: demandItem.update({ where: { sku }, data })
    Prisma->>DB: UPDATE DemandItem SET ... WHERE sku = ?
    
    DB-->>Prisma: DemandItem atualizado
    Prisma-->>Repo: DemandItem
    Repo-->>UC: DemandItem entity
    UC-->>Ctrl: DemandItem DTO
    Ctrl-->>Routes: 200 OK + JSON
    Routes-->>API: Response
    
    API-->>RQ: Success
    RQ->>RQ: invalidateQueries(['demands'])
    RQ->>RQ: invalidateQueries(['demand', uuid-123])
    RQ-->>Hook: onSuccess
    Hook-->>UI: Atualiza UI
    UI-->>User: Item atualizado!
```

## Fluxo: Deletar Demanda (com Confirmação)

```mermaid
sequenceDiagram
    actor User as Usuário
    participant UI as Demand List
    participant Dialog as Confirmation Dialog
    participant Hook as useDeleteDemand
    participant RQ as React Query
    participant API as API Client
    participant Routes as Express Routes
    participant Ctrl as Controller
    participant UC as DeleteDemandUseCase
    participant Repo as Repository
    participant Prisma as Prisma Client
    participant DB as SQLite

    User->>UI: Clica em "Deletar"
    UI->>Dialog: Abre modal de confirmação
    Dialog-->>User: "Tem certeza?"
    
    User->>Dialog: Confirma
    Dialog->>Hook: deleteDemand.mutate(demandId)
    Hook->>RQ: Executa mutation
    RQ->>API: DELETE /api/demands/:id
    
    API->>Routes: HTTP DELETE /demands/uuid-123
    Routes->>Ctrl: deleteDemand(req, res)
    Ctrl->>UC: execute(demandId)
    
    UC->>Repo: findDemandById(demandId)
    Repo->>Prisma: demand.findUnique({ where: { id } })
    Prisma->>DB: SELECT * FROM Demand WHERE id = ?
    
    alt Demanda não encontrada
        DB-->>Prisma: null
        UC-->>Ctrl: throw DemandNotFoundError
        Ctrl-->>API: 404 Not Found
        API-->>RQ: Error
        RQ-->>Hook: onError
        Hook-->>UI: Exibe erro
        UI-->>User: "Demanda não encontrada"
    end
    
    DB-->>Prisma: Demand encontrada
    
    UC->>Repo: deleteDemand(demandId)
    Repo->>Prisma: demand.delete({ where: { id } })
    
    Note over Prisma,DB: Cascata ON DELETE
    Prisma->>DB: DELETE FROM Demand WHERE id = ?
    DB->>DB: DELETE FROM DemandItem WHERE demandId = ? (cascata)
    DB-->>Prisma: Sucesso
    Prisma-->>Repo: void
    Repo-->>UC: void
    UC-->>Ctrl: void
    Ctrl-->>Routes: 204 No Content
    Routes-->>API: Response
    
    API-->>RQ: Success
    RQ->>RQ: invalidateQueries(['demands'])
    RQ->>RQ: Remove do cache
    RQ-->>Hook: onSuccess
    Hook-->>UI: Atualiza lista
    UI-->>User: "Demanda removida!"
```

## Fluxo: Tratamento de Erros

```mermaid
flowchart TD
    Request[Requisição HTTP] --> Logger[Request Logger MW]
    Logger --> Validator[Validation MW]
    
    Validator --> ValidationCheck{Validação OK?}
    ValidationCheck -->|Não| ValidationError[400 Bad Request]
    ValidationCheck -->|Sim| Controller[Controller]
    
    Controller --> UseCase[Use Case]
    UseCase --> BusinessLogic{Regra de negócio OK?}
    
    BusinessLogic -->|Não| BusinessError[Domain Error]
    BusinessLogic -->|Sim| Repository[Repository]
    
    Repository --> Database[(Database)]
    Database --> DBCheck{Operação OK?}
    
    DBCheck -->|Erro| DBError[Database Error]
    DBCheck -->|Sucesso| Success[200/201 Response]
    
    ValidationError --> ErrorHandler[Error Handler MW]
    BusinessError --> ErrorHandler
    DBError --> ErrorHandler
    
    ErrorHandler --> LogError[Log do Erro Pino]
    LogError --> FormatError{Tipo de Erro}
    
    FormatError -->|ValidationError| Return400[400 Bad Request]
    FormatError -->|NotFoundError| Return404[404 Not Found]
    FormatError -->|BusinessError| Return422[422 Unprocessable]
    FormatError -->|DatabaseError| Return500[500 Internal Error]
    FormatError -->|UnknownError| Return500
    
    Return400 --> Response[JSON Error Response]
    Return404 --> Response
    Return422 --> Response
    Return500 --> Response
    Success --> Response
    
    Response --> Client[Cliente Frontend]
```

## Fluxo de Cache do React Query

```mermaid
flowchart TD
    Component[Componente React] --> Hook[useFetchDemands]
    Hook --> Query{Query no cache?}
    
    Query -->|Não existe| FetchNew[Fetch da API]
    Query -->|Existe| CheckStale{Cache stale?}
    
    CheckStale -->|Não < 5s| ReturnCache[Retorna do cache]
    CheckStale -->|Sim > 5s| Background[Background refetch]
    
    FetchNew --> API[API Request]
    Background --> API
    
    API --> Success{Sucesso?}
    Success -->|Sim| UpdateCache[Atualiza cache]
    Success -->|Não| ErrorState[Estado de erro]
    
    UpdateCache --> Render[Re-renderiza componente]
    ReturnCache --> Render
    ErrorState --> Render
    
    Mutation[Mutation create/update/delete] --> MutationAPI[API Request]
    MutationAPI --> MutationSuccess{Sucesso?}
    
    MutationSuccess -->|Sim| Invalidate[invalidateQueries demands]
    MutationSuccess -->|Não| MutationError[Mutation error]
    
    Invalidate --> Refetch[Refetch automático]
    Refetch --> UpdateCache
```

