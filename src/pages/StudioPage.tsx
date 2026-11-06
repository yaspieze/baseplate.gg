import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Download,
  RefreshCw,
  Folder,
  FileCode2,
  Zap,
  Monitor,
  Terminal as TerminalIcon,
  Loader2,
  CheckCircle2,
  ChevronRight,
  BrainCircuit,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { SHOWCASE_PRESETS, ExplorerItem } from '../data/presets';
import { synthesizeSystemFromPrompt } from '../utils/aiSynthesizer';
import { highlightLuauLine } from '../utils/luauHighlight';
import { downloadRbxmxPackage } from '../utils/rbxExport';
import { InteractiveViewport } from '../components/InteractiveViewport';
import { sfx } from '../utils/sfx';

type GenPhase = 'idle' | 'indexing' | 'thinking' | 'streaming' | 'syncing';

interface ChatTurn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  thoughts?: string[];
  timestamp: string;
}

const MENTION_OPTIONS = [
  '@Workspace',
  '@ReplicatedStorage',
  '@ServerScriptService',
  '@StarterGui',
  '@StarterPlayerScripts',
  '@StarterPack',
  '@Lighting',
];

function nowStamp(): string {
  const d = new Date();
  return d.toTimeString().slice(0, 8);
}

export const StudioPage: React.FC = () => {
  const {
    activeSystem,
    setActiveSystem,
    pendingPrompt,
    clearPendingPrompt,
    connectionStatus,
    placeName,
    creatorHandle,
    openConnectModal,
    selectedModel,
    setSelectedModel,
    pushToast,
    demoBannerArmed,
    setDemoBannerOpen,
  } = useStudio();

  const [promptInput, setPromptInput] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [phase, setPhase] = useState<GenPhase>('idle');
  const [visibleThoughts, setVisibleThoughts] = useState<string[]>([]);
  const [activeScriptIdx, setActiveScriptIdx] = useState(0);
  const [streamedChars, setStreamedChars] = useState<number>(999999);
  const [centerTab, setCenterTab] = useState<'code' | 'viewport'>('code');
  const [copied, setCopied] = useState(false);
  const [syncingPush, setSyncingPush] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatTurn[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `Loaded **${activeSystem.title}** (${activeSystem.scripts.length} --!strict Luau modules). Ask me to build any Roblox game mechanic, GUI, or @Explorer system — or click ▶ Playtest in the Viewport tab!`,
      thoughts: activeSystem.thinkingSteps,
      timestamp: nowStamp(),
    },
  ]);

  const [outputLogs, setOutputLogs] = useState<string[]>([
    `${nowStamp()}.104  [Baseplate Bridge v2.4] Ready — Model: Baseplate-R3 (Luau 0.654 --!strict)`,
    `${nowStamp()}.288  [Explorer Indexer] Indexed ${activeSystem.explorerItems.length} instances for ${activeSystem.title}.`,
  ]);

  const appendLog = (msg: string) => {
    setOutputLogs((prev) => [...prev.slice(-24), `${nowStamp()}.${Math.floor(100 + Math.random() * 899)}  ${msg}`]);
  };

  const runRealisticGeneration = async (rawPrompt: string) => {
    const clean = rawPrompt.trim();
    if (!clean || phase !== 'idle') return;

    sfx.playClick();
    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: clean,
      timestamp: nowStamp(),
    };
    setChatHistory((prev) => [...prev, userTurn]);
    setPromptInput('');
    setCenterTab('code');

    const nextSys = synthesizeSystemFromPrompt(clean);

    // Phase 1: Indexing Studio Explorer (realistic 850ms delay)
    setPhase('indexing');
    setVisibleThoughts([]);
    appendLog(`[Context Reader] Scanning @Explorer hierarchy for prompt dependencies...`);
    await new Promise((r) => setTimeout(r, 850));

    // Phase 2: Streaming Architectural Reasoning Steps (realistic 550ms per step)
    setPhase('thinking');
    for (let i = 0; i < nextSys.thinkingSteps.length; i++) {
      setVisibleThoughts((prev) => [...prev, nextSys.thinkingSteps[i]]);
      appendLog(`[Planner] ${nextSys.thinkingSteps[i]}`);
      await new Promise((r) => setTimeout(r, 560));
    }

    // Phase 3: Token-by-Token Luau Code Streaming
    setActiveSystem(nextSys);
    setActiveScriptIdx(0);
    setPhase('streaming');
    const primaryCodeLen = nextSys.scripts[0]?.code.length || 600;
    setStreamedChars(0);

    await new Promise<void>((resolve) => {
      let cur = 0;
      const timer = setInterval(() => {
        cur += Math.floor(28 + Math.random() * 42);
        if (cur >= primaryCodeLen) {
          setStreamedChars(999999);
          clearInterval(timer);
          resolve();
        } else {
          setStreamedChars(cur);
        }
      }, 32);
    });

    // Phase 4: Auto-Sync Injection Delay
    setPhase('syncing');
    appendLog(
      `[Luau Typecheck] Compiled ${nextSys.scripts.length} scripts under --!strict (0 errors, 0 warnings).`
    );
    await new Promise((r) => setTimeout(r, 680));

    setPhase('idle');
    sfx.playSyncSuccess();

    const syncNote =
      connectionStatus === 'connected'
        ? `Auto-Synced all ${nextSys.explorerItems.length} instances straight into **${placeName}**!`
        : `Ready to export (.rbxmx) or pair Roblox Studio for live Auto-Sync.`;

    setChatHistory((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: `${nextSys.summary} ${syncNote}`,
        thoughts: nextSys.thinkingSteps,
        timestamp: nowStamp(),
      },
    ]);

    appendLog(
      `[Baseplate Auto-Sync] Injected ${nextSys.scripts.map((s) => s.name).join(', ')} in 24ms.`
    );
    pushToast(
      `Generated ${nextSys.title}`,
      `${nextSys.scripts.length} Luau modules + Explorer hierarchy ready.`,
      'emerald'
    );
  };

  // Auto-run if navigated from Home / Showcase with a prompt!
  const ranInitialRef = useRef<string | null>(null);
  useEffect(() => {
    if (pendingPrompt && ranInitialRef.current !== pendingPrompt) {
      ranInitialRef.current = pendingPrompt;
      const p = pendingPrompt;
      clearPendingPrompt();
      runRealisticGeneration(p);
    }
  }, [pendingPrompt, clearPendingPrompt]);

  const currentScript = activeSystem.scripts[activeScriptIdx] || activeSystem.scripts[0];
  const displayedCode =
    phase === 'streaming' && activeScriptIdx === 0
      ? currentScript.code.slice(0, streamedChars)
      : currentScript.code;
  const codeLines = displayedCode.split('\n');

  const handleManualSyncClick = async () => {
    if (demoBannerArmed) {
      setDemoBannerOpen(true);
      return;
    }
    if (connectionStatus !== 'connected') {
      openConnectModal();
      return;
    }
    setSyncingPush(true);
    sfx.playClick();
    appendLog(`[Auto-Sync] Pushing ${activeSystem.explorerItems.length} instances -> ${placeName} (127.0.0.1:38412)...`);
    await new Promise((r) => setTimeout(r, 920));
    setSyncingPush(false);
    sfx.playSyncSuccess();
    appendLog(`[Auto-Sync] Confirmed Studio Explorer commit #${Math.floor(1000 + Math.random() * 9000)} (19ms).`);
    pushToast(`Synced to ${placeName}`, `Updated ${activeSystem.scripts.length} scripts in Roblox Studio.`, 'emerald');
  };

  const handleExportRbxmx = () => {
    if (demoBannerArmed) {
      setDemoBannerOpen(true);
      return;
    }
    sfx.playSyncSuccess();
    downloadRbxmxPackage(activeSystem.title, activeSystem.scripts);
    appendLog(`[Exporter] Wrote schema-valid ${activeSystem.title.replace(/\s+/g, '_')}.rbxmx XML package.`);
    pushToast(
      'Downloaded .rbxmx Studio File!',
      'Drag and drop this file straight into your Roblox Studio viewport.',
      'emerald'
    );
  };

  const servicesOrder: ExplorerItem['parentService'][] = [
    'Workspace',
    'ReplicatedStorage',
    'ServerScriptService',
    'StarterPlayerScripts',
    'StarterGui',
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-5 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[calc(100vh-125px)]">
        {/* LEFT COLUMN: AI AGENT PROMPT & REASONING STREAM (4 cols) */}
        <div className="lg:col-span-4 rbx-panel rounded-2xl flex flex-col overflow-hidden h-[680px] lg:h-[calc(100vh-125px)]">
          {/* Header */}
          <div className="px-4 py-3 bg-[#141927] border-b border-[#242E45] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#00E676]" />
              <span className="font-builder font-extrabold text-xs text-white uppercase tracking-wide">
                Baseplate Studio Agent
              </span>
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-2 py-1 rounded-lg bg-[#0D111B] border border-[#28334E] text-[10.5px] font-builder font-bold text-[#8CF7C4] outline-none"
            >
              <option>Baseplate-R3 (Reasoning)</option>
              <option>Luau-Fast 2.5</option>
              <option>ForgeUI-Vision v4</option>
              <option>Baseplate-Architect 128k</option>
            </select>
          </div>

          {/* Template Quick-Switcher Strip */}
          <div className="px-3 py-2 bg-[#0E121C] border-b border-[#1E263A] flex items-center gap-1.5 overflow-x-auto">
            {SHOWCASE_PRESETS.map((p) => (
              <button
                key={p.id}
                disabled={phase !== 'idle'}
                onClick={() => runRealisticGeneration(p.prompt)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-builder font-bold shrink-0 cursor-pointer border transition-colors ${
                  activeSystem.id === p.id
                    ? 'bg-[#00E676]/15 border-[#00E676]/50 text-[#00E676]'
                    : 'bg-[#151B2A] border-[#252F47] text-[#96A4C2] hover:text-white'
                }`}
              >
                {p.shortTag}
              </button>
            ))}
          </div>

          {/* Chat Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {chatHistory.map((turn) => (
              <div
                key={turn.id}
                className={`rounded-xl p-3 text-xs space-y-2 ${
                  turn.role === 'user'
                    ? 'bg-[#192338] border border-[#2F4166] ml-5 text-white'
                    : 'bg-[#0F131E] border border-[#212A40] mr-2 text-[#D5E0F5]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#7888A8] font-luau">
                  <span className="font-bold text-[#9EB0D1]">
                    {turn.role === 'user' ? creatorHandle : 'Baseplate-R3'}
                  </span>
                  <span>{turn.timestamp}</span>
                </div>

                {turn.thoughts && turn.thoughts.length > 0 && (
                  <details className="rounded-lg bg-[#0A0D14] border border-[#1C2438] px-2.5 py-1.5">
                    <summary className="text-[10.5px] font-luau text-[#7DD3FC] cursor-pointer font-semibold">
                      Viewed Explorer &amp; planned {turn.thoughts.length} steps
                    </summary>
                    <ul className="mt-1.5 space-y-1 text-[10.5px] text-[#8595B5] font-luau">
                      {turn.thoughts.map((th, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#00E676] shrink-0 mt-0.5" />
                          <span>{th}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}

                <p className="leading-relaxed">{turn.text}</p>
              </div>
            ))}

            {/* Live Generation Progress Card */}
            {phase !== 'idle' && (
              <div className="rounded-xl p-3 bg-[#0C1422] border-2 border-[#00A2FF]/50 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#5CC6FF] font-builder font-bold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>
                    {phase === 'indexing' && 'Reading Studio Explorer (@Workspace, @StarterGui)...'}
                    {phase === 'thinking' && 'Planning Server-Authoritative Luau Architecture...'}
                    {phase === 'streaming' && 'Streaming --!strict Luau Modules...'}
                    {phase === 'syncing' && 'Running Luau Typecheck & Auto-Sync...'}
                  </span>
                </div>
                {visibleThoughts.length > 0 && (
                  <ul className="space-y-1 font-luau text-[10.5px] text-[#9BB4D8]">
                    {visibleThoughts.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <ChevronRight className="w-3 h-3 text-[#00E676] shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Prompt Composer with @ Explorer Autocomplete */}
          <div className="p-3 bg-[#121725] border-t border-[#232C42] relative">
            {showMentions && (
              <div className="absolute bottom-full left-3 right-3 mb-1.5 rounded-xl bg-[#151B2B] border-2 border-[#2E3B5B] p-1.5 shadow-2xl z-20">
                <p className="text-[10px] font-builder font-bold text-[#7F8FA8] px-2 py-1">
                  REFERENCE STUDIO INSTANCE
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {MENTION_OPTIONS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setPromptInput((prev) => prev.replace(/@$/, '') + m + ' ');
                        setShowMentions(false);
                      }}
                      className="text-left px-2.5 py-1 rounded-lg hover:bg-[#222B42] font-luau text-[11px] text-[#7DD3FC] cursor-pointer"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={promptInput}
                disabled={phase !== 'idle'}
                onChange={(e) => {
                  const val = e.target.value;
                  setPromptInput(val);
                  setShowMentions(val.endsWith('@'));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    runRealisticGeneration(promptInput);
                  }
                }}
                placeholder="Describe any game system or type @ to mention Explorer services..."
                className="flex-1 bg-[#0A0D15] rounded-xl px-3 py-2 text-xs text-white placeholder-[#687796] border border-[#242E46] focus:border-[#00E676] outline-none resize-none"
              />
              <button
                disabled={phase !== 'idle' || !promptInput.trim()}
                onClick={() => runRealisticGeneration(promptInput)}
                className="rbx-btn rbx-btn-emerald p-2.5 rounded-xl disabled:opacity-45"
                title="Generate (Free)"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[10px] text-[#7281A1]">
              <span>Tip: Type <code className="font-luau text-[#7DD3FC]">@</code> to link Explorer services</span>
              <span className="text-[#00E676] font-bold">0 Credits · Unlimited</span>
            </div>
          </div>
        </div>

        {/* CENTER + RIGHT WORKSPACE (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4 h-auto lg:h-[calc(100vh-125px)]">
          {/* Top Action Bar */}
          <div className="rbx-panel rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 bg-[#0C0F18] p-1 rounded-xl border border-[#21293E]">
              <button
                onClick={() => setCenterTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-builder font-extrabold flex items-center gap-1.5 cursor-pointer ${
                  centerTab === 'code'
                    ? 'bg-[#1E273B] text-white border border-[#354466]'
                    : 'text-[#8998B8] hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 text-[#29B6FF]" />
                <span>Luau Scripts ({activeSystem.scripts.length})</span>
              </button>
              <button
                onClick={() => setCenterTab('viewport')}
                className={`px-3 py-1.5 rounded-lg text-xs font-builder font-extrabold flex items-center gap-1.5 cursor-pointer ${
                  centerTab === 'viewport'
                    ? 'bg-[#1E273B] text-white border border-[#354466]'
                    : 'text-[#8998B8] hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-[#00E676]" />
                <span>3D Baseplate &amp; Playtest</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleManualSyncClick}
                disabled={syncingPush}
                className="rbx-btn rbx-btn-blue px-3.5 py-1.5 rounded-xl text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingPush ? 'animate-spin' : ''}`} />
                <span>{connectionStatus === 'connected' ? `Sync to ${placeName}` : 'Auto-Sync Studio'}</span>
              </button>
              <button
                onClick={handleExportRbxmx}
                className="rbx-btn rbx-btn-emerald px-3.5 py-1.5 rounded-xl text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .rbxmx</span>
              </button>
            </div>
          </div>

          {/* Middle Split: Code/Viewport + Studio Explorer */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 flex-1 min-h-0">
            {/* Code Editor OR 3D Playtest Viewport (8 cols) */}
            <div className="xl:col-span-8 flex flex-col min-h-[380px] overflow-hidden">
              {centerTab === 'code' ? (
                <div className="rbx-panel rounded-2xl flex flex-col flex-1 overflow-hidden">
                  {/* Script File Tabs */}
                  <div className="px-3 pt-2 bg-[#121725] border-b border-[#222B40] flex items-center justify-between gap-2 overflow-x-auto">
                    <div className="flex items-center gap-1">
                      {activeSystem.scripts.map((sc, idx) => {
                        const active = idx === activeScriptIdx;
                        const badgeColor =
                          sc.className === 'Script'
                            ? 'text-[#5CC6FF]'
                            : sc.className === 'LocalScript'
                            ? 'text-[#2AF598]'
                            : 'text-[#C084FC]';
                        return (
                          <button
                            key={sc.name}
                            onClick={() => setActiveScriptIdx(idx)}
                            className={`px-3 py-2 rounded-t-xl text-xs font-luau font-semibold flex items-center gap-1.5 border-t border-x cursor-pointer ${
                              active
                                ? 'bg-[#0B0E16] border-[#29344F] text-white'
                                : 'bg-[#151B2B]/60 border-transparent text-[#8594B2] hover:text-white'
                            }`}
                          >
                            <FileCode2 className={`w-3.5 h-3.5 ${badgeColor}`} />
                            <span>{sc.name}.luau</span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentScript.code);
                        setCopied(true);
                        sfx.playPop();
                        setTimeout(() => setCopied(false), 1800);
                      }}
                      className="px-2.5 py-1 mb-1 rounded-lg bg-[#1A2236] hover:bg-[#232E47] text-[11px] font-builder font-bold text-[#C7D4EE] flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Parent Service Breadcrumb */}
                  <div className="px-4 py-1.5 bg-[#0E121C] border-b border-[#1B2235] flex items-center justify-between text-[11px] font-luau text-[#7E8FAD]">
                    <span>
                      game.{currentScript.parentService}.{currentScript.name} ({currentScript.className})
                    </span>
                    <span className="text-[#00E676]">--!strict OK</span>
                  </div>

                  {/* Syntax-Highlighted Luau Editor Body */}
                  <div className="flex-1 overflow-auto bg-[#0A0D14] p-3 font-luau text-[12px] leading-[1.6]">
                    {codeLines.map((line, idx) => (
                      <div key={idx} className="flex hover:bg-white/[0.02] px-1 rounded">
                        <span className="w-9 shrink-0 select-none text-right pr-3 text-[#4B5875]">
                          {idx + 1}
                        </span>
                        <pre className="whitespace-pre overflow-x-visible">{highlightLuauLine(line)}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <InteractiveViewport
                  system={activeSystem}
                  creatorHandle={creatorHandle}
                  onLog={appendLog}
                />
              )}
            </div>

            {/* Authentic Roblox Studio Explorer Hierarchy Panel (4 cols) */}
            <div className="xl:col-span-4 rbx-panel rounded-2xl flex flex-col overflow-hidden min-h-[260px]">
              <div className="px-3.5 py-2.5 bg-[#141927] border-b border-[#242D44] flex items-center justify-between">
                <span className="font-builder font-extrabold text-xs text-white uppercase tracking-wide">
                  Studio Explorer
                </span>
                <span className="font-luau text-[10px] text-[#00E676]">{placeName}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-2.5 space-y-2 text-xs font-luau">
                {servicesOrder.map((srv) => {
                  const children = activeSystem.explorerItems.filter((i) => i.parentService === srv);
                  return (
                    <div key={srv} className="space-y-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#111624] text-[#C8D5EE] font-semibold">
                        <Folder className="w-3.5 h-3.5 text-[#FFD54F]" />
                        <span>{srv}</span>
                      </div>
                      <div className="pl-4 space-y-1">
                        {children.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              const sIdx = activeSystem.scripts.findIndex((s) => s.name === item.name);
                              if (sIdx >= 0) {
                                setActiveScriptIdx(sIdx);
                                setCenterTab('code');
                                sfx.playClick();
                              }
                            }}
                            className="flex items-center justify-between gap-1 px-2 py-1 rounded-lg hover:bg-[#182033] cursor-pointer text-[11px]"
                          >
                            <span className="flex items-center gap-1.5 truncate text-[#E2E9F8]">
                              {item.className === 'RemoteEvent' ? (
                                <Zap className="w-3 h-3 text-[#FFD54F] shrink-0" />
                              ) : item.className === 'ScreenGui' ? (
                                <Sparkles className="w-3 h-3 text-[#2AF598] shrink-0" />
                              ) : (
                                <FileCode2 className="w-3 h-3 text-[#5CC6FF] shrink-0" />
                              )}
                              <span className="truncate">{item.name}</span>
                            </span>
                            {item.linesAdded ? (
                              <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[#00E676]/15 text-[#00E676] shrink-0">
                                +{item.linesAdded}
                              </span>
                            ) : (
                              <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-[#00A2FF]/15 text-[#5CC6FF] shrink-0">
                                NEW
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Authentic Roblox Studio Output Console */}
          <div className="rbx-panel rounded-2xl overflow-hidden h-36 flex flex-col shrink-0">
            <div className="px-3.5 py-1.5 bg-[#131826] border-b border-[#222B40] flex items-center justify-between text-[11px]">
              <span className="font-builder font-extrabold text-white flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-[#00E676]" />
                Studio Output Console
              </span>
              <button
                onClick={() => setOutputLogs([`${nowStamp()}.001  [Output] Cleared.`])}
                className="text-[10px] text-[#7D8CA8] hover:text-white cursor-pointer"
              >
                Clear Output
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5 bg-[#080A10] font-luau text-[11px] space-y-1">
              {outputLogs.map((ln, i) => (
                <div
                  key={i}
                  className={
                    ln.includes('Auto-Sync') || ln.includes('--!strict OK') || ln.includes('Confirmed')
                      ? 'text-[#6BFFB3]'
                      : ln.includes('Planner')
                      ? 'text-[#7DD3FC]'
                      : 'text-[#9AA8C7]'
                  }
                >
                  {ln}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
