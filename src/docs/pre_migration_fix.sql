-- =====================================================
-- CORREÇÃO PRÉ-MIGRAÇÃO
-- Corrige valores inválidos antes da migração principal
-- =====================================================

-- 1. VERIFICAR VALORES ATUAIS DE REGIÃO
SELECT 'Valores atuais de região:' as info;
SELECT 
  CASE 
    WHEN regiao = '' THEN '[VAZIO]'
    WHEN regiao IS NULL THEN '[NULL]'
    ELSE regiao
  END as regiao_display,
  regiao as regiao_original,
  COUNT(*) as quantidade
FROM public.eleitores 
GROUP BY regiao 
ORDER BY COUNT(*) DESC;

-- 2. CORRIGIR REGIÕES VAZIAS OU NULAS
-- Definir um valor padrão para registros sem região
UPDATE public.eleitores 
SET regiao = 'Centro' 
WHERE regiao = '' OR regiao IS NULL OR TRIM(regiao) = '';

-- 3. VERIFICAR SE HÁ VALORES QUE NÃO ESTÃO NO ENUM
SELECT 'Verificando compatibilidade com enum:' as info;
SELECT DISTINCT regiao, COUNT(*) 
FROM public.eleitores 
WHERE regiao NOT IN (
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
)
GROUP BY regiao;

-- 4. SUGESTÕES DE CORREÇÃO MANUAL (se necessário)
-- Se a query acima retornar resultados, você precisa corrigir manualmente:

-- Exemplos de correções comuns:
-- UPDATE public.eleitores SET regiao = 'Vila Galvão' WHERE regiao = 'Vila Galvao';
-- UPDATE public.eleitores SET regiao = 'São João' WHERE regiao = 'Sao Joao';
-- UPDATE public.eleitores SET regiao = 'Taboão' WHERE regiao = 'Taboao';

-- 5. VERIFICAÇÃO FINAL
SELECT 'Verificação final - todos os valores devem estar no enum:' as info;
SELECT regiao, COUNT(*) 
FROM public.eleitores 
GROUP BY regiao 
ORDER BY regiao;
