import { supabase } from './supabase';

// =====================================================
// ENUMS - Correspondem aos enums do banco de dados
// =====================================================

export const RegiaoEnum = {
  CENTRO: 'Centro',
  CONTINENTAIS: 'Continentais',
  VILA_GALVAO: 'Vila Galvão',
  BONSUCESSO: 'Bonsucesso',
  COCAIA: 'Cocaia',
  PIMENTAS: 'Pimentas',
  CUMBICA: 'Cumbica',
  CUMBICA_AEROPORTO: 'Cumbica aeroporto',
  SAO_JOAO: 'São João',
  TABOAO: 'Taboão',
  TRANQUILIDADE: 'Tranquilidade'
} as const;

export type RegiaoEnum = typeof RegiaoEnum[keyof typeof RegiaoEnum];

export const ReligiaoEnum = {
  CATOLICO: 'Católico',
  EVANGELICO: 'Evangélico/Protestante',
  ESPIRITA: 'Espírita',
  UMBANDISTA: 'Umbandista',
  CANDOMBLECISTA: 'Candomblecista',
  BUDISTA: 'Budista',
  ISLAMICO: 'Islâmico',
  JUDEU: 'Judeu',
  OUTRA: 'Outra'
} as const;

export type ReligiaoEnum = typeof ReligiaoEnum[keyof typeof ReligiaoEnum];

export const ProfissaoEnum = {
  DONA_DE_CASA: 'Dona de casa',
  APOSENTADO: 'Aposentado',
  AUTONOMO: 'Autônomo',
  COMERCIANTE: 'Comerciante',
  COMERCIARIO: 'Comerciário',
  BANCARIO: 'Bancário',
  PROFESSOR: 'Professor',
  FUNCIONARIO_PUBLICO: 'Funcionário Público',
  MEDICO: 'Médico',
  AGENTE_SAUDE: 'Agente de saúde',
  ENFERMEIRO: 'Enfermeiro',
  ADVOGADO: 'Advogado',
  ENGENHEIRO: 'Engenheiro',
  TECNICO_GERAL: 'Técnico em geral',
  TRABALHADOR_INFORMATICA: 'Trabalhador de Informática',
  OUTRO: 'Outro'
} as const;

export type ProfissaoEnum = typeof ProfissaoEnum[keyof typeof ProfissaoEnum];

export const SegmentoSocialEnum = {
  SAUDE: 'Saúde',
  EDUCACAO: 'Educação',
  MORADIA: 'Moradia',
  TRANSPORTE: 'Transporte',
  ASSISTENCIA_SOCIAL: 'Assistência Social',
  SEGURANCA: 'Segurança',
  OUTRO: 'Outro'
} as const;

export type SegmentoSocialEnum = typeof SegmentoSocialEnum[keyof typeof SegmentoSocialEnum];

export const LiderancaEnum = {
  ARNALDO_SOUZA: 'Arnaldo Souza',
  LUIZAO_SOUZA: 'Luizão Souza',
  EDERSON: 'Ederson',
  LUIZ_FABIO: 'Luiz Fábio',
  DR_MARCELO: 'Dr Marcelo',
  PROF_RENATO: 'Prof Renato',
  SANDRAO: 'Sandrão',
  DR_SEVERINO: 'Dr Severino',
  JOSEFA: 'Josefa',
  ZE_DINIZ: 'Zé Diniz',
  ROSILDA: 'Rosilda',
  MARKS: 'Marks',
  ULISSES: 'Ulisses',
  GILMAR: 'Gilmar',
  CORREIOS: 'Correios',
  APOSENTADOS: 'Aposentados',
  OUTRA: 'Outra'
} as const;

export type LiderancaEnum = typeof LiderancaEnum[keyof typeof LiderancaEnum];

export const GeneroEnum = {
  MASCULINO: 'MASCULINO',
  FEMININO: 'FEMININO',
  OUTROS: 'OUTROS'
} as const;

export type GeneroEnum = typeof GeneroEnum[keyof typeof GeneroEnum];

// =====================================================
// INTERFACE PRINCIPAL
// =====================================================

export interface Eleitor {
  id?: string;
  
  // Dados pessoais básicos
  nome: string;
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  cpf?: string;
  genero: GeneroEnum;
  
  // Endereço completo
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  regiao: RegiaoEnum;
  cidade: string;
  endereco?: string; // Campo legado, manter por compatibilidade
  
