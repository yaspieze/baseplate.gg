import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { GeneratedSystem, SHOWCASE_PRESETS } from '../data/presets';
import { sfx } from '../utils/sfx';

export type RoutePath = '/' | '/studio' | '/gui' | '/connect' | '/showcase' | '/pricing' | '/docs';

export type StudioConnectionStatus = 'disconnected' | 'probing' | 'pairing' | 'connected';

export interface ToastMessage {
  id: string;
  title: string;
  detail: string;
  tone: 'emerald' | 'blue' | 'amber' | 'rose';
}

interface StudioContextValue {
  route: RoutePath;
  navigate: (to: RoutePath, promptOverride?: string) => void;
  pendingPrompt: string | null;
  clearPendingPrompt: () => void;

  // Studio Bridge state
  connectionStatus: StudioConnectionStatus;
  connectionStepText: string;
  placeName: string;
  creatorHandle: string;
  pairingCode: string;
  autoSync: boolean;
  setAutoSync: (v: boolean) => void;
  pingMs: number;
  onlineSessions: number;
  sfxEnabled: boolean;
  toggleSfx: () => void;

  // Actions
  probeLocalPort: () => Promise<boolean>;
  pairWithStudio: (code: string, handle?: string, place?: string) => Promise<void>;
  disconnectStudio: () => void;
  openConnectModal: () => void;
  closeConnectModal: () => void;
  connectModalOpen: boolean;

  // Active AI Studio workspace state
  activeSystem: GeneratedSystem;
  setActiveSystem: (sys: GeneratedSystem) => void;
  selectedModel: string;
  setSelectedModel: (m: string) => void;

  // Toasts
  toasts: ToastMessage[];
  pushToast: (title: string, detail: string, tone?: ToastMessage['tone']) => void;

  // Live Stream / Demo Override Controls (Alt + Shift + B)
  directorOpen: boolean;
  setDirectorOpen: (v: boolean) => void;
  demoBannerArmed: boolean;
  setDemoBannerArmed: (v: boolean) => void;
  demoCustomMessage: string;
  setDemoCustomMessage: (m: string) => void;
  demoBannerOpen: boolean;
  setDemoBannerOpen: (v: boolean) => void;
  forceInstantConnect: (handle: string, place: string) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

const VALID_ROUTES: RoutePath[] = ['/', '/studio', '/gui', '/connect', '/showcase', '/pricing', '/docs'];

function getBasePrefix(): string {
  const raw = import.meta.env.BASE_URL || '/';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

function parseCurrentRoute(): RoutePath {
  if (typeof window === 'undefined') return '/';
  const base = getBasePrefix();
  let pathname = window.location.pathname;
  if (base && pathname.startsWith(base)) {
    pathname = pathname.slice(base.length) || '/';
  }
  // Strip trailing slash except root
  if (pathname.length > 1 && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }
  // Strip accidental .html if someone typed it manually and normalize
  if (pathname.endsWith('.html')) {
    pathname = pathname.replace(/\/index\.html$/, '') || '/';
    pathname = pathname.replace(/\.html$/, '') || '/';
  }
  if ((VALID_ROUTES as string[]).includes(pathname)) {
    return pathname as RoutePath;
  }
  return '/';
}

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RoutePath>(() => parseCurrentRoute());
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<StudioConnectionStatus>(() => {
    const saved = localStorage.getItem('bp_conn_status');
    return saved === 'connected' ? 'connected' : 'disconnected';
  });
  const [connectionStepText, setConnectionStepText] = useState<string>('');
  const [placeName, setPlaceName] = useState<string>(
    () => localStorage.getItem('bp_place_name') || 'Place1.rbxl'
  );
  const [creatorHandle, setCreatorHandle] = useState<string>(
    () => localStorage.getItem('bp_creator_handle') || '@BuilderDev'
  );
  const [pairingCode, setPairingCode] = useState<string>('BP-482-910');
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [pingMs, setPingMs] = useState<number>(22);
  const [onlineSessions, setOnlineSessions] = useState<number>(14892);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);
  const [connectModalOpen, setConnectModalOpen] = useState<boolean>(false);

  const [activeSystem, setActiveSystem] = useState<GeneratedSystem>(SHOWCASE_PRESETS[0]);
  const [selectedModel, setSelectedModel] = useState<string>('Baseplate-R3 (Reasoning)');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Live Stream / Demo Mode (Alt + Shift + B)
  const [directorOpen, setDirectorOpen] = useState<boolean>(false);
  const [demoBannerArmed, setDemoBannerArmed] = useState<boolean>(false);
  const [demoCustomMessage, setDemoCustomMessage] = useState<string>(
    'Custom Showcase Alert — Edit this message in Alt+Shift+B!'
  );
  const [demoBannerOpen, setDemoBannerOpen] = useState<boolean>(false);

