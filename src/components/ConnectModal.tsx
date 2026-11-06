import React, { useState } from 'react';
import {
  X,
  PlugZap,
  Loader2,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Terminal,
  Sliders,
  PartyPopper,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const GlobalOverlays: React.FC = () => {
  const {
    connectModalOpen,
    closeConnectModal,
    connectionStatus,
    connectionStepText,
    placeName,
    creatorHandle,
    probeLocalPort,
    pairWithStudio,
    disconnectStudio,
    navigate,
    toasts,
    directorOpen,
    setDirectorOpen,
    demoBannerArmed,
    setDemoBannerArmed,
    demoCustomMessage,
    setDemoCustomMessage,
    demoBannerOpen,
    setDemoBannerOpen,
    forceInstantConnect,
    pushToast,
  } = useStudio();

  const [codeInput, setCodeInput] = useState('BP-482-910');
  const [handleInput, setHandleInput] = useState(creatorHandle.replace('@', ''));
  const [placeInput, setPlaceInput] = useState(placeName);

  const [dirHandle, setDirHandle] = useState('CreatorLive');
  const [dirPlace, setDirPlace] = useState('FrontPageHit.rbxl');

  const isBusy = connectionStatus === 'probing' || connectionStatus === 'pairing';

  return (
    <>
      {/* Studio Pairing Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="rbx-panel rounded-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-studs px-6 py-4 bg-[#141927] border-b-2 border-[#242D42] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00E676]/15 border-2 border-[#00E676]/50 flex items-center justify-center">
                  <PlugZap className="w-5 h-5 text-[#00E676]" />
                </div>
                <div>
                  <h3 className="font-builder font-extrabold text-base text-white">
                    Roblox Studio Auto-Sync Bridge
                  </h3>
                  <p className="text-xs text-[#8D9BB8]">
                    Creator Store Plugin · Local Loopback Port 38412
                  </p>
                </div>
              </div>
              <button
                onClick={closeConnectModal}
                className="p-1.5 rounded-lg bg-[#1C2336] text-[#96A4C2] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {connectionStatus === 'connected' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#00E676]/10 border-2 border-[#00E676]/40 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00E676] shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-builder font-bold text-sm text-white">
                        Live Session Connected: <span className="text-[#00E676] font-luau">{placeName}</span>
                      </p>
                      <p className="text-[#A8B6D1]">
                        Authenticated Studio user <strong className="text-white">{creatorHandle}</strong> · Bidirectional Explorer read/write enabled via TLS 1.3 bridge.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-luau">
                    <div className="p-3 rounded-xl bg-[#0D1018] border border-[#222A3D]">
                      <span className="text-[#7080A0] block text-[10px]">BRIDGE ENDPOINT</span>
                      <span className="text-[#5CC6FF] font-bold">ws://127.0.0.1:38412</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#0D1018] border border-[#222A3D]">
                      <span className="text-[#7080A0] block text-[10px]">INDEXED SERVICES</span>
                      <span className="text-[#00E676] font-bold">Workspace + 6 more</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={disconnectStudio}
                      className="rbx-btn rbx-btn-slate px-4 py-2.5 rounded-xl text-xs"
                    >
                      Disconnect Session
                    </button>
                    <button
                      onClick={() => {
                        closeConnectModal();
                        navigate('/studio');
                      }}
                      className="rbx-btn rbx-btn-emerald px-5 py-2.5 rounded-xl text-xs"
                    >
                      Open Studio Agent
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 1: Auto Scan Localhost */}
                  <div className="p-3.5 rounded-xl bg-[#0E121B] border border-[#232B40] flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <p className="font-builder font-bold text-white">1. Detect Open Roblox Studio</p>
                      <p className="text-[#8594B2] text-[11px]">
                        Scans <code className="font-luau text-[#5CC6FF]">127.0.0.1:38412</code> for the Baseplate Bridge plugin.
                      </p>
                    </div>
                    <button
                      disabled={isBusy}
                      onClick={probeLocalPort}
                      className="rbx-btn rbx-btn-slate px-3 py-2 rounded-xl text-xs shrink-0 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus === 'probing' ? 'animate-spin text-[#29B6FF]' : ''}`} />
                      <span>Scan Port</span>
                    </button>
                  </div>

                  {/* Step 2: Pairing Code */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-builder font-bold text-xs text-white">
                        2. Enter 6-Digit Studio Pairing Code (or Cloud Sandbox)
                      </label>
                      <button
                        onClick={() => {
                          closeConnectModal();
                          navigate('/connect');
                        }}
                        className="text-[11px] text-[#29B6FF] hover:underline font-semibold cursor-pointer"
                      >
                        Plugin install guide →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-[#7C8BA8] uppercase block mb-1">
                          Pairing Code
                        </span>
                        <input
                          value={codeInput}
                          onChange={(e) => setCodeInput(e.target.value)}
                          placeholder="BP-482-910"
                          className="w-full px-3 py-2 rounded-xl bg-[#0B0E15] border-2 border-[#252F47] focus:border-[#00E676] outline-none font-luau text-sm text-[#00E676] font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#7C8BA8] uppercase block mb-1">
                          Roblox Handle
                        </span>
                        <input
                          value={handleInput}
                          onChange={(e) => setHandleInput(e.target.value)}
                          placeholder="BuilderDev"
                          className="w-full px-3 py-2 rounded-xl bg-[#0B0E15] border-2 border-[#252F47] focus:border-[#00A2FF] outline-none text-sm text-white font-semibold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#7C8BA8] uppercase block mb-1">
                          Active .rbxl Place
                        </span>
                        <input
                          value={placeInput}
                          onChange={(e) => setPlaceInput(e.target.value)}
                          placeholder="Place1.rbxl"
                          className="w-full px-3 py-2 rounded-xl bg-[#0B0E15] border-2 border-[#252F47] focus:border-[#00A2FF] outline-none font-luau text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {isBusy && (
                    <div className="p-3.5 rounded-xl bg-[#0C1524] border border-[#1E3A5F] flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-[#29B6FF] animate-spin shrink-0" />
                      <span className="font-luau text-xs text-[#9BD6FF]">{connectionStepText}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-[#7D8CA8] bg-[#0D1018] p-2.5 rounded-xl border border-[#1E2536]">
                    <ShieldCheck className="w-4 h-4 text-[#00E676] shrink-0" />
                    <span>
                      <strong>Zero-Password Bridge:</strong> Baseplate never asks for your Roblox password. Project files remain inside your local Roblox Studio session.
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-1">
                    <button
                      disabled={isBusy}
                      onClick={closeConnectModal}
                      className="rbx-btn rbx-btn-slate px-4 py-2.5 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isBusy}
                      onClick={async () => {
                        await pairWithStudio(codeInput, handleInput, placeInput);
                        closeConnectModal();
                      }}
                      className="rbx-btn rbx-btn-emerald px-5 py-2.5 rounded-xl text-xs disabled:opacity-60"
                    >
                      {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
                      <span>Pair &amp; Enable Auto-Sync</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Creator Broadcast / Showcase Controls (Alt + Shift + B) */}
      {directorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rbx-panel rounded-2xl max-w-md w-full p-6 space-y-4 border-[#A855F7]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#C084FC]" />
                <h3 className="font-builder font-black text-base text-white">
                  Broadcast Controls <span className="text-xs text-[#C084FC]">(Alt+Shift+B)</span>
                </h3>
              </div>
              <button onClick={() => setDirectorOpen(false)} className="text-[#8E9BB8] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#9BA8C7]">
              Session controls for live demos and showcase recordings.
            </p>

            <div className="space-y-2 p-3.5 rounded-xl bg-[#0C0F17] border border-[#242D42]">
              <p className="font-builder font-bold text-xs text-white">Instant Studio Session Override</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={dirHandle}
                  onChange={(e) => setDirHandle(e.target.value)}
                  placeholder="CreatorHandle"
                  className="px-2.5 py-1.5 rounded-lg bg-[#141926] border border-[#2B3550] text-xs text-white"
                />
                <input
                  value={dirPlace}
                  onChange={(e) => setDirPlace(e.target.value)}
                  placeholder="Project.rbxl"
                  className="px-2.5 py-1.5 rounded-lg bg-[#141926] border border-[#2B3550] text-xs font-luau text-white"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    forceInstantConnect(dirHandle, dirPlace);
                    setDirectorOpen(false);
                  }}
                  className="rbx-btn rbx-btn-emerald px-3 py-1.5 rounded-lg text-xs flex-1"
                >
                  Set Connected
                </button>
                <button
                  onClick={() => {
                    setDirectorOpen(false);
                    setTimeout(() => {
                      pushToast(
                        `Auto-Sync Push -> ${dirPlace}`,
                        `Injected 5 --!strict Luau scripts into ServerScriptService (19ms).`,
                        'emerald'
                      );
                    }, 5000);
                  }}
                  className="rbx-btn rbx-btn-blue px-3 py-1.5 rounded-lg text-xs flex-1"
                >
                  5s Delayed Sync Toast
                </button>
              </div>
            </div>

            <div className="space-y-2 p-3.5 rounded-xl bg-[#0C0F17] border border-[#242D42]">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="font-builder font-bold text-xs text-white">
                  Show Custom Modal on Next Sync / Export
                </span>
                <input
                  type="checkbox"
                  checked={demoBannerArmed}
                  onChange={(e) => setDemoBannerArmed(e.target.checked)}
                  className="w-4 h-4 accent-[#00E676]"
                />
              </label>
              <textarea
                rows={2}
                value={demoCustomMessage}
                onChange={(e) => setDemoCustomMessage(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#141926] border border-[#2B3550] text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Broadcast Modal */}
      {demoBannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg">
          <div className="rbx-panel rounded-3xl max-w-md w-full p-7 text-center space-y-4 border-[#FFD54F]">
            <div className="w-16 h-16 rounded-2xl bg-[#FFD54F]/20 border-2 border-[#FFD54F] mx-auto flex items-center justify-center">
              <PartyPopper className="w-9 h-9 text-[#FFD54F]" />
            </div>
            <h2 className="font-cartoon text-3xl text-[#FFD54F] rbx-text-stroke">
              SURPRISE!!
            </h2>
            <p className="text-sm text-[#E2E8F5] font-semibold leading-relaxed">
              {demoCustomMessage}
            </p>
            <button
              onClick={() => setDemoBannerOpen(false)}
              className="rbx-btn rbx-btn-amber px-6 py-2.5 rounded-xl text-sm w-full"
            >
              Continue to Baseplate.gg
            </button>
          </div>
        </div>
      )}

      {/* Bottom-Right Roblox Studio Style Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          const borderCol =
            t.tone === 'emerald'
              ? 'border-[#00E676]/60'
              : t.tone === 'amber'
              ? 'border-[#FFB300]/60'
              : 'border-[#29B6FF]/60';
          return (
            <div
              key={t.id}
              className={`pointer-events-auto rbx-panel rounded-xl px-4 py-3 border-2 ${borderCol} bg-[#111623]/95 backdrop-blur-md`}
            >
              <p className="font-builder font-extrabold text-xs text-white">{t.title}</p>
              <p className="text-[11px] text-[#9BA9C6] mt-0.5">{t.detail}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};
