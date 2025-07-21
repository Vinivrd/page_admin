# Especificação Técnica - Sistema de Administração de Campanha Política

## 📋 Visão Geral do Projeto

Sistema de administração para gestão de dados de eleitores em campanha política, permitindo consulta, filtragem, inserção e exportação de dados em formato de planilha.

## 🎯 Objetivos

- Centralizar dados de eleitores/apoiadores
- Permitir consulta e filtragem eficiente de dados
- Facilitar inserção de novos cadastros
- Exportar dados para análise externa
- Interface intuitiva para administradores

## 🏗️ Arquitetura Técnica

### Frontend

- **Framework**: React 18+ com TypeScript
- **UI Library**: Sugestão - Material-UI ou Ant Design para componentes de tabela robustos
- **Gerenciamento de Estado**: Context API ou Zustand
- **Estilização**: Styled-components ou CSS Modules

### Backend

- **BaaS**: Supabase
- **Banco de Dados**: PostgreSQL (via Supabase)
- **Autenticação**: Supabase Auth
- **API**: REST via Supabase Client

## 🗄️ Estrutura da Tabela `eleitores`

```sql
CREATE TABLE eleitores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regiao VARCHAR(100) NOT NULL,
  bairro VARCHAR(100),
  cep VARCHAR(10),
  cidade VARCHAR(100) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  escola VARCHAR(255),
  endereco TEXT,
  telefone VARCHAR(20),
  data_nascimento DATE,
  cpf VARCHAR(14) UNIQUE,
  instagram VARCHAR(255),
  facebook VARCHAR(255),
  tiktok VARCHAR(255),
  genero genero_enum NOT NULL DEFAULT 'OUTROS',
  religiao VARCHAR(100),
  profissao VARCHAR(255),
  observacoes TEXT,
  interacao BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enum para gênero
CREATE TYPE genero_enum AS ENUM ('MASCULINO', 'FEMININO', 'OUTROS');

-- Índices para performance
CREATE INDEX idx_eleitores_regiao ON eleitores(regiao);
CREATE INDEX idx_eleitores_religiao ON eleitores(religiao);
CREATE INDEX idx_eleitores_cidade ON eleitores(cidade);
CREATE INDEX idx_eleitores_bairro ON eleitores(bairro);
CREATE INDEX idx_eleitores_interacao ON eleitores(interacao);
```

## 🔐 Autenticação e Segurança

### Row Level Security (RLS)

```sql
-- Apenas usuários autenticados como admin podem acessar
CREATE POLICY "Admin only access" ON eleitores
FOR ALL USING (
  auth.jwt() ->> 'role' = 'admin'
);
```

### Configuração de Usuário Admin

- Usuário admin criado via Supabase Dashboard
- Role 'admin' definida nos custom claims do JWT

## 📱 Funcionalidades do Frontend

### 1. Página de Login

- **Rota**: `/login`
- **Componente**: `LoginPage`
- **Funcionalidades**:
  - Autenticação via email/senha
  - Redirecionamento para dashboard após login
  - Validação de credenciais

### 2. Dashboard Principal

- **Rota**: `/dashboard`
- **Componente**: `DashboardPage`
- **Funcionalidades**:
  - Tabela paginada com todos os registros
  - Sistema de filtros avançados
  - Ações de CRUD
  - Export para CSV

#### 2.1 Sistema de Filtros

```typescript
interface FiltrosState {
  regiao: string[]
  religiao: string[]
  cidade: string
  bairro: string
  genero: GeneroEnum | ''
  interacao: boolean | null
  idadeMin: number | null
  idadeMax: number | null
}
```

**Tipos de Filtro**:

- **Múltipla seleção**: Região, Religião
- **Texto**: Cidade, Bairro, Nome
- **Seleção única**: Gênero
- **Boolean**: Interação (Ativo/Inativo/Todos)
- **Range**: Faixa etária

#### 2.2 Tabela de Dados

**Colunas Exibidas**:

- Nome
- Região
- Cidade/Bairro
- Telefone
- Email
- Idade (calculada)
- Gênero
- Religião
- Interação (Badge Verde/Vermelho)
- Ações (Editar/Excluir)

**Funcionalidades**:

- Ordenação por qualquer coluna
- Paginação (25/50/100 registros por página)
- Busca global
- Seleção múltipla para ações em lote

### 3. Modal de Cadastro/Edição

- **Componente**: `EleitorModal`
- **Funcionalidades**:
  - Formulário completo com validação
  - Validação de CPF
  - Máscaras para telefone e CEP
  - Preview dos dados antes de salvar

### 4. Funcionalidade de Export

- **Formato**: CSV
- **Opções**:
  - Exportar todos os registros
  - Exportar apenas registros filtrados
  - Seleção de colunas para export
  - Nome do arquivo personalizado

