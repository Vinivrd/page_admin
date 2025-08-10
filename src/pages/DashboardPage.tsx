import { useState, useEffect, useMemo } from 'react';
import { Filter, Download } from 'lucide-react';
import BooleanFilter from '../components/filtros/BooleanFilter';
import ListFilter from '../components/filtros/ListFilter';
import SearchFilter from '../components/filtros/SearchFilter';
import UserRow from '../components/UserRow';
import { AddUserModal } from '../components/add-user';
import ErrorMessage from '../components/ErrorMessage';
import './DashboardPage.scss';
import { fetchEleitoresPage } from '../services/eleitores.service';
import type { Eleitor } from '../services/eleitores.service';
// import { toast } from 'react-toastify';

const DashboardPage = () => {
  const [eleitores, setEleitores] = useState<Eleitor[]>([]);
  const [filters, setFilters] = useState({ regiao: '', interacao: '', genero: '', cidade: '', search: '', religiao: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper: converter filtros da UI para filtros do serviço
  const buildServiceFilters = () => ({
    regiao: filters.regiao || undefined,
    cidade: filters.cidade || undefined,
    genero: filters.genero || undefined,
    religiao: filters.religiao || undefined,
    interacao: filters.interacao === '' ? undefined : filters.interacao === 'true',
    search: filters.search || undefined,
  });

  // Carregar ao montar e quando filtros mudarem
  useEffect(() => {
    const loadFirstPage = async () => {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      setCurrentPage(1);
      const { data, count, error } = await fetchEleitoresPage({
        page: 1,
        pageSize,
        filters: buildServiceFilters(),
      });

      if (error) {
        setError('Erro ao buscar eleitores');
        setErrorDetails(error.message);
      } else {
        setEleitores([...(data as Eleitor[])]);
        setTotalCount(count);
      }
      setLoading(false);
    };
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.regiao, filters.interacao, filters.genero, filters.cidade, filters.search, filters.religiao]);

  // Estatísticas sobre os itens carregados (já filtrados pelo backend)
  const loadedStats = useMemo(() => ({
    total: eleitores.length,
    withInteraction: eleitores.filter(e => e.interacao).length,
    withoutInteraction: eleitores.filter(e => !e.interacao).length,
    lastCreatedAt: eleitores.length > 0 ? new Date(Math.max(...eleitores.map(e => new Date(e.created_at || '').getTime()))) : null,
  }), [eleitores]);

  const handleEleitorDeleted = (id: string) => {
    setEleitores(prev => prev.filter(e => e.id !== id));
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ regiao: '', interacao: '', genero: '', cidade: '', search: '', religiao: '' });
  };

  // const handleAddEleitorSuccess = () => {
  //   // Recarregar os dados após adicionar um novo eleitor
  //   const getEleitores = async () => {
  //     try {
  //       const { data, error } = await fetchEleitores();
  //       if (error) {
  //         setError('Erro ao buscar eleitores: ' + error.message);
  //         toast.error('Erro ao atualizar lista de eleitores');
  //         return;
  //       }
  //       setEleitores(data || []);
  //       toast.success('Lista de eleitores atualizada com sucesso!');
  //     } catch (err) {
  //       setError('Erro ao buscar eleitores: ' + (err instanceof Error ? err.message : String(err)));
  //       toast.error('Erro ao atualizar lista de eleitores');
  //     }
  //   };
  //   getEleitores();
  //   setIsAddModalOpen(false);
  // };

  // const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard de Eleitores</h1>
        <p>Gerenciamento de eleitores</p>
      </div>

      {error && <ErrorMessage message={error} details={errorDetails || undefined} />}

      <div className="dashboard__filters">
        <div className="filters__header">
          <Filter size={18} />
          <span>Filtros</span>
        </div>
        <div className="filters__controls">
   
                 
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
          <SearchFilter
            label="Buscar"
            placeholder="Nome, email ou CPF"
            value={filters.search}
            onChange={val => handleFilterChange('search', val)}
          />
          <SearchFilter
            label="Cidade"
            placeholder="Digite a cidade"
            value={filters.cidade}
            onChange={val => handleFilterChange('cidade', val)}
          />
         

        
          <BooleanFilter
            label="Interação"
            value={filters.interacao}
            onChange={val => handleFilterChange('interacao', val)}
          />
       
        </div>
        <div className="filters__actions">
          <div className="filters__actions-primary">
            <button 
              type="button" 
              className="btn-primary" 
              onClick={() => setIsAddModalOpen(true)}
              aria-label="Adicionar novo eleitor"
            >
              <span className="btn-icon">+</span>
              <span>Adicionar</span>
            </button>
          </div>
          <div className="filters__actions-secondary">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={clearFilters}
              aria-label="Limpar todos os filtros"
            >
              Limpar filtros
            </button>
            <button 
              type="button" 
              className="btn-secondary btn-with-icon" 
              aria-label="Exportar dados"
            >
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__icon total-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-card__content">
              <div className="stat-card__value">{totalCount}</div>
            <div className="stat-card__label">Total de eleitores</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon interaction-yes-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
          </div>
          <div className="stat-card__content">
              <div className="stat-card__value">{loadedStats.withInteraction}</div>
            <div className="stat-card__label">Com interação</div>
          </div>
          <div className="stat-card__percentage">
            {loadedStats.total > 0 ? 
              `${Math.round((loadedStats.withInteraction / loadedStats.total) * 100)}%` : 
              '0%'
            }
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon interaction-no-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
            </svg>
          </div>
          <div className="stat-card__content">
              <div className="stat-card__value">{loadedStats.withoutInteraction}</div>
            <div className="stat-card__label">Sem interação</div>
          </div>
          <div className="stat-card__percentage">
            {loadedStats.total > 0 ? 
              `${Math.round((loadedStats.withoutInteraction / loadedStats.total) * 100)}%` : 
              '0%'
            }
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon recent-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-card__content">
            <div className="stat-card__value">
              {loadedStats.lastCreatedAt ? 
                loadedStats.lastCreatedAt.toLocaleDateString('pt-BR') : 
                '-'
              }
            </div>
            <div className="stat-card__label">Último cadastro</div>
          </div>
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
                {eleitores.length > 0 ? (
                  eleitores.map(e => (
                    <UserRow key={e.id} onDeleted={handleEleitorDeleted} user={{
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
          <button type="button" onClick={async () => {
            if (loading || currentPage === 1) return;
            setLoading(true);
            const next = currentPage - 1;
            const { data, count } = await fetchEleitoresPage({
              page: next,
              pageSize,
              filters: buildServiceFilters(),
            });
            setEleitores([...(data as Eleitor[])]);
            setTotalCount(count);
            setCurrentPage(next);
            setLoading(false);
          }} disabled={loading || currentPage === 1}>Anterior</button>

          <span>Página {currentPage} de {Math.max(1, Math.ceil(totalCount / pageSize))}</span>

          <button type="button" onClick={async () => {
            const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
            if (loading || currentPage >= totalPages) return;
            setLoading(true);
            const next = currentPage + 1;
            const { data, count } = await fetchEleitoresPage({
              page: next,
              pageSize,
              filters: buildServiceFilters(),
            });
            setEleitores([...(data as Eleitor[])]);
            setTotalCount(count);
            setCurrentPage(next);
            setLoading(false);
          }} disabled={loading || currentPage >= Math.max(1, Math.ceil(totalCount / pageSize))}>Próximo</button>
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