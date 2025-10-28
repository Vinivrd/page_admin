import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import BooleanFilter from '../components/filtros/BooleanFilter';
import UserRow from '../components/UserRow';
import type { User } from '../components/UserRow';
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
type SortDirection = 'asc' | 'desc';
type SortKey = 'nome' | 'regiao' | 'profissao' | 'created_at';

interface FiltersState {
  regioes: string[];
  bairros: string[];
  interacao: BooleanFilterValue;
  genero: string;
  cidade: string;
  nome: string;
  email: string;
  cpf: string;
  religiao: string;
  profissao: string;
  segmento_social: string;
  lideranca: string;
  atendido_instituto: BooleanFilterValue;
  atendido_demandas: BooleanFilterValue;
  participante_atividades: BooleanFilterValue;
}

const initialFilters: FiltersState = {
  regioes: [],
  bairros: [],
  interacao: '',
  genero: '',
  cidade: '',
  nome: '',
  email: '',
  cpf: '',
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
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [availableBairros, setAvailableBairros] = useState<string[]>([]);
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
        const uniqueBairros = Array.from(
          new Set(
            (data || [])
              .map(item => item.bairro?.trim())
              .filter((bairro): bairro is string => Boolean(bairro && bairro.length > 0))
              .map(bairro => bairro as string)
          )
        ).sort((a, b) => a.localeCompare(b, 'pt-BR'));
        setAvailableBairros(uniqueBairros);
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
    const nomeFilter = filters.nome.trim().toLowerCase();
    const emailFilter = filters.email.trim().toLowerCase();
    const normalizedCpfFilter = filters.cpf.replace(/\D/g, '');

    return eleitores.filter(e => {
      const matchesRegioes =
        filters.regioes.length === 0 || (e.regiao && filters.regioes.includes(e.regiao));
      const matchesInteracao = parseBooleanFilter(filters.interacao) === undefined
        || e.interacao === parseBooleanFilter(filters.interacao);
      const matchesGenero = !filters.genero || e.genero === filters.genero;
      const matchesCidade = !filters.cidade || e.cidade.toLowerCase().includes(filters.cidade.toLowerCase());
      const matchesBairros =
        filters.bairros.length === 0 ||
        filters.bairros.some(bairroFiltro => e.bairro?.toLowerCase() === bairroFiltro.toLowerCase());
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
      const matchesNome = !nomeFilter || e.nome.toLowerCase().includes(nomeFilter);
      const matchesEmail = !emailFilter || (e.email?.toLowerCase().includes(emailFilter));
      const matchesCpf =
        !normalizedCpfFilter ||
        (e.cpf && e.cpf.replace(/\D/g, '').includes(normalizedCpfFilter));

      return (
        matchesRegioes &&
        matchesInteracao &&
        matchesGenero &&
        matchesCidade &&
        matchesBairros &&
        matchesReligiao &&
        matchesProfissao &&
        matchesSegmento &&
        matchesLideranca &&
        matchesAtendidoInstituto &&
        matchesAtendidoDemandas &&
        matchesParticipanteAtividades &&
        matchesNome &&
        matchesEmail &&
        matchesCpf
      );
    });
  }, [eleitores, filters]);

  const sortedEleitores = useMemo(() => {
    if (!sortConfig) return filteredEleitores;

    const data = [...filteredEleitores];
    data.sort((a, b) => {
      const { key, direction } = sortConfig;
      let compareResult = 0;

      const aValue = a[key];
      const bValue = b[key];

      if (key === 'created_at') {
        const aDate = aValue ? new Date(String(aValue)).getTime() : 0;
        const bDate = bValue ? new Date(String(bValue)).getTime() : 0;
        compareResult = aDate - bDate;
      } else {
        const aString = (aValue ?? '').toString().toLowerCase();
        const bString = (bValue ?? '').toString().toLowerCase();
        compareResult = aString.localeCompare(bString, 'pt-BR');
      }

      return direction === 'asc' ? compareResult : -compareResult;
    });

    return data;
  }, [filteredEleitores, sortConfig]);

  const totalPages = Math.ceil(sortedEleitores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEleitores = sortedEleitores.slice(startIndex, startIndex + itemsPerPage);

  const toggleSort = (key: SortKey) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        const nextDirection = prev.direction === 'asc' ? 'desc' : 'asc';
        return { key, direction: nextDirection };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleFilterChange = (key: keyof FiltersState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleMultiSelectChange = (key: 'regioes', values: string[]) => {
    setFilters(prev => ({ ...prev, [key]: values }));
    setCurrentPage(1);
  };

  const handleBairrosChange = (values: string[]) => {
    setFilters(prev => ({ ...prev, bairros: values }));
    setCurrentPage(1);
  };

  const activeFilterBadges = useMemo(() => {
    const badges: { label: string; value: string }[] = [];

    if (filters.regioes.length > 0) {
      badges.push({ label: 'Regiões', value: filters.regioes.join(', ') });
    }

    if (filters.bairros.length > 0) {
      badges.push({ label: 'Bairros', value: filters.bairros.join(', ') });
    }

    if (filters.cidade.trim()) {
      badges.push({ label: 'Cidade', value: filters.cidade });
    }

    if (filters.genero) {
      badges.push({ label: 'Gênero', value: filters.genero });
    }

    if (filters.religiao) {
      badges.push({ label: 'Religião', value: filters.religiao });
    }

    if (filters.profissao) {
      badges.push({ label: 'Profissão', value: filters.profissao });
    }

    if (filters.segmento_social) {
      badges.push({ label: 'Segmento', value: filters.segmento_social });
    }

    if (filters.lideranca) {
      badges.push({ label: 'Liderança', value: filters.lideranca });
    }

    if (filters.nome.trim()) {
      badges.push({ label: 'Nome', value: filters.nome });
    }

    if (filters.email.trim()) {
      badges.push({ label: 'Email', value: filters.email });
    }

    if (filters.cpf.trim()) {
      badges.push({ label: 'CPF', value: filters.cpf });
    }

    const booleanFilters: Array<{ key: keyof FiltersState; label: string }> = [
      { key: 'interacao', label: 'Interação' },
      { key: 'atendido_instituto', label: 'Atendido Instituto' },
      { key: 'atendido_demandas', label: 'Atendido Demandas' },
      { key: 'participante_atividades', label: 'Participa Atividades' }
    ];

    booleanFilters.forEach(({ key, label }) => {
      const value = filters[key];
      if (value !== '') {
        badges.push({ label, value: value === 'true' ? 'Sim' : 'Não' });
      }
    });

    return badges;
  }, [filters]);

  const clearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
    setError(null);
  };

  const handleUserUpdated = (updatedUser: Partial<User> & { id: string }) => {
    if (import.meta.env.DEV) {
      console.log('AdminUsersDashboard handleUserUpdated chamado com:', updatedUser);
    }
    setEleitores(prev => {
      const updated = prev.map(eleitor => 
        eleitor.id === updatedUser.id 
          ? { ...eleitor, ...(updatedUser as any), updated_at: new Date().toISOString() } as Eleitor
          : eleitor
      );
      if (import.meta.env.DEV) {
        console.log('Lista atualizada:', updated);
      }
      return updated;
    });
  };

  const handleUserDeleted = (deletedUserId: string) => {
    setEleitores(prev => prev.filter(eleitor => eleitor.id !== deletedUserId));
  };

  const statsCards = useMemo(() => {
    const totalEleitores = eleitores.length;
    const filtrados = filteredEleitores.length;
    const comInteracao = filteredEleitores.filter(u => u.interacao).length;
    const semInteracao = Math.max(filtrados - comInteracao, 0);
    const percent = (value: number, total: number) => {
      if (total <= 0) return '0%';
      const ratio = Math.round((value / total) * 100);
      return `${ratio}%`;
    };

    const ultimoCadastroTimestamp = eleitores.reduce<number>((latest, eleitor) => {
      if (!eleitor.created_at) return latest;
      const current = new Date(eleitor.created_at).getTime();
      if (Number.isNaN(current)) return latest;
      return current > latest ? current : latest;
    }, 0);

    const ultimoCadastro = ultimoCadastroTimestamp
      ? new Date(ultimoCadastroTimestamp).toLocaleDateString('pt-BR')
      : '-';

    return [
      {
        id: 'total',
        label: 'Total de eleitores',
        value: totalEleitores.toLocaleString('pt-BR'),
        meta:
          filtrados === totalEleitores
            ? 'Todos exibidos'
            : `${filtrados.toLocaleString('pt-BR')} filtrado(s)`
      },
      {
        id: 'with-interaction',
        label: 'Com interação',
        value: comInteracao.toLocaleString('pt-BR'),
        meta: percent(comInteracao, filtrados || totalEleitores)
      },
      {
        id: 'without-interaction',
        label: 'Sem interação',
        value: semInteracao.toLocaleString('pt-BR'),
        meta: percent(semInteracao, filtrados || totalEleitores)
      },
      {
        id: 'last-created',
        label: 'Último cadastro',
        value: ultimoCadastro,
        meta: filtrados > 0 ? `Referente ao conjunto atual` : 'Sem registros ativos'
      }
    ];
  }, [eleitores, filteredEleitores]);

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
            <label>Regiões</label>
            <select
              multiple
              value={filters.regioes}
              onChange={e =>
                handleMultiSelectChange(
                  'regioes',
                  Array.from(e.target.selectedOptions, option => option.value)
                )
              }
            >
              {REGIOES_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <small>Use Ctrl/Cmd para selecionar múltiplas regiões</small>
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
              <option value="">Selecione</option>
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
          <div className="filter-group filter-group--boolean">
            <BooleanFilter label="Interação" value={filters.interacao} onChange={(val: string) => handleFilterChange('interacao', val)} options={FILTROS_BOOLEAN_OPTIONS} />
          </div>
          <div className="filter-group filter-group--boolean">
            <BooleanFilter label="Atendido pelo Instituto" value={filters.atendido_instituto} onChange={(val: string) => handleFilterChange('atendido_instituto', val)} options={FILTROS_BOOLEAN_OPTIONS} />
          </div>
          <div className="filter-group filter-group--boolean">
            <BooleanFilter label="Atendido por Demandas" value={filters.atendido_demandas} onChange={(val: string) => handleFilterChange('atendido_demandas', val)} options={FILTROS_BOOLEAN_OPTIONS} />
          </div>
          <div className="filter-group filter-group--boolean">
            <BooleanFilter label="Participa de Atividades" value={filters.participante_atividades} onChange={(val: string) => handleFilterChange('participante_atividades', val)} options={FILTROS_BOOLEAN_OPTIONS} />
          </div>
          <div className="filter-group">
            <label>Cidade</label>
            <input type="text" value={filters.cidade} onChange={e => handleFilterChange('cidade', e.target.value)} placeholder="Digite a cidade" />
          </div>
          <div className="filter-group">
            <label>Bairros</label>
            <select
              multiple
              value={filters.bairros}
              onChange={e =>
                handleBairrosChange(Array.from(e.target.selectedOptions, option => option.value))
              }
            >
              {availableBairros.map(bairro => (
                <option key={bairro} value={bairro}>
                  {bairro}
                </option>
              ))}
            </select>
            <small>Use Ctrl/Cmd para selecionar múltiplos bairros</small>
          </div>
          <div className="filter-group">
            <label>Nome</label>
            <div className="search-wrapper">
              <Search />
              <input
                type="text"
                value={filters.nome}
                onChange={e => handleFilterChange('nome', e.target.value)}
                placeholder="Buscar por nome"
              />
            </div>
          </div>
          <div className="filter-group">
            <label>Email</label>
            <div className="search-wrapper">
              <Search />
              <input
                type="text"
                value={filters.email}
                onChange={e => handleFilterChange('email', e.target.value)}
                placeholder="Buscar por email"
              />
            </div>
          </div>
          <div className="filter-group">
            <label>CPF</label>
            <div className="search-wrapper">
              <Search />
              <input
                type="text"
                value={filters.cpf}
                onChange={e => handleFilterChange('cpf', e.target.value)}
                placeholder="Buscar por CPF"
                inputMode="numeric"
              />
            </div>
          </div>
        </div>
        <div className="filters__summary">
          <span>Resultados filtrados: <strong>{filteredEleitores.length}</strong> de {eleitores.length}</span>
          {sortConfig && (
            <button type="button" className="summary-reset" onClick={() => setSortConfig(null)}>
              Remover ordenação
            </button>
          )}
        </div>
        {activeFilterBadges.length > 0 && (
          <div className="filters__badges">
            {activeFilterBadges.map(badge => (
              <span key={`${badge.label}-${badge.value}`} className="filters__badge">
                <strong>{badge.label}:</strong> {badge.value}
              </span>
            ))}
          </div>
        )}
        <div className="filters__actions">
          <button type="button" onClick={clearFilters}>Limpar filtros</button>
          <button type="button" className="export">
            <Download /> Exportar
          </button>
        </div>
      </div>

      <div className="dashboard__stats">
        {statsCards.map(card => (
          <div key={card.id} className={`stat-card stat-card--${card.id}`}>
            <span className="stat-card__label">{card.label}</span>
            <strong className="stat-card__value">{card.value}</strong>
            {card.meta && <span className="stat-card__meta">{card.meta}</span>}
          </div>
        ))}
      </div>

      <div className="dashboard__table">
        <table>
          <thead>
            <tr>
              <th>
                <button type="button" onClick={() => toggleSort('nome')}>
                  Usuário {sortConfig?.key === 'nome' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => toggleSort('regiao')}>
                  Região/Cidade {sortConfig?.key === 'regiao' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>Gênero</th>
              <th>Religião</th>
              <th>Contato</th>
              <th>Redes Sociais</th>
              <th>
                <button type="button" onClick={() => toggleSort('profissao')}>
                  Prof./Escola {sortConfig?.key === 'profissao' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>Observações</th>
              <th>Interação</th>
              <th>
                <button type="button" onClick={() => toggleSort('created_at')}>
                  Data Cadastro {sortConfig?.key === 'created_at' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </button>
              </th>
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
                    rua: e.rua || undefined,
                    numero: e.numero || undefined,
                    complemento: e.complemento || undefined,
                    cep: e.cep || undefined,
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
                    created_at: e.created_at || '',
                    data_nascimento: e.data_nascimento || ''
                  }}
                  onUpdated={handleUserUpdated}
                  onDeleted={handleUserDeleted}
                />
              ))
            )}
          </tbody>
        </table>
        <div className="dashboard__pagination">
          <button
            type="button"
            className="pagination__button pagination__button--prev"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
            <span>Anterior</span>
          </button>

          <span className="pagination__status">
            Página <strong>{currentPage}</strong>
            <span className="pagination__separator">de</span>
            <strong>{totalPages || 1}</strong>
          </span>

          <button
            type="button"
            className="pagination__button pagination__button--next"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
            disabled={currentPage === (totalPages || 1)}
          >
            <span>Próximo</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersDashboard; 
