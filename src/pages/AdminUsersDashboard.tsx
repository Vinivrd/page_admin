import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import BooleanFilter from '../components/filtros/BooleanFilter';
import UserRow from '../components/UserRow';
import '../styles/dashboard.scss';
import { fetchEleitores } from '../services/eleitores.service';
import type { Eleitor } from '../services/eleitores.service';

const AdminUsersDashboard = () => {
  const [filters, setFilters] = useState({
    regiao: '',
    interacao: '',
    genero: '',
    cidade: '',
    search: ''
  });
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

  const filteredEleitores = useMemo(() => {
    return eleitores.filter(e => {
      const matchesRegiao = !filters.regiao || e.regiao === filters.regiao;
      const matchesInteracao = filters.interacao === '' || e.interacao.toString() === filters.interacao;
      const matchesGenero = !filters.genero || e.genero === filters.genero;
      const matchesCidade = !filters.cidade || e.cidade.toLowerCase().includes(filters.cidade.toLowerCase());
      const matchesSearch = !filters.search ||
        e.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        (e.email?.toLowerCase().includes(filters.search.toLowerCase())) ||
        (e.cpf?.includes(filters.search));
      return matchesRegiao && matchesInteracao && matchesGenero && matchesCidade && matchesSearch;
    });
  }, [eleitores, filters]);

  const totalPages = Math.ceil(filteredEleitores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEleitores = filteredEleitores.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ regiao: '', interacao: '', genero: '', cidade: '', search: '' });
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
              <option value="">Todas as regiões</option>
              <option value="Norte">Norte</option>
              <option value="Sul">Sul</option>
              <option value="Leste">Leste</option>
              <option value="Oeste">Oeste</option>
              <option value="Centro">Centro</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Interação</label>
            <BooleanFilter label="Interação" value={filters.interacao} onChange={(val: string) => handleFilterChange('interacao', val)} />
          </div>
          <div className="filter-group">
            <label>Gênero</label>
            <select value={filters.genero} onChange={e => handleFilterChange('genero', e.target.value)}>
              <option value="">Todos</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMININO">Feminino</option>
              <option value="OUTROS">Outros</option>
            </select>
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
                <UserRow key={e.id} user={{
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
                  tiktok: e.tiktok,
                  religiao: e.religiao,
                  observacoes: e.observacoes,
                  profissao: e.profissao,
                  escola: e.escola,
                  interacao: e.interacao,
                  created_at: e.created_at || '',
                  data_nascimento: e.data_nascimento || ''
                }} />
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