## 🛠️ Estrutura de Componentes React

```
src/
├── components/
│   ├── common/
│   │   ├── Table/
│   │   ├── Filter/
│   │   ├── Modal/
│   │   └── Export/
│   ├── eleitores/
│   │   ├── EleitorTable.tsx
│   │   ├── EleitorModal.tsx
│   │   ├── EleitorFilters.tsx
│   │   └── EleitorActions.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
├── hooks/
│   ├── useEleitores.ts
│   ├── useFilters.ts
│   └── useExport.ts
├── services/
│   ├── supabase.ts
│   ├── eleitores.service.ts
│   └── auth.service.ts
├── types/
│   ├── eleitor.types.ts
│   └── common.types.ts
└── utils/
    ├── validators.ts
    ├── formatters.ts
    └── exportHelpers.ts
```

## 📊 Tipos TypeScript

```typescript
// types/eleitor.types.ts
export enum GeneroEnum {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OUTROS = 'OUTROS',
}

export interface Eleitor {
  id: string
  regiao: string
  bairro?: string
  cep?: string
  cidade: string
  nome: string
  email?: string
  escola?: string
  endereco?: string
  telefone?: string
  data_nascimento?: string
  cpf?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  genero: GeneroEnum
  religiao?: string
  profissao?: string
  observacoes?: string
  interacao: boolean
  created_at: string
  updated_at: string
}

export interface CreateEleitorDTO extends Omit<Eleitor, 'id' | 'created_at' | 'updated_at'> {}

export interface UpdateEleitorDTO extends Partial<CreateEleitorDTO> {
  id: string
}
```

## 🔧 Validações

### Validação de CPF

```typescript
export const validarCPF = (cpf: string): boolean => {
  // Implementação da validação de CPF
  // Remove caracteres não numéricos
  // Verifica dígitos verificadores
}
```

### Validações do Formulário

- **Nome**: Obrigatório, mínimo 2 caracteres
- **Região**: Obrigatório
- **Cidade**: Obrigatório
- **CPF**: Formato válido (quando preenchido)
- **Email**: Formato válido (quando preenchido)
- **Data de Nascimento**: Data válida, não pode ser futura

## 📈 Performance e Otimizações

### Frontend

- Paginação server-side
- Debounce em filtros de texto (300ms)
- Memoização de componentes pesados
- Lazy loading de componentes

### Backend (Supabase)

- Índices em colunas de filtro
- Paginação com `range()`
- Filtros combinados em uma query
- Cache de consultas frequentes

## 🚀 Roadmap de Desenvolvimento

### Fase 1 - MVP (2-3 semanas)

1. **Setup do projeto**

   - Configuração React + TypeScript
   - Configuração Supabase
   - Setup de autenticação

2. **CRUD Básico**

   - Listagem de eleitores
   - Cadastro de eleitor
   - Edição de eleitor
   - Exclusão de eleitor

3. **Autenticação**
   - Página de login
   - Proteção de rotas
   - Logout

### Fase 2 - Filtros e Export (1-2 semanas)

1. **Sistema de Filtros**

   - Filtros por região
   - Filtros por religião
   - Filtros combinados
   - Busca por texto

2. **Export CSV**
   - Export básico
   - Export com filtros aplicados

### Fase 3 - Melhorias (1 semana)

1. **Validações**

   - Validação de CPF
   - Máscaras de input
   - Validações de formulário

2. **UX/UI**
   - Loading states
   - Mensagens de erro/sucesso
   - Responsividade mobile

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "@tanstack/react-query": "^4.0.0",
    "react-router-dom": "^6.8.0",
    "react-hook-form": "^7.43.0",
    "@hookform/resolvers": "^3.0.0",
    "zod": "^3.20.0",
    "date-fns": "^2.29.0",
    "react-csv": "^2.2.2"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "vite": "^4.0.0"
  }
}
```

## 🔍 Considerações de UX

### Responsividade

- Desktop-first (uso principal)
- Mobile: visualização básica, sem edição
- Tablet: funcionalidade completa

### Estados de Loading

- Skeleton loading para tabela
- Spinners para ações
- Progress bar para exports grandes

### Feedback ao Usuário

- Toast notifications para ações
- Confirmações para exclusões
- Indicadores de salvamento automático

## 📋 Checklist de Entrega

- [ ] Autenticação funcional
- [ ] CRUD completo de eleitores
- [ ] Sistema de filtros múltiplos
- [ ] Export CSV
- [ ] Validação de CPF
- [ ] Interface responsiva
- [ ] Tratamento de erros
- [ ] Documentação de deploy
- [ ] Testes básicos

---

**Tempo estimado total**: 4-6 semanas
**Complexidade**: Média
**Prioridade**: Alta para funcionalidades core, média para melhorias de UX
