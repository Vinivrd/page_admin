import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { X } from 'lucide-react';
import './AddUserModal.scss';
import {
  addEleitor,
  updateEleitor,
  EleitoresError,
  type Eleitor,
  RegiaoEnum,
  ReligiaoEnum,
  ProfissaoEnum,
  SegmentoSocialEnum,
  LiderancaEnum,
  GeneroEnum
} from '../../services/eleitores.service';
import {
  REGIOES_OPTIONS,
  RELIGIOES_OPTIONS,
  PROFISSOES_OPTIONS,
  SEGMENTOS_SOCIAIS_OPTIONS,
  LIDERANCAS_OPTIONS,
  GENEROS_OPTIONS,
  isValidGenero,
  isValidRegiao,
  isValidReligiao,
  isValidProfissao,
  isValidSegmentoSocial,
  isValidLideranca
} from '../../services/enums.utils';
import ErrorMessage from '../ErrorMessage';
import { toast } from 'react-toastify';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: Eleitor | null;
  isEditing?: boolean;
}

type EleitorFormData = {
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  cpf: string;
  genero: GeneroEnum | '';
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  regiao: RegiaoEnum | '';
  cidade: string;
  religiao: ReligiaoEnum | '';
  religiao_outra: string;
  escola: string;
  profissao: ProfissaoEnum | '';
  profissao_outra: string;
  segmento_social: SegmentoSocialEnum | '';
  segmento_social_outro: string;
  lideranca: LiderancaEnum | '';
  lideranca_outra: string;
  atendido_instituto: boolean;
  atendido_demandas: boolean;
  participante_atividades: boolean;
  data_instituto: string;
  data_demandas: string;
  data_atividades: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  observacoes: string;
  interacao: boolean;
};

const createEmptyFormData = (): EleitorFormData => ({
  nome: '',
  email: '',
  telefone: '',
  data_nascimento: '',
  cpf: '',
  genero: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cep: '',
  regiao: '',
  cidade: '',
  religiao: '',
  religiao_outra: '',
  escola: '',
  profissao: '',
  profissao_outra: '',
  segmento_social: '',
  segmento_social_outro: '',
  lideranca: '',
  lideranca_outra: '',
  atendido_instituto: false,
  atendido_demandas: false,
  participante_atividades: false,
  data_instituto: '',
  data_demandas: '',
  data_atividades: '',
  instagram: '',
  facebook: '',
  tiktok: '',
  observacoes: '',
  interacao: false
});

const formatDateToDisplay = (value?: string | null) => {
  if (!value) return '';
  const iso = value.includes('T') ? value.split('T')[0] : value;
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return '';
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

const maskDisplayDate = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const parseDisplayDateToISO = (displayValue: string) => {
  const digits = displayValue.replace(/\D/g, '');
  if (digits.length !== 8) return undefined;

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  const iso = `${year}-${month}-${day}`;
  const date = new Date(`${iso}T00:00:00`);

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear().toString() !== year ||
    String(date.getUTCMonth() + 1).padStart(2, '0') !== month ||
    String(date.getUTCDate()).padStart(2, '0') !== day
  ) {
    return undefined;
  }

  return iso;
};

const trimOrEmpty = (value?: string | null) => value?.trim() ?? '';

