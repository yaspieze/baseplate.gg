import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Check,
  X,
  Zap,
  Layers,
  PlugZap,
  Download,
  ChevronDown,
  Shield,
  Cpu,
  Code2,
} from 'lucide-react';
import { SHOWCASE_PRESETS, GeneratedSystem } from '../data/presets';
import { ShowcaseSceneCard } from '../components/ShowcaseSceneCard';
import { useStudio } from '../context/StudioContext';

const HERO_PLACEHOLDERS = [
  'Build a Blade Ball homing orb parry mechanic using @ServerScriptService and streak HUD...',
  'Make a Rivals 5v5 hitscan rifle with headshot crits and @StarterGui crosshair...',
  'Create a Grow a Garden plot system with Celestial crop mutations and Sheckles shop...',
  'Generate a 99 Nights forest campfire fuel & sanity survival loop in @Workspace...',
];

const FAQS = [
  {
    q: 'How is Baseplate.gg actually 100% Free Forever with no credit limits?',
    a: 'Unlike general wrappers paying markup per token, Baseplate Labs runs our own quantized Luau-native model family (Baseplate-R3) backed by our Open Creator Grant. Core Luau generation, GUI Forge kits, and Studio Auto-Sync are $0 forever with zero credit paywalls.',
  },
  {
    q: 'How does Auto-Sync connect to my Roblox Studio project?',
    a: 'Install the lightweight Baseplate Bridge plugin in Roblox Studio (or use BaseplateMCP). It opens a local loopback socket on 127.0.0.1:38412 so approved scripts and ScreenGuis inject straight into ServerScriptService, ReplicatedStorage, and StarterGui.',
  },
  {
    q: 'Does Baseplate.gg host or store my private .rbxl place files?',
    a: 'Never. Just like working locally in Roblox Studio, your place geometry stays on your computer or Roblox Cloud. Baseplate only reads Explorer instance names when you reference them with @mentions.',
  },
  {
    q: 'Can I export scripts and GUIs without installing the Studio plugin?',
    a: 'Yes! Every generation includes 1-click .rbxmx XML export. Simply download the .rbxmx package and drag-and-drop it directly onto your Roblox Studio viewport.',
  },
];

