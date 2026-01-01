
import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<Props> = ({ value, onChange, placeholder }) => (
  <div className="relative w-full max-w-md">
    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <i className="fas fa-search text-slate-400"></i>
    </span>
    <input
      type="text"
      className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all sm:text-sm"
      placeholder={placeholder || "Search..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default SearchBar;
