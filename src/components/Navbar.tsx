import React, { useState } from 'react';
import {
  Terminal,
  Layers,
  PlugZap,
  Compass,
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  Menu,
  X,
  Wifi,
  CheckCircle2,
} from 'lucide-react';
import { RoutePath, useStudio } from '../context/StudioContext';

export const BaseplateLogo: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0 drop-shadow-[0_3px_10px_rgba(0,230,118,0.35)]">
    <defs>
      <linearGradient id="bpGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2AF598" />
        <stop offset="55%" stopColor="#00E676" />
        <stop offset="100%" stopColor="#00A2FF" />
      </linearGradient>
    </defs>
    <rect x="4" y="10" width="56" height="48" rx="14" fill="#054A29" />
    <rect x="4" y="5" width="56" height="48" rx="14" fill="url(#bpGrad)" stroke="#8CFFD0" strokeWidth="2" />
    <circle cx="22" cy="20.5" r="6.5" fill="#06291A" fillOpacity="0.35" />
    <circle cx="22" cy="18.5" r="6.5" fill="#FFFFFF" fillOpacity="0.95" />
    <circle cx="42" cy="20.5" r="6.5" fill="#06291A" fillOpacity="0.35" />
    <circle cx="42" cy="18.5" r="6.5" fill="#FFFFFF" fillOpacity="0.95" />
    <circle cx="22" cy="39" r="6.5" fill="#06291A" fillOpacity="0.35" />
    <circle cx="22" cy="37" r="6.5" fill="#FFFFFF" fillOpacity="0.95" />
    <circle cx="42" cy="39" r="6.5" fill="#06291A" fillOpacity="0.35" />
    <circle cx="42" cy="37" r="6.5" fill="#FFFFFF" fillOpacity="0.95" />
  </svg>
);

const NAV_ITEMS: { path: RoutePath; label: string; icon?: React.ReactNode; badge?: string }[] = [
  { path: '/studio', label: 'Studio AI', icon: <Terminal className="w-4 h-4" />, badge: 'LIVE' },
  { path: '/gui', label: 'GUI Forge', icon: <Layers className="w-4 h-4" /> },
  { path: '/connect', label: 'Plugin & MCP', icon: <PlugZap className="w-4 h-4" /> },
  { path: '/showcase', label: 'Showcase', icon: <Compass className="w-4 h-4" /> },
  { path: '/pricing', label: 'Free Forever', badge: '$0' },
  { path: '/docs', label: 'Docs', icon: <BookOpen className="w-4 h-4" /> },
];

export const Navbar: React.FC = () => {
  const {
    route,
    navigate,
    connectionStatus,
    placeName,
    pingMs,
    onlineSessions,
    sfxEnabled,
    toggleSfx,
    openConnectModal,
  } = useStudio();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#090B10]/90 border-b-2 border-[#1B2233]">
      {/* Top Studio Telemetry Ribbon */}
      <div className="bg-[#0D111A] border-b border-[#192030] px-4 py-1.5 text-[11px] font-medium text-[#8B98B4]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[#00E676] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              Baseplate-R3 Engine Online
            </span>
            <span className="hidden sm:inline text-[#2D364D]">|</span>
            <span className="hidden sm:inline font-luau text-[10.5px]">
              relay-us-east-04 · {pingMs}ms
            </span>
            <span className="hidden md:inline text-[#2D364D]">|</span>
            <span className="hidden md:inline">
              <strong className="text-white">{onlineSessions.toLocaleString()}</strong> active Roblox Studio sessions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] font-builder font-bold text-[10px] tracking-wide uppercase">
              100% Free Forever · Unlimited Prompts
            </span>
          </div>
        </div>
      </div>

      {/* Main Roblox-GUI Styled Navbar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 group cursor-pointer text-left"
        >
          <BaseplateLogo size={36} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-builder font-black text-xl tracking-tight text-white group-hover:text-[#2AF598] transition-colors">
                baseplate<span className="text-[#00E676]">.gg</span>
              </span>
              <span className="text-[10px] font-luau font-bold px-1.5 py-0.5 rounded bg-[#1A2133] border border-[#2C3754] text-[#7D8FB3]">
                v2.4
              </span>
            </div>
            <p className="text-[10px] text-[#7382A3] font-semibold -mt-0.5 hidden sm:block">
              ROBLOX STUDIO AI AGENT &amp; GUI FORGE
            </p>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#111520] p-1 rounded-xl border-2 border-[#1E2538]">
          {NAV_ITEMS.map((item) => {
            const active = route === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-1.5 rounded-lg text-xs font-builder font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-b from-[#252E45] to-[#1A2133] text-white border border-[#3B496B] shadow-[0_2px_0_#0A0D14]'
                    : 'text-[#8F9DBC] hover:text-white hover:bg-[#171C2B]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded font-extrabold ${
                      item.badge === '$0'
                        ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/40'
                        : 'bg-[#00A2FF]/20 text-[#5CC6FF] border border-[#00A2FF]/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSfx}
            title={sfxEnabled ? 'Mute UI Sounds' : 'Enable UI Sounds'}
            className="p-2 rounded-xl bg-[#131824] border-2 border-[#232B40] text-[#8E9BB8] hover:text-white cursor-pointer"
          >
            {sfxEnabled ? <Volume2 className="w-4 h-4 text-[#00E676]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {connectionStatus === 'connected' ? (
            <button
              onClick={openConnectModal}
              className="rbx-btn rbx-btn-slate px-3 py-1.5 rounded-xl text-xs !border-[#00E676]/50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
              <span className="font-luau text-[11px] text-[#00E676] font-bold">{placeName}</span>
              <span className="hidden sm:inline text-[10px] text-[#8A99B8]">· Sync ON</span>
            </button>
          ) : (
            <button
              onClick={openConnectModal}
              className="rbx-btn rbx-btn-slate px-3 py-1.5 rounded-xl text-xs"
            >
              <Wifi className="w-3.5 h-3.5 text-[#29B6FF]" />
              <span className="hidden sm:inline">Connect Studio</span>
              <span className="sm:hidden">Pair</span>
            </button>
          )}

          <button
            onClick={() => navigate('/studio')}
            className="rbx-btn rbx-btn-emerald px-3.5 py-1.5 rounded-xl text-xs hidden sm:inline-flex"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Building</span>
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-xl bg-[#141926] border-2 border-[#252E44] text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0E121B] border-t-2 border-[#1E2538] px-4 py-3 space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-builder font-bold text-sm ${
                route === item.path
                  ? 'bg-[#1B2235] text-white border border-[#344263]'
                  : 'text-[#9BA8C7] hover:bg-[#151A28]'
              }`}
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00E676]/20 text-[#00E676]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
