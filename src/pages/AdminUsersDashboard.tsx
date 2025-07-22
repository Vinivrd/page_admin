import { useState, useMemo } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import InteractionFilter from '../components/InteractionFilter';
import UserRow from '../components/UserRow';
import '../styles/dashboard.scss';

interface User {
  id: string;
  regiao: string;
  bairro: string;
  cep: string;
  cidade: string;
  nome: string;
  email: string;
  escola: string;
  endereco: string;
  telefone: string;
  data_nascimento: string;
  cpf: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  genero: string;
  religiao: string;
  profissao: string;
  observacoes: string;
  interacao: boolean;
  created_at: string;
  updated_at: string;
}

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

  const [users] = useState<User[]>([
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      regiao: 'Norte',
      bairro: 'Centro',
      cep: '01234-567',
      cidade: 'São Paulo',
      nome: 'Maria Silva',
      email: 'maria@email.com',
      escola: 'EMEF João da Silva',
      endereco: 'Rua das Flores, 123',
      telefone: '(11) 99999-9999',
      data_nascimento: '1995-06-15',
      cpf: '123.456.789-00',
      instagram: '@maria_silva',
      facebook: 'Maria Silva',
      tiktok: '@maria_tk',
      genero: 'FEMININO',
      religiao: 'Católica',
      profissao: 'Professora',
      observacoes: 'Muito engajada nas atividades',
      interacao: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T14:45:00Z'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      regiao: 'Sul',
      bairro: 'Vila Nova',
      cep: '04567-890',
      cidade: 'Rio de Janeiro',
      nome: 'João Santos',
      email: 'joao@email.com',
      escola: 'Colégio Santa Maria',
      endereco: 'Av. Principal, 456',
      telefone: '(21) 88888-8888',
      data_nascimento: '1988-03-22',
      cpf: '987.654.321-00',
      instagram: '@joao_santos',
      facebook: '',
      tiktok: '',
      genero: 'MASCULINO',
      religiao: 'Evangélica',
      profissao: 'Engenheiro',
      observacoes: '',
      interacao: false,
      created_at: '2024-01-10T08:15:00Z',
      updated_at: '2024-01-18T16:20:00Z'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      regiao: 'Norte',
      bairro: 'Jardim América',
      cep: '12345-678',
      cidade: 'Belo Horizonte',
      nome: 'Ana Costa',
      email: 'ana@email.com',
      escola: 'Escola Municipal do Bairro',
      endereco: 'Rua da Paz, 789',
      telefone: '(31) 77777-7777',
      data_nascimento: '1992-11-08',
      cpf: '456.789.123-00',
      instagram: '@ana_costa',
      facebook: 'Ana Costa',
      tiktok: '@ana_tk',
      genero: 'FEMININO',
      religiao: 'Espírita',
      profissao: 'Médica',
      observacoes: 'Participa ativamente dos eventos',
      interacao: true,
      created_at: '2024-01-12T12:00:00Z',
      updated_at: '2024-01-22T09:30:00Z'
    }
  ]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRegiao = !filters.regiao || user.regiao === filters.regiao;
      const matchesInteracao = filters.interacao === '' || user.interacao.toString() === filters.interacao;
      const matchesGenero = !filters.genero || user.genero === filters.genero;
      const matchesCidade = !filters.cidade || user.cidade.toLowerCase().includes(filters.cidade.toLowerCase());
      const matchesSearch = !filters.search ||
        user.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.cpf.includes(filters.search);
      return matchesRegiao && matchesInteracao && matchesGenero && matchesCidade && matchesSearch;
    });
  }, [users, filters]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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
            <InteractionFilter value={filters.interacao} onChange={val => handleFilterChange('interacao', val)} />
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
          <div className="value">{filteredUsers.length}</div>
          <div className="label">Total de usuários</div>
        </div>
        <div className="stat-card">
          <div className="value">{filteredUsers.filter(u => u.interacao).length}</div>
          <div className="label">Com interação</div>
        </div>
        <div className="stat-card">
          <div className="value">{filteredUsers.filter(u => !u.interacao).length}</div>
          <div className="label">Sem interação</div>
        </div>
        <div className="stat-card">
          <div className="value">{new Set(filteredUsers.map(u => u.regiao)).size}</div>
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
            {paginatedUsers.map(user => <UserRow key={user.id} user={user} />)}
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