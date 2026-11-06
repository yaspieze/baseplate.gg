import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Download,
  Code2,
  Eye,
  Loader2,
  ShoppingBag,
  Backpack,
  Gift,
  Swords,
  Check,
  X,
} from 'lucide-react';
import { sfx } from '../utils/sfx';
import { downloadRbxmxPackage } from '../utils/rbxExport';
import { highlightLuauLine } from '../utils/luauHighlight';
import { useStudio } from '../context/StudioContext';

type GuiPresetType = 'shop' | 'inventory' | 'daily' | 'combat';
type GuiStyleTheme = 'simulator' | 'tactical' | 'cyber' | 'gold';

const THEME_CONFIG: Record<
  GuiStyleTheme,
  { name: string; primary: string; border: string; headerGrad: string; cartoon: boolean }
> = {
  simulator: {
    name: 'Glossy Simulator (Fredoka)',
    primary: '#00E676',
    border: '#5CFFAE',
    headerGrad: 'from-[#00E676] to-[#00B0FF]',
    cartoon: true,
  },
  tactical: {
    name: 'Rivals Tactical Dark',
    primary: '#00A2FF',
    border: '#38BDF8',
    headerGrad: 'from-[#0284C7] to-[#1E293B]',
    cartoon: false,
  },
  cyber: {
    name: 'Anime Neon Cyber',
    primary: '#EC4899',
    border: '#F472B6',
    headerGrad: 'from-[#EC4899] to-[#8B5CF6]',
    cartoon: false,
  },
  gold: {
    name: 'Tycoon VIP Gold',
    primary: '#FFB300',
    border: '#FFE082',
    headerGrad: 'from-[#FFB300] to-[#FF6D00]',
    cartoon: true,
  },
};

