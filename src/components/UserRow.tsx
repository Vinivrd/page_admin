import type { FC } from 'react';
import { memo, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import './UserRow.scss';
import AddUserModal from './add-user/AddUserModal';
import { toast } from 'react-toastify';
import { deleteEleitor } from '../services/eleitores.service';

// Movendo a interface User para um arquivo separado (simulado aqui)
export interface User {
  id: string;
  nome: string;
  email?: string;
  cpf?: string;
  regiao: string;
  cidade: string;
  genero: string;
  bairro?: string;
  telefone?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  religiao?: string;
  religiao_outra?: string;
  observacoes?: string;
  profissao?: string;
  profissao_outra?: string;
  segmento_social?: string;
  segmento_social_outro?: string;
  lideranca?: string;
  lideranca_outra?: string;
  atendido_instituto: boolean;
  atendido_demandas: boolean;
  participante_atividades: boolean;
  data_instituto?: string;
  data_demandas?: string;
  data_atividades?: string;
  escola?: string;
  interacao: boolean;
  created_at: string;
  data_nascimento: string;
}

interface UserRowProps {
  user: User;
  onDeleted?: (id: string) => void;
}

// Funções de formatação movidas para fora do componente
const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('pt-BR');
};

const formatBirthDate = (dateString?: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return Number.isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
};

const formatNullableField = (value?: string): string => (value && value.trim()) || '-';

const formatEnumWithOther = (primary?: string, other?: string): string => {
  if (primary) {
    if (primary.toLowerCase() === 'outro' || primary.toLowerCase() === 'outra') {
      return formatNullableField(other);
    }
    return primary;
  }
  return formatNullableField(other);
};

