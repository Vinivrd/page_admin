import type { FC } from 'react';
import './BooleanFilter.scss';

interface BooleanFilterOption {
  value: string;
  label: string;
}

interface BooleanFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: BooleanFilterOption[];
}

const DEFAULT_OPTIONS: BooleanFilterOption[] = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' }
];

const BooleanFilter: FC<BooleanFilterProps> = ({ label, value, onChange, options = DEFAULT_OPTIONS }) => {
  return (
    <div className="boolean-filter">
      <label>{label}</label>
      <div className="boolean-filter__buttons">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            className={`boolean-filter__button${value === option.value ? ' active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BooleanFilter;