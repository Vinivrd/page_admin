# 🗑️ Implementação de Soft Delete

## 📋 O que é Soft Delete?

Soft Delete é uma técnica onde os registros não são removidos permanentemente do banco de dados. Em vez disso, são marcados como "deletados" usando um campo de status (`is_active`).

### Vantagens:
- ✅ **Recuperação de dados** - Possível restaurar registros deletados
- ✅ **Auditoria** - Mantém histórico completo
- ✅ **Segurança** - Previne perda acidental de dados
- ✅ **Conformidade** - Atende requisitos legais de retenção de dados

---

## 🔧 Implementação Realizada

### 1. **Campo `is_active` Adicionado**

```typescript
export interface Eleitor {
  // ... outros campos
  
  // Soft delete
  is_active?: number; // 1 = ativo, 0 = deletado
  
  // Metadados
  created_at?: string;
  updated_at?: string;
}
```

**Valores:**
- `1` = Eleitor ativo (visível no sistema)
- `0` = Eleitor deletado (oculto, mas mantido no banco)

---

### 2. **Função `deleteEleitor()` Modificada**

**ANTES (Hard Delete):**
```typescript
const result = await supabase
  .from('eleitores')
  .delete()
  .eq('id', id);
```

**DEPOIS (Soft Delete):**
```typescript
const result = await supabase
  .from('eleitores')
  .update({ is_active: 0 })
  .eq('id', id)
  .eq('is_active', 1); // Apenas se ainda estiver ativo
```

---

### 3. **Todas as Buscas Filtram por `is_active = 1`**

Modificadas as seguintes funções:

#### `fetchEleitores()`
```typescript
.select('*')
.eq('is_active', 1) // Apenas ativos
.order('created_at', { ascending: false });
```

#### `fetchEleitorById(id)`
```typescript
.select('*')
.eq('id', id)
.eq('is_active', 1) // Apenas se ativo
.single();
```

#### `searchEleitores(filters)`
```typescript
let query = supabase.from('eleitores').select('*').eq('is_active', 1);
```

#### `fetchEleitoresKeyset(params)`
```typescript
.select('*')
.eq('is_active', 1) // Apenas ativos
.order('created_at', { ascending: false })
```

#### `fetchEleitoresPage(params)`
```typescript
.select('*', { count: 'exact' })
.eq('is_active', 1) // Apenas ativos
.order('created_at', { ascending: false })
```

---

### 4. **Novas Funções Adicionadas**

#### `restoreEleitor(id)` - Restaurar Eleitor Deletado
```typescript
export async function restoreEleitor(id: string) {
  const result = await supabase
    .from('eleitores')
    .update({ is_active: 1 })
    .eq('id', id)
    .eq('is_active', 0); // Apenas se estiver deletado
  
  return { data: result.data, error: null };
}
```

**Uso:**
```typescript
import { restoreEleitor } from './services/eleitores.service';

const { data, error } = await restoreEleitor('eleitor-id-123');
if (!error) {
  toast.success('Eleitor restaurado com sucesso!');
}
```

---

#### `fetchDeletedEleitores()` - Buscar Eleitores Deletados
```typescript
export async function fetchDeletedEleitores() {
  const result = await supabase
    .from('eleitores')
    .select('*')
    .eq('is_active', 0)
    .order('updated_at', { ascending: false });
  
  return { data: result.data, error: null };
}
```

**Uso:**
```typescript
import { fetchDeletedEleitores } from './services/eleitores.service';

const { data, error } = await fetchDeletedEleitores();
console.log('Eleitores deletados:', data);
```

---

#### `permanentDeleteEleitor(id)` - Deletar Permanentemente
```typescript
export async function permanentDeleteEleitor(id: string) {
  const result = await supabase
    .from('eleitores')
    .delete()
    .eq('id', id);
  
  return { data: result.data, error: null };
}
```

**⚠️ ATENÇÃO:** Esta função remove permanentemente do banco. Use com cuidado!

**Uso:**
```typescript
import { permanentDeleteEleitor } from './services/eleitores.service';

// Apenas para admins ou após confirmação dupla
const { data, error } = await permanentDeleteEleitor('eleitor-id-123');
```

---

## 📊 Fluxo de Trabalho

### Deletar Eleitor (Soft Delete)
```
1. Usuário clica em "Deletar"
2. Sistema chama deleteEleitor(id)
3. Campo is_active é atualizado para 0
4. Eleitor desaparece da lista
5. Registro permanece no banco
```

### Restaurar Eleitor
```
1. Admin acessa "Eleitores Deletados"
2. Sistema chama fetchDeletedEleitores()
3. Lista mostra eleitores com is_active = 0
4. Admin clica em "Restaurar"
5. Sistema chama restoreEleitor(id)
6. Campo is_active volta para 1
7. Eleitor reaparece na lista principal
```

### Deletar Permanentemente (Hard Delete)
```
1. Admin acessa "Eleitores Deletados"
2. Admin clica em "Deletar Permanentemente"
3. Modal de confirmação dupla aparece
4. Sistema chama permanentDeleteEleitor(id)
5. Registro é removido do banco (irreversível)
```

---

## 🎯 Como Usar no Frontend

### 1. **Deletar Eleitor (já funciona automaticamente)**
```typescript
import { deleteEleitor } from './services/eleitores.service';

const handleDelete = async (id: string) => {
  const { error } = await deleteEleitor(id);
  if (!error) {
    toast.success('Eleitor removido com sucesso!');
    // Atualizar lista
  }
};
```