  // Dados obrigatórios
  religiao?: ReligiaoEnum;
  profissao: ProfissaoEnum;
  segmento_social: SegmentoSocialEnum;
  
  // Campos "Outro/Outra" para especificação
  religiao_outra?: string;
  profissao_outra?: string;
  segmento_social_outro?: string;
  lideranca_outra?: string;
  
  // Controle de atendimentos
  atendido_instituto: boolean;
  atendido_demandas: boolean;
  participante_atividades: boolean;
  lideranca?: LiderancaEnum;
  
  // Datas de controle
  data_instituto?: string;
  data_demandas?: string;
  data_atividades?: string;
  
  // Redes sociais
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  
  // Outros
  escola?: string;
  observacoes?: string;
  interacao: boolean;
  
  // Soft delete
  is_active?: number; // 1 = ativo, 0 = deletado
  
  // Metadados
  created_at?: string;
  updated_at?: string;
}

export type EleitorUpsertPayload = {
  nome: string;
  email: string | null;
  telefone: string | null;
  data_nascimento: string | null;
  cpf: string | null;
  genero: GeneroEnum;
  rua: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  regiao: RegiaoEnum;
  cidade: string;
  religiao: ReligiaoEnum | null;
  religiao_outra: string | null;
  escola: string | null;
  profissao: ProfissaoEnum;
  profissao_outra: string | null;
  segmento_social: SegmentoSocialEnum;
  segmento_social_outro: string | null;
  lideranca: LiderancaEnum | null;
  lideranca_outra: string | null;
  atendido_instituto: boolean;
  atendido_demandas: boolean;
  participante_atividades: boolean;
  data_instituto: string | null;
  data_demandas: string | null;
  data_atividades: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  observacoes: string | null;
  interacao: boolean;
}

/**
 * Classe customizada de erro para operações com eleitores
 */
export class EleitoresError extends Error {
  code: string;
  
  constructor(message: string, code: string = 'database/unknown') {
    super(message);
    this.name = 'EleitoresError';
    this.code = code;
  }
}

/**
 * Trata erros do Supabase e retorna um EleitoresError
 */
function handleSupabaseError(error: any, defaultMessage: string): EleitoresError {
  if (!error) return new EleitoresError(defaultMessage);
  
  let code = 'database/unknown';
  
  // Mapear códigos de erro do Supabase
  if (error.code === '23505') {
    code = 'database/duplicate-entry';
  } else if (error.code === '42P01') {
    code = 'database/table-not-found';
  } else if (error.code === '23503') {
    code = 'database/foreign-key-violation';
  } else if (error.message?.includes('timeout')) {
    code = 'database/timeout';
  } else if (error.message?.includes('permission')) {
    code = 'database/permission-denied';
  }
  
  return new EleitoresError(
    error.message || defaultMessage,
    code
  );
}

/**
 * Busca todos os eleitores cadastrados (apenas ativos)
 */
export async function fetchEleitores() {
  try {
    const result = await supabase
      .from('eleitores')
      .select('*')
      .eq('is_active', 1) // Apenas eleitores ativos
      .order('created_at', { ascending: false });
    
    if (result.error) {
      throw handleSupabaseError(
        result.error,
        'Erro ao buscar eleitores'
      );
    }
    
    return { data: result.data, error: null };
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: null, error: err };
    }
    
    return {
      data: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao buscar eleitores',
        'database/fetch-error'
      )
    };
  }
}

/**
 * Busca um eleitor específico pelo ID (apenas se ativo)
 */
export async function fetchEleitorById(id: string) {
  try {
    if (!id) {
      throw new EleitoresError('ID do eleitor não fornecido', 'database/invalid-id');
    }
    
    const result = await supabase
      .from('eleitores')
      .select('*')
      .eq('id', id)
      .eq('is_active', 1) // Apenas se ativo
      .single();
    
    if (result.error) {
      if (result.error.message?.includes('not found')) {
        throw new EleitoresError(`Eleitor com ID ${id} não encontrado ou foi removido`, 'database/not-found');
      }
      
      throw handleSupabaseError(
        result.error,
        `Erro ao buscar eleitor com ID ${id}`
      );
    }
    
    return { data: result.data, error: null };
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: null, error: err };
    }
    
    return {
      data: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao buscar eleitor',
        'database/fetch-by-id-error'
      )
    };
  }
}

/**
 * Adiciona um novo eleitor
 */
