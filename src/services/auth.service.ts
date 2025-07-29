import { supabase } from './supabase'

/**
 * Classe customizada de erro para autenticação
 */
export class AuthError extends Error {
  code: string;
  
  constructor(message: string, code: string = 'auth/unknown') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

/**
 * Realiza login com email e senha
 * @throws {AuthError} Se houver erro na autenticação
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      let code = 'auth/unknown';
      
      // Mapear códigos de erro do Supabase para códigos mais amigáveis
      if (error.message.includes('Invalid login credentials')) {
        code = 'auth/invalid-credentials';
      } else if (error.message.includes('Email not confirmed')) {
        code = 'auth/email-not-verified';
      } else if (error.message.includes('rate limit')) {
        code = 'auth/too-many-requests';
      }
      
      throw new AuthError(error.message, code);
    }
    
    return { data, error: null };
  } catch (err) {
    if (err instanceof AuthError) {
      throw err;
    }
    
    // Erros de rede ou outros erros inesperados
    throw new AuthError(
      err instanceof Error ? err.message : 'Erro desconhecido ao fazer login',
      'auth/network-error'
    );
  }
}

/**
 * Realiza logout do usuário
 * @throws {AuthError} Se houver erro ao fazer logout
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new AuthError(error.message, 'auth/signout-failed');
    }
    
    return { error: null };
  } catch (err) {
    throw new AuthError(
      err instanceof Error ? err.message : 'Erro ao fazer logout',
      'auth/signout-failed'
    );
  }
}

/**
 * Obtém a sessão atual do usuário
 * @throws {AuthError} Se houver erro ao obter a sessão
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new AuthError(error.message, 'auth/session-error');
    }
    
    return { data, error: null };
  } catch (err) {
    throw new AuthError(
      err instanceof Error ? err.message : 'Erro ao obter sessão',
      'auth/session-error'
    );
  }
} 