### 2. **Criar Página de Eleitores Deletados**
```typescript
import { fetchDeletedEleitores, restoreEleitor } from './services/eleitores.service';

function DeletedEleitoresPage() {
  const [deletedEleitores, setDeletedEleitores] = useState([]);

  useEffect(() => {
    const loadDeleted = async () => {
      const { data } = await fetchDeletedEleitores();
      setDeletedEleitores(data || []);
    };
    loadDeleted();
  }, []);

  const handleRestore = async (id: string) => {
    const { error } = await restoreEleitor(id);
    if (!error) {
      toast.success('Eleitor restaurado!');
      // Recarregar lista
    }
  };

  return (
    <div>
      <h1>Eleitores Deletados</h1>
      {deletedEleitores.map(eleitor => (
        <div key={eleitor.id}>
          <span>{eleitor.nome}</span>
          <button onClick={() => handleRestore(eleitor.id)}>
            Restaurar
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 3. **Adicionar Botão de Restauração**
```typescript
// No componente UserRow ou similar
import { restoreEleitor } from './services/eleitores.service';

<button onClick={async () => {
  const { error } = await restoreEleitor(user.id);
  if (!error) {
    toast.success('Eleitor restaurado!');
    onRestored(user.id);
  }
}}>
  <RotateCcw size={16} /> Restaurar
</button>
```

---

## 🔒 Segurança no Supabase

### Row Level Security (RLS) Policies

**Importante:** Configure políticas no Supabase para proteger dados deletados:

```sql
-- Usuários normais só veem eleitores ativos
CREATE POLICY "Usuários veem apenas ativos"
ON eleitores FOR SELECT
TO authenticated
USING (is_active = 1);

-- Apenas admins podem ver deletados
CREATE POLICY "Admins veem deletados"
ON eleitores FOR SELECT
TO authenticated
USING (
  is_active = 0 AND 
  auth.jwt() ->> 'role' = 'admin'
);

-- Apenas admins podem restaurar
CREATE POLICY "Admins podem restaurar"
ON eleitores FOR UPDATE
TO authenticated
USING (
  is_active = 0 AND 
  auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (is_active = 1);

-- Apenas admins podem deletar permanentemente
CREATE POLICY "Admins podem deletar permanentemente"
ON eleitores FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

---

## 📈 Estatísticas e Relatórios

### Contar Eleitores Ativos vs Deletados
```typescript
const { count: ativos } = await supabase
  .from('eleitores')
  .select('*', { count: 'exact', head: true })
  .eq('is_active', 1);

const { count: deletados } = await supabase
  .from('eleitores')
  .select('*', { count: 'exact', head: true })
  .eq('is_active', 0);

console.log(`Ativos: ${ativos}, Deletados: ${deletados}`);
```

---

## 🧹 Limpeza Automática (Opcional)

### Script para Deletar Permanentemente Registros Antigos

```typescript
/**
 * Deleta permanentemente eleitores que foram soft-deleted há mais de 30 dias
 */
export async function cleanupOldDeletedEleitores() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await supabase
    .from('eleitores')
    .select('id')
    .eq('is_active', 0)
    .lt('updated_at', thirtyDaysAgo.toISOString());

  if (data && data.length > 0) {
    for (const eleitor of data) {
      await permanentDeleteEleitor(eleitor.id);
    }
  }

  return { deleted: data?.length || 0 };
}
```

**Uso:** Executar via cron job ou manualmente pelo admin.

---

## ✅ Checklist de Implementação

- [x] Campo `is_active` adicionado à interface `Eleitor`
- [x] Função `deleteEleitor()` modificada para soft delete
- [x] Todas as buscas filtram por `is_active = 1`
- [x] Função `restoreEleitor()` criada
- [x] Função `fetchDeletedEleitores()` criada
- [x] Função `permanentDeleteEleitor()` criada
- [ ] **TODO:** Criar página de eleitores deletados no frontend
- [ ] **TODO:** Adicionar botão "Restaurar" na UI
- [ ] **TODO:** Configurar RLS policies no Supabase
- [ ] **TODO:** Adicionar confirmação dupla para delete permanente
- [ ] **TODO:** Implementar limpeza automática (opcional)

---

## 🎨 Sugestões de UI

### Badge de Status
```typescript
{eleitor.is_active === 0 && (
  <span className="badge badge-deleted">Deletado</span>
)}
```

### Filtro de Visualização
```typescript
<select onChange={(e) => setShowDeleted(e.target.value === 'deleted')}>
  <option value="active">Ativos</option>
  <option value="deleted">Deletados</option>
  <option value="all">Todos</option>
</select>
```

### Modal de Confirmação
```typescript
const confirmDelete = () => {
  if (confirm('Tem certeza que deseja remover este eleitor?')) {
    deleteEleitor(id);
  }
};
```

---

## 📝 Notas Importantes

1. **Migração de Dados:** Se você já tem dados no banco, execute:
   ```sql
   UPDATE eleitores SET is_active = 1 WHERE is_active IS NULL;
   ALTER TABLE eleitores ALTER COLUMN is_active SET DEFAULT 1;
   ```

2. **Performance:** Adicione índice no campo `is_active`:
   ```sql
   CREATE INDEX idx_eleitores_is_active ON eleitores(is_active);
   ```

3. **Backup:** Sempre faça backup antes de implementar hard delete.

4. **Logs:** Considere adicionar logs de auditoria para rastrear quem deletou/restaurou.

---

## 🔄 Próximos Passos

1. Testar todas as funções no ambiente de desenvolvimento
2. Criar interface para gerenciar eleitores deletados
3. Configurar políticas de segurança no Supabase
4. Adicionar testes unitários
5. Documentar para o time

---

**Status:** ✅ **Implementação Backend Completa**  
**Próximo:** Implementar UI para gerenciar eleitores deletados
