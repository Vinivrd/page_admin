import { useState, useEffect, useMemo } from 'react';
import { Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import BooleanFilter from '../components/filtros/BooleanFilter';
import ListFilter from '../components/filtros/ListFilter';
import SearchFilter from '../components/filtros/SearchFilter';
import UserRow from '../components/UserRow';
import type { User } from '../components/UserRow';
import { AddUserModal } from '../components/add-user';
import './DashboardPage.scss';
import { fetchEleitores } from '../services/eleitores.service';
import type { Eleitor } from '../services/eleitores.service';

const DashboardPage = () => {
  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [filters, setFilters] = useState({ regiao: '', interacao: '', genero: '', cidade: '', search: '', religiao: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getEleitores = async () => {
      setLoading(true);
      try {
        const { data, error } = await fetchEleitores();
        if (error) {
          setError('Erro ao buscar eleitores: ' + error.message);
          return;
        }
        setEleitores(data || []);
      } catch (err) {
        setError('Erro ao buscar eleitores: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setLoading(false);
      }
    };
    getEleitores();
  }, []);

  const filteredEleitores = useMemo(() => {
    return eleitores.filter(e => {
      const matchesRegiao = !filters.regiao || e.regiao === filters.regiao;
      const matchesInteracao = filters.interacao === '' || e.interacao.toString() === filters.interacao;
      const matchesGenero = !filters.genero || e.genero === filters.genero;
      const matchesCidade = !filters.cidade || e.cidade.toLowerCase().includes(filters.cidade.toLowerCase());
      const matchesReligiao = !filters.religiao || e.religiao === filters.religiao;
      const matchesSearch =
        !filters.search ||
        e.nome.toLowerCase().includes(filters.search.toLowerCase()) ||
        (e.email?.toLowerCase().includes(filters.search.toLowerCase())) ||
        (e.cpf?.includes(filters.search));
      return matchesRegiao && matchesInteracao && matchesGenero && matchesCidade && matchesReligiao && matchesSearch;
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
    setFilters({ regiao: '', interacao: '', genero: '', cidade: '', search: '', religiao: '' });
    setCurrentPage(1);  
  };

  const handleAddEleitorSuccess = () => {
    // Recarregar os dados após adicionar um novo eleitor
    const getEleitores = async () => {
      try {
        const { data, error } = await fetchEleitores();
        if (error) {
          setError('Erro ao buscar eleitores: ' + error.message);
          return;
        }
        setEleitores(data || []);
      } catch (err) {
        setError('Erro ao buscar eleitores: ' + (err instanceof Error ? err.message : String(err)));
      }
    };
    getEleitores();
    setIsAddModalOpen(false);
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
   
          <SearchFilter
            label="Buscar"
            placeholder="Nome, email ou CPF"
            value={filters.search}
            onChange={val => handleFilterChange('search', val)}
          />
                 
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
         
          <SearchFilter
            label="Cidade"
            placeholder="Digite a cidade"
            value={filters.cidade}
            onChange={val => handleFilterChange('cidade', val)}
          />
         
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

          <ListFilter
            label="Religião"
            options={[
              { value: '', label: 'Todas as religiões' },
              { value: 'Cristianismo', label: 'Cristianismo' },
              { value: 'Islamismo', label: 'Islamismo' },
              { value: 'Budismo', label: 'Budismo' },
              { value: 'Hinduismo', label: 'Hinduismo' },
              { value: 'Judaísmo', label: 'Judaísmo' },
              { value: 'Outros', label: 'Outros' },
            ]}
            value={filters.religiao}
            onChange={val => handleFilterChange('religiao', val)}
            />
        
          <BooleanFilter
            label="Interação"
            value={filters.interacao}
            onChange={val => handleFilterChange('interacao', val)}
          />
       
        </div>
        <div className="filters__actions">
          <div>
            <button type="button" className="adicionar" onClick={() => setIsAddModalOpen(true)}>
              <span className='plus-adicionar'>+</span> Adicionar
            </button> 
          </div>
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
          {loading ? (
            <div className="loading-indicator">Carregando eleitores...</div>
          ) : (
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
                {paginatedEleitores.length > 0 ? (
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
                ) : (
                  <tr>
                    <td colSpan={11} className="empty-state">
                      Nenhum eleitor encontrado com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="dashboard__pagination">
          <button type="button" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
            <ChevronLeft />
          </button>
          <span>Página {currentPage} de {totalPages || 1}</span>
          <button type="button" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalPages === 0}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <AddUserModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default DashboardPage; 