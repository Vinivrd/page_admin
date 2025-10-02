# Plano de Melhorias - Sistema de Administração Política

## 📋 Análise do Projeto Atual

### Status Atual
- Sistema React + TypeScript funcionando
- Integração com Supabase operacional
- Interface de CRUD básica implementada
- Sistema de filtros existente (básico)
- Estrutura de dados configurada na tabela `eleitores`

### Pontos que Precisam ser Atualizados
Com base na mensagem recebida, identificamos 7 principais áreas de melhoria que devem ser implementadas.

---

## 🎯 Objetivo Geral

Expandir o sistema de cadastro para incluir novos campos específicos para regiões/bairros, religião, profissão, segmento social e controle de atendimentos, transformando-o em uma ferramenta completa de gestão política.

---

## 📝 Plano de Implementação

### **FASE 1: Atualização do Banco de Dados** 
*Tempo estimado: 1-2 dias*

#### 1.1 Atualização da Estrutura da Tabela
- [ ] Modificar tabela `eleitores` no Supabase
- [ ] Adicionar novos campos obrigatórios
- [ ] Criar enums para valores fixos
- [ ] Ajustar campos de endereço

**Novos campos a adicionar:**
```sql
-- Campos de endereço expandidos
rua VARCHAR(255),
numero VARCHAR(20),
complemento VARCHAR(255),
-- bairro e regiao já existem, mas regiao será obrigatório agora

-- Novos campos obrigatórios
profissao VARCHAR(100) NOT NULL,
segmento_social VARCHAR(100) NOT NULL,

-- Campos de controle de atendimento
atendido_instituto BOOLEAN DEFAULT FALSE,
atendido_demandas BOOLEAN DEFAULT FALSE,
participante_atividades BOOLEAN DEFAULT FALSE,
lideranca VARCHAR(100),

-- Data de criação dos campos de controle
data_instituto DATE,
data_demandas DATE,
data_atividades DATE
```

#### 1.2 Criação de Enums
- [ ] Enum para regiões (11 regiões especificadas)
- [ ] Enum para religiões (9 opções + "Outra")
*Tempo estimado: 1 dia*

#### 2.1 Atualização da Interface Eleitor
- [x] Atualizar `src/services/eleitores.service.ts`
- [x] Adicionar todos os novos campos
- [x] Criar tipos para os enums
- [x] Atualizar DTOs de criação e atualização

#### 2.2 Criação de Tipos Auxiliares
- [x] Tipo para filtros expandidos
- [x] Tipo para campos de endereço
- [x] Tipos para relatórios e exportação

---

{{ ... }}
### **FASE 3: Atualização do Formulário de Cadastro**
*Tempo estimado: 2-3 dias*

#### 3.1 Reorganização dos Campos de Endereço
- [x] Separar campos: rua, número, complemento, bairro, CEP, região
- [x] Implementar select para região (obrigatório)
- [x] Implementar input text para bairro
- [ ] Validação de CEP
- [ ] Integração futura com API de CEP (opcional)

#### 3.2 Novos Campos Obrigatórios
- [x] Select de religião com 9 opções + campo "Outra"
- [x] Select de profissão com 16 opções + campo "Outro"
- [x] Select de segmento social com 7 opções + campo "Outro"

#### 3.3 Campos de Controle (Checkboxes)
- [x] Checkbox "Atendido pelo Instituto"
- [x] Checkbox "Atendido por Demandas do Mandato"
- [x] Checkbox "Participa de Atividades do Mandato"
- [x] Select para "Liderança" (17 opções + "Outra")

#### 3.4 Validações
- [x] Região obrigatória
- [x] Profissão obrigatória
- [x] Segmento social obrigatório
- [x] Validação de campos "Outro/Outra" quando selecionados

---

### **FASE 4: Expansão do Sistema de Filtros**
*Tempo estimado: 2 dias*

#### 4.1 Novos Filtros de Busca
- [x] Filtro por região (múltipla seleção)
- [ ] Filtro por bairro (texto livre)
- [x] Filtro por religião (múltipla seleção)
- [x] Filtro por profissão (múltipla seleção)
- [x] Filtro por segmento social (múltipla seleção)

#### 4.2 Filtros de Controle
- [x] Filtro "Atendidos pelo Instituto" (Sim/Não/Todos)
- [x] Filtro "Atendidos por Demandas" (Sim/Não/Todos)
- [x] Filtro "Participantes de Atividades" (Sim/Não/Todos)
- [x] Filtro por liderança (select)

#### 4.3 Filtros Combinados
- [x] Filtros aplicados simultaneamente
- [ ] Contador de registros filtrados
- [x] Botão "Limpar filtros"

---

### **FASE 5: Melhorias na Interface**
*Tempo estimado: 2 dias*

#### 5.1 Atualização da Tabela Principal
- [x] Ajustar colunas exibidas conforme prioridade
- [x] Adicionar indicadores visuais para status de atendimento
- [ ] Melhorar responsividade da tabela
- [ ] Implementar ordenação nas novas colunas

#### 5.2 Dashboard de Estatísticas
- [ ] Cards com total por região
- [ ] Cards com total por religião
- [ ] Cards com total por profissão
- [ ] Gráficos de atendimentos (Instituto, Demandas, Atividades)

