-- =====================================================
-- FASE 1: MIGRAÇÃO DO BANCO DE DADOS
-- Sistema de Administração Política
-- =====================================================

-- 1. CRIAR NOVOS ENUMS
-- =====================================================

-- Enum para Regiões (11 opções específicas)
CREATE TYPE regiao_enum AS ENUM (
  'Centro',
  'Continentais', 
  'Vila Galvão',
  'Bonsucesso',
  'Cocaia',
  'Pimentas',
  'Cumbica',
  'Cumbica aeroporto',
  'São João',
  'Taboão',
  'Tranquilidade'
);

-- Enum para Religiões (9 opções + Outra)
CREATE TYPE religiao_enum AS ENUM (
  'Católico',
  'Evangélico/Protestante',
  'Espírita', 
  'Umbandista',
  'Candomblecista',
  'Budista',
  'Islâmico',
  'Judeu',
  'Outra'
);

-- Enum para Profissões (16 opções + Outro)
CREATE TYPE profissao_enum AS ENUM (
  'Dona de casa',
  'Aposentado',
  'Autônomo',
  'Comerciante',
  'Comerciário',
  'Bancário',
  'Professor',
  'Funcionário Público',
  'Médico',
  'Agente de saúde',
  'Enfermeiro',
  'Advogado',
  'Engenheiro',
  'Técnico em geral',
  'Trabalhador de Informática',
  'Outro'
);

-- Enum para Segmentos Sociais (7 opções + Outro)
CREATE TYPE segmento_social_enum AS ENUM (
  'Saúde',
  'Educação',
  'Moradia',
  'Transporte',
  'Assistência Social',
  'Segurança',
  'Outro'
);

-- Enum para Lideranças (17 opções + Outra)
CREATE TYPE lideranca_enum AS ENUM (
  'Arnaldo Souza',
  'Luizão Souza',
  'Ederson',
  'Luiz Fábio',
  'Dr Marcelo',
  'Prof Renato',
  'Sandrão',
  'Dr Severino',
  'Josefa',
  'Zé Diniz',
  'Rosilda',
  'Marks',
  'Ulisses',
  'Gilmar',
  'Correios',
  'Aposentados',
  'Outra'
);

-- 2. ADICIONAR NOVOS CAMPOS À TABELA ELEITORES
-- =====================================================

-- Campos de endereço expandidos
ALTER TABLE public.eleitores 
ADD COLUMN rua VARCHAR(255),
ADD COLUMN numero VARCHAR(20),
ADD COLUMN complemento VARCHAR(255);

-- Campos obrigatórios (inicialmente nullable para migração)
ALTER TABLE public.eleitores 
ADD COLUMN profissao_nova profissao_enum,
ADD COLUMN segmento_social segmento_social_enum;

-- Campos de controle de atendimento
ALTER TABLE public.eleitores 
ADD COLUMN atendido_instituto BOOLEAN DEFAULT FALSE,
ADD COLUMN atendido_demandas BOOLEAN DEFAULT FALSE,
ADD COLUMN participante_atividades BOOLEAN DEFAULT FALSE,
ADD COLUMN lideranca lideranca_enum;

-- Campos para rastreamento de datas
ALTER TABLE public.eleitores 
ADD COLUMN data_instituto DATE,
ADD COLUMN data_demandas DATE,
ADD COLUMN data_atividades DATE;

-- Campos para "Outro/Outra" quando aplicável
ALTER TABLE public.eleitores 
ADD COLUMN religiao_outra VARCHAR(100),
ADD COLUMN profissao_outra VARCHAR(100),
ADD COLUMN segmento_social_outro VARCHAR(100),
ADD COLUMN lideranca_outra VARCHAR(100);

-- 3. MIGRAÇÃO DE DADOS EXISTENTES
-- =====================================================

-- Migrar campo religiao existente para o novo enum (quando possível)
UPDATE public.eleitores 
SET religiao_outra = religiao 
WHERE religiao IS NOT NULL 
AND religiao NOT IN (
  'Católico', 'Evangélico/Protestante', 'Espírita', 'Umbandista',
  'Candomblecista', 'Budista', 'Islâmico', 'Judeu'
);

-- Definir valores padrão temporários para campos obrigatórios
UPDATE public.eleitores 
SET profissao_nova = 'Outro'
WHERE profissao_nova IS NULL;

UPDATE public.eleitores 
SET segmento_social = 'Outro'
WHERE segmento_social IS NULL;

-- Migrar campo regiao para enum (assumindo que os valores já estão corretos)
-- Se houver valores diferentes, eles precisarão ser ajustados manualmente

-- 4. ALTERAR TIPOS DE CAMPOS EXISTENTES
-- =====================================================

