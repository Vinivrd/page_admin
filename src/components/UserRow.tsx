import type { FC } from 'react';
import { memo } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import './UserRow.scss';

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
  tiktok?: string;
  religiao?: string;
  observacoes?: string;
  profissao?: string;
  escola?: string;
  interacao: boolean;
  created_at: string;
  data_nascimento: string;
}

interface UserRowProps {
  user: User;
}

// Funções de formatação movidas para fora do componente
const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('pt-BR');

const formatBirthDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

const formatNullableField = (value?: string): string => value || '-';

// Componente principal com memo para evitar renderizações desnecessárias
const UserRow: FC<UserRowProps> = memo(({ user }) => {
  return (
    <tr className="user-row">
      <td className="user-row__cell">
        <UserInfo user={user} />
      </td>
      <td className="user-row__cell">
        <Location user={user} />
      </td>
      <td className="user-row__cell">
        <div className="user-row__gender">{user.genero}</div>
      </td>
      <td className="user-row__cell">
        <div className="user-row__religion">{formatNullableField(user.religiao)}</div>
      </td>
      <td className="user-row__cell">
        <div className="user-row__contact">
          <div className="user-row__phone">{formatNullableField(user.telefone)}</div>
        </div>
      </td>
      <td className="user-row__cell">
        <SocialMedia instagram={user.instagram} tiktok={user.tiktok} />
      </td>
      <td className="user-row__cell">
        <Profession profissao={user.profissao} escola={user.escola} />
      </td>
      <td className="user-row__cell">
        <div className="user-row__observations">{formatNullableField(user.observacoes)}</div>
      </td>
      <td className="user-row__cell">
        <span className={`user-row__interaction ${user.interacao ? 'user-row__interaction--yes' : 'user-row__interaction--no'}`}>
          {user.interacao ? 'Sim' : 'Não'}
        </span>
      </td>
      <td className="user-row__cell">{formatDate(user.created_at)}</td>
      <td className="user-row__cell">
        <div className="user-row__actions">
          <button type="button" className="user-row__action-button">
            <span className="user-row__icon-wrapper">
              <Edit size={16} />
            </span>
          </button>
          <button type="button" className="user-row__action-button">
            <span className="user-row__icon-wrapper">
              <Trash2 size={16} />
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
});

// Componentes extraídos
const UserInfo: FC<{ user: User }> = ({ user }) => (
  <div className="user-row__info">
    <div className="user-row__details">
      <div className="user-row__name">{user.nome}</div>
      <div className="user-row__email">{user.email}</div>
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

const SocialMedia: FC<{ instagram?: string; tiktok?: string }> = ({ instagram, tiktok }) => (
  <div className="user-row__social">
    {(instagram || tiktok) ? (
      <>
        {instagram && <span className="user-row__social-item">{instagram}</span>}
        {tiktok && <span className="user-row__social-item">{tiktok}</span>}
      </>
    ) : (
      <span className="user-row__social-item">-</span>
    )}
  </div>
);

const Profession: FC<{ profissao?: string; escola?: string }> = ({ profissao, escola }) => (
  <div className="user-row__profession">
    <div className="user-row__job">{formatNullableField(profissao)}</div>
    <div className="user-row__school">{formatNullableField(escola)}</div>
  </div>
);

export default UserRow; 