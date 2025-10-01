// =====================================================
// UTILITÁRIOS PARA ENUMS
// Sistema de Administração Política
// =====================================================

import {
  RegiaoEnum,
  ReligiaoEnum,
  ProfissaoEnum,
  SegmentoSocialEnum,
  LiderancaEnum,
  GeneroEnum
} from './eleitores.service';

// =====================================================
// ARRAYS PARA USO EM SELECTS/DROPDOWNS
// =====================================================

export const REGIOES_OPTIONS = Object.values(RegiaoEnum).map(value => ({
  value,
  label: value
}));

export const RELIGIOES_OPTIONS = Object.values(ReligiaoEnum).map(value => ({
  value,
  label: value
}));

export const PROFISSOES_OPTIONS = Object.values(ProfissaoEnum).map(value => ({
  value,
  label: value
}));

export const SEGMENTOS_SOCIAIS_OPTIONS = Object.values(SegmentoSocialEnum).map(value => ({
  value,
  label: value
}));

export const LIDERANCAS_OPTIONS = Object.values(LiderancaEnum).map(value => ({
  value,
  label: value
}));

export const GENEROS_OPTIONS = Object.values(GeneroEnum).map(value => ({
  value,
  label: value === 'OUTROS' ? 'Outros' : value === 'MASCULINO' ? 'Masculino' : 'Feminino'
}));

// =====================================================
// FUNÇÕES DE VALIDAÇÃO
// =====================================================

export const isValidRegiao = (value: string): value is RegiaoEnum => {
  return Object.values(RegiaoEnum).includes(value as RegiaoEnum);
};

export const isValidReligiao = (value: string): value is ReligiaoEnum => {
  return Object.values(ReligiaoEnum).includes(value as ReligiaoEnum);
};

export const isValidProfissao = (value: string): value is ProfissaoEnum => {
  return Object.values(ProfissaoEnum).includes(value as ProfissaoEnum);
};

export const isValidSegmentoSocial = (value: string): value is SegmentoSocialEnum => {
  return Object.values(SegmentoSocialEnum).includes(value as SegmentoSocialEnum);
};

export const isValidLideranca = (value: string): value is LiderancaEnum => {
  return Object.values(LiderancaEnum).includes(value as LiderancaEnum);
};

export const isValidGenero = (value: string): value is GeneroEnum => {
  return Object.values(GeneroEnum).includes(value as GeneroEnum);
};

// =====================================================
// FUNÇÕES PARA CAMPOS "OUTRO/OUTRA"
// =====================================================

export const needsOtherField = {
  religiao: (value: ReligiaoEnum) => value === ReligiaoEnum.OUTRA,
  profissao: (value: ProfissaoEnum) => value === ProfissaoEnum.OUTRO,
  segmentoSocial: (value: SegmentoSocialEnum) => value === SegmentoSocialEnum.OUTRO,
  lideranca: (value: LiderancaEnum) => value === LiderancaEnum.OUTRA,
};

// =====================================================
// FUNÇÕES DE FORMATAÇÃO
// =====================================================

export const formatEnumValue = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const getEnumDisplayName = (enumType: string, value: string): string => {
  switch (enumType) {
    case 'genero':
      switch (value) {
        case GeneroEnum.MASCULINO: return 'Masculino';
        case GeneroEnum.FEMININO: return 'Feminino';
        case GeneroEnum.OUTROS: return 'Outros';
        default: return value;
      }
    default:
      return value;
  }
};

// =====================================================
// CONSTANTES PARA FILTROS
// =====================================================

export const FILTROS_BOOLEAN_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' }
];

export const FILTROS_ATENDIMENTO_LABELS = {
  atendido_instituto: 'Atendido pelo Instituto',
  atendido_demandas: 'Atendido por Demandas',
  participante_atividades: 'Participa de Atividades'
};

// =====================================================
// FUNÇÕES DE BUSCA/FILTRO
// =====================================================

export const searchInEnum = (enumValues: string[], searchTerm: string): string[] => {
  if (!searchTerm) return enumValues;
  
  const term = searchTerm.toLowerCase();
  return enumValues.filter(value => 
    value.toLowerCase().includes(term)
  );
};

// =====================================================
// VALIDAÇÕES DE FORMULÁRIO
// =====================================================

export const validateEleitorData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Campos obrigatórios
  if (!data.nome?.trim()) {
    errors.push('Nome é obrigatório');
  }

  if (!data.regiao) {
    errors.push('Região é obrigatória');
  } else if (!isValidRegiao(data.regiao)) {
    errors.push('Região inválida');
  }

  if (!data.cidade?.trim()) {
    errors.push('Cidade é obrigatória');
  }

  if (!data.profissao) {
    errors.push('Profissão é obrigatória');
  } else if (!isValidProfissao(data.profissao)) {
    errors.push('Profissão inválida');
  }

  if (!data.segmento_social) {
    errors.push('Segmento social é obrigatório');
  } else if (!isValidSegmentoSocial(data.segmento_social)) {
    errors.push('Segmento social inválido');
  }

  // Validar campos "Outro/Outra"
  if (data.religiao === ReligiaoEnum.OUTRA && !data.religiao_outra?.trim()) {
    errors.push('Especifique a religião quando "Outra" for selecionada');
  }

  if (data.profissao === ProfissaoEnum.OUTRO && !data.profissao_outra?.trim()) {
    errors.push('Especifique a profissão quando "Outro" for selecionado');
  }

  if (data.segmento_social === SegmentoSocialEnum.OUTRO && !data.segmento_social_outro?.trim()) {
    errors.push('Especifique o segmento social quando "Outro" for selecionado');
  }

  if (data.lideranca === LiderancaEnum.OUTRA && !data.lideranca_outra?.trim()) {
    errors.push('Especifique a liderança quando "Outra" for selecionada');
  }

  // Validar CPF se fornecido
  if (data.cpf && !isValidCPF(data.cpf)) {
    errors.push('CPF inválido');
  }

  // Validar email se fornecido
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Email inválido');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

const isValidCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// =====================================================
// EXPORTAÇÕES PARA FACILITAR IMPORTAÇÃO
// =====================================================

export const EnumUtils = {
  REGIOES_OPTIONS,
  RELIGIOES_OPTIONS,
  PROFISSOES_OPTIONS,
  SEGMENTOS_SOCIAIS_OPTIONS,
  LIDERANCAS_OPTIONS,
  GENEROS_OPTIONS,
  FILTROS_BOOLEAN_OPTIONS,
  FILTROS_ATENDIMENTO_LABELS,
  isValidRegiao,
  isValidReligiao,
  isValidProfissao,
  isValidSegmentoSocial,
  isValidLideranca,
  isValidGenero,
  needsOtherField,
  validateEleitorData,
  searchInEnum
};
