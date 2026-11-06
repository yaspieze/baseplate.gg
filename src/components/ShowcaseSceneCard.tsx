import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { GeneratedSystem, SceneArchetype } from '../data/presets';

const SceneIllustration: React.FC<{ type: SceneArchetype; accent: string }> = ({ type, accent }) => {
  switch (type) {
    case 'blade':
      return (
        <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id="bladeGlow" cx="50%" cy="48%" r="55%">
              <stop offset="0%" stopColor="#FF3B5C" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#1B1026" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#090C14" />
            </radialGradient>
          </defs>
          <rect width="360" height="200" fill="url(#bladeGlow)" />
          {/* Perspective Arena Ring */}
          <ellipse cx="180" cy="152" rx="140" ry="32" fill="none" stroke="#FF3B5C" strokeOpacity="0.35" strokeWidth="2.5" />
          <ellipse cx="180" cy="152" rx="95" ry="20" fill="none" stroke="#00E676" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="6 4" />
          {/* Roblox Blocky Fighter Silhouette */}
          <rect x="68" y="96" width="26" height="34" rx="4" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
          <rect x="73" y="76" width="16" height="16" rx="4" fill="#38BDF8" />
          {/* Cyber Katana Slash Arc */}
          <path d="M 95 128 Q 148 52 216 95" fill="none" stroke="#2AF598" strokeWidth="6" strokeLinecap="round" />
          <path d="M 98 124 Q 148 58 212 96" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Homing Neon Energy Sphere */}
          <circle cx="218" cy="92" r="24" fill="#FF3B5C" fillOpacity="0.32" />
          <circle cx="218" cy="92" r="14" fill="#FF3B5C" />
          <circle cx="214" cy="88" r="6" fill="#FFFFFF" />
          {/* Opponent Blocky Avatar */}
          <rect x="268" y="98" width="26" height="34" rx="4" fill="#2A1320" stroke="#FF3B5C" strokeWidth="2" />
          <rect x="273" y="78" width="16" height="16" rx="4" fill="#FDA4AF" />
          {/* Floating Deflect Tag */}
          <rect x="136" y="24" width="92" height="22" rx="6" fill="#0B101B" stroke="#2AF598" strokeWidth="1.5" />
          <text x="182" y="39" textAnchor="middle" fill="#2AF598" fontSize="10" fontWeight="800" fontFamily="Montserrat">
            PARRY x14!
          </text>
        </svg>
      );

    case 'rivals':
      return (
        <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="fpsSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0E2A47" />
              <stop offset="100%" stopColor="#090D16" />
            </linearGradient>
          </defs>
          <rect width="360" height="200" fill="url(#fpsSky)" />
          {/* Shipping Containers Arena */}
          <rect x="28" y="68" width="96" height="76" rx="4" fill="#E11D48" fillOpacity="0.82" stroke="#FB7185" strokeWidth="1.5" />
          <rect x="234" y="62" width="102" height="82" rx="4" fill="#0284C7" fillOpacity="0.82" stroke="#38BDF8" strokeWidth="1.5" />
          <rect x="0" y="144" width="360" height="56" fill="#131926" />
          {/* Enemy Mid-Peek */}
          <rect x="170" y="88" width="20" height="26" rx="3" fill="#1E293B" stroke="#FF4655" strokeWidth="2" />
          <rect x="173" y="72" width="14" height="14" rx="3" fill="#FDE047" />
          {/* Hitmarker + Crosshair */}
          <line x1="173" y1="72" x2="166" y2="65" stroke="#FF3B5C" strokeWidth="2.5" />
          <line x1="187" y1="72" x2="194" y2="65" stroke="#FF3B5C" strokeWidth="2.5" />
          <line x1="173" y1="86" x2="166" y2="93" stroke="#FF3B5C" strokeWidth="2.5" />
          <line x1="187" y1="86" x2="194" y2="93" stroke="#FF3B5C" strokeWidth="2.5" />
          <text x="206" y="68" fill="#FFD54F" fontSize="12" fontWeight="900" fontFamily="Montserrat">
            -85 CRIT
          </text>
          {/* FPS Stylized Rifle Viewmodel */}
          <polygon points="215,200 262,126 304,132 285,200" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
          <rect x="256" y="118" width="34" height="10" rx="3" fill="#00A2FF" />
        </svg>
      );

    case 'garden':
      return (
        <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="gardenBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#093024" />
              <stop offset="100%" stopColor="#0B1320" />
            </linearGradient>
          </defs>
          <rect width="360" height="200" fill="url(#gardenBg)" />
          {/* Soil Plots with Studs */}
          <rect x="34" y="118" width="292" height="58" rx="12" fill="#3E2723" stroke="#6D4C41" strokeWidth="3" />
          <rect x="52" y="128" width="76" height="38" rx="6" fill="#4E342E" />
          <rect x="142" y="128" width="76" height="38" rx="6" fill="#4E342E" />
          <rect x="232" y="128" width="76" height="38" rx="6" fill="#4E342E" />
          {/* Mutated Crops: Emerald, Golden, Celestial */}
          <rect x="84" y="84" width="12" height="46" rx="4" fill="#00E676" />
          <circle cx="90" cy="78" r="18" fill="#00E676" stroke="#B9F6CA" strokeWidth="2" />
          <rect x="174" y="72" width="12" height="58" rx="4" fill="#FFB300" />
          <polygon points="180,42 198,74 162,74" fill="#FFD54F" stroke="#FFF8E1" strokeWidth="2" />
          <rect x="264" y="76" width="12" height="54" rx="4" fill="#A855F7" />
          <circle cx="270" cy="68" r="20" fill="#C084FC" stroke="#F3E8FF" strokeWidth="2" />
          <rect x="218" y="24" width="118" height="22" rx="6" fill="#0E1522" stroke="#FFD54F" strokeWidth="1.5" />
          <text x="277" y="39" textAnchor="middle" fill="#FFD54F" fontSize="9.5" fontWeight="800" fontFamily="Montserrat">
            CELESTIAL x25!
          </text>
        </svg>
      );

    case 'horror':
      return (
        <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
          <rect width="360" height="200" fill="#080A10" />
          {/* Pine Trees Silhouette */}
          <polygon points="40,32 10,155 70,155" fill="#0F172A" />
          <polygon points="88,48 60,155 116,155" fill="#111C33" />
          <polygon points="280,38 250,155 310,155" fill="#111C33" />
          <polygon points="324,26 292,155 356,155" fill="#0F172A" />
          {/* Glowing Eyes in Woods */}
          <circle cx="56" cy="96" r="2.8" fill="#FF3B5C" />
          <circle cx="66" cy="96" r="2.8" fill="#FF3B5C" />
          {/* Warm Campfire Core */}
          <circle cx="180" cy="136" r="56" fill="#FF9800" fillOpacity="0.18" />
          <circle cx="180" cy="136" r="30" fill="#FFB300" fillOpacity="0.32" />
          <polygon points="180,96 200,144 160,144" fill="#FF9800" />
          <polygon points="180,108 192,144 168,144" fill="#FFF176" />
          <rect x="154" y="142" width="52" height="10" rx="4" fill="#5D4037" />
          <text x="180" y="36" textAnchor="middle" fill="#FFB300" fontSize="11" fontWeight="900" fontFamily="Montserrat">
            NIGHT 47 / 99
          </text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 360 200" className="w-full h-full object-cover">
          <defs>
            <radialGradient id={`g-${type}`} cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0A0E17" />
            </radialGradient>
          </defs>
          <rect width="360" height="200" fill={`url(#g-${type})`} />
          {/* Isometric Roblox Stud Cube Cluster */}
          <rect x="92" y="76" width="52" height="52" rx="12" fill="#172033" stroke={accent} strokeWidth="2.5" />
          <rect x="154" y="58" width="58" height="58" rx="14" fill={accent} fillOpacity="0.28" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="222" y="76" width="52" height="52" rx="12" fill="#172033" stroke={accent} strokeWidth="2.5" />
          <circle cx="183" cy="87" r="12" fill="#FFFFFF" fillOpacity="0.9" />
          <rect x="118" y="146" width="128" height="22" rx="7" fill="#0D121D" stroke={accent} strokeWidth="1.5" />
          <text x="182" y="160" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="800" fontFamily="Montserrat">
            STUDIO READY
          </text>
        </svg>
      );
  }
};