export async function addEleitor(eleitor: EleitorUpsertPayload) {
  try {
    const result = await supabase
      .from('eleitores')
      .insert([eleitor])
      .select();
    
    if (result.error) {
      throw handleSupabaseError(
        result.error,
        'Erro ao adicionar eleitor'
      );
    }
    
    return { data: result.data, error: null };
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: null, error: err };
    }
    
    return {
      data: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao adicionar eleitor',
        'database/add-error'
      )
    };
  }
}

/**
 * Atualiza um eleitor existente
 */
export async function updateEleitor(id: string, eleitor: Partial<EleitorUpsertPayload>) {
  try {
    if (!id) {
      throw new EleitoresError('ID do eleitor não fornecido para atualização', 'database/invalid-id');
    }
    
    const result = await supabase
      .from('eleitores')
      .update(eleitor)
      .eq('id', id)
      .select();
    
    if (result.error) {
      if (result.error.message?.includes('not found')) {
        throw new EleitoresError(`Eleitor com ID ${id} não encontrado para atualização`, 'database/not-found');
      }
      
      throw handleSupabaseError(
        result.error,
        `Erro ao atualizar eleitor com ID ${id}`
      );
    }
    
    return { data: result.data, error: null };
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: null, error: err };
    }
    
    return {
      data: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao atualizar eleitor',
        'database/update-error'
      )
    };
  }
}

/**
 * Remove um eleitor (soft delete - marca como inativo)
 */
export async function deleteEleitor(id: string) {
  try {
    if (!id) {
      throw new EleitoresError('ID do eleitor não fornecido para exclusão', 'database/invalid-id');
    }
    
    // Soft delete: atualiza is_active para 0 ao invés de deletar
    const result = await supabase
      .from('eleitores')
      .update({ is_active: 0 })
      .eq('id', id)
      .eq('is_active', 1); // Apenas se ainda estiver ativo
    
    if (result.error) {
      if (result.error.message?.includes('not found')) {
        throw new EleitoresError(`Eleitor com ID ${id} não encontrado para exclusão`, 'database/not-found');
      }
      
      throw handleSupabaseError(
        result.error,
        `Erro ao excluir eleitor com ID ${id}`
      );
    }
    
    return { data: result.data, error: null };
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: null, error: err };
    }
    
    return {
      data: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao excluir eleitor',
        'database/delete-error'
      )
    };
  }
}

// =====================================================
// TIPOS PARA FILTROS
// =====================================================

export interface FiltrosEleitor {
  search?: string;
  regiao?: RegiaoEnum | string;
  bairro?: string;
  cidade?: string;
  genero?: GeneroEnum | string;
  religiao?: ReligiaoEnum | string;
  profissao?: ProfissaoEnum | string;
  segmento_social?: SegmentoSocialEnum | string;
  lideranca?: LiderancaEnum | string;
  interacao?: boolean;
  atendido_instituto?: boolean;
  atendido_demandas?: boolean;
  participante_atividades?: boolean;
  nome?: string;
  email?: string;
  cpf?: string;
}

/**
 * Busca eleitores com filtros expandidos (apenas ativos)
 */