const stringOrUndefined = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const mapEleitorToFormData = (eleitor: Eleitor): EleitorFormData => ({
  nome: trimOrEmpty(eleitor.nome),
  email: trimOrEmpty(eleitor.email),
  telefone: trimOrEmpty(eleitor.telefone),
  data_nascimento: formatDateToDisplay(eleitor.data_nascimento),
  cpf: trimOrEmpty(eleitor.cpf),
  genero: eleitor.genero ?? '',
  rua: trimOrEmpty(eleitor.rua),
  numero: trimOrEmpty(eleitor.numero),
  complemento: trimOrEmpty(eleitor.complemento),
  bairro: trimOrEmpty(eleitor.bairro),
  cep: trimOrEmpty(eleitor.cep),
  regiao: eleitor.regiao ?? '',
  cidade: trimOrEmpty(eleitor.cidade),
  religiao: eleitor.religiao ?? '',
  religiao_outra: trimOrEmpty(eleitor.religiao_outra),
  escola: trimOrEmpty(eleitor.escola),
  profissao: eleitor.profissao ?? '',
  profissao_outra: trimOrEmpty(eleitor.profissao_outra),
  segmento_social: eleitor.segmento_social ?? '',
  segmento_social_outro: trimOrEmpty(eleitor.segmento_social_outro),
  lideranca: eleitor.lideranca ?? '',
  lideranca_outra: trimOrEmpty(eleitor.lideranca_outra),
  atendido_instituto: Boolean(eleitor.atendido_instituto),
  atendido_demandas: Boolean(eleitor.atendido_demandas),
  participante_atividades: Boolean(eleitor.participante_atividades),
  data_instituto: formatDateToDisplay(eleitor.data_instituto),
  data_demandas: formatDateToDisplay(eleitor.data_demandas),
  data_atividades: formatDateToDisplay(eleitor.data_atividades),
  instagram: trimOrEmpty(eleitor.instagram),
  facebook: trimOrEmpty(eleitor.facebook),
  tiktok: trimOrEmpty(eleitor.tiktok),
  observacoes: trimOrEmpty(eleitor.observacoes),
  interacao: Boolean(eleitor.interacao)
});

const buildEleitorPayload = (
  data: EleitorFormData
): Omit<Eleitor, 'id' | 'created_at' | 'updated_at'> => {
  const religiao = data.religiao ? (data.religiao as ReligiaoEnum) : undefined;
  const profissao = data.profissao as ProfissaoEnum;
  const segmento = data.segmento_social as SegmentoSocialEnum;
  const lideranca = data.lideranca ? (data.lideranca as LiderancaEnum) : undefined;
  const religiaoOutra = religiao === ReligiaoEnum.OUTRA ? stringOrUndefined(data.religiao_outra) : undefined;
  const profissaoOutra = profissao === ProfissaoEnum.OUTRO ? stringOrUndefined(data.profissao_outra) : undefined;
  const segmentoOutro = segmento === SegmentoSocialEnum.OUTRO ? stringOrUndefined(data.segmento_social_outro) : undefined;
  const liderancaOutra = lideranca === LiderancaEnum.OUTRA ? stringOrUndefined(data.lideranca_outra) : undefined;

  const dataNascimentoISO = parseDisplayDateToISO(data.data_nascimento);

  return {
    nome: data.nome.trim(),
    email: stringOrUndefined(data.email),
    telefone: stringOrUndefined(data.telefone),
    data_nascimento: dataNascimentoISO,
    cpf: stringOrUndefined(data.cpf),
    genero: data.genero as GeneroEnum,
    rua: stringOrUndefined(data.rua),
    numero: stringOrUndefined(data.numero),
    complemento: stringOrUndefined(data.complemento),
    bairro: stringOrUndefined(data.bairro),
    cep: stringOrUndefined(data.cep),
    regiao: data.regiao as RegiaoEnum,
    cidade: data.cidade.trim(),
    religiao,
    religiao_outra: religiaoOutra,
    escola: stringOrUndefined(data.escola),
    profissao,
    profissao_outra: profissaoOutra,
    segmento_social: segmento,
    segmento_social_outro: segmentoOutro,
    lideranca,
    lideranca_outra: liderancaOutra,
    atendido_instituto: data.atendido_instituto,
    atendido_demandas: data.atendido_demandas,
    participante_atividades: data.participante_atividades,
    data_instituto: parseDisplayDateToISO(data.data_instituto),
    data_demandas: parseDisplayDateToISO(data.data_demandas),
    data_atividades: parseDisplayDateToISO(data.data_atividades),
    instagram: stringOrUndefined(data.instagram),
    facebook: stringOrUndefined(data.facebook),
    tiktok: stringOrUndefined(data.tiktok),
    observacoes: stringOrUndefined(data.observacoes),
    interacao: data.interacao
  };
};

