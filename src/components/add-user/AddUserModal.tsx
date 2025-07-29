import { useState } from 'react';
import { X } from 'lucide-react';
import './AddUserModal.scss';
import { addEleitor } from '../../services/eleitores.service';
import ErrorMessage from '../ErrorMessage';
import { EleitoresError } from '../../services/eleitores.service';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal = ({ isOpen, onClose }: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    regiao: '',
    cidade: '',
    bairro: '',
    cep: '',
    genero: '',
    religiao: '',
    escola: '',
    profissao: '',
    telefone: '',
    data_nascimento: '',
    cpf: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    observacoes: '',
    interacao: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{message: string, details?: string} | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    // Validação básica dos campos obrigatórios
    if (!formData.nome.trim()) {
      setError({ message: 'O nome é obrigatório.' });
      return false;
    }
    if (!formData.regiao) {
      setError({ message: 'A região é obrigatória.' });
      return false;
    }
    if (!formData.cidade.trim()) {
      setError({ message: 'A cidade é obrigatória.' });
      return false;
    }
    if (!formData.genero) {
      setError({ message: 'O gênero é obrigatório.' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data, error } = await addEleitor(formData);
      
      if (error) {
        throw error;
      }
      
      setSuccessMessage('Eleitor cadastrado com sucesso!');
      console.log('Eleitor cadastrado com sucesso:', data);
      
      // Resetar o formulário após o sucesso
      resetForm();
      
      // Fechar o modal após um pequeno delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Erro ao adicionar eleitor:', err);
      
      if (err instanceof EleitoresError) {
        // Mensagens de erro mais amigáveis baseadas no código
        let errorMessage = 'Erro ao adicionar eleitor';
        
        switch(err.code) {
          case 'database/duplicate-entry':
            errorMessage = 'Este eleitor já existe no sistema';
            break;
          case 'database/permission-denied':
            errorMessage = 'Você não tem permissão para adicionar eleitores';
            break;
          case 'database/timeout':
            errorMessage = 'Tempo esgotado. Verifique sua conexão';
            break;
        }
        
        setError({
          message: errorMessage,
          details: err.message
        });
      } else {
        setError({
          message: 'Erro ao adicionar eleitor. Tente novamente.',
          details: err instanceof Error ? err.message : 'Erro desconhecido'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      regiao: '',
      cidade: '',
      bairro: '',
      cep: '',
      genero: '',
      religiao: '',
      escola: '',
      profissao: '',
      telefone: '',
      data_nascimento: '',
      cpf: '',
      instagram: '',
      facebook: '',
      tiktok: '',
      observacoes: '',
      interacao: false,
    });
    setError(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Adicionar Eleitor</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <ErrorMessage 
            message={error.message}
            details={error.details}
            variant="error"
            onDismiss={() => setError(null)}
          />
        )}
        
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome*</label>
              <input 
                type="text" 
                id="nome" 
                name="nome" 
                value={formData.nome} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="regiao">Região*</label>
              <select 
                id="regiao" 
                name="regiao" 
                value={formData.regiao} 
                onChange={handleChange} 
                required
              >
                <option value="">Selecione</option>
                <option value="Norte">Norte</option>
                <option value="Sul">Sul</option>
                <option value="Leste">Leste</option>
                <option value="Oeste">Oeste</option>
                <option value="Centro">Centro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="cidade">Cidade*</label>
              <input 
                type="text" 
                id="cidade" 
                name="cidade" 
                value={formData.cidade} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bairro">Bairro</label>
              <input 
                type="text" 
                id="bairro" 
                name="bairro" 
                value={formData.bairro} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cep">CEP</label>
              <input 
                type="text" 
                id="cep" 
                name="cep" 
                value={formData.cep} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="genero">Gênero*</label>
              <select 
                id="genero" 
                name="genero" 
                value={formData.genero} 
                onChange={handleChange} 
                required
              >
                <option value="">Selecione</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="religiao">Religião</label>
              <input 
                type="text" 
                id="religiao" 
                name="religiao" 
                value={formData.religiao} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="escola">Escola</label>
              <input 
                type="text" 
                id="escola" 
                name="escola" 
                value={formData.escola} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="profissao">Profissão</label>
              <input 
                type="text" 
                id="profissao" 
                name="profissao" 
                value={formData.profissao} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input 
                type="tel" 
                id="telefone" 
                name="telefone" 
                value={formData.telefone} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="data_nascimento">Data de Nascimento</label>
              <input 
                type="date" 
                id="data_nascimento" 
                name="data_nascimento" 
                value={formData.data_nascimento} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input 
                type="text" 
                id="cpf" 
                name="cpf" 
                value={formData.cpf} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="form-group social-section">
              <h3>Redes Sociais</h3>
              
              <div className="social-inputs">
                <div className="social-input">
                  <label htmlFor="instagram">Instagram</label>
                  <input 
                    type="text" 
                    id="instagram" 
                    name="instagram" 
                    value={formData.instagram} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="social-input">
                  <label htmlFor="facebook">Facebook</label>
                  <input 
                    type="text" 
                    id="facebook" 
                    name="facebook" 
                    value={formData.facebook} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="social-input">
                  <label htmlFor="tiktok">TikTok</label>
                  <input 
                    type="text" 
                    id="tiktok" 
                    name="tiktok" 
                    value={formData.tiktok} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="observacoes">Observações</label>
              <textarea 
                id="observacoes" 
                name="observacoes" 
                value={formData.observacoes} 
                onChange={handleChange} 
                rows={3}
              />
            </div>
            
            <div className="form-group checkbox-group">
              <input 
                type="checkbox" 
                id="interacao" 
                name="interacao" 
                checked={formData.interacao} 
                onChange={handleChange} 
              />
              <label htmlFor="interacao">Interação</label>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={handleClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal; 