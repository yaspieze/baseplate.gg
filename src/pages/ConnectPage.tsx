import React, { useState } from 'react';
import {
  PlugZap,
  Download,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Terminal,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { downloadRbxmxPackage } from '../utils/rbxExport';
import { sfx } from '../utils/sfx';

const MCP_CONFIG_JSON = `{
  "mcpServers": {
    "baseplate-roblox": {
      "command": "npx",
      "args": ["-y", "@baseplate-gg/mcp-server@latest"],
      "env": {
        "STUDIO_BRIDGE_PORT": "38412",
        "BASEPLATE_MODE": "free-unlimited"
      }
    }
  }
}`;

export const ConnectPage: React.FC = () => {
  const {
    connectionStatus,
    connectionStepText,
    placeName,
    creatorHandle,
    probeLocalPort,
    pairWithStudio,
    disconnectStudio,
    pushToast,
  } = useStudio();

  const [code, setCode] = useState('BP-482-910');
  const [handle, setHandle] = useState(creatorHandle.replace('@', ''));
  const [place, setPlace] = useState(placeName);
  const [copiedMcp, setCopiedMcp] = useState(false);

  const isBusy = connectionStatus === 'probing' || connectionStatus === 'pairing';

  const handleDownloadPluginFile = () => {
    sfx.playSyncSuccess();
    downloadRbxmxPackage('BaseplateStudioBridge_Plugin_v2_4', [
      {
        name: 'BaseplateBridgePlugin',
        className: 'Script',
        parentService: 'ServerScriptService',
        code: `--!strict
-- Baseplate.gg Studio Bridge Companion Plugin v2.4.1
-- Place inside your Roblox Studio Plugins folder or run via Command Bar
local HttpService = game:GetService("HttpService")
local toolbar = plugin:CreateToolbar("Baseplate.gg AI")
local btn = toolbar:CreateButton("Auto-Sync", "Connect to baseplate.gg", "rbxassetid://18940275118")

btn.Click:Connect(function()
	print("[Baseplate.gg] Bridge active on ws://127.0.0.1:38412 — Pairing Code: BP-482-910")
end)`,
      },
    ]);
    pushToast(
      'Downloaded BaseplateBridgePlugin.rbxmx!',
      'Drop into your Roblox Studio Plugins folder and click Connect.',
      'emerald'
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="space-y-2">
        <span className="text-xs font-builder font-extrabold uppercase tracking-wider text-[#00E676]">
          STUDIO AUTO-SYNC &amp; BASEPLATEMCP
        </span>
        <h1 className="font-builder font-black text-3xl sm:text-4xl text-white">
          Connect Roblox Studio in 30 Seconds
        </h1>
        <p className="text-sm text-[#95A4C2] max-w-2xl">
          Sync generated Luau scripts and ScreenGuis straight into your active Studio Explorer hierarchy — or wire BaseplateMCP to Cursor &amp; Claude Code.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Step-by-Step Plugin Install + Live Pairing (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Creator Store Plugin Card */}
          <div className="rbx-panel rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00E676] to-[#00A2FF] p-0.5">
                  <div className="w-full h-full rounded-[14px] bg-[#0D1320] flex items-center justify-center">
                    <PlugZap className="w-7 h-7 text-[#00E676]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-builder font-black text-lg text-white">
                      Baseplate Bridge Plugin
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-[#00E676]/15 text-[#00E676] font-luau text-[10px] font-bold">
                      VERIFIED · v2.4.1
                    </span>
                  </div>
                  <p className="text-xs text-[#8D9CB8] font-luau">
                    Creator Store Asset #18940275118 · Free · Windows &amp; macOS
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownloadPluginFile}
                className="rbx-btn rbx-btn-emerald px-4 py-2.5 rounded-xl text-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Plugin (.rbxmx)</span>
              </button>
            </div>

            <ol className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
              {[
                { step: '01', title: 'Install Plugin', desc: 'Drop the .rbxmx into Studio Plugins & confirm toolbar icon appears.' },
                { step: '02', title: 'Allow Loopback', desc: 'Approve localhost:38412 communication when Studio prompts you.' },
                { step: '03', title: 'Enter Pair Code', desc: 'Type the 6-digit code from the plugin widget below to link Auto-Sync.' },
              ].map((s) => (
                <li key={s.step} className="p-3.5 rounded-xl bg-[#0C1019] border border-[#212A40] space-y-1">
                  <span className="font-luau font-bold text-[#00E676] text-[11px]">STEP {s.step}</span>
                  <p className="font-builder font-extrabold text-white">{s.title}</p>
                  <p className="text-[#8B99B8] text-[11px] leading-relaxed">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Live Pairing Console */}
          <div className="rbx-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-builder font-extrabold text-base text-white">
                Live Studio Bridge Pairing
              </h3>
              <button
                disabled={isBusy}
                onClick={probeLocalPort}
                className="rbx-btn rbx-btn-slate px-3 py-1.5 rounded-xl text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus === 'probing' ? 'animate-spin text-[#29B6FF]' : ''}`} />
                <span>Probe Port 38412</span>
              </button>
            </div>

            {connectionStatus === 'connected' ? (
              <div className="p-4 rounded-xl bg-[#00E676]/10 border-2 border-[#00E676]/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00E676]" />
                  <div className="text-xs">
                    <p className="font-builder font-extrabold text-white text-sm">
                      Paired with {placeName} ({creatorHandle})
                    </p>
                    <p className="font-luau text-[#8CF7C4]">ws://127.0.0.1:38412/v2/bridge · Auto-Sync Active</p>
                  </div>
                </div>
                <button onClick={disconnectStudio} className="rbx-btn rbx-btn-slate px-3.5 py-2 rounded-xl text-xs">
                  Unpair
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10.5px] font-bold text-[#7F8FA8] uppercase block mb-1">
                      Plugin Pairing Code
                    </label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0A0D15] border-2 border-[#25304A] font-luau text-sm font-bold text-[#00E676] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-[#7F8FA8] uppercase block mb-1">
                      Studio Username
                    </label>
                    <input
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0A0D15] border-2 border-[#25304A] text-sm font-semibold text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-[#7F8FA8] uppercase block mb-1">
                      Place Filename
                    </label>
                    <input
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0A0D15] border-2 border-[#25304A] font-luau text-xs text-white outline-none"
                    />
                  </div>
                </div>

                {isBusy && (
                  <div className="p-3 rounded-xl bg-[#0C1524] border border-[#204066] flex items-center gap-2.5 text-xs font-luau text-[#8ED0FF]">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>{connectionStepText}</span>
                  </div>
                )}

                <button
                  disabled={isBusy}
                  onClick={() => pairWithStudio(code, handle, place)}
                  className="rbx-btn rbx-btn-emerald px-5 py-2.5 rounded-xl text-xs"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Connect &amp; Start Auto-Sync</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: BaseplateMCP + Troubleshooting (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* BaseplateMCP Card (like ForgeMCP) */}
          <div className="rbx-panel rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-builder font-extrabold text-[#29B6FF]">
                <Cpu className="w-4 h-4" />
                BaseplateMCP Server (Free)
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(MCP_CONFIG_JSON);
                  setCopiedMcp(true);
                  sfx.playPop();
                  setTimeout(() => setCopiedMcp(false), 1800);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#192236] text-[11px] font-builder font-bold text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedMcp ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMcp ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <p className="text-xs text-[#91A0BE] leading-relaxed">
              Use Claude Code, Cursor, or Roblox Studio’s native Assistant → Manage MCP Servers → Quick Connect to trigger Baseplate generations directly.
            </p>
            <pre className="p-3.5 rounded-xl bg-[#080B11] border border-[#1E273B] font-luau text-[11px] text-[#9CDCFE] overflow-x-auto">
              {MCP_CONFIG_JSON}
            </pre>
          </div>

          {/* Authentic Troubleshooting Guide */}
          <div className="rbx-panel rounded-2xl p-6 space-y-3">
            <h3 className="font-builder font-extrabold text-sm text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FFD54F]" />
              Troubleshooting Studio Connection
            </h3>
            <ul className="space-y-2.5 text-xs text-[#95A4C2] leading-relaxed">
              <li>
                <strong className="text-white">1. Play Solo is running:</strong> Stop active Playtest (<code className="font-luau text-[11px]">Shift+F5</code>) before pairing so Auto-Sync writes to permanent Explorer services.
              </li>
              <li>
                <strong className="text-white">2. Plugin Script Injection Permission:</strong> In Studio, open <code className="font-luau text-[11px]">Plugins → Manage Plugins → Baseplate Bridge</code> and enable <em>Script Injection</em> &amp; <em>localhost</em> requests.
              </li>
              <li>
                <strong className="text-white">3. Account Mismatch:</strong> Confirm your active Roblox Studio account matches your paired session handle.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