const AddUserModal = ({ isOpen, onClose, userToEdit, isEditing = false }: AddUserModalProps) => {
  const [formData, setFormData] = useState<EleitorFormData>(createEmptyFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{message: string, details?: string} | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  // Preencher ou resetar o formulário quando o modal é aberto
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (isEditing && userToEdit) {
      setFormData(mapEleitorToFormData(userToEdit));
    } else {
      setFormData(createEmptyFormData());
    }
  }, [isOpen, isEditing, userToEdit]);

  // Limpar timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'data_nascimento') {
      const masked = maskDisplayDate(value);
      setFormData(prev => ({
        ...prev,
        data_nascimento: masked
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const next = { ...prev } as EleitorFormData;

      switch (name) {
        case 'genero':
          next.genero = (value as GeneroEnum) || '';
          break;
        case 'regiao':
          next.regiao = (value as RegiaoEnum) || '';
          break;
        case 'religiao':
          next.religiao = (value as ReligiaoEnum) || '';
          if (value !== ReligiaoEnum.OUTRA) {
            next.religiao_outra = '';
          }
          break;
        case 'profissao':
          next.profissao = (value as ProfissaoEnum) || '';
          if (value !== ProfissaoEnum.OUTRO) {
            next.profissao_outra = '';
          }
          break;
        case 'segmento_social':
          next.segmento_social = (value as SegmentoSocialEnum) || '';
          if (value !== SegmentoSocialEnum.OUTRO) {
            next.segmento_social_outro = '';
          }
          break;
        case 'lideranca':
          next.lideranca = (value as LiderancaEnum) || '';
          if (value !== LiderancaEnum.OUTRA) {
            next.lideranca_outra = '';
          }
          break;
        default:
          (next as any)[name] = value;
      }

      return next;
    });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData(prev => {
      const next = { ...prev, [name]: checked } as EleitorFormData;

      if (name === 'atendido_instituto' && !checked) {
        next.data_instituto = '';
      }
      if (name === 'atendido_demandas' && !checked) {
        next.data_demandas = '';
      }
      if (name === 'participante_atividades' && !checked) {
        next.data_atividades = '';
      }

      return next;
    });
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.nome.trim()) {
      errors.push('O nome é obrigatório.');
    }

    if (!formData.regiao || !isValidRegiao(formData.regiao)) {
      errors.push('Selecione uma região válida.');
    }

    if (!formData.cidade.trim()) {
      errors.push('A cidade é obrigatória.');
    }

    if (!formData.genero || !isValidGenero(formData.genero)) {
      errors.push('Selecione um gênero válido.');
    }

    if (!formData.profissao || !isValidProfissao(formData.profissao)) {
      errors.push('Selecione uma profissão.');
    }

    if (!formData.segmento_social || !isValidSegmentoSocial(formData.segmento_social)) {
      errors.push('Selecione um segmento social.');
    }

    if (formData.religiao && !isValidReligiao(formData.religiao)) {
      errors.push('Selecione uma religião válida.');
    }

    if (formData.lideranca && !isValidLideranca(formData.lideranca)) {
      errors.push('Selecione uma liderança válida.');
    }

    if (formData.religiao === ReligiaoEnum.OUTRA && !formData.religiao_outra.trim()) {
      errors.push('Informe a religião quando "Outra" for selecionada.');
    }

    if (formData.profissao === ProfissaoEnum.OUTRO && !formData.profissao_outra.trim()) {
      errors.push('Informe a profissão quando "Outro" for selecionado.');
    }

    if (formData.segmento_social === SegmentoSocialEnum.OUTRO && !formData.segmento_social_outro.trim()) {
      errors.push('Informe o segmento social quando "Outro" for selecionado.');
    }

    if (formData.lideranca === LiderancaEnum.OUTRA && !formData.lideranca_outra.trim()) {
      errors.push('Informe a liderança quando "Outra" for selecionada.');
    }

    if (formData.data_nascimento.trim() && !parseDisplayDateToISO(formData.data_nascimento)) {
      errors.push('Informe a data de nascimento no formato DD/MM/AAAA.');
    }

    if (errors.length > 0) {
      setError({
        message: 'Corrija os campos obrigatórios.',
        details: errors.join('\n')
      });
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      let result;
      const payload = buildEleitorPayload(formData);
      
      if (isEditing && userToEdit?.id) {
        // Atualizar eleitor existente
        result = await updateEleitor(userToEdit.id, payload);
        if (result.error) throw result.error;
        
        setSuccessMessage('Eleitor atualizado com sucesso!');
        toast.success('Eleitor atualizado com sucesso!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        console.log('Eleitor atualizado com sucesso:', result.data);
      } else {
        // Adicionar novo eleitor
        result = await addEleitor(payload);
        if (result.error) throw result.error;
        
        setSuccessMessage('Eleitor cadastrado com sucesso!');
        toast.success('Eleitor cadastrado com sucesso!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        console.log('Eleitor cadastrado com sucesso:', result.data);
      }
      
      // Resetar o formulário após o sucesso
      resetForm();
      
      // Fechar o modal após um pequeno delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        handleCloseWithAnimation();
      }, 1500);
    } catch (err) {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'adicionar'} eleitor:`, err);
      
      if (err instanceof EleitoresError) {
        // Mensagens de erro mais amigáveis baseadas no código
        let errorMessage = `Erro ao ${isEditing ? 'atualizar' : 'adicionar'} eleitor`;
        
        switch(err.code) {
          case 'database/duplicate-entry':
            errorMessage = 'Este eleitor já existe no sistema';
            break;
          case 'database/permission-denied':
            errorMessage = `Você não tem permissão para ${isEditing ? 'atualizar' : 'adicionar'} eleitores`;
            break;
          case 'database/timeout':
            errorMessage = 'Tempo esgotado. Verifique sua conexão';
            break;
        }
        
        setError({
          message: errorMessage,
          details: err.message
        });
        
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const errorMsg = `Erro ao ${isEditing ? 'atualizar' : 'adicionar'} eleitor. Tente novamente.`;
        setError({
          message: errorMsg,
          details: err instanceof Error ? err.message : 'Erro desconhecido'
        });
        
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(createEmptyFormData());
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseWithAnimation = () => {
    setIsClosing(true);
    // Aguardar a animação terminar antes de fechar o modal
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsClosing(false);
      resetForm();
      onClose();
    }, 300); // Tempo da animação em ms
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`}>
      <div className={`modal-container ${isClosing ? 'closing' : ''}`}>
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Eleitor' : 'Adicionar Eleitor'}</h2>
          <button className="close-button" onClick={handleCloseWithAnimation}>
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="data_nascimento">Data de Nascimento</label>
              <input
                type="date"
                id="data_nascimento"
                name="data_nascimento"
                lang="pt-BR"
                value={formData.data_nascimento}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="genero">Gênero*</label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleSelectChange}
                required
              >
                <option value="">Selecione</option>
                {GENEROS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="rua">Rua</label>
              <input
                type="text"
                id="rua"
                name="rua"
                value={formData.rua}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="numero">Número</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="complemento">Complemento</label>
              <input
                type="text"
                id="complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bairro">Bairro</label>
              <input
                type="text"
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cep">CEP</label>
              <input
                type="text"
                id="cep"
                name="cep"
                value={formData.cep}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cidade">Cidade*</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="regiao">Região*</label>
              <select
                id="regiao"
                name="regiao"
                value={formData.regiao}
                onChange={handleSelectChange}
                required
              >
                <option value="">Selecione</option>
                {REGIOES_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="religiao">Religião</label>
              <select
                id="religiao"
                name="religiao"
                value={formData.religiao}
                onChange={handleSelectChange}
              >
                <option value="">Selecione</option>
                {RELIGIOES_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.religiao === ReligiaoEnum.OUTRA && (
              <div className="form-group">
                <label htmlFor="religiao_outra">Qual religião?</label>
                <input
                  type="text"
                  id="religiao_outra"
                  name="religiao_outra"
                  value={formData.religiao_outra}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="profissao">Profissão*</label>
              <select
                id="profissao"
                name="profissao"
                value={formData.profissao}
                onChange={handleSelectChange}
                required
              >
                <option value="">Selecione</option>
                {PROFISSOES_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.profissao === ProfissaoEnum.OUTRO && (
              <div className="form-group">
                <label htmlFor="profissao_outra">Qual profissão?</label>
                <input
                  type="text"
                  id="profissao_outra"
                  name="profissao_outra"
                  value={formData.profissao_outra}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="segmento_social">Segmento social*</label>
              <select
                id="segmento_social"
                name="segmento_social"
                value={formData.segmento_social}
                onChange={handleSelectChange}
                required
              >
                <option value="">Selecione</option>
                {SEGMENTOS_SOCIAIS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.segmento_social === SegmentoSocialEnum.OUTRO && (
              <div className="form-group">
                <label htmlFor="segmento_social_outro">Qual segmento?</label>
                <input
                  type="text"
                  id="segmento_social_outro"
                  name="segmento_social_outro"
                  value={formData.segmento_social_outro}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="lideranca">Liderança</label>
              <select
                id="lideranca"
                name="lideranca"
                value={formData.lideranca}
                onChange={handleSelectChange}
              >
                <option value="">Selecione</option>
                {LIDERANCAS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.lideranca === LiderancaEnum.OUTRA && (
              <div className="form-group">
                <label htmlFor="lideranca_outra">Qual liderança?</label>
                <input
                  type="text"
                  id="lideranca_outra"
                  name="lideranca_outra"
                  value={formData.lideranca_outra}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="escola">Escola</label>
              <input
                type="text"
                id="escola"
                name="escola"
                value={formData.escola}
                onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    placeholder="Instagram"
                  />
                </div>

                <div className="social-input">
                  <label htmlFor="facebook">Facebook</label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="Facebook"
                  />
                </div>

                <div className="social-input">
                  <label htmlFor="tiktok">TikTok</label>
                  <input
                    type="text"
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleInputChange}
                    placeholder="TikTok"
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
                onChange={handleInputChange}
                placeholder="Observações"
                rows={3}
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="interacao"
                name="interacao"
                checked={formData.interacao}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="interacao">Interação</label>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="atendido_instituto"
                name="atendido_instituto"
                checked={formData.atendido_instituto}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="atendido_instituto">Atendido pelo Instituto</label>
              <input
                type="date"
                id="data_instituto"
                name="data_instituto"
                value={formData.data_instituto}
                onChange={handleInputChange}
                disabled={!formData.atendido_instituto}
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="atendido_demandas"
                name="atendido_demandas"
                checked={formData.atendido_demandas}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="atendido_demandas">Atendido por Demandas</label>
              <input
                type="date"
                id="data_demandas"
                name="data_demandas"
                value={formData.data_demandas}
                onChange={handleInputChange}
                disabled={!formData.atendido_demandas}
              />
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="participante_atividades"
                name="participante_atividades"
                checked={formData.participante_atividades}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="participante_atividades">Participa de Atividades</label>
              <input
                type="date"
                id="data_atividades"
                name="data_atividades"
                value={formData.data_atividades}
                onChange={handleInputChange}
                disabled={!formData.participante_atividades}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={handleCloseWithAnimation}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal; 