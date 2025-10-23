# Frontend - Controle de Gastos

Este é o frontend da aplicação de controle de gastos desenvolvido com Angular 18 e Angular Material.

## Funcionalidades

- **Autenticação**: Sistema de login e cadastro de usuários
- **Dashboard**: Visão geral das finanças com resumo de receitas, despesas e saldo
- **Transações**: Cadastro e gerenciamento de receitas e despesas
- **Relatórios**: Gráficos interativos usando ECharts para análise financeira
- **Categorias**: Sistema de categorização automática para transações

## Tecnologias Utilizadas

- Angular 18 (Standalone Components)
- Angular Material
- ECharts (ngx-echarts)
- TypeScript
- RxJS

## Como Executar

1. Certifique-se de que a API está rodando na porta 3000
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o projeto:

   ```bash
   npm start
   ```

4. Acesse `http://localhost:4200`

## Estrutura do Projeto

```
src/app/
├── components/
│   ├── auth/
│   │   ├── login.component.ts
│   │   └── register.component.ts
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   └── dashboard-home.component.ts
│   ├── transactions/
│   │   └── transactions.component.ts
│   └── reports/
│       └── reports.component.ts
├── models/
│   ├── user.model.ts
│   ├── transaction.model.ts
│   └── category.model.ts
├── services/
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── transaction.service.ts
│   ├── category.service.ts
│   └── data-initialization.service.ts
├── guards/
│   └── auth.guard.ts
└── app.routes.ts
```

## Funcionalidades Detalhadas

### Autenticação

- Login com email e senha
- Cadastro de novos usuários
- Proteção de rotas com AuthGuard
- Persistência de sessão no localStorage

### Dashboard

- Resumo financeiro em tempo real
- Cards com receitas, despesas e saldo
- Ações rápidas para navegação

### Transações

- Cadastro de receitas e despesas
- Seleção de categoria
- Listagem com filtros
- Edição e exclusão de transações

### Relatórios

- Gráfico de pizza: Gastos por categoria
- Gráfico de barras: Receitas vs Despesas
- Gráfico de linha: Evolução mensal
- Cards de resumo financeiro

## API Endpoints Utilizados

- `GET/POST /users` - Gerenciamento de usuários
- `GET/POST /categories` - Gerenciamento de categorias
- `GET/POST/PATCH/DELETE /transactions` - Gerenciamento de transações
- `GET /transactions/summary/:userId` - Resumo financeiro

## Configuração

A aplicação está configurada para se comunicar com a API em `http://localhost:3000`. Para alterar a URL da API, modifique a propriedade `apiUrl` nos serviços.

## Dados Padrão

Ao fazer login pela primeira vez, o sistema automaticamente cria categorias padrão:

- Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Roupas
- Salário, Freelance, Investimentos
