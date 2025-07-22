import type { FC } from 'react';
import './BooleanFilter.scss';

interface BooleanFilterProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const BooleanFilter: FC<BooleanFilterProps> = ({ value, onChange, label }) => {
  return (
    <div className="boolean-filter">
      <div className="boolean-filter__buttons">
        {label && <span className="boolean-filter__label">{label}</span>}
        <button type="button" className={value === '' ? 'active' : ''} onClick={() => onChange('')}>Todos</button>
        <button type="button" className={value === 'true' ? 'active' : ''} onClick={() => onChange('true')}>Sim</button>
        <button type="button" className={value === 'false' ? 'active' : ''} onClick={() => onChange('false')}>Não</button>
      </div>
    </div>
  );
};

export default BooleanFilter; 