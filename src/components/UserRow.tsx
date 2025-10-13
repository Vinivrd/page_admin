import type { FC } from 'react';
import { memo, useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import './UserRow.scss';
import AddUserModal from './add-user/AddUserModal';
import { toast } from 'react-toastify';
import { deleteEleitor, type Eleitor } from '../services/eleitores.service';

// Movendo a interface User para um arquivo separado (simulado aqui)
export interface User {
  id: string;
  nome: string;
  email?: string;
  cpf?: string;
  regiao: string;
  cidade: string;
  genero: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  cep?: string;
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
  onUpdated?: (user: Partial<User> & { id: string }) => void;
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
const UserRow: FC<UserRowProps> = memo(({ user, onDeleted, onUpdated }) => {
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
          <div className="user-row__gender">{formatNullableField(user.genero)}</div>
        </td>
        <td className="user-row__cell">
          <div className="user-row__religion">{formatEnumWithOther(user.religiao, user.religiao_outra)}</div>
        </td>
        <td className="user-row__cell">
          <ContactInfo telefone={user.telefone} email={user.email} />
        </td>
        <td className="user-row__cell">
          <SocialInfo instagram={user.instagram} facebook={user.facebook} tiktok={user.tiktok} />
        </td>
        <td className="user-row__cell">
          <Profession profissao={user.profissao} profissaoOutra={user.profissao_outra} escola={user.escola} />
        </td>
        <td className="user-row__cell">
          <div className="user-row__observacoes">{formatNullableField(user.observacoes)}</div>
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
          userToEdit={user as unknown as Eleitor}
          isEditing={true}
          onSuccess={(updated) => {
            console.log('UserRow onSuccess chamado com:', updated);
            handleCloseEditModal();
            if (updated && onUpdated) {
              // Converter EleitorFormSubmitResult para User
              const updatedUser = {
                id: updated.id,
                nome: updated.nome,
                email: updated.email || undefined,
                cpf: updated.cpf || undefined,
                regiao: updated.regiao as string,
                cidade: updated.cidade,
                genero: updated.genero as string,
                rua: updated.rua || undefined,
                numero: updated.numero || undefined,
                complemento: updated.complemento || undefined,
                cep: updated.cep || undefined,
                bairro: updated.bairro || undefined,
                telefone: updated.telefone || undefined,
                instagram: updated.instagram || undefined,
                facebook: updated.facebook || undefined,
                tiktok: updated.tiktok || undefined,
                religiao: updated.religiao as string || undefined,
                religiao_outra: updated.religiao_outra || undefined,
                observacoes: updated.observacoes || undefined,
                profissao: updated.profissao as string || undefined,
                profissao_outra: updated.profissao_outra || undefined,
                segmento_social: updated.segmento_social as string || undefined,
                segmento_social_outro: updated.segmento_social_outro || undefined,
                lideranca: updated.lideranca as string || undefined,
                lideranca_outra: updated.lideranca_outra || undefined,
                atendido_instituto: updated.atendido_instituto,
                atendido_demandas: updated.atendido_demandas,
                participante_atividades: updated.participante_atividades,
                data_instituto: updated.data_instituto || undefined,
                data_demandas: updated.data_demandas || undefined,
                data_atividades: updated.data_atividades || undefined,
                escola: updated.escola || undefined,
                interacao: updated.interacao,
                created_at: user.created_at, // Manter o original
                data_nascimento: updated.data_nascimento || ''
              };
              console.log('Chamando onUpdated com:', updatedUser);
              onUpdated(updatedUser);
            }
          }}
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

const ContactInfo: FC<{ telefone?: string; email?: string }> = ({ telefone, email }) => (
  <div className="user-row__contact">
    <div className="user-row__phone">{formatNullableField(telefone)}</div>
    <div className="user-row__email-small">{formatNullableField(email)}</div>
  </div>
);

type SocialPlatform = 'instagram' | 'facebook' | 'tiktok';

const extractSocialHandle = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const path = parsed.pathname.replace(/\/+$/, '');
      if (!path) return null;
      const segments = path.split('/').filter(Boolean);
      if (segments.length === 0) return null;
      const lastSegment = segments[segments.length - 1];
      return lastSegment.replace(/^@/, '');
    } catch {
      return null;
    }
  }

  return trimmed.replace(/^@/, '');
};

const buildSocialUrl = (platform: SocialPlatform, value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const handle = extractSocialHandle(trimmed);
  if (!handle) return null;

  switch (platform) {
    case 'instagram':
      return `https://www.instagram.com/${handle}`;
    case 'facebook':
      return `https://www.facebook.com/${handle}`;
    case 'tiktok':
      return `https://www.tiktok.com/@${handle}`;
    default:
      return null;
  }
};

const buildSocialLabel = (platform: SocialPlatform, value: string): string | null => {
  const handle = extractSocialHandle(value);
  if (!handle) {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (platform === 'facebook') {
    return handle;
  }

  return handle.startsWith('@') ? handle : `@${handle}`;
};

const SocialInfo: FC<{ instagram?: string; facebook?: string; tiktok?: string }> = ({ instagram, facebook, tiktok }) => (
  <div className="user-row__social">
    {instagram && instagram.trim() && (
      <a
        className="user-row__social-item"
        href={buildSocialUrl('instagram', instagram) ?? instagram}
        target="_blank"
        rel="noopener noreferrer"
      >
        IG: {buildSocialLabel('instagram', instagram) ?? instagram.trim()}
      </a>
    )}
    {facebook && facebook.trim() && (
      <a
        className="user-row__social-item"
        href={buildSocialUrl('facebook', facebook) ?? facebook}
        target="_blank"
        rel="noopener noreferrer"
      >
        FB: {buildSocialLabel('facebook', facebook) ?? facebook.trim()}
      </a>
    )}
    {tiktok && tiktok.trim() && (
      <a
        className="user-row__social-item"
        href={buildSocialUrl('tiktok', tiktok) ?? tiktok}
        target="_blank"
        rel="noopener noreferrer"
      >
        TT: {buildSocialLabel('tiktok', tiktok) ?? tiktok.trim()}
      </a>
    )}
    {!instagram && !facebook && !tiktok && <span className="user-row__social-item">-</span>}
  </div>
);

const Profession: FC<{ profissao?: string; profissaoOutra?: string; escola?: string }> = ({ profissao, profissaoOutra, escola }) => (
  <div className="user-row__profession">
    <div className="user-row__job">{formatEnumWithOther(profissao, profissaoOutra)}</div>
    <div className="user-row__school">{formatNullableField(escola)}</div>
  </div>
);

export default UserRow; 
