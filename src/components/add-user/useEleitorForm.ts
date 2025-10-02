import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { toast } from 'react-toastify'
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
} from '../../services/eleitores.service'
import {
  isValidGenero,
  isValidRegiao,
  isValidReligiao,
  isValidProfissao,
  isValidSegmentoSocial,
  isValidLideranca
} from '../../services/enums.utils'

export type EleitorFormData = {
  nome: string
  email: string
  telefone: string
  data_nascimento: string
  cpf: string
  genero: GeneroEnum | ''
  rua: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  regiao: RegiaoEnum | ''
  cidade: string
  religiao: ReligiaoEnum | ''
  religiao_outra: string
  escola: string
  profissao: ProfissaoEnum | ''
  profissao_outra: string
  segmento_social: SegmentoSocialEnum | ''
  segmento_social_outro: string
  lideranca: LiderancaEnum | ''
  lideranca_outra: string
  atendido_instituto: boolean
  atendido_demandas: boolean
  participante_atividades: boolean
  data_instituto: string
  data_demandas: string
  data_atividades: string
  instagram: string
  facebook: string
  tiktok: string
  observacoes: string
  interacao: boolean
}

export interface FormFeedbackError {
  message: string
  details?: string
}

export interface UseEleitorFormReturn {
  formData: EleitorFormData
  isSubmitting: boolean
  error: FormFeedbackError | null
  successMessage: string | null
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<boolean>
  dismissError: () => void
  clearSuccessMessage: () => void
  resetForm: (options?: { keepFeedback?: boolean }) => void
}

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
})

const formatDateToDisplay = (value?: string | null) => {
  if (!value) return ''
  const iso = value.includes('T') ? value.split('T')[0] : value
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) return ''
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
}

const maskDisplayDate = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

const parseDisplayDateToISO = (displayValue: string) => {
  const digits = displayValue.replace(/\D/g, '')
  if (digits.length !== 8) return undefined

  const day = digits.slice(0, 2)
  const month = digits.slice(2, 4)
  const year = digits.slice(4, 8)
  const iso = `${year}-${month}-${day}`
  const date = new Date(`${iso}T00:00:00`)

  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear().toString() !== year ||
    String(date.getUTCMonth() + 1).padStart(2, '0') !== month ||
    String(date.getUTCDate()).padStart(2, '0') !== day
  ) {
    return undefined
  }

  return iso
}

const trimOrEmpty = (value?: string | null) => value?.trim() ?? ''

const stringOrUndefined = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? trimmed : undefined
}

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
})

const buildEleitorPayload = (
  data: EleitorFormData
): Omit<Eleitor, 'id' | 'created_at' | 'updated_at'> => {
  const religiao = data.religiao ? (data.religiao as ReligiaoEnum) : undefined
  const profissao = data.profissao as ProfissaoEnum
  const segmento = data.segmento_social as SegmentoSocialEnum
  const lideranca = data.lideranca ? (data.lideranca as LiderancaEnum) : undefined
  const religiaoOutra = religiao === ReligiaoEnum.OUTRA ? stringOrUndefined(data.religiao_outra) : undefined
  const profissaoOutra = profissao === ProfissaoEnum.OUTRO ? stringOrUndefined(data.profissao_outra) : undefined
  const segmentoOutro = segmento === SegmentoSocialEnum.OUTRO ? stringOrUndefined(data.segmento_social_outro) : undefined
  const liderancaOutra = lideranca === LiderancaEnum.OUTRA ? stringOrUndefined(data.lideranca_outra) : undefined

  const dataNascimentoISO = parseDisplayDateToISO(data.data_nascimento)

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
  }
}

interface UseEleitorFormOptions {
  isOpen: boolean
  isEditing: boolean
  userToEdit?: Eleitor | null
}

const DATE_FIELDS = new Set(['data_nascimento', 'data_instituto', 'data_demandas', 'data_atividades'])

