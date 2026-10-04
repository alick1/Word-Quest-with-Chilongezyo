import React from 'react';
import { UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import { Users, GraduationCap, Heart, Shield, ChevronDown } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, setRole, pupils, currentPupil, switchPupil } = useApp();

  return (
    <div className="bg-stone-900 text-stone-100 px-3 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-stone-800">
      <div className="flex items-center gap-2">
        <span className="text-stone-400 font-medium">Chinego Primary Mode:</span>
        
        {/* Role tabs */}
        <div className="inline-flex rounded-lg bg-stone-800 p-0.5" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={role === 'pupil'}
            onClick={() => setRole('pupil')}
            className={`touch-target px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              role === 'pupil' ? 'bg-emerald-600 text-white shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            Pupil
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'teacher'}
            onClick={() => setRole('teacher')}
            className={`touch-target px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              role === 'teacher' ? 'bg-amber-600 text-white shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            Teacher (Mr. Chuma)
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'parent'}
            onClick={() => setRole('parent')}
            className={`touch-target px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              role === 'parent' ? 'bg-teal-600 text-white shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            Parent
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'admin'}
            onClick={() => setRole('admin')}
            className={`touch-target px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
              role === 'admin' ? 'bg-purple-600 text-white shadow' : 'text-stone-300 hover:text-white'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Pupil switcher dropdown when in Pupil mode */}
      {role === 'pupil' && (
        <div className="flex items-center gap-1.5 text-stone-300">
          <span>Active Pupil:</span>
          <select
            value={currentPupil.id}
            onChange={(e) => switchPupil(e.target.value)}
            className="bg-stone-800 text-amber-300 text-xs font-bold rounded-lg px-2 py-1 border border-stone-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {pupils.map(p => (
              <option key={p.id} value={p.id}>
                {p.fullName} ({p.className})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