export const ShowcaseSceneCard: React.FC<{
  system: GeneratedSystem;
  compact?: boolean;
  onSelect: (sys: GeneratedSystem) => void;
}> = ({ system, compact = false, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(system)}
      className={`group relative rounded-2xl overflow-hidden bg-[#121723] border-2 border-[#232C42] hover:border-[#00E676] transition-all cursor-pointer shadow-[0_5px_0_#07090E] hover:-translate-y-1 ${
        compact ? 'w-[285px] shrink-0' : 'w-full'
      }`}
    >
      <div className="relative h-40 overflow-hidden bg-[#0B0E16]">
        <SceneIllustration type={system.sceneType} accent={system.accent} />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-md bg-[#090C13]/85 backdrop-blur-md border border-white/15 text-[10px] font-builder font-extrabold text-white tracking-wide">
            {system.shortTag}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#090C13]/85 backdrop-blur-md border border-[#00E676]/40 text-[10px] font-luau font-bold text-[#00E676] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
            {system.ccu}
          </span>
        </div>

        {/* Hover Overlay CTA like lemonade.gg & forgegui.com */}
        <div className="absolute inset-0 bg-[#080B12]/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <span className="rbx-btn rbx-btn-emerald px-4 py-2 rounded-xl text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Use in Studio AI</span>
          </span>
        </div>
      </div>

      <div className="p-3.5 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-builder font-extrabold text-sm text-white truncate">
            {system.title}
          </h4>
          <span className="text-[10px] font-semibold text-[#8A99B8] shrink-0 flex items-center gap-1">
            <Play className="w-2.5 h-2.5 fill-current text-[#00E676]" />
            {system.genre}
          </span>
        </div>
        <p className="text-[11.5px] text-[#8E9CB8] line-clamp-2 leading-snug">
          “{system.prompt}”
        </p>
      </div>
    </div>
  );
};