export const useEleitorForm = ({ isOpen, isEditing, userToEdit }: UseEleitorFormOptions): UseEleitorFormReturn => {
  const [formData, setFormData] = useState<EleitorFormData>(createEmptyFormData())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<FormFeedbackError | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const resetForm = useCallback((options?: { keepFeedback?: boolean }) => {
    setFormData(createEmptyFormData())
    if (!options?.keepFeedback) {
      setError(null)
      setSuccessMessage(null)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (isEditing && userToEdit) {
      setFormData(mapEleitorToFormData(userToEdit))
      setSuccessMessage(null)
      setError(null)
    } else {
      resetForm()
    }
  }, [isOpen, isEditing, userToEdit, resetForm])

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData(prev => {
      if (DATE_FIELDS.has(name)) {
        return {
          ...prev,
          [name]: maskDisplayDate(value)
        } as EleitorFormData
      }

      return { ...prev, [name]: value } as EleitorFormData
    })
  }, [])

  const handleSelectChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData(prev => {
      const next = { ...prev } as EleitorFormData

      switch (name) {
        case 'genero':
          next.genero = (value as GeneroEnum) || ''
          break
        case 'regiao':
          next.regiao = (value as RegiaoEnum) || ''
          break
        case 'religiao':
          next.religiao = (value as ReligiaoEnum) || ''
          if (value !== ReligiaoEnum.OUTRA) {
            next.religiao_outra = ''
          }
          break
        case 'profissao':
          next.profissao = (value as ProfissaoEnum) || ''
          if (value !== ProfissaoEnum.OUTRO) {
            next.profissao_outra = ''
          }
          break
        case 'segmento_social':
          next.segmento_social = (value as SegmentoSocialEnum) || ''
          if (value !== SegmentoSocialEnum.OUTRO) {
            next.segmento_social_outro = ''
          }
          break
        case 'lideranca':
          next.lideranca = (value as LiderancaEnum) || ''
          if (value !== LiderancaEnum.OUTRA) {
            next.lideranca_outra = ''
          }
          break
        default:
          ;(next as Record<string, unknown>)[name] = value
      }

      return next
    })
  }, [])

  const handleCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target

    setFormData(prev => {
      const next = { ...prev, [name]: checked } as EleitorFormData

      if (name === 'atendido_instituto' && !checked) {
        next.data_instituto = ''
      }
      if (name === 'atendido_demandas' && !checked) {
        next.data_demandas = ''
      }
      if (name === 'participante_atividades' && !checked) {
        next.data_atividades = ''
      }

      return next
    })
  }, [])

  const validateForm = useCallback(() => {
    const errors: string[] = []

    if (!formData.nome.trim()) {
      errors.push('O nome é obrigatório.')
    }

    if (!formData.regiao || !isValidRegiao(formData.regiao)) {
      errors.push('Selecione uma região válida.')
    }

    if (!formData.cidade.trim()) {
      errors.push('A cidade é obrigatória.')
    }

    if (!formData.genero || !isValidGenero(formData.genero)) {
      errors.push('Selecione um gênero válido.')
    }

    if (!formData.profissao || !isValidProfissao(formData.profissao)) {
      errors.push('Selecione uma profissão.')
    }

    if (!formData.segmento_social || !isValidSegmentoSocial(formData.segmento_social)) {
      errors.push('Selecione um segmento social.')
    }

    if (formData.religiao && !isValidReligiao(formData.religiao)) {
      errors.push('Selecione uma religião válida.')
    }

    if (formData.lideranca && !isValidLideranca(formData.lideranca)) {
      errors.push('Selecione uma liderança válida.')
    }

    if (formData.religiao === ReligiaoEnum.OUTRA && !formData.religiao_outra.trim()) {
      errors.push('Informe a religião quando "Outra" for selecionada.')
    }

    if (formData.profissao === ProfissaoEnum.OUTRO && !formData.profissao_outra.trim()) {
      errors.push('Informe a profissão quando "Outro" for selecionado.')
    }

    if (formData.segmento_social === SegmentoSocialEnum.OUTRO && !formData.segmento_social_outro.trim()) {
      errors.push('Informe o segmento social quando "Outro" for selecionado.')
    }

    if (formData.lideranca === LiderancaEnum.OUTRA && !formData.lideranca_outra.trim()) {
      errors.push('Informe a liderança quando "Outra" for selecionada.')
    }

    if (formData.data_nascimento.trim() && !parseDisplayDateToISO(formData.data_nascimento)) {
      errors.push('Informe a data de nascimento no formato DD/MM/AAAA.')
    }

    if (errors.length > 0) {
      setError({
        message: 'Corrija os campos obrigatórios.',
        details: errors.join('\n')
      })
      return false
    }

    setError(null)
    return true
  }, [formData])

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (!validateForm()) return false

      setIsSubmitting(true)
      setError(null)

      try {
        const payload = buildEleitorPayload(formData)

        if (isEditing) {
          if (!userToEdit?.id) {
            setError({
              message: 'ID do eleitor inválido para edição.',
              details: 'Não foi possível identificar o eleitor a ser atualizado.'
            })
            toast.error('ID do eleitor inválido para edição.', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true
            })
            return false
          }

          const result = await updateEleitor(userToEdit.id, payload)
          if (result.error) throw result.error

          setSuccessMessage('Eleitor atualizado com sucesso!')
          toast.success('Eleitor atualizado com sucesso!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        } else {
          const result = await addEleitor(payload)
          if (result.error) throw result.error

          setSuccessMessage('Eleitor cadastrado com sucesso!')
          toast.success('Eleitor cadastrado com sucesso!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        }

        resetForm({ keepFeedback: true })
        return true
      } catch (err) {
        console.error(`Erro ao ${isEditing ? 'atualizar' : 'adicionar'} eleitor:`, err)

        if (err instanceof EleitoresError) {
          let errorMessage = `Erro ao ${isEditing ? 'atualizar' : 'adicionar'} eleitor`

          switch (err.code) {
            case 'database/duplicate-entry':
              errorMessage = 'Este eleitor já existe no sistema'
              break
            case 'database/permission-denied':
              errorMessage = `Você não tem permissão para ${isEditing ? 'atualizar' : 'adicionar'} eleitores`
              break
            case 'database/timeout':
              errorMessage = 'Tempo esgotado. Verifique sua conexão'
              break
          }

          setError({
            message: errorMessage,
            details: err.message
          })

          toast.error(errorMessage, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        } else {
          const fallbackMessage = `Erro ao ${isEditing ? 'atualizar' : 'adicionar'} eleitor. Tente novamente.`

          setError({
            message: fallbackMessage,
            details: err instanceof Error ? err.message : 'Erro desconhecido'
          })

          toast.error(fallbackMessage, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          })
        }

        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, isEditing, resetForm, userToEdit, validateForm]
  )

  const dismissError = useCallback(() => setError(null), [])
  const clearSuccessMessage = useCallback(() => setSuccessMessage(null), [])

  return {
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
  }
}
