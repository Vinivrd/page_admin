import type { FC, InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import './SearchFilter.scss';

interface SearchFilterProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  label?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
}

const SearchFilter: FC<SearchFilterProps> = ({ value, placeholder, onChange, label, inputMode, type }) => (
  <div className="search-filter">
    {label && <label className="search-filter__label">{label}</label>}
    <div className="search-filter__wrapper">
      <Search className="search-icon" size={16} />
      <input
        type={type ?? 'text'}
        inputMode={inputMode}
        className="search-filter__input"
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default SearchFilter; 