-- Alterar campo religiao para usar o novo enum
ALTER TABLE public.eleitores 
ALTER COLUMN religiao TYPE religiao_enum 
USING CASE 
  WHEN religiao = 'Católico' THEN 'Católico'::religiao_enum
  WHEN religiao = 'Evangélico/Protestante' THEN 'Evangélico/Protestante'::religiao_enum
  WHEN religiao = 'Espírita' THEN 'Espírita'::religiao_enum
  WHEN religiao = 'Umbandista' THEN 'Umbandista'::religiao_enum
  WHEN religiao = 'Candomblecista' THEN 'Candomblecista'::religiao_enum
  WHEN religiao = 'Budista' THEN 'Budista'::religiao_enum
  WHEN religiao = 'Islâmico' THEN 'Islâmico'::religiao_enum
  WHEN religiao = 'Judeu' THEN 'Judeu'::religiao_enum
  ELSE 'Outra'::religiao_enum
END;

-- Alterar campo regiao para usar o novo enum
ALTER TABLE public.eleitores 
ALTER COLUMN regiao TYPE regiao_enum 
USING regiao::regiao_enum;

-- 5. TORNAR CAMPOS OBRIGATÓRIOS
-- =====================================================

-- Remover campo profissao antigo e renomear o novo
ALTER TABLE public.eleitores DROP COLUMN profissao;
ALTER TABLE public.eleitores RENAME COLUMN profissao_nova TO profissao;

-- Tornar campos obrigatórios
ALTER TABLE public.eleitores 
ALTER COLUMN profissao SET NOT NULL;

ALTER TABLE public.eleitores 
ALTER COLUMN segmento_social SET NOT NULL;

-- 6. CRIAR NOVOS ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para os novos campos de filtro
CREATE INDEX IF NOT EXISTS idx_eleitores_profissao ON public.eleitores USING btree (profissao);
CREATE INDEX IF NOT EXISTS idx_eleitores_segmento_social ON public.eleitores USING btree (segmento_social);
CREATE INDEX IF NOT EXISTS idx_eleitores_lideranca ON public.eleitores USING btree (lideranca);

-- Índices para campos de controle
CREATE INDEX IF NOT EXISTS idx_eleitores_atendido_instituto ON public.eleitores USING btree (atendido_instituto);
CREATE INDEX IF NOT EXISTS idx_eleitores_atendido_demandas ON public.eleitores USING btree (atendido_demandas);
CREATE INDEX IF NOT EXISTS idx_eleitores_participante_atividades ON public.eleitores USING btree (participante_atividades);

-- Índices compostos para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_eleitores_regiao_profissao ON public.eleitores USING btree (regiao, profissao);
CREATE INDEX IF NOT EXISTS idx_eleitores_atendimentos ON public.eleitores USING btree (atendido_instituto, atendido_demandas, participante_atividades);

-- 7. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON COLUMN public.eleitores.rua IS 'Rua do endereço do eleitor';
COMMENT ON COLUMN public.eleitores.numero IS 'Número do endereço';
COMMENT ON COLUMN public.eleitores.complemento IS 'Complemento do endereço (apto, bloco, etc.)';
COMMENT ON COLUMN public.eleitores.profissao IS 'Profissão do eleitor (obrigatório)';
COMMENT ON COLUMN public.eleitores.segmento_social IS 'Segmento social de interesse (obrigatório)';
COMMENT ON COLUMN public.eleitores.atendido_instituto IS 'Indica se foi atendido pelo Instituto';
COMMENT ON COLUMN public.eleitores.atendido_demandas IS 'Indica se foi atendido por demandas do mandato';
COMMENT ON COLUMN public.eleitores.participante_atividades IS 'Indica se participa de atividades do mandato';
COMMENT ON COLUMN public.eleitores.lideranca IS 'Liderança à qual o eleitor está vinculado';
COMMENT ON COLUMN public.eleitores.religiao_outra IS 'Especificação quando religião = "Outra"';
COMMENT ON COLUMN public.eleitores.profissao_outra IS 'Especificação quando profissão = "Outro"';
COMMENT ON COLUMN public.eleitores.segmento_social_outro IS 'Especificação quando segmento social = "Outro"';
COMMENT ON COLUMN public.eleitores.lideranca_outra IS 'Especificação quando liderança = "Outra"';

-- =====================================================
-- FIM DA MIGRAÇÃO FASE 1
-- =====================================================

-- VERIFICAÇÕES PÓS-MIGRAÇÃO
-- Para executar após a migração:

-- 1. Verificar se todos os registros têm profissão e segmento_social
-- SELECT COUNT(*) FROM public.eleitores WHERE profissao IS NULL OR segmento_social IS NULL;

-- 2. Verificar distribuição por região
-- SELECT regiao, COUNT(*) FROM public.eleitores GROUP BY regiao ORDER BY COUNT(*) DESC;

-- 3. Verificar se há valores em religiao_outra que precisam ser revisados
-- SELECT religiao_outra, COUNT(*) FROM public.eleitores WHERE religiao = 'Outra' GROUP BY religiao_outra;
