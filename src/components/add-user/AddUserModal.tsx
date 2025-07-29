import { useState } from 'react';
import { X } from 'lucide-react';
import './AddUserModal.scss';
import { addEleitor } from '../../services/eleitores.service';

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
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const { data, error } = await addEleitor(formData);
      
      if (error) {
        setError(`Erro ao cadastrar eleitor: ${error.message}`);
        return;
      }
      
      console.log('Eleitor cadastrado com sucesso:', data);
      onClose();
    } catch (err) {
      setError(`Erro ao cadastrar eleitor: ${err instanceof Error ? err.message : String(err)}`);
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
          <div className="error-message">
            {error}
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