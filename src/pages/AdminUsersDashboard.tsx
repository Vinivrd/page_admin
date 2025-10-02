import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import BooleanFilter from '../components/filtros/BooleanFilter';
import UserRow from '../components/UserRow';
import '../styles/dashboard.scss';
import { fetchEleitores } from '../services/eleitores.service';
import type { Eleitor } from '../services/eleitores.service';
import {
  REGIOES_OPTIONS,
  GENEROS_OPTIONS,
  RELIGIOES_OPTIONS,
  PROFISSOES_OPTIONS,
  SEGMENTOS_SOCIAIS_OPTIONS,
  LIDERANCAS_OPTIONS,
  FILTROS_BOOLEAN_OPTIONS
} from '../services/enums.utils';

type BooleanFilterValue = '' | 'true' | 'false';

interface FiltersState {
  regiao: string;
  interacao: BooleanFilterValue;
  genero: string;
  cidade: string;
  search: string;
  religiao: string;
  profissao: string;
  segmento_social: string;
  lideranca: string;
  atendido_instituto: BooleanFilterValue;
  atendido_demandas: BooleanFilterValue;
  participante_atividades: BooleanFilterValue;
}

const initialFilters: FiltersState = {
  regiao: '',
  interacao: '',
  genero: '',
  cidade: '',
  search: '',
  religiao: '',
  profissao: '',
  segmento_social: '',
  lideranca: '',
  atendido_instituto: '',
  atendido_demandas: '',
  participante_atividades: ''
};

