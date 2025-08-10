import { supabase } from './supabase';

export interface Eleitor {
  id?: string;
  regiao: string;
  bairro?: string;
  cep?: string;
  cidade: string;
  nome: string;
  email?: string;
  escola?: string;
  endereco?: string;
  telefone?: string;
  data_nascimento?: string;
  cpf?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  genero: string;
  religiao?: string;
  profissao?: string;
  observacoes?: string;
  interacao: boolean;
  created_at?: string;
  updated_at?: string;
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
 * Busca todos os eleitores cadastrados
 */
export async function fetchEleitores() {
  try {
    const result = await supabase
      .from('eleitores')
      .select('*')
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
 * Busca um eleitor específico pelo ID
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
      .single();
    
    if (result.error) {
      if (result.error.message?.includes('not found')) {
        throw new EleitoresError(`Eleitor com ID ${id} não encontrado`, 'database/not-found');
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
export async function addEleitor(eleitor: Omit<Eleitor, 'id' | 'created_at' | 'updated_at'>) {
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
export async function updateEleitor(id: string, eleitor: Partial<Eleitor>) {
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
 * Remove um eleitor
 */
export async function deleteEleitor(id: string) {
  try {
    if (!id) {
      throw new EleitoresError('ID do eleitor não fornecido para exclusão', 'database/invalid-id');
    }
    
    const result = await supabase
      .from('eleitores')
      .delete()
      .eq('id', id);
    
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

/**
 * Busca eleitores com filtros
 */
export async function searchEleitores(filters: {
  search?: string;
  regiao?: string;
  cidade?: string;
  genero?: string;
  religiao?: string;
  interacao?: boolean;
}) {
  let query = supabase.from('eleitores').select('*');

  // Aplicar filtros se fornecidos
  if (filters.regiao) {
    query = query.eq('regiao', filters.regiao);
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

  if (filters.interacao !== undefined) {
    query = query.eq('interacao', filters.interacao);
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
 * Busca eleitores com paginação por cursor (keyset)
 */
export async function fetchEleitoresKeyset(params: {
  limit?: number;
  cursor?: { created_at: string; id: string } | null;
  filters?: {
    search?: string;
    regiao?: string;
    cidade?: string;
    genero?: string;
    religiao?: string;
    interacao?: boolean;
  };
}) {
  const { limit = 50, cursor, filters } = params || {};

  let query = supabase
    .from('eleitores')
    .select('*')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);

  // Filtros
  if (filters) {
    if (filters.regiao) query = query.eq('regiao', filters.regiao);
    if (filters.cidade) query = query.ilike('cidade', `%${filters.cidade}%`);
    if (filters.genero) query = query.eq('genero', filters.genero);
    if (filters.religiao) query = query.eq('religiao', filters.religiao);
    if (filters.interacao !== undefined) query = query.eq('interacao', filters.interacao);
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
 * Busca eleitores com paginação por página/tamanho (offset/range)
 */
export async function fetchEleitoresPage(params: {
  page?: number; // 1-based
  pageSize?: number;
  filters?: {
    search?: string;
    regiao?: string;
    cidade?: string;
    genero?: string;
    religiao?: string;
    interacao?: boolean;
  };
}) {
  const { page = 1, pageSize = 50, filters } = params || {};
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('eleitores')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters) {
    if (filters.regiao) query = query.eq('regiao', filters.regiao);
    if (filters.cidade) query = query.ilike('cidade', `%${filters.cidade}%`);
    if (filters.genero) query = query.eq('genero', filters.genero);
    if (filters.religiao) query = query.eq('religiao', filters.religiao);
    if (filters.interacao !== undefined) query = query.eq('interacao', filters.interacao);
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