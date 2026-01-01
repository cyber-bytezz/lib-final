import React from 'react';

interface Props {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const FormInput: React.FC<Props> = ({ label, type = "text", value, onChange, placeholder, required }) => (
  <div className="mb-5">
    <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-medium placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-200"
    />
  </div>
);

export default FormInput;