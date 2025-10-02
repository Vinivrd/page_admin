import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import './AddUserModal.scss'
import type { Eleitor } from '../../services/eleitores.service'
import { ReligiaoEnum, ProfissaoEnum, SegmentoSocialEnum, LiderancaEnum } from '../../services/eleitores.service'
import {
  REGIOES_OPTIONS,
  RELIGIOES_OPTIONS,
  PROFISSOES_OPTIONS,
  SEGMENTOS_SOCIAIS_OPTIONS,
  LIDERANCAS_OPTIONS,
  GENEROS_OPTIONS
} from '../../services/enums.utils'
import ErrorMessage from '../ErrorMessage'
import { useEleitorForm } from './useEleitorForm'
import type { UseEleitorFormReturn } from './useEleitorForm'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  userToEdit?: Eleitor | null
  isEditing?: boolean
}

const AddUserModal = ({ isOpen, onClose, userToEdit, isEditing = false }: AddUserModalProps) => {
  const [isClosing, setIsClosing] = useState(false)
  const closeTimeoutRef = useRef<number | null>(null)

  const {
    formData,
    isSubmitting,
    error,
    successMessage,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleSubmit,
    dismissError,
    clearSuccessMessage,
    resetForm
  } = useEleitorForm({ isOpen, isEditing, userToEdit })

  const handleCloseWithAnimation = useCallback(() => {
    setIsClosing(true)
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsClosing(false)
      resetForm()
      onClose()
    }, 300)
  }, [onClose, resetForm])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!successMessage) return
    const timerId = window.setTimeout(() => {
      setIsClosing(false)
      onClose()
      resetForm()
    }, 1600)

    return () => window.clearTimeout(timerId)
  }, [successMessage, onClose, resetForm])

  if (!isOpen) return null

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
            onDismiss={dismissError}
          />
        )}

        {successMessage && <SuccessMessage message={successMessage} onDismiss={clearSuccessMessage} />}

        <form onSubmit={handleSubmit} className="add-user-form">
          <EleitorFormGrid
            formData={formData}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onCheckboxChange={handleCheckboxChange}
          />

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={handleCloseWithAnimation}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface SuccessMessageProps {
  message: string
  onDismiss: () => void
}

const SuccessMessage = ({ message, onDismiss }: SuccessMessageProps) => (
  <div className="success-message" role="status">
    <span>{message}</span>
    <button type="button" className="success-message__dismiss" onClick={onDismiss}>
      Fechar
    </button>
  </div>
)

interface EleitorFormGridProps {
  formData: UseEleitorFormReturn['formData']
  onInputChange: UseEleitorFormReturn['handleInputChange']
  onSelectChange: UseEleitorFormReturn['handleSelectChange']
  onCheckboxChange: UseEleitorFormReturn['handleCheckboxChange']
}

const EleitorFormGrid = ({ formData, onInputChange, onSelectChange, onCheckboxChange }: EleitorFormGridProps) => (
  <div className="form-grid">
    <div className="form-group">
      <label htmlFor="nome">Nome*</label>
      <input type="text" id="nome" name="nome" value={formData.nome} onChange={onInputChange} required />
    </div>

    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" value={formData.email} onChange={onInputChange} />
    </div>

    <div className="form-group">
      <label htmlFor="telefone">Telefone</label>
      <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={onInputChange} />
    </div>

    <div className="form-group">
      <label htmlFor="data_nascimento">Data de Nascimento</label>
      <input
        type="text"
        id="data_nascimento"
        name="data_nascimento"
        inputMode="numeric"
        pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
        title="Formato: DD/MM/AAAA"
        placeholder="DD/MM/AAAA"
        value={formData.data_nascimento}
        onChange={onInputChange}
      />
    </div>

    <div className="form-group">
      <label htmlFor="cpf">CPF</label>
      <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={onInputChange} />
    </div>

    <div className="form-group">
      <label htmlFor="genero">Gênero*</label>
      <select id="genero" name="genero" value={formData.genero} onChange={onSelectChange} required>
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
      <input type="text" id="rua" name="rua" value={formData.rua} onChange={onInputChange} />
    </div>

    <div className="form-group">
      <label htmlFor="numero">Número</label>
      <input type="text" id="numero" name="numero" value={formData.numero} onChange={onInputChange} />
    </div>

    <div className="form-group">
      <label htmlFor="complemento">Complemento</label>
      <input type="text" id="complemento" name="complemento" value={formData.complemento} onChange={onInputChange} />
    </div>

    <div className="form-group">
      <label htmlFor="bairro">Bairro</label>
      <input type="text" id="bairro" name="bairro" value={formData.bairro} onChange={onInputChange} />
    </div>

    <div className="form-group">
      <label htmlFor="cep">CEP</label>
      <input type="text" id="cep" name="cep" value={formData.cep} onChange={onInputChange} />
    </div>

    <div className="form-group">
      <label htmlFor="cidade">Cidade*</label>
      <input type="text" id="cidade" name="cidade" value={formData.cidade} onChange={onInputChange} required />
    </div>

    <div className="form-group">
      <label htmlFor="regiao">Região*</label>
      <select id="regiao" name="regiao" value={formData.regiao} onChange={onSelectChange} required>
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
      <select id="religiao" name="religiao" value={formData.religiao} onChange={onSelectChange}>
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
          onChange={onInputChange}
          required
        />
      </div>
    )}

    <div className="form-group">
      <label htmlFor="profissao">Profissão*</label>
      <select id="profissao" name="profissao" value={formData.profissao} onChange={onSelectChange} required>
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
          onChange={onInputChange}
          required
        />
      </div>
    )}

    <div className="form-group">
      <label htmlFor="segmento_social">Segmento social*</label>
      <select id="segmento_social" name="segmento_social" value={formData.segmento_social} onChange={onSelectChange} required>
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
          onChange={onInputChange}
          required
        />
      </div>
    )}

    <div className="form-group">
      <label htmlFor="lideranca">Liderança</label>
      <select id="lideranca" name="lideranca" value={formData.lideranca} onChange={onSelectChange}>
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
          onChange={onInputChange}
          required
        />
      </div>
    )}

    <div className="form-group">
      <label htmlFor="escola">Escola</label>
      <input type="text" id="escola" name="escola" value={formData.escola} onChange={onInputChange} />
    </div>

    <div className="form-group social-section">
      <h3>Redes Sociais</h3>
      <div className="social-inputs">
        <div className="social-input">
          <label htmlFor="instagram">Instagram</label>
          <input type="text" id="instagram" name="instagram" value={formData.instagram} onChange={onInputChange} placeholder="Instagram" />
        </div>
        <div className="social-input">
          <label htmlFor="facebook">Facebook</label>
          <input type="text" id="facebook" name="facebook" value={formData.facebook} onChange={onInputChange} placeholder="Facebook" />
        </div>
        <div className="social-input">
          <label htmlFor="tiktok">TikTok</label>
          <input type="text" id="tiktok" name="tiktok" value={formData.tiktok} onChange={onInputChange} placeholder="TikTok" />
        </div>
      </div>
    </div>

    <div className="form-group full-width">
      <label htmlFor="observacoes">Observações</label>
      <textarea
        id="observacoes"
        name="observacoes"
        value={formData.observacoes}
        onChange={onInputChange}
        placeholder="Observações"
        rows={3}
      />
    </div>

    <div className="form-group checkbox-group">
      <input type="checkbox" id="interacao" name="interacao" checked={formData.interacao} onChange={onCheckboxChange} />
      <label htmlFor="interacao">Interação</label>
    </div>

    <AtendimentoCheckbox
      id="atendido_instituto"
      label="Atendido pelo Instituto"
      checked={formData.atendido_instituto}
      onCheckboxChange={onCheckboxChange}
    />

    <AtendimentoCheckbox
      id="atendido_demandas"
      label="Atendido por Demandas"
      checked={formData.atendido_demandas}
      onCheckboxChange={onCheckboxChange}
    />

    <AtendimentoCheckbox
      id="participante_atividades"
      label="Participa de Atividades"
      checked={formData.participante_atividades}
      onCheckboxChange={onCheckboxChange}
    />
  </div>
)

interface AtendimentoCheckboxProps {
  id: 'atendido_instituto' | 'atendido_demandas' | 'participante_atividades'
  label: string
  checked: boolean
  onCheckboxChange: UseEleitorFormReturn['handleCheckboxChange']
}

const AtendimentoCheckbox = ({ id, label, checked, onCheckboxChange }: AtendimentoCheckboxProps) => (
  <div className="form-group checkbox-group">
    <input type="checkbox" id={id} name={id} checked={checked} onChange={onCheckboxChange} />
    <label htmlFor={id}>{label}</label>
  </div>
)

export default AddUserModal