#### 5.3 Melhorias de UX
- [ ] Loading states melhorados
- [ ] Mensagens de validação mais claras
- [ ] Tooltips explicativos
- [ ] Confirmações para ações importantes

---

### **FASE 6: Funcionalidades de Relatório**
*Tempo estimado: 2 dias*

#### 6.1 Exportação Expandida
- [ ] Export incluindo todos os novos campos
- [ ] Opção de export por filtros aplicados
- [ ] Export em Excel (.xlsx) além do CSV
- [ ] Templates de relatório pré-definidos

#### 6.2 Relatórios Especializados
- [ ] Relatório de atendimentos do Instituto
- [ ] Relatório de demandas do mandato
- [ ] Relatório de participantes de atividades
- [ ] Relatório por liderança

---

### **FASE 7: Testes e Validação**
*Tempo estimado: 1-2 dias*

#### 7.1 Testes de Funcionalidade
- [ ] Testar todos os formulários
- [ ] Testar filtros combinados
- [ ] Testar exports e relatórios
- [ ] Testar responsividade

#### 7.2 Migração de Dados
- [ ] Script para migrar dados existentes
- [ ] Validação de integridade dos dados
- [ ] Backup antes da atualização

---

## 📊 Estrutura de Dados Detalhada

### Regiões (11 opções)
1. Centro
2. Continentais
3. Vila Galvão
4. Bonsucesso
5. Cocaia
6. Pimentas
7. Cumbica
8. Cumbica aeroporto
9. São João
10. Taboão
11. Tranquilidade

### Religiões (9 opções + Outra)
1. Católico
2. Evangélico/Protestante
3. Espírita
4. Umbandista
5. Candomblecista
6. Budista
7. Islâmico
8. Judeu
9. Outra

### Profissões (16 opções + Outro)
1. Dona de casa
2. Aposentado
3. Autônomo
4. Comerciante
5. Comerciário
6. Bancário
7. Professor
8. Funcionário Público
9. Médico
10. Agente de saúde
11. Enfermeiro
12. Advogado
13. Engenheiro
14. Técnico em geral
15. Trabalhador de Informática
16. Outro

### Segmentos Sociais (7 opções + Outro)
1. Saúde
2. Educação
3. Moradia
4. Transporte
5. Assistência Social
6. Segurança
7. Outro

### Lideranças (17 opções + Outra)
1. Arnaldo Souza
2. Luizão Souza
3. Ederson
4. Luiz Fábio
5. Dr Marcelo
6. Prof Renato
7. Sandrão
8. Dr Severino
9. Josefa
10. Zé Diniz
11. Rosilda
12. Marks
13. Ulisses
14. Gilmar
15. Correios
16. Aposentados
17. Outra

---

## 🚀 Cronograma de Execução

| Fase | Duração | Dependências | Entregáveis |
|------|---------|--------------|-------------|
| **Fase 1** | 1-2 dias | - | Banco atualizado com novos campos |
| **Fase 2** | 1 dia | Fase 1 | Tipos TypeScript atualizados |
| **Fase 3** | 2-3 dias | Fase 2 | Formulário completo funcionando |
| **Fase 4** | 2 dias | Fase 3 | Sistema de filtros expandido |
| **Fase 5** | 2 dias | Fase 4 | Interface melhorada e dashboard |
| **Fase 6** | 2 dias | Fase 5 | Relatórios e exports funcionando |
| **Fase 7** | 1-2 dias | Todas | Sistema testado e validado |

**Tempo total estimado: 11-15 dias úteis**

---

## ⚠️ Considerações Importantes

### Migração de Dados
- Dados existentes precisarão ser atualizados para os novos campos obrigatórios
- Sugestão: Valores padrão temporários para `profissao` e `segmento_social`
- Script de migração deve ser executado em horário de menor uso

### Validações
- Região será obrigatória (diferente do atual)
- Campos "Outro/Outra" devem ser validados quando selecionados
- Manter compatibilidade com dados existentes

### Performance
- Índices adicionais podem ser necessários para os novos campos de filtro
- Considerar paginação server-side para grandes volumes de dados
- Cache de dados estáticos (regiões, profissões, etc.)

---

## ✅ Critérios de Aceitação

### Funcionalidades Básicas
- [ ] Todos os 7 pontos da mensagem implementados
- [ ] Formulário de cadastro funcionando com todos os campos
- [ ] Sistema de filtros operacional
- [ ] Exports incluindo novos campos

### Qualidade
- [ ] Interface responsiva
- [ ] Validações adequadas
- [ ] Performance mantida
- [ ] Dados existentes preservados

### Documentação
- [ ] README atualizado
- [ ] Documentação dos novos campos
- [ ] Guia de migração
- [ ] Manual de uso das novas funcionalidades

---

## 🔄 Próximos Passos

1. **Validação do Plano**: Revisar este plano com a equipe
2. **Aprovação da Joyce**: Aguardar revisão das regiões conforme mencionado
3. **Backup**: Realizar backup completo antes de iniciar
4. **Início da Implementação**: Começar pela Fase 1 (Banco de Dados)

---

*Este plano está pronto para implementação e pode ser ajustado conforme necessário durante o desenvolvimento.*
