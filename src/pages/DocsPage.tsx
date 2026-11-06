import React, { useState } from 'react';
import { BookOpen, Terminal, Layers, PlugZap, Shield, ArrowRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

const DOC_SECTIONS = [
  {
    id: 'quickstart',
    title: 'Generating Your First Game System',
    badge: 'Beginner',
    icon: <Terminal className="w-4 h-4 text-[#00E676]" />,
    content: [
      'Open the Studio AI workspace (/studio) and describe a focused mechanic — for example, "Create a server-validated dash ability on Q cooldown with trail particles in @StarterPlayerScripts".',
      'Baseplate-R3 executes a 4-stage pipeline: Context Indexing -> Architecture Planning -> --!strict Luau Streaming -> Studio Explorer Auto-Sync.',
      'Before publishing, click the "3D Baseplate & Playtest" tab inside Baseplate.gg or press F5 inside Roblox Studio to verify server/client behavior.',
    ],
    snippet: `-- Always structure prompts with target Explorer services:
-- "Build a round coin spawner in @Workspace managed by @ServerScriptService"`,
  },
  {
    id: 'mentions',
    title: 'Using @Explorer Context Mentions',
    badge: 'Workflow',
    icon: <BookOpen className="w-4 h-4 text-[#29B6FF]" />,
    content: [
      'Type @ inside any Baseplate prompt box to reference live Roblox Studio services (@Workspace, @ReplicatedStorage, @ServerScriptService, @StarterGui, @StarterPack).',
      'When paired via the Baseplate Bridge plugin, @mentions inspect child instance names and class types — never uploading private geometry or secret keys.',
      'This guarantees WaitForChild() paths and RemoteEvent bindings match your exact place structure on the first compile.',
    ],
    snippet: `local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Remotes = ReplicatedStorage:WaitForChild("ParryRemotes")`,
  },
  {
    id: 'guikits',
    title: 'Building Responsive 9-Slice GUI Kits',
    badge: 'Intermediate',
    icon: <Layers className="w-4 h-4 text-[#FFD54F]" />,
    content: [
      'Visit GUI Forge (/gui) to generate cohesive Simulator shops, Pet inventories, Daily Streak modals, and Tactical FPS HUDs.',
      'All generated ScreenGuis use UDim2.fromScale() rather than raw pixel offsets so frames scale cleanly across Mobile, Console, and 4K PC monitors.',
      'Adjust UICorner radius, UIStroke thickness, and Enum.Font (FredokaOne vs BuilderSansExtraBold) live before exporting to .rbxmx.',
    ],
    snippet: `mainFrame.AnchorPoint = Vector2.new(0.5, 0.5)
mainFrame.Position = UDim2.fromScale(0.5, 0.5)
mainFrame.Size = UDim2.fromScale(0.56, 0.62)`,
  },
  {
    id: 'mcp',
    title: 'Exporting & BaseplateMCP Protocol',
    badge: 'Advanced',
    icon: <PlugZap className="w-4 h-4 text-[#C084FC]" />,
    content: [
      'Don’t want to install a plugin right away? Every Studio AI and GUI Forge result exports as a schema-valid .rbxmx XML package.',
      'Drag the downloaded .rbxmx file straight from your browser downloads bar onto the Roblox Studio 3D viewport to unpack all folders and scripts.',
      'Power users using Rojo, Cursor, or Claude Code can enable BaseplateMCP on port 38412 for hands-free agentic sync.',
    ],
    snippet: `npx -y @baseplate-gg/mcp-server@latest --port 38412`,
  },
];

export const DocsPage: React.FC = () => {
  const { navigate } = useStudio();
  const [activeId, setActiveId] = useState('quickstart');

  const current = DOC_SECTIONS.find((d) => d.id === activeId) || DOC_SECTIONS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-4 rbx-panel rounded-2xl p-4 space-y-2 h-fit">
          <div className="px-2 py-1.5 border-b border-[#222B40] mb-2">
            <span className="text-[10.5px] font-builder font-extrabold uppercase tracking-wider text-[#00E676]">
              BASEPLATE DOCUMENTATION
            </span>
            <h2 className="font-builder font-black text-lg text-white">Reference Guide</h2>
          </div>

          {DOC_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveId(sec.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-2 text-xs font-builder font-bold cursor-pointer transition-colors ${
                sec.id === activeId
                  ? 'bg-[#1B2438] text-white border border-[#35466B]'
                  : 'text-[#8F9EBD] hover:bg-[#141A29] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                {sec.icon}
                <span className="truncate">{sec.title}</span>
              </span>
              <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-white/5 text-[#9BA9C6] shrink-0">
                {sec.badge}
              </span>
            </button>
          ))}
        </aside>

        {/* Article Body */}
        <article className="md:col-span-8 rbx-panel rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2 border-b border-[#222B40] pb-4">
            <span className="px-2.5 py-0.5 rounded-md bg-[#00E676]/15 text-[#00E676] font-builder font-extrabold text-[10.5px] uppercase">
              {current.badge} Guide
            </span>
            <h1 className="font-builder font-black text-2xl sm:text-3xl text-white">
              {current.title}
            </h1>
          </div>

          <div className="space-y-4 text-sm text-[#B7C4DF] leading-relaxed">
            {current.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-luau font-bold text-[#7F8FA8] uppercase">
              Example Snippet
            </span>
            <pre className="p-4 rounded-xl bg-[#090C13] border border-[#202940] font-luau text-xs text-[#8CF7C4] overflow-x-auto">
              {current.snippet}
            </pre>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1422] border border-[#23314F] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#9AA8C7]">
              <Shield className="w-4 h-4 text-[#00E676] shrink-0" />
              <span>Baseplate Labs Inc. is an independent developer tool and is not affiliated with Roblox Corporation.</span>
            </div>
            <button
              onClick={() => navigate('/studio')}
              className="rbx-btn rbx-btn-emerald px-4 py-2 rounded-xl text-xs"
            >
              <span>Open Studio AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};
