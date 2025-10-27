import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { fetchEleitorById, type Eleitor } from '../services/eleitores.service'
import ErrorMessage from '../components/ErrorMessage'
import './DetailPage.scss'

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<Eleitor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!id) {
        setError('ID não informado')
        setLoading(false)
        return
      }
      const { data, error } = await fetchEleitorById(id)
      if (error) {
        setError('Erro ao carregar detalhes do eleitor')
        setErrorDetails(error.message)
      } else {
        setData(data as Eleitor)
      }
      setLoading(false)
    }
    run()
  }, [id])

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-page__container">
          <div className="detail-page__header">
            <button type="button" className="detail-page__back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
          <div className="detail-page__loading">Carregando...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="detail-page">
        <div className="detail-page__container">
          <div className="detail-page__header">
            <button type="button" className="detail-page__back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
          <div className="detail-page__error">
            <ErrorMessage message={error} details={errorDetails || undefined} />
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="detail-page">
        <div className="detail-page__container">
          <div className="detail-page__header">
            <button type="button" className="detail-page__back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
          <div className="detail-page__empty">Nenhum dado encontrado.</div>
        </div>
      </div>
    )
  }

  const fmt = (v?: string | boolean | null) => {
    if (v === true) return 'Sim'
    if (v === false) return 'Não'
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) return '-'
    return String(v)
  }

  const formatDate = (v?: string | null) => {
    if (!v) return '-'
    const d = new Date(v)
    return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('pt-BR')
  }

  const renderBadge = (value: boolean) => (
    <span className={`detail-page__badge detail-page__badge--${value ? 'yes' : 'no'}`}>
      {value ? 'Sim' : 'Não'}
    </span>
  )

  const renderField = (label: string, value: string | boolean) => {
    const displayValue = typeof value === 'boolean' ? renderBadge(value) : (
      <span className={value === '-' ? 'detail-page__value--empty' : ''}>{value}</span>
    )
    
    return (
      <div className="detail-page__field">
        <span className="detail-page__label">{label}</span>
        <div className="detail-page__value">{displayValue}</div>
      </div>
    )
  }

  const renderPhoneField = (label: string, phone?: string) => {
    const handlePhoneClick = () => {
      if (!phone || !phone.trim() || phone === '-') return
      
      const cleanPhone = phone.replace(/\D/g, '')
      if (cleanPhone) {
        const whatsappUrl = `https://wa.me/55${cleanPhone}`
        window.open(whatsappUrl, '_blank')
      }
    }

    const hasPhone = phone && phone.trim() && phone !== '-'
    
    return (
      <div className="detail-page__field">
        <span className="detail-page__label">{label}</span>
        <div className="detail-page__value">
          {hasPhone ? (
            <span 
              className="detail-page__value--link" 
              onClick={handlePhoneClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handlePhoneClick()
                }
              }}
            >
              {phone}
            </span>
          ) : (
            <span className="detail-page__value--empty">-</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <div className="detail-page__container">
        <div className="detail-page__header">
          <button type="button" className="detail-page__back-button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Voltar
          </button>
          <h1 className="detail-page__title">Detalhes do Eleitor</h1>
        </div>

        <div className="detail-page__content">
          <section className="detail-page__section detail-page__section--personal">
            <h2 className="detail-page__section-title">Dados Pessoais</h2>
            <div className="detail-page__grid">
              {renderField('Nome', fmt(data.nome))}
              {renderField('E-mail', fmt(data.email))}
              {renderPhoneField('Telefone', data.telefone)}
              {renderField('Data de Nascimento', formatDate(data.data_nascimento || undefined))}
              {renderField('CPF', fmt(data.cpf))}
              {renderField('Gênero', fmt(data.genero))}
            </div>
          </section>

          <section className="detail-page__section detail-page__section--address">
            <h2 className="detail-page__section-title">Endereço</h2>
            <div className="detail-page__grid">
              {renderField('Rua', fmt(data.rua))}
              {renderField('Número', fmt(data.numero))}
              {renderField('Complemento', fmt(data.complemento))}
              {renderField('Bairro', fmt(data.bairro))}
              {renderField('CEP', fmt(data.cep))}
              {renderField('Região', fmt(data.regiao))}
              {renderField('Cidade', fmt(data.cidade))}
            </div>
          </section>

          <section className="detail-page__section detail-page__section--professional">
            <h2 className="detail-page__section-title">Religião e Profissão</h2>
            <div className="detail-page__grid">
              {renderField('Religião', fmt(data.religiao))}
              {renderField('Outra Religião', fmt(data.religiao_outra))}
              {renderField('Profissão', fmt(data.profissao))}
              {renderField('Outra Profissão', fmt(data.profissao_outra))}
              {renderField('Segmento Social', fmt(data.segmento_social))}
              {renderField('Outro Segmento Social', fmt(data.segmento_social_outro))}
              {renderField('Liderança', fmt(data.lideranca))}
              {renderField('Outra Liderança', fmt(data.lideranca_outra))}
              {renderField('Escola', fmt(data.escola))}
            </div>
          </section>

          <section className="detail-page__section detail-page__section--engagement">
            <h2 className="detail-page__section-title">Atendimentos e Participações</h2>
            <div className="detail-page__grid">
              {renderField('Atendido Instituto', data.atendido_instituto)}
              {renderField('Atendido Demandas', data.atendido_demandas)}
              {renderField('Participante de Atividades', data.participante_atividades)}
              {renderField('Data Instituto', formatDate(data.data_instituto || undefined))}
              {renderField('Data Demandas', formatDate(data.data_demandas || undefined))}
              {renderField('Data Atividades', formatDate(data.data_atividades || undefined))}
              {renderField('Interação', data.interacao)}
            </div>
          </section>

          <section className="detail-page__section detail-page__section--social">
            <h2 className="detail-page__section-title">Redes Sociais</h2>
            <div className="detail-page__grid">
              {renderField('Instagram', fmt(data.instagram))}
              {renderField('Facebook', fmt(data.facebook))}
              {renderField('TikTok', fmt(data.tiktok))}
            </div>
          </section>

          {data.observacoes && data.observacoes.trim() && (
            <section className="detail-page__section">
              <h2 className="detail-page__section-title">Observações</h2>
              <div className="detail-page__field">
                <div className="detail-page__value">{data.observacoes}</div>
              </div>
            </section>
          )}

          <section className="detail-page__section detail-page__section--metadata">
            <h2 className="detail-page__section-title">Metadados</h2>
            <div className="detail-page__grid">
              {renderField('Criado em', formatDate(data.created_at || undefined))}
              {renderField('Atualizado em', formatDate(data.updated_at || undefined))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