export async function searchEleitores(filters: FiltrosEleitor) {
  let query = supabase.from('eleitores').select('*').eq('is_active', 1);

  // Aplicar filtros se fornecidos
  if (filters.regiao) {
    query = query.eq('regiao', filters.regiao);
  }

  if (filters.bairro) {
    query = query.ilike('bairro', `%${filters.bairro}%`);
  }

  if (filters.cidade) {
    query = query.ilike('cidade', `%${filters.cidade}%`);
  }

  if (filters.genero) {
    query = query.eq('genero', filters.genero);
  }

  if (filters.religiao) {
    query = query.eq('religiao', filters.religiao);
  }

  if (filters.profissao) {
    query = query.eq('profissao', filters.profissao);
  }

  if (filters.segmento_social) {
    query = query.eq('segmento_social', filters.segmento_social);
  }

  if (filters.lideranca) {
    query = query.eq('lideranca', filters.lideranca);
  }

  const nomeFilter = filters.nome?.trim();
  if (nomeFilter) {
    query = query.ilike('nome', `%${nomeFilter}%`);
  }

  const emailFilter = filters.email?.trim();
  if (emailFilter) {
    query = query.ilike('email', `%${emailFilter}%`);
  }

  const cpfFilter = filters.cpf?.trim();
  if (cpfFilter) {
    query = query.ilike('cpf', `%${cpfFilter}%`);
  }

  if (filters.interacao !== undefined) {
    query = query.eq('interacao', filters.interacao);
  }

  if (filters.atendido_instituto !== undefined) {
    query = query.eq('atendido_instituto', filters.atendido_instituto);
  }

  if (filters.atendido_demandas !== undefined) {
    query = query.eq('atendido_demandas', filters.atendido_demandas);
  }

  if (filters.participante_atividades !== undefined) {
    query = query.eq('participante_atividades', filters.participante_atividades);
  }

  if (filters.search) {
    query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%,cpf.eq.${filters.search}`);
  }

  try {
    const result = await query.order('created_at', { ascending: false });
    
    if (result.error) {
      throw handleSupabaseError(
        result.error,
        'Erro ao buscar eleitores com filtros'
      );
    }
    
    return { data: result.data, error: null };
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: null, error: err };
    }
    
    return {
      data: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao buscar eleitores com filtros',
        'database/search-error'
      )
    };
  }
} 

/**
 * Busca eleitores com paginação por cursor (keyset) - apenas ativos
 */
export async function fetchEleitoresKeyset(params: {
  limit?: number;
  cursor?: { created_at: string; id: string } | null;
  filters?: FiltrosEleitor;
}) {
  const { limit = 50, cursor, filters } = params || {};

  let query = supabase
    .from('eleitores')
    .select('*')
    .eq('is_active', 1) // Apenas ativos
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);

  // Filtros expandidos
  if (filters) {
    if (filters.regiao) query = query.eq('regiao', filters.regiao);
    if (filters.bairro) query = query.ilike('bairro', `%${filters.bairro}%`);
    if (filters.cidade) query = query.ilike('cidade', `%${filters.cidade}%`);
    if (filters.genero) query = query.eq('genero', filters.genero);
    if (filters.religiao) query = query.eq('religiao', filters.religiao);
    if (filters.profissao) query = query.eq('profissao', filters.profissao);
    if (filters.segmento_social) query = query.eq('segmento_social', filters.segmento_social);
    if (filters.lideranca) query = query.eq('lideranca', filters.lideranca);
    if (filters.interacao !== undefined) query = query.eq('interacao', filters.interacao);
    if (filters.atendido_instituto !== undefined) query = query.eq('atendido_instituto', filters.atendido_instituto);
    if (filters.atendido_demandas !== undefined) query = query.eq('atendido_demandas', filters.atendido_demandas);
    if (filters.participante_atividades !== undefined) query = query.eq('participante_atividades', filters.participante_atividades);
    const nomeFilter = filters.nome?.trim();
    if (nomeFilter) query = query.ilike('nome', `%${nomeFilter}%`);
    const emailFilter = filters.email?.trim();
    if (emailFilter) query = query.ilike('email', `%${emailFilter}%`);
    const cpfFilter = filters.cpf?.trim();
    if (cpfFilter) query = query.ilike('cpf', `%${cpfFilter}%`);
    if (filters.search) {
      query = query.or(
        `nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%,cpf.eq.${filters.search}`
      );
    }
  }

  // Cursor (created_at,id) keyset
  if (cursor && cursor.created_at && cursor.id) {
    query = query.or(
      `and(created_at.lt.${cursor.created_at}),and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    );
  }

  try {
    const result = await query;
    if (result.error) {
      throw handleSupabaseError(result.error, 'Erro ao buscar eleitores (keyset)');
    }

    const data = result.data || [];
    const last = data[data.length - 1] as Eleitor | undefined;
    const nextCursor = last && last.created_at && (last as any).id
      ? { created_at: String(last.created_at), id: String((last as any).id) }
      : null;

    return { data, nextCursor, error: null } as const;
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: [], nextCursor: null, error: err } as const;
    }
    return {
      data: [],
      nextCursor: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao buscar eleitores (keyset)',
        'database/keyset-error'
      )
    } as const;
  }
}

/**
 * Busca eleitores com paginação por página/tamanho (offset/range) - apenas ativos
 */
