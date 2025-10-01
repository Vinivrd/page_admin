# 🚀 Guia de Execução - FASE 1

## Passos para Executar a Migração

### 1. No Supabase Dashboard
1. Acesse seu projeto no Supabase
2. Vá em **SQL Editor**
3. Cole o conteúdo do arquivo `migration_fase1.sql`
4. Execute o script completo

### 2. Verificações Pós-Migração
Execute estas queries para verificar se tudo funcionou:

```sql
-- 1. Verificar se todos os registros têm profissão e segmento_social
SELECT COUNT(*) FROM public.eleitores WHERE profissao IS NULL OR segmento_social IS NULL;

-- 2. Verificar distribuição por região
SELECT regiao, COUNT(*) FROM public.eleitores GROUP BY regiao ORDER BY COUNT(*) DESC;

-- 3. Verificar se há valores em religiao_outra que precisam ser revisados
SELECT religiao_outra, COUNT(*) FROM public.eleitores WHERE religiao = 'Outra' GROUP BY religiao_outra;

-- 4. Verificar estrutura da tabela
\d public.eleitores;
```

### 3. Possíveis Problemas e Soluções

#### ❌ Erro: "invalid input value for enum"
**Causa**: Valores na coluna `regiao` não coincidem com o enum
**Solução**: 
```sql
-- Ver valores únicos atuais
SELECT DISTINCT regiao FROM public.eleitores;
-- Ajustar manualmente os valores antes da migração
```

#### ❌ Erro: "column already exists"
**Causa**: Script executado parcialmente antes
**Solução**: Remover campos já criados ou usar IF NOT EXISTS

### 4. ✅ Sinais de Sucesso
- [ ] Script executado sem erros
- [ ] Todos os enums criados
- [ ] Novos campos visíveis na tabela
- [ ] Dados existentes preservados
- [ ] Índices criados

---

## 🎯 Após a Execução
Quando terminar, me avise para começarmos a **FASE 2** (Tipos TypeScript)!
