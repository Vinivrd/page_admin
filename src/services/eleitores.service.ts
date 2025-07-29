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