// Componente principal com memo para evitar renderizações desnecessárias
const UserRow: FC<UserRowProps> = memo(({ user, onDeleted }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    toast.info(`Editando eleitor: ${user.nome}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = async () => {
    if (!user.id) {
      toast.error('ID do eleitor inválido.');
      return;
    }

    const confirmed = window.confirm(`Tem certeza que deseja excluir o eleitor "${user.nome}"?`);
    if (!confirmed) return;

    try {
      const { error } = await deleteEleitor(user.id);
      if (error) {
        toast.error(`Erro ao excluir: ${error.message}`);
        return;
      }
      toast.success('Eleitor excluído com sucesso');
      onDeleted?.(user.id);
    } catch (err) {
      toast.error('Erro inesperado ao excluir eleitor');
    }
  };

  return (
    <>
      <tr className="user-row">
        <td className="user-row__cell">
          <UserInfo user={user} />
        </td>
        <td className="user-row__cell">
          <Location user={user} />
        </td>
        <td className="user-row__cell">
          <ContactInfo user={user} />
        </td>
        <td className="user-row__cell">
          <Profession profissao={user.profissao} profissaoOutra={user.profissao_outra} escola={user.escola} />
        </td>
        <td className="user-row__cell">
          <SegmentoInfo segmento={user.segmento_social} outro={user.segmento_social_outro} />
        </td>
        <td className="user-row__cell">
          <div className="user-row__religion">{formatEnumWithOther(user.religiao, user.religiao_outra)}</div>
        </td>
        <td className="user-row__cell">
          <div className="user-row__leadership">{formatEnumWithOther(user.lideranca, user.lideranca_outra)}</div>
        </td>
        <td className="user-row__cell">
          <AtendimentosInfo
            atendidoInstituto={user.atendido_instituto}
            atendidoDemandas={user.atendido_demandas}
            participanteAtividades={user.participante_atividades}
            dataInstituto={user.data_instituto}
            dataDemandas={user.data_demandas}
            dataAtividades={user.data_atividades}
          />
        </td>
        <td className="user-row__cell">
          <span className={`user-row__interaction ${user.interacao ? 'user-row__interaction--yes' : 'user-row__interaction--no'}`}>
            {user.interacao ? 'Sim' : 'Não'}
          </span>
        </td>
        <td className="user-row__cell">{formatDate(user.created_at)}</td>
        <td className="user-row__cell">
          <div className="user-row__actions">
            <button 
              type="button" 
              className="user-row__action-button"
              onClick={handleEditClick}
            >
              <span className="user-row__icon-wrapper">
                <Edit size={16} />
              </span>
            </button>
            <button type="button" className="user-row__action-button" onClick={handleDeleteClick} aria-label={`Excluir ${user.nome}`}>
              <span className="user-row__icon-wrapper">
                <Trash2 size={16} />
              </span>
            </button>
          </div>
        </td>
      </tr>

      {isEditModalOpen && (
        <AddUserModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          userToEdit={user}
          isEditing={true}
        />
      )}
    </>
  );
});

// Componentes extraídos
const UserInfo: FC<{ user: User }> = ({ user }) => (
  <div className="user-row__info">
    <div className="user-row__details">
      <div className="user-row__name">{user.nome}</div>
      <div className="user-row__email">{formatNullableField(user.email)}</div>
      <div className="user-row__cpf">CPF: {formatNullableField(user.cpf)}</div>
      <div className="user-row__birthday">Nascimento: {formatBirthDate(user.data_nascimento)}</div>
    </div>
  </div>
);

const Location: FC<{ user: User }> = ({ user }) => (
  <div className="user-row__location">
    <div className="user-row__region">{user.regiao}</div>
    <div className="user-row__city">{user.cidade}</div>
    <div className="user-row__neighborhood">{formatNullableField(user.bairro)}</div>
  </div>
);

const ContactInfo: FC<{ user: User }> = ({ user }) => (
  <div className="user-row__contact">
    <div className="user-row__phone">{formatNullableField(user.telefone)}</div>
    <div className="user-row__email-small">{formatNullableField(user.email)}</div>
    <div className="user-row__social">
      {user.instagram && <span className="user-row__social-item">IG: {user.instagram}</span>}
      {user.facebook && <span className="user-row__social-item">FB: {user.facebook}</span>}
      {user.tiktok && <span className="user-row__social-item">TT: {user.tiktok}</span>}
      {!user.instagram && !user.facebook && !user.tiktok && <span className="user-row__social-item">-</span>}
    </div>
  </div>
);

const Profession: FC<{ profissao?: string; profissaoOutra?: string; escola?: string }> = ({ profissao, profissaoOutra, escola }) => (
  <div className="user-row__profession">
    <div className="user-row__job">{formatEnumWithOther(profissao, profissaoOutra)}</div>
    <div className="user-row__school">{formatNullableField(escola)}</div>
  </div>
);

const SegmentoInfo: FC<{ segmento?: string; outro?: string }> = ({ segmento, outro }) => (
  <div className="user-row__segmento">{formatEnumWithOther(segmento, outro)}</div>
);

const AtendimentosInfo: FC<{
  atendidoInstituto: boolean;
  atendidoDemandas: boolean;
  participanteAtividades: boolean;
  dataInstituto?: string;
  dataDemandas?: string;
  dataAtividades?: string;
}> = ({
  atendidoInstituto,
  atendidoDemandas,
  participanteAtividades,
  dataInstituto,
  dataDemandas,
  dataAtividades
}) => (
  <div className="user-row__atendimentos">
    <div className={`user-row__atendimento ${atendidoInstituto ? 'ativo' : ''}`}>
      Instituto: {atendidoInstituto ? formatDate(dataInstituto) : 'Não'}
    </div>
    <div className={`user-row__atendimento ${atendidoDemandas ? 'ativo' : ''}`}>
      Demandas: {atendidoDemandas ? formatDate(dataDemandas) : 'Não'}
    </div>
    <div className={`user-row__atendimento ${participanteAtividades ? 'ativo' : ''}`}>
      Atividades: {participanteAtividades ? formatDate(dataAtividades) : 'Não'}
    </div>
  </div>
);

export default UserRow; 