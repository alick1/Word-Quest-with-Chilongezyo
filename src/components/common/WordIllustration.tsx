import React from 'react';

interface WordIllustrationProps {
  name: string;
  className?: string;
  size?: number;
}

export const WordIllustration: React.FC<WordIllustrationProps> = ({ name, className = '', size = 120 }) => {
  switch (name) {
    case 'wheat':
    case 'corn':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#fef3c7" />
          {/* Stalk */}
          <path d="M50 85 C50 65 48 40 50 15" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" fill="none"/>
          {/* Leaves */}
          <path d="M50 70 C35 60 25 70 20 65 C30 55 45 60 50 65" fill="#22c55e"/>
          <path d="M50 55 C65 45 75 55 80 50 C70 40 55 45 50 50" fill="#22c55e"/>
          {/* Maize cob */}
          <ellipse cx="50" cy="38" rx="14" ry="22" fill="#f59e0b" stroke="#d97706" strokeWidth="2"/>
          {/* Kernels */}
          <circle cx="46" cy="28" r="2.5" fill="#fef08a"/>
          <circle cx="54" cy="28" r="2.5" fill="#fef08a"/>
          <circle cx="44" cy="35" r="2.5" fill="#fef08a"/>
          <circle cx="52" cy="35" r="2.5" fill="#fef08a"/>
          <circle cx="48" cy="42" r="2.5" fill="#fef08a"/>
          <circle cx="53" cy="48" r="2.5" fill="#fef08a"/>
          {/* Husks */}
          <path d="M38 52 C42 42 45 32 40 26 C36 34 35 44 38 52" fill="#15803d"/>
          <path d="M62 52 C58 42 55 32 60 26 C64 34 65 44 62 52" fill="#15803d"/>
        </svg>
      );

    case 'bowl':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#fef9c3" />
          {/* Steam */}
          <path d="M42 28 C40 22 45 18 42 12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M50 26 C48 20 53 16 50 10" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M58 28 C56 22 61 18 58 12" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          {/* Sadza mound */}
          <ellipse cx="50" cy="48" rx="28" ry="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2"/>
          <path d="M22 48 Q50 32 78 48 Z" fill="#ffffff"/>
          {/* Traditional clay/ceramic bowl */}
          <path d="M18 48 Q18 80 50 82 Q82 80 82 48 Z" fill="#b45309" stroke="#78350f" strokeWidth="3"/>
          <ellipse cx="50" cy="48" rx="32" ry="7" fill="none" stroke="#78350f" strokeWidth="3"/>
          {/* Zimbabwean chevron pattern on bowl */}
          <path d="M30 62 L36 68 L42 62 L48 68 L54 62 L60 68 L66 62 L72 68" stroke="#fef08a" strokeWidth="2.5" fill="none"/>
        </svg>
      );

    case 'school':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#ecfdf5" />
          {/* School Building */}
          <polygon points="50,18 15,40 85,40" fill="#dc2626"/>
          <rect x="22" y="40" width="56" height="42" fill="#f97316" stroke="#9a3412" strokeWidth="2"/>
          {/* Door */}
          <rect x="42" y="55" width="16" height="27" rx="3" fill="#78350f"/>
          {/* Windows */}
          <rect x="26" y="48" width="12" height="12" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5"/>
          <rect x="62" y="48" width="12" height="12" rx="2" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5"/>
          {/* Flagpole & Zim colors */}
          <line x1="50" y1="18" x2="50" y2="8" stroke="#334155" strokeWidth="2"/>
          <rect x="51" y="8" width="14" height="8" fill="#15803d"/>
        </svg>
      );

    case 'bike':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#e0f2fe" />
          {/* Wheels */}
          <circle cx="30" cy="65" r="16" fill="none" stroke="#334155" strokeWidth="3"/>
          <circle cx="30" cy="65" r="3" fill="#64748b"/>
          <circle cx="70" cy="65" r="16" fill="none" stroke="#334155" strokeWidth="3"/>
          <circle cx="70" cy="65" r="3" fill="#64748b"/>
          {/* Frame */}
          <polyline points="30,65 48,65 64,48 44,48 30,65" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinejoin="round"/>
          <polyline points="48,65 44,48 42,42" fill="none" stroke="#ef4444" strokeWidth="4"/>
          <line x1="70" y1="65" x2="62" y2="40" stroke="#ef4444" strokeWidth="4"/>
          {/* Handlebar & Seat */}
          <line x1="58" y1="38" x2="66" y2="38" stroke="#1e293b" strokeWidth="4" strokeLinecap="round"/>
          <line x1="38" y1="42" x2="48" y2="42" stroke="#1e293b" strokeWidth="4" strokeLinecap="round"/>
        </svg>
      );

    case 'paw':
    case 'shield': // Elephant icon
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#f1f5f9" />
          {/* Friendly elephant body */}
          <circle cx="48" cy="46" r="24" fill="#94a3b8"/>
          {/* Big ear */}
          <ellipse cx="62" cy="42" rx="14" ry="18" fill="#cbd5e1" stroke="#64748b" strokeWidth="2"/>
          {/* Eye */}
          <circle cx="38" cy="40" r="3.5" fill="#0f172a"/>
          <circle cx="39" cy="39" r="1" fill="#ffffff"/>
          {/* Trunk */}
          <path d="M30 48 C24 55 22 66 26 72 C28 75 32 75 33 71 C34 66 35 56 36 50" fill="#94a3b8" stroke="#64748b" strokeWidth="2"/>
          {/* Curved white tusk */}
          <path d="M33 54 C26 55 24 58 22 62" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        </svg>
      );

    case 'sun':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#fffbeb" />
          {/* Radiant Sun */}
          <circle cx="50" cy="50" r="22" fill="#f59e0b"/>
          <circle cx="50" cy="50" r="18" fill="#fbbf24"/>
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="16"
              x2="50"
              y2="22"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
          {/* Cheerful face */}
          <circle cx="44" cy="48" r="2.5" fill="#78350f"/>
          <circle cx="56" cy="48" r="2.5" fill="#78350f"/>
          <path d="M44 55 Q50 61 56 55" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
      );

    case 'flower':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#f0fdf4" />
          {/* Stem & Leaves */}
          <path d="M50 85 C50 65 48 55 50 48" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" fill="none"/>
          <path d="M50 68 C38 65 30 70 32 60 C40 58 48 64 50 68" fill="#22c55e"/>
          <path d="M50 58 C62 55 70 60 68 50 C60 48 52 54 50 58" fill="#22c55e"/>
          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map(deg => (
            <circle
              key={deg}
              cx="50"
              cy="34"
              r="10"
              fill="#fb7185"
              transform={`rotate(${deg} 50 48)`}
            />
          ))}
          {/* Flower Center */}
          <circle cx="50" cy="48" r="9" fill="#fde047" stroke="#ca8a04" strokeWidth="2"/>
        </svg>
      );

    case 'droplets':
    case 'droplet':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#f0f9ff" />
          {/* Waterfall cliff */}
          <rect x="20" y="24" width="28" height="52" rx="4" fill="#78350f"/>
          <rect x="52" y="24" width="28" height="52" rx="4" fill="#78350f"/>
          {/* Water rushing down */}
          <path d="M40 24 L40 76 Q50 82 60 76 L60 24 Z" fill="#38bdf8"/>
          <line x1="45" y1="28" x2="45" y2="72" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 3"/>
          <line x1="55" y1="28" x2="55" y2="72" stroke="#ffffff" strokeWidth="2" strokeDasharray="4 3"/>
          {/* Mist clouds at bottom */}
          <circle cx="44" cy="74" r="8" fill="#e0f2fe" opacity="0.9"/>
          <circle cx="56" cy="74" r="9" fill="#e0f2fe" opacity="0.9"/>
        </svg>
      );

    case 'sparkles':
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#fefce8" />
          <polygon points="50,16 60,38 84,40 66,56 72,80 50,67 28,80 34,56 16,40 40,38" fill="#facc15" stroke="#ca8a04" strokeWidth="2"/>
          <circle cx="44" cy="46" r="2.5" fill="#78350f"/>
          <circle cx="56" cy="46" r="2.5" fill="#78350f"/>
          <path d="M45 54 Q50 58 55 54" stroke="#78350f" strokeWidth="2" fill="none"/>
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={`drop-shadow-sm ${className}`} aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
          {/* Book */}
          <path d="M25 35 Q50 30 75 35 L75 75 Q50 70 25 75 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="3"/>
          <line x1="50" y1="32" x2="50" y2="72" stroke="#0284c7" strokeWidth="2"/>
          <text x="37" y="55" fontSize="16" fontWeight="bold" fill="#15803d" textAnchor="middle">A</text>
          <text x="63" y="55" fontSize="16" fontWeight="bold" fill="#d97706" textAnchor="middle">Z</text>
        </svg>
      );
  }
};
