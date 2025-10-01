-- =====================================================
-- CORREÇÃO DE REGIÕES - MAPEAMENTO PARA ENUM
-- =====================================================

-- 1. CORRIGIR REGISTROS VAZIOS (826 registros)
UPDATE public.eleitores 
SET regiao = 'Centro' 
WHERE regiao = '' OR regiao IS NULL;

-- 2. MAPEAR VALORES EXISTENTES PARA O ENUM
-- Baseado na análise dos dados e nas 11 regiões definidas

-- PIMENTAS (423 + variações)
UPDATE public.eleitores SET regiao = 'Pimentas' WHERE regiao = 'PIMENTAS';
UPDATE public.eleitores SET regiao = 'Pimentas' WHERE regiao = 'PIMEENTAS';
UPDATE public.eleitores SET regiao = 'Pimentas' WHERE regiao = 'PIMNETAS';

-- SÃO JOÃO (338 + variações)
UPDATE public.eleitores SET regiao = 'São João' WHERE regiao = 'SAO JOAO';
UPDATE public.eleitores SET regiao = 'São João' WHERE regiao = 'SÃO JOÒO';
UPDATE public.eleitores SET regiao = 'São João' WHERE regiao = 'SAO JOÒO';
UPDATE public.eleitores SET regiao = 'São João' WHERE regiao = 'SOA JOAO';

-- BONSUCESSO (159)
UPDATE public.eleitores SET regiao = 'Bonsucesso' WHERE regiao = 'BONSUCESSO';

-- COCAIA (148)
UPDATE public.eleitores SET regiao = 'Cocaia' WHERE regiao = 'COCAIA';

-- CENTRO (113)
UPDATE public.eleitores SET regiao = 'Centro' WHERE regiao = 'CENTRO';

-- CUMBICA (108)
UPDATE public.eleitores SET regiao = 'Cumbica' WHERE regiao = 'CUMBICA';

-- TABOÃO (82)
UPDATE public.eleitores SET regiao = 'Taboão' WHERE regiao = 'TABOAO';

-- CONTINENTAIS (79)
UPDATE public.eleitores SET regiao = 'Continentais' WHERE regiao = 'CONTINENTAIS';

-- VILA GALVÃO (72)
UPDATE public.eleitores SET regiao = 'Vila Galvão' WHERE regiao = 'VILA GALVAO';

-- TRANQUILIDADE (35)
UPDATE public.eleitores SET regiao = 'Tranquilidade' WHERE regiao = 'TRANQUILIDADE';

-- 3. MAPEAR REGIÕES QUE NÃO ESTÃO NO ENUM PARA A MAIS PRÓXIMA
-- Estas precisam ser mapeadas para uma das 11 regiões oficiais

-- PICANCO -> Provavelmente Pimentas (região próxima)
UPDATE public.eleitores SET regiao = 'Pimentas' WHERE regiao = 'PICAN!O';

-- PONTE GRANDE -> Mapear para Continentais (região próxima)
UPDATE public.eleitores SET regiao = 'Continentais' WHERE regiao = 'PONTE GRANDE';

-- PRESIDENTE DUTRA -> Mapear para Cumbica (região próxima ao aeroporto)
UPDATE public.eleitores SET regiao = 'Cumbica aeroporto' WHERE regiao = 'PRESIDENTE DUTRA';
UPDATE public.eleitores SET regiao = 'Cumbica aeroporto' WHERE regiao = 'PRES DUTRA';

-- CABUÇU -> Mapear para Bonsucesso (região próxima)
UPDATE public.eleitores SET regiao = 'Bonsucesso' WHERE regiao = 'CABU!U';

-- GOPOUVA -> Mapear para Vila Galvão (região próxima)
UPDATE public.eleitores SET regiao = 'Vila Galvão' WHERE regiao = 'GOPOUVA';

-- Outras regiões menores -> Mapear para Centro (padrão)
UPDATE public.eleitores SET regiao = 'Centro' WHERE regiao IN (
  'SAO PAULO',
  'ITAPEGICA', 
  'BELA VISTA',
  'SANTOS DUMONT',
  'Norte',
  'LAVRAS',
  'MARMELO',
  'PARAVENTI',
  'VILA RIO',
  'MUNIRA',
  'MUNHOZ',
  'JARDIM JACY',
  'MONTE CARMELO',
  'SANTA EDWIRGES',
  'MIKAIL',
  '395',
  'NOVA CIDADE',
  'CECAP',
  'BANANAL',
  'TORRES TIBAGY',
  'AGUA CHATA'
);

-- 4. VERIFICAÇÃO FINAL
SELECT 'VERIFICAÇÃO FINAL - Distribuição após correção:' as info;
SELECT regiao, COUNT(*) as quantidade
FROM public.eleitores 
GROUP BY regiao 
ORDER BY COUNT(*) DESC;

-- 5. VERIFICAR SE TODOS OS VALORES ESTÃO NO ENUM
SELECT 'Valores que ainda não estão no enum (deve retornar vazio):' as info;
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
