import { useState, useEffect, useMemo } from 'react';
import { Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import BooleanFilter from '../components/filtros/BooleanFilter';
import ListFilter from '../components/filtros/ListFilter';
import SearchFilter from '../components/filtros/SearchFilter';
import UserRow from '../components/UserRow';
import './DashboardPage.scss';
import { supabase } from '../services/supabase';

interface Eleitor {
  id: string;
  regiao: string;
  bairro?: string;
  cep?: string;
  cidade: string;
  nome: string;
  email?: string;
  escola?: string;
  endereco?: string;
  telefone?: string;
  data_nascimento?: string;
  cpf?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  genero: string;
  religiao?: string;
  profissao?: string;
  observacoes?: string;
  interacao: boolean;
  created_at: string;
  updated_at: string;
}

const DashboardPage = () => {
  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [filters, setFilters] = useState({ regiao: '', interacao: '', genero: '', cidade: '', search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEleitores = async () => {
      const { data, error } = await supabase.from('eleitores').select('*');
      if (error) {
        setError('Erro ao buscar eleitores: ' + error.message);
        return;
      }
      setEleitores(data || []);
    };
    fetchEleitores();
  }, []);

  const filteredEleitores = useMemo(() => {
    return eleitores.filter(e => {
      const matchesRegiao = !filters.regiao || e.regiao === filters.regiao;
      const matchesInteracao = filters.interacao === '' || e.interacao.toString() === filters.interacao;
      const matchesGenero = !filters.genero || e.genero === filters.genero;
      const matchesCidade = !filters.cidade || e.cidade.toLowerCase().includes(filters.cidade.toLowerCase());
      const matchesSearch =
        !filters.search ||
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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard de Eleitores</h1>
        <p>Gerenciamento de eleitores</p>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="dashboard__filters">
        <div className="filters__header">
          <Filter size={18} />
          <span>Filtros</span>
        </div>
        <div className="filters__controls">
          <div className="filter-group">
            <SearchFilter
              label="Buscar"
              placeholder="Nome, email ou CPF"
              value={filters.search}
              onChange={val => handleFilterChange('search', val)}
            />
          </div>
          <div className="filter-group">
            <ListFilter
              label="Região"
              options={[
                { value: '', label: 'Todas as regiões' },
                { value: 'Norte', label: 'Norte' },
                { value: 'Sul', label: 'Sul' },
                { value: 'Leste', label: 'Leste' },
                { value: 'Oeste', label: 'Oeste' },
                { value: 'Centro', label: 'Centro' },
              ]}
              value={filters.regiao}
              onChange={val => handleFilterChange('regiao', val)}
            />
          </div>
          <div className="filter-group">
            <SearchFilter
              label="Cidade"
              placeholder="Digite a cidade"
              value={filters.cidade}
              onChange={val => handleFilterChange('cidade', val)}
            />
          </div>
          <div className="filter-group">
            <ListFilter
              label="Gênero"
              options={[
                { value: '', label: 'Todos' },
                { value: 'MASCULINO', label: 'Masculino' },
                { value: 'FEMININO', label: 'Feminino' },
                { value: 'OUTROS', label: 'Outros' },
              ]}
              value={filters.genero}
              onChange={val => handleFilterChange('genero', val)}
            />
          </div>
          <div className="filter-group">
            <BooleanFilter
              label="Interação"
              value={filters.interacao}
              onChange={val => handleFilterChange('interacao', val)}
            />
          </div>
        </div>
        <div className="filters__actions">
          <button type="button" onClick={clearFilters}>Limpar filtros</button>
          <button type="button" className="export">
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="value">{filteredEleitores.length}</div>
          <div className="label">Total de eleitores</div>
        </div>
        <div className="stat-card">
          <div className="value">{filteredEleitores.filter(e => e.interacao).length}</div>
          <div className="label">Com interação</div>
        </div>
        <div className="stat-card">
          <div className="value">{filteredEleitores.filter(e => !e.interacao).length}</div>
          <div className="label">Sem interação</div>
        </div>
      </div>

      <div className="dashboard__table">
        <div className="table__header">
          <h2>Lista de Eleitores</h2>
        </div>
        <div className="table__body">
          <table>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Região/Cidade</th>
                <th>Gênero</th>
                <th>Religião</th>
                <th>Contato</th>
                <th>Redes Sociais</th>
                <th>Prof/Escola</th>
                <th>Observações</th>
                <th>Interação</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEleitores.map(e => (
                <UserRow key={e.id} user={{
                  ...e,
                  data_nascimento: e.data_nascimento || ''
                }} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="dashboard__pagination">
          <button type="button" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
            <ChevronLeft />
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button type="button" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 