export const GuiForgePage: React.FC = () => {
  const { pushToast, demoBannerArmed, setDemoBannerOpen } = useStudio();

  const [guiType, setGuiType] = useState<GuiPresetType>('shop');
  const [theme, setTheme] = useState<GuiStyleTheme>('simulator');
  const [cornerRadius, setCornerRadius] = useState(18);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [customTitle, setCustomTitle] = useState('EXCLUSIVE GAMEPASS SHOP!');
  const [customPrompt, setCustomPrompt] = useState('');
  const [forging, setForging] = useState(false);
  const [forgePassText, setForgePassText] = useState('');
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [equippedSlot, setEquippedSlot] = useState<number>(0);
  const [claimedDay, setClaimedDay] = useState<number[]>([1, 2]);

  const activeTheme = THEME_CONFIG[theme];

  const handleForgeGenerate = async () => {
    sfx.playClick();
    setForging(true);
    const passes = [
      'Pass 1/4: Synthesizing UDim2 Scale responsive layout...',
      'Pass 2/4: Applying 9-Slice UICorner & UIStroke bevels...',
      'Pass 3/4: Baking UIGradient specular highlights...',
      'Pass 4/4: Compiling LocalScript TweenService spring controller...',
    ];
    for (const p of passes) {
      setForgePassText(p);
      await new Promise((r) => setTimeout(r, 640));
    }

    if (customPrompt.trim()) {
      const lower = customPrompt.toLowerCase();
      if (lower.includes('inv') || lower.includes('pet') || lower.includes('bag')) setGuiType('inventory');
      else if (lower.includes('daily') || lower.includes('reward') || lower.includes('gift')) setGuiType('daily');
      else if (lower.includes('hud') || lower.includes('health') || lower.includes('combat')) setGuiType('combat');
      else setGuiType('shop');
      setCustomTitle(customPrompt.trim().slice(0, 28).toUpperCase());
    }

    setForging(false);
    sfx.playSyncSuccess();
    pushToast('GUI Kit Forged!', 'Interactive ScreenGui + TweenService script ready (0 Credits).', 'emerald');
  };

  const generatedGuiLuau = `--!strict
-- Forged by Baseplate.gg GUI Forge v4 (9-Slice + TweenService Ready)
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")

local player = Players.LocalPlayer
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "BaseplateForged_${guiType.toUpperCase()}"
screenGui.IgnoreGuiInset = true
screenGui.ResetOnSpawn = false
screenGui.Parent = player:WaitForChild("PlayerGui")

local mainFrame = Instance.new("Frame")
mainFrame.Name = "Container"
mainFrame.AnchorPoint = Vector2.new(0.5, 0.5)
mainFrame.Position = UDim2.fromScale(0.5, 0.5)
mainFrame.Size = UDim2.fromScale(0.56, 0.62)
mainFrame.BackgroundColor3 = Color3.fromRGB(18, 23, 36)
mainFrame.Parent = screenGui

local uiCorner = Instance.new("UICorner")
uiCorner.CornerRadius = UDim.new(0, ${cornerRadius})
uiCorner.Parent = mainFrame

local uiStroke = Instance.new("UIStroke")
uiStroke.Thickness = ${strokeWidth}
uiStroke.Color = Color3.fromHex("${activeTheme.primary}")
uiStroke.Parent = mainFrame

local headerLabel = Instance.new("TextLabel")
headerLabel.Size = UDim2.fromScale(1, 0.16)
headerLabel.BackgroundTransparency = 1
headerLabel.Font = ${activeTheme.cartoon ? 'Enum.Font.FredokaOne' : 'Enum.Font.BuilderSansExtraBold'}
headerLabel.Text = "${customTitle.replace(/"/g, '')}"
headerLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
headerLabel.TextScaled = true
headerLabel.Parent = mainFrame

-- Pop-in Spring Animation
mainFrame.Size = UDim2.fromScale(0.42, 0.46)
TweenService:Create(
	mainFrame,
	TweenInfo.new(0.32, Enum.EasingStyle.Back, Enum.EasingDirection.Out),
	{ Size = UDim2.fromScale(0.56, 0.62) }
):Play()`;

  const handleExportGui = () => {
    if (demoBannerArmed) {
      setDemoBannerOpen(true);
      return;
    }
    sfx.playSyncSuccess();
    downloadRbxmxPackage(`ForgedGUI_${guiType}`, [
      {
        name: `Forged_${guiType}_Builder`,
        className: 'LocalScript',
        parentService: 'StarterGui',
        code: generatedGuiLuau,
      },
    ]);
    pushToast('Exported GUI .rbxmx!', 'Drop into StarterGui in Roblox Studio to spawn immediately.', 'emerald');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-builder font-extrabold uppercase tracking-wider text-[#29B6FF]">
            INSPIRED BY TOP FRONT-PAGE ROBLOX INTERFACES
          </span>
          <h1 className="font-builder font-black text-3xl sm:text-4xl text-white">
            AI Roblox GUI &amp; Asset Forge
          </h1>
          <p className="text-xs sm:text-sm text-[#93A2C0] mt-1">
            Generate glossy Roblox Simulator frames, Gamepass shops, Pet inventories, and{' '}
            <code className="font-luau text-[#00E676]">TweenService</code> scripts — 100% Free Forever.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'preview' ? 'code' : 'preview')}
            className="rbx-btn rbx-btn-slate px-4 py-2 rounded-xl text-xs"
          >
            {viewMode === 'preview' ? <Code2 className="w-4 h-4 text-[#29B6FF]" /> : <Eye className="w-4 h-4 text-[#00E676]" />}
            <span>{viewMode === 'preview' ? 'Inspect Luau Code' : 'Live Roblox GUI'}</span>
          </button>
          <button onClick={handleExportGui} className="rbx-btn rbx-btn-emerald px-4 py-2 rounded-xl text-xs">
            <Download className="w-4 h-4" />
            <span>Export to StarterGui (.rbxmx)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT CONTROLS (4 cols) */}
        <div className="lg:col-span-4 rbx-panel rounded-2xl p-5 space-y-5">
          {/* Prompt Box */}
          <div className="space-y-1.5">
            <label className="font-builder font-extrabold text-xs text-white uppercase">
              AI GUI Prompt
            </label>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Neon Cyber Pet Inventory with 3x Hatch & Equip buttons..."
              className="w-full px-3 py-2 rounded-xl bg-[#0A0D15] border-2 border-[#232D45] focus:border-[#00E676] text-xs text-white outline-none resize-none"
            />
          </div>

          {/* Preset Kit Selector */}
          <div className="space-y-1.5">
            <label className="font-builder font-extrabold text-xs text-white uppercase">
              ScreenGui Archetype
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'shop' as const, label: 'Gamepass Shop', icon: <ShoppingBag className="w-3.5 h-3.5" />, defaultTitle: 'EXCLUSIVE GAMEPASS SHOP!' },
                { id: 'inventory' as const, label: 'Pet Inventory', icon: <Backpack className="w-3.5 h-3.5" />, defaultTitle: 'MY PET INVENTORY (4/50)' },
                { id: 'daily' as const, label: 'Daily Rewards', icon: <Gift className="w-3.5 h-3.5" />, defaultTitle: 'DAILY LOGIN STREAK!' },
                { id: 'combat' as const, label: 'Combat HUD', icon: <Swords className="w-3.5 h-3.5" />, defaultTitle: 'ARENA LOADOUT HUD' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    sfx.playClick();
                    setGuiType(item.id);
                    setCustomTitle(item.defaultTitle);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-builder font-bold flex items-center gap-2 border-2 cursor-pointer transition-all ${
                    guiType === item.id
                      ? 'bg-[#1B2438] border-[#00E676] text-white'
                      : 'bg-[#101420] border-[#212A3E] text-[#8D9CB8] hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Roblox Visual Style */}
          <div className="space-y-1.5">
            <label className="font-builder font-extrabold text-xs text-white uppercase">
              Art Style &amp; Roblox Font
            </label>
            <div className="space-y-1.5">
              {(Object.keys(THEME_CONFIG) as GuiStyleTheme[]).map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    sfx.playClick();
                    setTheme(k);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-builder font-bold flex items-center justify-between border cursor-pointer ${
                    theme === k
                      ? 'bg-[#192236] border-white/40 text-white'
                      : 'bg-[#0F131E] border-[#20283C] text-[#8B9AB8]'
                  }`}
                >
                  <span>{THEME_CONFIG[k].name}</span>
                  <span
                    style={{ backgroundColor: THEME_CONFIG[k].primary }}
                    className="w-3.5 h-3.5 rounded-full border border-white/40"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Header Text + UICorner + UIStroke Sliders */}
          <div className="space-y-3 pt-1">
            <div>
              <span className="text-[11px] font-builder font-bold text-[#95A4C2] block mb-1">
                Header Banner Text
              </span>
              <input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#0A0D15] border border-[#25304A] text-xs font-bold text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10.5px] font-luau text-[#8D9CB8] block mb-1">
                  UICorner: {cornerRadius}px
                </span>
                <input
                  type="range"
                  min={4}
                  max={32}
                  value={cornerRadius}
                  onChange={(e) => setCornerRadius(Number(e.target.value))}
                  className="w-full accent-[#00E676]"
                />
              </div>
              <div>
                <span className="text-[10.5px] font-luau text-[#8D9CB8] block mb-1">
                  UIStroke: {strokeWidth}px
                </span>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full accent-[#29B6FF]"
                />
              </div>
            </div>
          </div>

          <button
            disabled={forging}
            onClick={handleForgeGenerate}
            className="rbx-btn rbx-btn-emerald w-full py-3 rounded-xl text-xs"
          >
            {forging ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{forging ? 'Forging GUI Kit...' : 'Forge GUI Kit (Free · 0 Credits)'}</span>
          </button>
        </div>

        {/* RIGHT INTERACTIVE ROBLOX GUI PREVIEW STAGE (8 cols) */}
        <div className="lg:col-span-8 rbx-panel rounded-2xl overflow-hidden flex flex-col min-h-[540px]">
          <div className="px-4 py-2.5 bg-[#131826] border-b border-[#232D44] flex items-center justify-between text-xs">
            <span className="font-builder font-extrabold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00E676]" />
              StarterGui Live Canvas (1920×1080 Scale)
            </span>
            <span className="font-luau text-[11px] text-[#7D8EAD]">
              Font: {activeTheme.cartoon ? 'Enum.Font.FredokaOne' : 'Enum.Font.BuilderSansExtraBold'}
            </span>
          </div>

          {viewMode === 'code' ? (
            <div className="flex-1 overflow-auto bg-[#090C13] p-4 font-luau text-xs leading-relaxed">
              {generatedGuiLuau.split('\n').map((ln, idx) => (
                <div key={idx} className="flex">
                  <span className="w-8 text-right pr-3 text-[#4A5775] select-none">{idx + 1}</span>
                  <pre>{highlightLuauLine(ln)}</pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative flex-1 bg-studs-bright bg-gradient-to-br from-[#131C31] via-[#0E1525] to-[#090D16] p-5 sm:p-8 flex items-center justify-center">
              {forging && (
                <div className="absolute inset-0 z-20 bg-[#080B12]/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <Loader2 className="w-9 h-9 text-[#00E676] animate-spin" />
                  <p className="font-builder font-extrabold text-sm text-white">{forgePassText}</p>
                </div>
              )}

              {/* ACTUAL INTERACTIVE ROBLOX IN-GAME SCREENGUI WINDOW */}
              <div
                style={{
                  borderRadius: `${cornerRadius}px`,
                  borderWidth: `${strokeWidth}px`,
                  borderColor: activeTheme.primary,
                }}
                className="w-full max-w-2xl bg-[#141A29]/95 shadow-[0_12px_0_#07090F,0_24px_50px_rgba(0,0,0,0.65)] overflow-hidden transition-all"
              >
                {/* Glossy Roblox Top Title Ribbon */}
                <div
                  className={`px-5 py-3.5 bg-gradient-to-r ${activeTheme.headerGrad} flex items-center justify-between border-b-2 border-black/30`}
                >
                  <h3
                    className={`text-lg sm:text-2xl text-white tracking-wide ${
                      activeTheme.cartoon
                        ? 'font-cartoon font-bold rbx-text-stroke'
                        : 'font-builder font-black uppercase rbx-text-stroke-sm'
                    }`}
                  >
                    {customTitle}
                  </h3>
                  <button
                    onClick={() => sfx.playClick()}
                    className="w-8 h-8 rounded-xl bg-[#EF4444] border-2 border-[#FCA5A5] shadow-[0_3px_0_#991B1B] flex items-center justify-center text-white cursor-pointer active:translate-y-0.5"
                  >
                    <X className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>

                {/* GUI CONTENT BODY */}
                <div className="p-5">
                  {guiType === 'shop' && (
                    <div className="grid sm:grid-cols-3 gap-3.5">
                      {[
                        { title: '2X COINS VIP', price: 'R$ 199', badge: 'BEST VALUE', color: 'from-[#FFD54F] to-[#FF9800]' },
                        { title: 'TRIPLE HATCH', price: 'R$ 399', badge: 'POPULAR', color: 'from-[#2AF598] to-[#00B0FF]' },
                        { title: 'CYBER KATANA', price: 'R$ 799', badge: 'LIMITED', color: 'from-[#F472B6] to-[#8B5CF6]' },
                      ].map((gp) => (
                        <div
                          key={gp.title}
                          className="rounded-2xl bg-[#0E1320] border-2 border-[#273350] p-3.5 flex flex-col items-center text-center gap-2.5 hover:scale-[1.02] transition-transform"
                        >
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9.5px] font-builder font-black text-[#FFD54F]">
                            {gp.badge}
                          </span>
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gp.color} border-2 border-white/60 shadow-lg flex items-center justify-center`}
                          >
                            <Sparkles className="w-7 h-7 text-[#0A101D]" />
                          </div>
                          <p
                            className={`text-sm text-white ${
                              activeTheme.cartoon ? 'font-cartoon font-bold rbx-text-stroke-sm' : 'font-builder font-black'
                            }`}
                          >
                            {gp.title}
                          </p>
                          <button
                            onClick={() => {
                              sfx.playPop();
                              pushToast(`PromptProductPurchase (${gp.title})`, `Simulated MarketplaceService prompt (${gp.price})`, 'emerald');
                            }}
                            className="rbx-btn rbx-btn-emerald w-full py-2 rounded-xl text-xs"
                          >
                            {gp.price}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {guiType === 'inventory' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { name: 'Void Dragon', mult: 'x145', rarity: 'SECRET', col: '#EC4899' },
                          { name: 'Solar Kitsune', mult: 'x68', rarity: 'MYTHIC', col: '#FFB300' },
                          { name: 'Frost Golem', mult: 'x32', rarity: 'EPIC', col: '#29B6FF' },
                          { name: 'Emerald Slime', mult: 'x12', rarity: 'RARE', col: '#00E676' },
                        ].map((pet, idx) => {
                          const eq = equippedSlot === idx;
                          return (
                            <div
                              key={pet.name}
                              onClick={() => {
                                sfx.playPop();
                                setEquippedSlot(idx);
                              }}
                              style={{ borderColor: eq ? pet.col : '#25304B' }}
                              className="rounded-2xl bg-[#0D121F] border-2 p-3 text-center space-y-1.5 cursor-pointer relative"
                            >
                              {eq && (
                                <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-[#00E676] text-[#052414] text-[9px] font-builder font-black">
                                  EQUIPPED
                                </span>
                              )}
                              <div
                                style={{ backgroundColor: `${pet.col}22`, borderColor: pet.col }}
                                className="w-11 h-11 mx-auto rounded-xl border flex items-center justify-center font-cartoon font-bold text-xs text-white"
                              >
                                {pet.mult}
                              </div>
                              <p className="font-builder font-extrabold text-xs text-white truncate">{pet.name}</p>
                              <p style={{ color: pet.col }} className="text-[9.5px] font-builder font-black">
                                {pet.rarity}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {guiType === 'daily' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { day: 1, reward: '+500 Coins' },
                        { day: 2, reward: '2x Luck Potion' },
                        { day: 3, reward: '+2,500 Gems' },
                        { day: 4, reward: 'Mythic Egg!' },
                      ].map((d) => {
                        const claimed = claimedDay.includes(d.day);
                        return (
                          <button
                            key={d.day}
                            onClick={() => {
                              sfx.playSyncSuccess();
                              if (!claimed) setClaimedDay((prev) => [...prev, d.day]);
                            }}
                            className={`rounded-2xl p-3.5 border-2 text-center space-y-2 cursor-pointer transition-all ${
                              claimed
                                ? 'bg-[#00E676]/15 border-[#00E676]/60'
                                : 'bg-[#0E1320] border-[#2A3655] hover:border-[#FFD54F]'
                            }`}
                          >
                            <span className="text-[10px] font-builder font-black text-[#96A5C4]">DAY {d.day}</span>
                            <p className="font-cartoon font-bold text-sm text-white">{d.reward}</p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-builder font-black text-[#00E676]">
                              {claimed ? (
                                <>
                                  <Check className="w-3 h-3" /> CLAIMED
                                </>
                              ) : (
                                'CLICK TO CLAIM'
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {guiType === 'combat' && (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-[#0D121E] border border-[#25314D] space-y-1.5">
                          <div className="flex justify-between text-xs font-builder font-extrabold">
                            <span className="text-[#00E676]">SHIELD INTEGRITY</span>
                            <span className="font-luau text-white">100 / 100</span>
                          </div>
                          <div className="h-3 rounded-full bg-[#172033] overflow-hidden">
                            <div className="h-full w-full bg-gradient-to-r from-[#00E676] to-[#29B6FF]" />
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0D121E] border border-[#25314D] space-y-1.5">
                          <div className="flex justify-between text-xs font-builder font-extrabold">
                            <span className="text-[#FFD54F]">ULTIMATE CHARGE [Q]</span>
                            <span className="font-luau text-white">84%</span>
                          </div>
                          <div className="h-3 rounded-full bg-[#172033] overflow-hidden">
                            <div className="h-full w-[84%] bg-gradient-to-r from-[#FFB300] to-[#FF3B5C]" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center gap-2.5">
                        {['[1] Katana', '[2] Pulse Rifle', '[3] Dash Orb', '[F] Parry'].map((slot, i) => (
                          <button
                            key={slot}
                            onClick={() => sfx.playClick()}
                            className={`px-3.5 py-2 rounded-xl font-builder font-extrabold text-xs border-2 cursor-pointer ${
                              i === 0
                                ? 'bg-[#1D2840] border-[#00A2FF] text-white'
                                : 'bg-[#0E1320] border-[#242F49] text-[#8E9DBB]'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