export const HomePage: React.FC = () => {
  const { navigate, setActiveSystem } = useStudio();
  const [heroPrompt, setHeroPrompt] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [selectedModel, setSelectedModel] = useState('Baseplate-R3');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % HERO_PLACEHOLDERS.length);
    }, 3800);
    return () => clearInterval(t);
  }, []);

  const handleLaunchPrompt = (promptText?: string) => {
    const finalPrompt = (promptText ?? heroPrompt).trim() || HERO_PLACEHOLDERS[placeholderIdx];
    navigate('/studio', finalPrompt);
  };

  const handleSelectShowcase = (sys: GeneratedSystem) => {
    setActiveSystem(sys);
    navigate('/studio', sys.prompt);
  };

  const row1 = [...SHOWCASE_PRESETS.slice(0, 4), ...SHOWCASE_PRESETS.slice(0, 4)];
  const row2 = [...SHOWCASE_PRESETS.slice(4, 8), ...SHOWCASE_PRESETS.slice(4, 8)];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-8 px-4 overflow-hidden bg-studs">
        {/* Ambient Emerald + Roblox Blue Glow */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[760px] h-[360px] bg-gradient-to-r from-[#00E676]/20 via-[#00A2FF]/18 to-[#A855F7]/15 blur-[110px] rounded-full" />

        <div className="max-w-5xl mx-auto relative text-center space-y-6">
          {/* Creator Count Social Proof Badge (lemonade.gg + forgegui.com style) */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#121725]/90 border-2 border-[#25304A] shadow-[0_4px_0_#07090E]">
            <div className="flex -space-x-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00E676] to-[#0284C7] border-2 border-[#121725] inline-block" />
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD54F] to-[#F97316] border-2 border-[#121725] inline-block" />
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#EC4899] to-[#8B5CF6] border-2 border-[#121725] inline-block" />
            </div>
            <span className="text-xs font-builder font-extrabold text-white">
              Join <span className="text-[#00E676]">+640,000</span> Roblox Creators
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#00E676]/20 text-[#00E676] font-luau font-bold text-[10px]">
              $0 FOREVER
            </span>
          </div>

          {/* Main Roblox Geometric Headline */}
          <h1 className="font-builder font-black text-4xl sm:text-6xl md:text-[64px] leading-[1.04] tracking-tight text-white">
            Build the Roblox game{' '}
            <span className="bg-gradient-to-r from-[#2AF598] via-[#00E676] to-[#29B6FF] bg-clip-text text-transparent">
              only you can imagine.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#9BA9C6] font-medium leading-relaxed">
            Your all-in-one Roblox AI game agent &amp; GUI forge. Generate server-authoritative{' '}
            <code className="font-luau text-[#00E676] text-xs bg-[#121826] px-1.5 py-0.5 rounded border border-[#23304A]">
              --!strict
            </code>{' '}
            Luau systems, 9-slice ScreenGuis, and playable mechanics synced straight into Roblox Studio.
          </p>

          {/* Interactive Hero Prompt Bar */}
          <div className="max-w-3xl mx-auto rbx-panel rounded-2xl p-3 sm:p-4 text-left space-y-3 border-[#2C3856]">
            <textarea
              rows={3}
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleLaunchPrompt();
                }
              }}
              placeholder={HERO_PLACEHOLDERS[placeholderIdx]}
              className="w-full bg-[#0B0E16] rounded-xl p-3.5 text-sm text-white placeholder-[#687796] border-2 border-[#1E263B] focus:border-[#00E676] outline-none resize-none font-medium"
            />

            {/* @Mention Quick Chips + Generate CTA */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {['@ServerScriptService', '@StarterGui', '@Workspace', '@ReplicatedStorage'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setHeroPrompt((prev) => `${prev ? prev + ' ' : 'Using '}${tag} `)}
                    className="px-2.5 py-1 rounded-lg bg-[#151B2B] hover:bg-[#1D253B] border border-[#28334E] font-luau text-[11px] text-[#7DD3FC] cursor-pointer transition-colors"
                  >
                    {tag}
                  </button>
                ))}

                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-[#151B2B] border border-[#28334E] text-[11px] font-builder font-bold text-[#C7D2FE] outline-none cursor-pointer"
                >
                  <option value="Baseplate-R3">Model: Baseplate-R3 (Free)</option>
                  <option value="Luau-Fast 2.5">Model: Luau-Fast 2.5 (Free)</option>
                  <option value="ForgeUI-Vision v4">Model: ForgeUI-Vision v4 (Free)</option>
                </select>
              </div>

              <button
                onClick={() => handleLaunchPrompt()}
                className="rbx-btn rbx-btn-emerald px-5 py-2.5 rounded-xl text-xs sm:text-sm w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate in Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Genre Starter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs text-[#7382A0] font-semibold">Try instant templates:</span>
            {SHOWCASE_PRESETS.slice(0, 4).map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectShowcase(preset)}
                className="px-3 py-1 rounded-full bg-[#131826] hover:bg-[#1B2236] border border-[#26304A] text-xs font-builder font-bold text-[#D6E0F5] hover:text-[#00E676] transition-colors cursor-pointer"
              >
                {preset.genre} →
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* INFINITE SCROLLING ROBLOX GAME SHOWCASE MARQUEES (lemonade.gg & forgegui.com signature) */}
      <section className="space-y-4 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-builder font-extrabold uppercase tracking-wider text-[#00E676]">
              REAL-GAME ARCHITECTURES
            </span>
            <h2 className="font-builder font-black text-2xl sm:text-3xl text-white">
              Make any front-page genre just by chatting.
            </h2>
          </div>
          <button
            onClick={() => navigate('/showcase')}
            className="text-xs font-builder font-bold text-[#29B6FF] hover:underline hidden sm:inline-flex items-center gap-1 cursor-pointer"
          >
            View all community builds <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4 py-2">
          <div className="animate-marquee-left gap-4 px-4">
            {row1.map((sys, idx) => (
              <ShowcaseSceneCard
                key={`r1-${sys.id}-${idx}`}
                system={sys}
                compact
                onSelect={handleSelectShowcase}
              />
            ))}
          </div>

          <div className="animate-marquee-right gap-4 px-4">
            {row2.map((sys, idx) => (
              <ShowcaseSceneCard
                key={`r2-${sys.id}-${idx}`}
                system={sys}
                compact
                onSelect={handleSelectShowcase}
              />
            ))}
          </div>
        </div>
      </section>

      {/* OLD WAY VS BASEPLATE WAY (Lemonade.gg viral developer pitch) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-builder font-extrabold uppercase tracking-wider text-[#29B6FF]">
            BUILT EXCLUSIVELY FOR ROBLOX STUDIO
          </span>
          <h2 className="font-builder font-black text-3xl sm:text-4xl text-white">
            Stop fighting generic chatbots for your Luau scripts.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* The Old Way */}
          <div className="rbx-panel rounded-2xl p-6 border-[#3B2029] bg-gradient-to-b from-[#191218] to-[#100D12] space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#FCA5A5] font-builder font-extrabold text-xs">
              <X className="w-4 h-4 text-[#EF4444]" />
              THE OLD WAY (Generic AI Chatbots)
            </div>
            <ul className="space-y-3 text-sm text-[#B8A8B4]">
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                <span>Zero visibility into your Explorer hierarchy — hallucinates missing RemoteEvents and folders.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                <span>Writes deprecated Lua 5.1 (<code className="font-luau text-xs">wait()</code>, <code className="font-luau text-xs">spawn()</code>) with insecure client-side cash checks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                <span>Endless manual copy-pasting across 10+ Script, LocalScript, and ModuleScript objects.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <X className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                <span>$20–$40/month prompt caps before your game prototype even compiles.</span>
              </li>
            </ul>
          </div>

          {/* The Baseplate Way */}
          <div className="rbx-panel rounded-2xl p-6 border-[#00E676]/50 bg-gradient-to-b from-[#10211B] to-[#0D131C] space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#00E676]/15 border border-[#00E676]/50 text-[#6BFFB3] font-builder font-extrabold text-xs">
              <Check className="w-4 h-4 text-[#00E676]" />
              THE BASEPLATE.GG WAY
            </div>
            <ul className="space-y-3 text-sm text-[#D6E6DF]">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span><strong>Live Explorer Context:</strong> Mention <code className="font-luau text-xs text-[#00E676]">@StarterPack</code> or <code className="font-luau text-xs text-[#00E676]">@Workspace</code> so every reference matches your real place.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span><strong>Modern Luau 0.654:</strong> Strict typechecking, rate-limited RemoteEvents, and <code className="font-luau text-xs text-[#00E676]">task</code> library out of the box.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span><strong>Bidirectional Auto-Sync + .rbxmx Export:</strong> Inject scripts straight into Studio or drag-and-drop valid XML packages.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span><strong>100% Free Forever:</strong> Unlimited generations, GUI Forge kits, and BaseplateMCP access at $0/mo.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ONE PLATFORM. INFINITE ROBLOX TOOLS (ForgeGUI style feature grid) */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-builder font-extrabold uppercase tracking-wider text-[#00E676]">
            ONE PLATFORM · INFINITE MODELS
          </span>
          <h2 className="font-builder font-black text-3xl sm:text-4xl text-white">
            Everything required to ship a front-page hit.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: <Code2 className="w-6 h-6 text-[#00E676]" />,
              title: 'Baseplate-R3 Luau Agent',
              desc: 'Multi-file server + client systems with exploit-proof validation and DataStore session locking.',
              cta: 'Open Studio AI',
              to: '/studio' as const,
            },
            {
              icon: <Layers className="w-6 h-6 text-[#29B6FF]" />,
              title: '9-Slice GUI & Icon Forge',
              desc: 'Generate glossy Simulator shops, Tactical HUDs, UICorner/UIStroke frames, and TweenService code.',
              cta: 'Open GUI Forge',
              to: '/gui' as const,
            },
            {
              icon: <PlugZap className="w-6 h-6 text-[#FFD54F]" />,
              title: 'Auto-Sync & BaseplateMCP',
              desc: 'Pair Roblox Studio via our Creator Store bridge or wire Cursor & Claude Code through BaseplateMCP.',
              cta: 'Setup Plugin',
              to: '/connect' as const,
            },
            {
              icon: <Download className="w-6 h-6 text-[#C084FC]" />,
              title: 'Native .rbxmx Export',
              desc: 'Download real Roblox XML model hierarchies ready to drag directly into any open Studio place.',
              cta: 'Read Docs',
              to: '/docs' as const,
            },
          ].map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.to)}
              className="rbx-panel rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-[#00E676]/60 transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#192133] border-2 border-[#2A3654] flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="font-builder font-extrabold text-base text-white">{card.title}</h3>
                <p className="text-xs text-[#93A2C0] leading-relaxed">{card.desc}</p>
              </div>
              <span className="text-xs font-builder font-extrabold text-[#00E676] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                {card.cta} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FREQUENT QUESTIONS (ForgeGUI & Lemonade style) */}
      <section className="max-w-3xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-builder font-black text-3xl text-white">Frequent Questions</h2>
          <p className="text-xs text-[#8D9CB8]">Everything you need to know about Baseplate.gg &amp; Studio Sync.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q} className="rbx-panel rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer"
                >
                  <span className="font-builder font-bold text-sm text-white">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#00E676] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-[#9AA8C6] leading-relaxed border-t border-[#21293D] pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Final CTA Banner */}
        <div className="rbx-panel bg-studs rounded-3xl p-8 text-center space-y-4 border-[#00E676]/50 mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E676]/15 text-[#00E676] text-xs font-builder font-extrabold">
            <Cpu className="w-3.5 h-3.5" />
            <Shield className="w-3.5 h-3.5" />
            <span>NO CREDIT CARD · NO PROMPT CAPS · $0 FOREVER</span>
          </div>
          <h3 className="font-builder font-black text-2xl sm:text-3xl text-white">
            Ready to turn an empty Baseplate into a front-page game?
          </h3>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              onClick={() => navigate('/studio')}
              className="rbx-btn rbx-btn-emerald px-6 py-3 rounded-xl text-sm"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Studio AI Now</span>
            </button>
            <button
              onClick={() => navigate('/gui')}
              className="rbx-btn rbx-btn-blue px-6 py-3 rounded-xl text-sm"
            >
              <Layers className="w-4 h-4" />
              <span>Try GUI Forge</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
