import type { FC } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import './ListFilter.scss';

interface Option {
  value: string;
  label: string;
}

interface ListFilterProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const ListFilter: FC<ListFilterProps> = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || `Selecione ${label}`;

  return (
    <div className="list-filter">
      <label className="list-filter__label">{label}</label>
      <div className="list-filter__dropdown" onClick={() => setOpen(!open)}>
        <span className="list-filter__selected">{selectedLabel}</span>
        {open ? <ChevronUp className="list-filter__icon" /> : <ChevronDown className="list-filter__icon" />}
      </div>
      {open && (
        <ul className="list-filter__options">
          {options.map(o => (
            <li
              key={o.value}
              className={`list-filter__option${o.value === value ? ' selected' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListFilter; 