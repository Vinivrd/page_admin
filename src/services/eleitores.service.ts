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
 * Busca todos os eleitores cadastrados
 */
export async function fetchEleitores() {
  return supabase
    .from('eleitores')
    .select('*')
    .order('created_at', { ascending: false });
}

/**
 * Busca um eleitor específico pelo ID
 */
export async function fetchEleitorById(id: string) {
  return supabase
    .from('eleitores')
    .select('*')
    .eq('id', id)
    .single();
}

/**
 * Adiciona um novo eleitor
 */
export async function addEleitor(eleitor: Omit<Eleitor, 'id' | 'created_at' | 'updated_at'>) {
  return supabase
    .from('eleitores')
    .insert([eleitor])
    .select();
}

/**
 * Atualiza um eleitor existente
 */
export async function updateEleitor(id: string, eleitor: Partial<Eleitor>) {
  return supabase
    .from('eleitores')
    .update(eleitor)
    .eq('id', id)
    .select();
}

/**
 * Remove um eleitor
 */
export async function deleteEleitor(id: string) {
  return supabase
    .from('eleitores')
    .delete()
    .eq('id', id);
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

  return query.order('created_at', { ascending: false });
} 