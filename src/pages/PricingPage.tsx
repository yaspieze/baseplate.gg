import React from 'react';
import { Check, Sparkles, Zap, ShieldCheck, Users } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export const PricingPage: React.FC = () => {
  const { navigate } = useStudio();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] font-builder font-extrabold text-xs">
          OPEN CREATOR GRANT · ZERO PAYWALLS
        </span>
        <h1 className="font-builder font-black text-4xl sm:text-5xl text-white">
          100% Free Forever. No Catch.
        </h1>
        <p className="text-sm sm:text-base text-[#94A3C2]">
          We built our own quantized Luau-native inference engine (<strong className="text-white">Baseplate-R3</strong>) so solo Roblox scripters and indie teams never hit a monthly credit wall again.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Solo Creator */}
        <div className="rbx-panel rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-builder font-extrabold text-sm text-[#8FA0C0]">SOLO CREATOR</span>
              <Zap className="w-5 h-5 text-[#29B6FF]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-builder font-black text-4xl text-white">$0</span>
              <span className="text-xs text-[#8594B2] font-bold">/ forever</span>
            </div>
            <p className="text-xs text-[#94A3C2]">
              Full Studio AI Agent &amp; GUI Forge access with zero credit deductions.
            </p>
            <ul className="space-y-2.5 text-xs text-[#DCE5F7] pt-2">
              {[
                'Unlimited Baseplate-R3 Luau prompts',
                'Unlimited 9-Slice GUI Forge generations',
                'Bidirectional Roblox Studio Auto-Sync',
                'Native .rbxmx one-click exports',
                '100% commercial ownership of all assets',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E676] shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => navigate('/studio')}
            className="rbx-btn rbx-btn-blue w-full py-3 rounded-xl text-xs"
          >
            Start Building Free
          </button>
        </div>

        {/* Highlighted Studio Squad */}
        <div className="rbx-panel rounded-3xl p-6 flex flex-col justify-between space-y-6 border-[#00E676] relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#00E676] text-[#052313] font-builder font-black text-[10px] tracking-wider">
            MOST POPULAR · CREATOR GRANT
          </span>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-builder font-extrabold text-sm text-[#00E676]">STUDIO SQUAD</span>
              <Users className="w-5 h-5 text-[#00E676]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-builder font-black text-4xl text-white">$0</span>
              <span className="text-xs line-through text-[#687796] font-bold">$29/mo</span>
              <span className="text-xs text-[#00E676] font-bold"> Covered Forever</span>
            </div>
            <p className="text-xs text-[#94A3C2]">
              For Team Create groups shipping front-page Roblox experiences together.
            </p>
            <ul className="space-y-2.5 text-xs text-[#DCE5F7] pt-2">
              {[
                'Everything in Solo Creator ($0/mo)',
                '128k Context Baseplate-Architect model',
                'Multi-developer Team Create Auto-Sync',
                'BaseplateMCP Server for Cursor & Claude',
                'Private generations by default',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00E676] shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => navigate('/studio')}
            className="rbx-btn rbx-btn-emerald w-full py-3 rounded-xl text-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Claim Free Squad Access</span>
          </button>
        </div>

        {/* Self-Hosted Studio Cluster */}
        <div className="rbx-panel rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-builder font-extrabold text-sm text-[#C084FC]">DEDICATED NODE</span>
              <ShieldCheck className="w-5 h-5 text-[#C084FC]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-builder font-black text-4xl text-white">$0</span>
              <span className="text-xs text-[#8594B2] font-bold">/ open weights CLI</span>
            </div>
            <p className="text-xs text-[#94A3C2]">
              Run local quantized Baseplate-R3 checkpoints on your own GPU workstation.
            </p>
            <ul className="space-y-2.5 text-xs text-[#DCE5F7] pt-2">
              {[
                'Offline local Studio port 38412 relay',
                'Custom studio style-guide fine-tuning',
                'Zero telemetry air-gapped mode',
                'Rojo + Wally + Aftman project support',
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C084FC] shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => navigate('/connect')}
            className="rbx-btn rbx-btn-slate w-full py-3 rounded-xl text-xs"
          >
            Configure Local MCP
          </button>
        </div>
      </div>

      {/* Benchmark Comparison Table */}
      <div className="rbx-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-4 bg-[#131928] border-b border-[#232D44]">
          <h3 className="font-builder font-extrabold text-base text-white">
            Roblox Luau Benchmark (2026 Creator Suite Eval)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E121D] text-[#8594B2] font-builder uppercase">
              <tr>
                <th className="px-6 py-3">Platform</th>
                <th className="px-6 py-3">--!strict Compile Pass</th>
                <th className="px-6 py-3">Live Studio Auto-Sync</th>
                <th className="px-6 py-3">9-Slice GUI Kit Export</th>
                <th className="px-6 py-3">Monthly Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D2538] font-medium">
              <tr className="bg-[#00E676]/5 text-white font-bold">
                <td className="px-6 py-3.5 text-[#00E676] font-builder">baseplate.gg (Baseplate-R3)</td>
                <td className="px-6 py-3.5 font-luau">98.6%</td>
                <td className="px-6 py-3.5 text-[#00E676]">Included (Bidirectional)</td>
                <td className="px-6 py-3.5 text-[#00E676]">Included (.rbxmx)</td>
                <td className="px-6 py-3.5 text-[#00E676]">$0 Forever</td>
              </tr>
              <tr className="text-[#9BA9C6]">
                <td className="px-6 py-3.5">Paid Roblox Wrapper Tools</td>
                <td className="px-6 py-3.5 font-luau">89.1%</td>
                <td className="px-6 py-3.5">Plugin Required</td>
                <td className="px-6 py-3.5">Credit Gated</td>
                <td className="px-6 py-3.5">$19 – $49/mo</td>
              </tr>
              <tr className="text-[#9BA9C6]">
                <td className="px-6 py-3.5">General Purpose Chatbots</td>
                <td className="px-6 py-3.5 font-luau">61.4%</td>
                <td className="px-6 py-3.5 text-[#EF4444]">None (Manual Copy-Paste)</td>
                <td className="px-6 py-3.5 text-[#EF4444]">None</td>
                <td className="px-6 py-3.5">$20/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