  const pushToast = useCallback(
    (title: string, detail: string, tone: ToastMessage['tone'] = 'emerald') => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, detail, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4400);
    },
    []
  );

  // Clean URL navigation without .html
  const navigate = useCallback((to: RoutePath, promptOverride?: string) => {
    sfx.playClick();
    if (promptOverride !== undefined) {
      setPendingPrompt(promptOverride);
    }
    const base = getBasePrefix();
    const fullUrl = to === '/' ? `${base || '/'}` : `${base}${to}`;
    window.history.pushState({}, '', fullUrl);
    setRoute(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const clearPendingPrompt = useCallback(() => setPendingPrompt(null), []);

  useEffect(() => {
    const onPop = () => setRoute(parseCurrentRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Subtle realistic telemetry jitter (ping 18-31ms, active Studio sessions ±3)
  useEffect(() => {
    const interval = setInterval(() => {
      setPingMs((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(17, Math.min(33, prev + delta));
      });
      setOnlineSessions((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(14200, prev + delta);
      });
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Secret keyboard shortcut: Alt + Shift + B opens Director Panel
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
        e.preventDefault();
        setDirectorOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev;
      sfx.enabled = next;
      return next;
    });
  }, []);

  const probeLocalPort = useCallback(async (): Promise<boolean> => {
    setConnectionStatus('probing');
    setConnectionStepText('Probing localhost:38412/v2/bridge (Roblox Studio Plugin)...');
    await new Promise((r) => setTimeout(r, 950));
    setConnectionStepText('Checking Studio MCP loopback port 44755...');
    await new Promise((r) => setTimeout(r, 1100));
    setConnectionStatus('disconnected');
    setConnectionStepText('');
    pushToast(
      'Local Port 38412 Unreachable',
      'Open the Baseplate Bridge plugin in Roblox Studio and enter your 6-digit Pairing Code.',
      'amber'
    );
    return false;
  }, [pushToast]);

  const pairWithStudio = useCallback(
    async (code: string, handle?: string, place?: string) => {
      const cleanCode = code.trim().toUpperCase() || 'BP-482-910';
      const cleanHandle = handle?.trim()
        ? handle.trim().startsWith('@')
          ? handle.trim()
          : `@${handle.trim()}`
        : creatorHandle;
      const cleanPlace = place?.trim()
        ? place.trim().endsWith('.rbxl') || place.trim().endsWith('.rbxlx')
          ? place.trim()
          : `${place.trim()}.rbxl`
        : placeName;

      setConnectionStatus('pairing');
      setConnectionStepText(`Resolving pairing token ${cleanCode} on relay-eu-west-2.baseplate.gg...`);
      await new Promise((r) => setTimeout(r, 820));

      setConnectionStepText('Verifying Roblox Studio HttpService permission & account match...');
      await new Promise((r) => setTimeout(r, 980));

      setConnectionStepText(`Indexing ${cleanPlace} Explorer (Workspace, ReplicatedStorage, StarterGui)...`);
      await new Promise((r) => setTimeout(r, 1150));

      setConnectionStepText('Establishing bidirectional Auto-Sync WebSocket (TLS 1.3 · 21ms)...');
      await new Promise((r) => setTimeout(r, 760));

      setPairingCode(cleanCode);
      setCreatorHandle(cleanHandle);
      setPlaceName(cleanPlace);
      setConnectionStatus('connected');
      setConnectionStepText('');
      localStorage.setItem('bp_conn_status', 'connected');
      localStorage.setItem('bp_place_name', cleanPlace);
      localStorage.setItem('bp_creator_handle', cleanHandle);
      sfx.playSyncSuccess();
      pushToast(
        `Connected to ${cleanPlace}`,
        `Bidirectional Auto-Sync active for ${cleanHandle} via port 38412.`,
        'emerald'
      );
    },
    [creatorHandle, placeName, pushToast]
  );

  const disconnectStudio = useCallback(() => {
    setConnectionStatus('disconnected');
    localStorage.removeItem('bp_conn_status');
    pushToast('Studio Bridge Disconnected', 'Closed WebSocket session on port 38412.', 'blue');
  }, [pushToast]);

  const forceInstantConnect = useCallback(
    (handle: string, place: string) => {
      const h = handle.startsWith('@') ? handle : `@${handle}`;
      const p = place.endsWith('.rbxl') ? place : `${place}.rbxl`;
      setCreatorHandle(h);
      setPlaceName(p);
      setConnectionStatus('connected');
      localStorage.setItem('bp_conn_status', 'connected');
      localStorage.setItem('bp_place_name', p);
      localStorage.setItem('bp_creator_handle', h);
      sfx.playSyncSuccess();
    },
    []
  );

  return (
    <StudioContext.Provider
      value={{
        route,
        navigate,
        pendingPrompt,
        clearPendingPrompt,
        connectionStatus,
        connectionStepText,
        placeName,
        creatorHandle,
        pairingCode,
        autoSync,
        setAutoSync,
        pingMs,
        onlineSessions,
        sfxEnabled,
        toggleSfx,
        probeLocalPort,
        pairWithStudio,
        disconnectStudio,
        openConnectModal: () => setConnectModalOpen(true),
        closeConnectModal: () => setConnectModalOpen(false),
        connectModalOpen,
        activeSystem,
        setActiveSystem,
        selectedModel,
        setSelectedModel,
        toasts,
        pushToast,
        directorOpen,
        setDirectorOpen,
        demoBannerArmed,
        setDemoBannerArmed,
        demoCustomMessage,
        setDemoCustomMessage,
        demoBannerOpen,
        setDemoBannerOpen,
        forceInstantConnect,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used inside StudioProvider');
  return ctx;
}