export async function fetchEleitoresPage(params: {
  page?: number; // 1-based
  pageSize?: number;
  filters?: FiltrosEleitor;
}) {
  const { page = 1, pageSize = 50, filters } = params || {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('eleitores')
    .select('*', { count: 'exact' })
    .eq('is_active', 1) // Apenas ativos
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters) {
    if (filters.regiao) query = query.eq('regiao', filters.regiao);
    if (filters.bairro) query = query.ilike('bairro', `%${filters.bairro}%`);
    if (filters.cidade) query = query.ilike('cidade', `%${filters.cidade}%`);
    if (filters.genero) query = query.eq('genero', filters.genero);
    if (filters.religiao) query = query.eq('religiao', filters.religiao);
    if (filters.profissao) query = query.eq('profissao', filters.profissao);
    if (filters.segmento_social) query = query.eq('segmento_social', filters.segmento_social);
    if (filters.lideranca) query = query.eq('lideranca', filters.lideranca);
    if (filters.interacao !== undefined) query = query.eq('interacao', filters.interacao);
    if (filters.atendido_instituto !== undefined) query = query.eq('atendido_instituto', filters.atendido_instituto);
    if (filters.atendido_demandas !== undefined) query = query.eq('atendido_demandas', filters.atendido_demandas);
    if (filters.participante_atividades !== undefined) query = query.eq('participante_atividades', filters.participante_atividades);
    const nomeFilter = filters.nome?.trim();
    if (nomeFilter) query = query.ilike('nome', `%${nomeFilter}%`);
    const emailFilter = filters.email?.trim();
    if (emailFilter) query = query.ilike('email', `%${emailFilter}%`);
    const cpfFilter = filters.cpf?.trim();
    if (cpfFilter) query = query.ilike('cpf', `%${cpfFilter}%`);
    if (filters.search) {
      query = query.or(
        `nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%,cpf.eq.${filters.search}`
      );
    }
  }

  try {
    const result = await query;
    if (result.error) {
      throw handleSupabaseError(result.error, 'Erro ao buscar eleitores (paginado)');
    }
    return { data: result.data || [], count: result.count || 0, error: null } as const;
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: [], count: 0, error: err } as const;
    }
    return {
      data: [],
      count: 0,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao buscar eleitores (paginado)',
        'database/page-error'
      )
    } as const;
  }
}

/**
 * Restaura um eleitor deletado (soft delete - marca como ativo novamente)
 */
export async function restoreEleitor(id: string) {
  try {
    if (!id) {
      throw new EleitoresError('ID do eleitor não fornecido para restauração', 'database/invalid-id');
    }
    
    const result = await supabase
      .from('eleitores')
      .update({ is_active: 1 })
      .eq('id', id)
      .eq('is_active', 0); // Apenas se estiver deletado
    
    if (result.error) {
      throw handleSupabaseError(
        result.error,
        `Erro ao restaurar eleitor com ID ${id}`
      );
    }
    
    return { data: result.data, error: null };
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: null, error: err };
    }
    
    return {
      data: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao restaurar eleitor',
        'database/restore-error'
      )
    };
  }
}

/**
 * Busca eleitores deletados (is_active = 0)
 */
export async function fetchDeletedEleitores() {
  try {
    const result = await supabase
      .from('eleitores')
      .select('*')
      .eq('is_active', 0)
      .order('updated_at', { ascending: false });
    
    if (result.error) {
      throw handleSupabaseError(
        result.error,
        'Erro ao buscar eleitores deletados'
      );
    }
    
    return { data: result.data, error: null };
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: null, error: err };
    }
    
    return {
      data: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao buscar eleitores deletados',
        'database/fetch-deleted-error'
      )
    };
  }
}

/**
 * Deleta permanentemente um eleitor (hard delete - remove do banco)
 * Use com cuidado! Esta ação é irreversível.
 */
export async function permanentDeleteEleitor(id: string) {
  try {
    if (!id) {
      throw new EleitoresError('ID do eleitor não fornecido para exclusão permanente', 'database/invalid-id');
    }
    
    const result = await supabase
      .from('eleitores')
      .delete()
      .eq('id', id);
    
    if (result.error) {
      throw handleSupabaseError(
        result.error,
        `Erro ao excluir permanentemente eleitor com ID ${id}`
      );
    }
    
    return { data: result.data, error: null };
  } catch (err) {
    if (err instanceof EleitoresError) {
      return { data: null, error: err };
    }
    
    return {
      data: null,
      error: new EleitoresError(
        err instanceof Error ? err.message : 'Erro desconhecido ao excluir permanentemente eleitor',
        'database/permanent-delete-error'
      )
    };
  }
}
