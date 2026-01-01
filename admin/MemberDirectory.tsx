import React, { useState, useMemo } from 'react';
import { store } from '../firebase/libraryStore';
import SearchBar from '../components/SearchBar';

const MemberDirectory: React.FC = () => {
  const [memberType, setMemberType] = useState<'student' | 'staff'>('student');
  const [programFilter, setProgramFilter] = useState<string>('All');
  const [educationFilter, setEducationFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  // Get unique education strings for the dropdown filter based on program
  const educationOptions = useMemo(() => {
    let filtered = store.students;
    if (programFilter !== 'All') filtered = filtered.filter(s => s.program === programFilter);
    return Array.from(new Set(filtered.map(s => s.Education))).sort();
  }, [store.students, programFilter]);

  const filteredMembers = useMemo(() => {
    if (memberType === 'staff') {
      return store.staff.filter(s => 
        s.Name.toLowerCase().includes(search.toLowerCase()) || 
        s.StaffID.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return store.students.filter(s => {
      const matchSearch = s.Name.toLowerCase().includes(search.toLowerCase()) || s.Regno.toLowerCase().includes(search.toLowerCase());
      const matchProgram = programFilter === 'All' || s.program === programFilter;
      const matchEducation = educationFilter === 'All' || s.Education === educationFilter;
      return matchSearch && matchProgram && matchEducation;
    });
  }, [memberType, programFilter, educationFilter, search, store.students, store.staff]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Member Directory</h1>
          <p className="text-slate-400 font-medium">Browse and filter students and staff records.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {['student', 'staff'].map(t => (
              <button key={t} onClick={() => { setMemberType(t as any); setEducationFilter('All'); }} className={`px-4 py-2 rounded-lg text-xs font-black capitalize transition-all ${memberType === t ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400'}`}>{t}s</button>
            ))}
          </div>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or ID..." />
        </div>
      </div>

      {memberType === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Program</label>
            <select value={programFilter} onChange={e => { setProgramFilter(e.target.value); setEducationFilter('All'); }} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-violet-500 transition-all">
              <option value="All">All Programs</option>
              <option value="UG">UG (Undergraduate)</option>
              <option value="PG">PG (Postgraduate)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Education Level</label>
            <select value={educationFilter} onChange={e => setEducationFilter(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-violet-500 transition-all">
              <option value="All">All Education Rows</option>
              {educationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((m: any) => (
          <div key={m.Regno || m.StaffID} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-violet-50 transition-colors">
                <i className={`fas ${memberType === 'student' ? 'fa-user-graduate' : 'fa-user-tie'} text-slate-400 group-hover:text-violet-600 transition-colors`}></i>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${memberType === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {memberType === 'student' ? m.program : m.Department}
              </span>
            </div>
            <h4 className="text-lg font-black text-slate-900 truncate">{m.Name}</h4>
            <p className="text-xs text-slate-400 font-bold font-mono mb-4">{m.Regno || m.StaffID}</p>
            {memberType === 'student' && (
              <div className="mt-4 pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Education Details</p>
                <p className="text-sm font-bold text-slate-700">{m.Education}</p>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 text-slate-400">
              <i className="fas fa-envelope text-xs"></i>
              <span className="text-xs font-medium truncate">{m.Email}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDirectory;