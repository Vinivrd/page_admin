import type { FC } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import './UserRow.scss';

interface User {
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

const UserRow: FC<UserRowProps> = ({ user }) => {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('pt-BR');

  const formatPhone = (phone?: string) => phone || '-';

  return (
    <tr className="user-row">
      <td>
        <div className="user-info">
          <div className="avatar">{user.nome.charAt(0).toUpperCase()}</div>
          <div className="details">
            <div className="name">{user.nome}</div>
            <div className="email">{user.email}</div>
            <div className="cpf">CPF: {user.cpf}</div>
            <div className="birthday">Nascimento: {user.data_nascimento}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="location">
          <div className="region">{user.regiao}</div>
          <div className="city">{user.cidade}</div>
          <div className="neighborhood">{user.bairro}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="gender">{user.genero}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="religion">{user.religiao || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="contact">
          <div className="phone">{formatPhone(user.telefone)}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="social">
          {(user.instagram || user.tiktok) ? (
            <>
              {user.instagram && <span className="social__item">{user.instagram}</span>}
              {user.tiktok && <span className="social__item">{user.tiktok}</span>}
            </>
          ) : (
            <span className="social__item">-</span>
          )}
        </div>
      </td>
      <td>
        <div className="profession">
          <div className="job">{user.profissao || '-'}</div>
          <div className="school">{user.escola || '-'}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="observations">{user.observacoes || '-'}</div>
      </td>
      <td>
        <span className={`interaction ${user.interacao ? 'yes' : 'no'}`}>{user.interacao ? 'Sim' : 'Não'}</span>
      </td>
      <td>{formatDate(user.created_at)}</td>
      <td>
        <div className="actions">
          <button type="button"><Edit /></button>
          <button type="button"><Trash2 /></button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow; 