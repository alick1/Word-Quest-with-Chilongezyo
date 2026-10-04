import React from 'react';
import { Star } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showStarMilestones?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label = 'Activity Progress',
  showStarMilestones = true,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / (total || 1)) * 100)));

  return (
    <div className={`w-full ${className}`} role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total} aria-label={label}>
      <div className="flex justify-between items-center text-xs font-semibold text-stone-700 mb-1.5">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{label}</span>
        </span>
        <span className="tabular-nums">
          Word {Math.min(current, total)} of {total} ({percentage}%)
        </span>
      </div>

      <div className="relative w-full h-3.5 bg-stone-200 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showStarMilestones && (
        <div className="flex justify-between mt-1 text-[10px] text-stone-400 font-medium px-1">
          <span className="flex items-center gap-0.5 text-stone-500">Start</span>
          <span className="flex items-center gap-0.5 text-amber-500">
            <Star className="w-3 h-3 fill-amber-400" /> Halfway
          </span>
          <span className="flex items-center gap-0.5 text-amber-600 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500" /> Goal!
          </span>
        </div>
      )}
    </div>
  );
};