const AdminUsersDashboard = () => {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await fetchEleitores();
      if (error) {
        setError(error.message);
      } else {
        setEleitores(data || []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const parseBooleanFilter = (value: BooleanFilterValue) => {
    if (value === '') return undefined;
    return value === 'true';
  };

  const filteredEleitores = useMemo(() => {
    return eleitores.filter(e => {
      const matchesRegiao = !filters.regiao || e.regiao === filters.regiao;
      const matchesInteracao = parseBooleanFilter(filters.interacao) === undefined
        || e.interacao === parseBooleanFilter(filters.interacao);
      const matchesGenero = !filters.genero || e.genero === filters.genero;
      const matchesCidade = !filters.cidade || e.cidade.toLowerCase().includes(filters.cidade.toLowerCase());
      const matchesReligiao = !filters.religiao || e.religiao === filters.religiao;
      const matchesProfissao = !filters.profissao || e.profissao === filters.profissao;
      const matchesSegmento = !filters.segmento_social || e.segmento_social === filters.segmento_social;
      const matchesLideranca = !filters.lideranca || e.lideranca === filters.lideranca;
      const matchesAtendidoInstituto = parseBooleanFilter(filters.atendido_instituto) === undefined
        || e.atendido_instituto === parseBooleanFilter(filters.atendido_instituto);
      const matchesAtendidoDemandas = parseBooleanFilter(filters.atendido_demandas) === undefined
        || e.atendido_demandas === parseBooleanFilter(filters.atendido_demandas);
      const matchesParticipanteAtividades = parseBooleanFilter(filters.participante_atividades) === undefined
        || e.participante_atividades === parseBooleanFilter(filters.participante_atividades);
      const matchesSearch = !filters.search ||
        e.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        (e.email?.toLowerCase().includes(filters.search.toLowerCase())) ||
        (e.cpf?.includes(filters.search));

      return (
        matchesRegiao &&
        matchesInteracao &&
        matchesGenero &&
        matchesCidade &&
        matchesReligiao &&
        matchesProfissao &&
        matchesSegmento &&
        matchesLideranca &&
        matchesAtendidoInstituto &&
        matchesAtendidoDemandas &&
        matchesParticipanteAtividades &&
        matchesSearch
      );
    });
  }, [eleitores, filters]);

  const totalPages = Math.ceil(filteredEleitores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEleitores = filteredEleitores.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  // const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Painel Administrativo</h1>
        <p>Gerenciamento de usuários e dados</p>
      </div>

      <div className="dashboard__filters">
        <div className="filters__header">
          <Filter />
          <span>Filtros</span>
        </div>
        <div className="filters__controls">
          <div className="filter-group">
            <label>Região</label>
            <select value={filters.regiao} onChange={e => handleFilterChange('regiao', e.target.value)}>
              <option value="">Todas</option>
              {REGIOES_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Gênero</label>
            <select value={filters.genero} onChange={e => handleFilterChange('genero', e.target.value)}>
              <option value="">Todos</option>
              {GENEROS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Religião</label>
            <select value={filters.religiao} onChange={e => handleFilterChange('religiao', e.target.value)}>
              <option value="">Todas</option>
              {RELIGIOES_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Profissão</label>
            <select value={filters.profissao} onChange={e => handleFilterChange('profissao', e.target.value)}>
              <option value="">Todas</option>
              {PROFISSOES_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Segmento social</label>
            <select value={filters.segmento_social} onChange={e => handleFilterChange('segmento_social', e.target.value)}>
              <option value="">Todos</option>
              {SEGMENTOS_SOCIAIS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Liderança</label>
            <select value={filters.lideranca} onChange={e => handleFilterChange('lideranca', e.target.value)}>
              <option value="">Todas</option>
              {LIDERANCAS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Interação</label>
            <BooleanFilter label="Interação" value={filters.interacao} onChange={(val: string) => handleFilterChange('interacao', val)} options={FILTROS_BOOLEAN_OPTIONS} />
          </div>
          <div className="filter-group">
            <label>Atendido pelo Instituto</label>
            <BooleanFilter label="Atendido pelo Instituto" value={filters.atendido_instituto} onChange={(val: string) => handleFilterChange('atendido_instituto', val)} options={FILTROS_BOOLEAN_OPTIONS} />
          </div>
          <div className="filter-group">
            <label>Atendido por Demandas</label>
            <BooleanFilter label="Atendido por Demandas" value={filters.atendido_demandas} onChange={(val: string) => handleFilterChange('atendido_demandas', val)} options={FILTROS_BOOLEAN_OPTIONS} />
          </div>
          <div className="filter-group">
            <label>Participa de Atividades</label>
            <BooleanFilter label="Participa de Atividades" value={filters.participante_atividades} onChange={(val: string) => handleFilterChange('participante_atividades', val)} options={FILTROS_BOOLEAN_OPTIONS} />
          </div>
          <div className="filter-group">
            <label>Cidade</label>
            <input type="text" value={filters.cidade} onChange={e => handleFilterChange('cidade', e.target.value)} placeholder="Digite a cidade" />
          </div>
          <div className="filter-group">
            <label>Buscar</label>
            <div className="search-wrapper">
              <Search />
              <input type="text" value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} placeholder="Nome, email ou CPF" />
            </div>
          </div>
        </div>
        <div className="filters__actions">
          <button type="button" onClick={clearFilters}>Limpar filtros</button>
          <button type="button" className="export">
            <Download /> Exportar
          </button>
        </div>
      </div>

      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="value">{filteredEleitores.length}</div>
          <div className="label">Total de usuários</div>
        </div>
        <div className="stat-card">
          <div className="value">{filteredEleitores.filter(u => u.interacao).length}</div>
          <div className="label">Com interação</div>
        </div>
        <div className="stat-card">
          <div className="value">{filteredEleitores.filter(u => !u.interacao).length}</div>
          <div className="label">Sem interação</div>
        </div>
        <div className="stat-card">
          <div className="value">{new Set(filteredEleitores.map(u => u.regiao)).size}</div>
          <div className="label">Regiões ativas</div>
        </div>
      </div>

      <div className="dashboard__table">
        <table>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Região/Cidade</th>
              <th>Contato</th>
              <th>Profissão</th>
              <th>Segmento</th>
              <th>Religião</th>
              <th>Liderança</th>
              <th>Atendimentos</th>
              <th>Interação</th>
              <th>Data Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}>Carregando...</td></tr>
            ) : error ? (
              <tr><td colSpan={7}>Erro ao carregar: {error}</td></tr>
            ) : paginatedEleitores.length === 0 ? (
              <tr><td colSpan={7}>Nenhum eleitor encontrado</td></tr>
            ) : (
              paginatedEleitores.map(e => (
                <UserRow
                  key={e.id}
                  user={{
                    id: e.id || '',
                    nome: e.nome,
                    email: e.email,
                    cpf: e.cpf,
                    regiao: e.regiao,
                    cidade: e.cidade,
                    genero: e.genero,
                    bairro: e.bairro,
                    telefone: e.telefone,
                    instagram: e.instagram,
                    facebook: e.facebook,
                    tiktok: e.tiktok,
                    religiao: e.religiao,
                    religiao_outra: e.religiao_outra,
                    observacoes: e.observacoes,
                    profissao: e.profissao,
                    profissao_outra: e.profissao_outra,
                    segmento_social: e.segmento_social,
                    segmento_social_outro: e.segmento_social_outro,
                    lideranca: e.lideranca,
                    lideranca_outra: e.lideranca_outra,
                    atendido_instituto: e.atendido_instituto,
                    atendido_demandas: e.atendido_demandas,
                    participante_atividades: e.participante_atividades,
                    data_instituto: e.data_instituto,
                    data_demandas: e.data_demandas,
                    data_atividades: e.data_atividades,
                    escola: e.escola,
                    interacao: e.interacao,
                    observacoes: e.observacoes,
                    created_at: e.created_at || '',
                    data_nascimento: e.data_nascimento || ''
                  }}
                />
              ))
            )}
          </tbody>
        </table>
        <div className="dashboard__pagination">
          <button type="button" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <ChevronLeft /> Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button type="button" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Próximo <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersDashboard; 