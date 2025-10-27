import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchEleitorById, type Eleitor } from '../services/eleitores.service'
import ErrorMessage from '../components/ErrorMessage'

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
      <div style={{ padding: '1.5rem' }}>
        <button type="button" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          Voltar
        </button>
        <div>Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <button type="button" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          Voltar
        </button>
        <ErrorMessage message={error} details={errorDetails || undefined} />
      </div>
    )
  }

  if (!data) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <button type="button" onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
          Voltar
        </button>
        <div>Nenhum dado encontrado.</div>
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

  return (
    <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
      <button type="button" onClick={() => navigate(-1)} style={{ width: 'fit-content' }}>
        Voltar
      </button>

      <h1>Detalhes do Eleitor</h1>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <h2>Dados Pessoais</h2>
        <div><strong>Nome:</strong> {fmt(data.nome)}</div>
        <div><strong>E-mail:</strong> {fmt(data.email)}</div>
        <div><strong>Telefone:</strong> {fmt(data.telefone)}</div>
        <div><strong>Data de Nascimento:</strong> {formatDate(data.data_nascimento || undefined)}</div>
        <div><strong>CPF:</strong> {fmt(data.cpf)}</div>
        <div><strong>Gênero:</strong> {fmt(data.genero)}</div>
      </section>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <h2>Endereço</h2>
        <div><strong>Rua:</strong> {fmt(data.rua)}</div>
        <div><strong>Número:</strong> {fmt(data.numero)}</div>
        <div><strong>Complemento:</strong> {fmt(data.complemento)}</div>
        <div><strong>Bairro:</strong> {fmt(data.bairro)}</div>
        <div><strong>CEP:</strong> {fmt(data.cep)}</div>
        <div><strong>Região:</strong> {fmt(data.regiao)}</div>
        <div><strong>Cidade:</strong> {fmt(data.cidade)}</div>
      </section>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <h2>Religião e Profissão</h2>
        <div><strong>Religião:</strong> {fmt(data.religiao)}</div>
        <div><strong>Outra Religião:</strong> {fmt(data.religiao_outra)}</div>
        <div><strong>Profissão:</strong> {fmt(data.profissao)}</div>
        <div><strong>Outra Profissão:</strong> {fmt(data.profissao_outra)}</div>
        <div><strong>Segmento Social:</strong> {fmt(data.segmento_social)}</div>
        <div><strong>Outro Segmento Social:</strong> {fmt(data.segmento_social_outro)}</div>
        <div><strong>Liderança:</strong> {fmt(data.lideranca)}</div>
        <div><strong>Outra Liderança:</strong> {fmt(data.lideranca_outra)}</div>
      </section>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <h2>Atendimentos e Participações</h2>
        <div><strong>Atendido Instituto:</strong> {fmt(data.atendido_instituto)}</div>
        <div><strong>Atendido Demandas:</strong> {fmt(data.atendido_demandas)}</div>
        <div><strong>Participante de Atividades:</strong> {fmt(data.participante_atividades)}</div>
        <div><strong>Data Instituto:</strong> {formatDate(data.data_instituto || undefined)}</div>
        <div><strong>Data Demandas:</strong> {formatDate(data.data_demandas || undefined)}</div>
        <div><strong>Data Atividades:</strong> {formatDate(data.data_atividades || undefined)}</div>
      </section>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <h2>Redes Sociais e Outros</h2>
        <div><strong>Instagram:</strong> {fmt(data.instagram)}</div>
        <div><strong>Facebook:</strong> {fmt(data.facebook)}</div>
        <div><strong>TikTok:</strong> {fmt(data.tiktok)}</div>
        <div><strong>Escola:</strong> {fmt(data.escola)}</div>
        <div><strong>Observações:</strong> {fmt(data.observacoes)}</div>
        <div><strong>Interação:</strong> {fmt(data.interacao)}</div>
      </section>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <h2>Metadados</h2>
        <div><strong>Criado em:</strong> {formatDate(data.created_at || undefined)}</div>
        <div><strong>Atualizado em:</strong> {formatDate(data.updated_at || undefined)}</div>
      </section>
    </div>
  )
}
