import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Move, Maximize2, RotateCw, MousePointer, Sparkles, Shield, Flame, Crosshair } from 'lucide-react';
import { GeneratedSystem } from '../data/presets';
import { sfx } from '../utils/sfx';

export const InteractiveViewport: React.FC<{
  system: GeneratedSystem;
  creatorHandle: string;
  onLog: (line: string) => void;
}> = ({ system, creatorHandle, onLog }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bootingPlay, setBootingPlay] = useState(false);
  const [yaw, setYaw] = useState(0.55);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Playtest Game State
  const [coins, setCoins] = useState(250);
  const [streak, setStreak] = useState(0);
  const [orbProgress, setOrbProgress] = useState(0.15);
  const [orbDir, setOrbDir] = useState<1 | -1>(1); // 1 = coming toward player, -1 = deflected to bot
  const [orbSpeed, setOrbSpeed] = useState(48);
  const [bannerText, setBannerText] = useState<string>('Press action button below to test mechanic!');
  const [fuel, setFuel] = useState(86);
  const [targetPos, setTargetPos] = useState({ x: 52, y: 46 });

  // Reset mini-state when system changes
  useEffect(() => {
    setStreak(0);
    setOrbSpeed(48);
    setBannerText(`Loaded ${system.title} — Click ▶ Play to test live!`);
  }, [system.id, system.title]);

  // Edit-Mode / Background 3D Baseplate Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let tick = 0;

    const render = () => {
      tick += 0.025;
      const w = canvas.width;
      const h = canvas.height;

      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      if (system.sceneType === 'horror') {
        sky.addColorStop(0, '#05070D');
        sky.addColorStop(1, '#0F1524');
      } else {
        sky.addColorStop(0, '#0C1629');
        sky.addColorStop(0.55, '#13203B');
        sky.addColorStop(1, '#0B0F19');
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Floor Baseplate Horizon
      const horizonY = h * 0.44;
      ctx.fillStyle = system.sceneType === 'horror' ? '#0B0F17' : '#141B29';
      ctx.fillRect(0, horizonY, w, h - horizonY);

      // Perspective Baseplate Grid (Rotated by yaw)
      const cx = w * 0.5;
      const cy = h * 0.68;
      const cos = Math.cos(yaw);
      const sin = Math.sin(yaw);

      ctx.strokeStyle = 'rgba(120, 160, 220, 0.14)';
      ctx.lineWidth = 1;

      const gridExtent = 9;
      const spacing = 34;

      const project = (gx: number, gy: number, gz: number) => {
        const rx = gx * cos - gz * sin;
        const rz = gx * sin + gz * cos + 340;
        const scale = 270 / Math.max(80, rz);
        return {
          x: cx + rx * scale,
          y: cy - gy * scale + (rz - 340) * 0.22,
          scale,
        };
      };

      for (let i = -gridExtent; i <= gridExtent; i++) {
        const p1 = project(i * spacing, 0, -gridExtent * spacing);
        const p2 = project(i * spacing, 0, gridExtent * spacing);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const p3 = project(-gridExtent * spacing, 0, i * spacing);
        const p4 = project(gridExtent * spacing, 0, i * spacing);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // Draw Roblox Stud dots across center baseplate
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let gx = -5; gx <= 5; gx++) {
        for (let gz = -5; gz <= 5; gz++) {
          const pt = project(gx * spacing, 0, gz * spacing);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(1.2, 2.5 * pt.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // SpawnLocation Pad at center
      const sp = project(0, 4, 0);
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = system.accent;
      ctx.lineWidth = 2;
      const padW = 68 * sp.scale;
      const padH = 24 * sp.scale;
      ctx.beginPath();
      ctx.roundRect(sp.x - padW / 2, sp.y - padH / 2, padW, padH, 5);
      ctx.fill();
      ctx.stroke();

      // Floating Focal Instance with SelectionBox in Edit Mode or Animated Core in Play Mode
      const bobY = 36 + Math.sin(tick * 2) * 7;
      const focal = project(0, bobY, 0);
      const r = 22 * focal.scale;

      // Glow aura
      const glow = ctx.createRadialGradient(focal.x, focal.y, 2, focal.x, focal.y, r * 2.8);
      glow.addColorStop(0, system.accent);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(focal.x, focal.y, r * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Core Object
      ctx.fillStyle = system.accent;
      ctx.beginPath();
      ctx.arc(focal.x, focal.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Cyan Roblox Studio SelectionBox when not playing
      if (!isPlaying) {
        ctx.strokeStyle = '#00A2FF';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(focal.x - r * 1.35, focal.y - r * 1.35, r * 2.7, r * 2.7);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [yaw, system.accent, system.sceneType, isPlaying]);

  // Playtest Simulation Loop (Blade Orb / Horror Fuel / Rivals Target)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      if (system.sceneType === 'blade') {
        setOrbProgress((prev) => {
          const step = (orbSpeed / 950) * orbDir;
          const next = prev + step;
          if (next >= 0.94) {
            setBannerText('💥 Hit! Timing missed — streak reset. Try again!');
            setStreak(0);
            setOrbSpeed(48);
            return 0.12;
          }
          if (next <= 0.08 && orbDir === -1) {
            setOrbDir(1);
            return 0.12;
          }
          return next;
        });
      } else if (system.sceneType === 'horror') {
        setFuel((f) => Math.max(0, +(f - 1.6).toFixed(1)));
      }
    }, 50);
    return () => clearInterval(timer);
  }, [isPlaying, system.sceneType, orbSpeed, orbDir]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      sfx.playClick();
      setIsPlaying(false);
      onLog(`[Studio PlaySolo] Stopped Play session — restored Edit Explorer state.`);
      return;
    }
    sfx.playClick();
    setBootingPlay(true);
    onLog(`[Studio PlaySolo] Compiling --!strict Luau & starting local Server + Client...`);
    setTimeout(() => {
      setBootingPlay(false);
      setIsPlaying(true);
      sfx.playSyncSuccess();
      onLog(`[Baseplate Runtime] ${system.title} initialized in 0.14s (0 errors, 0 warnings).`);
    }, 520);
  };

  const handleParryClick = () => {
    sfx.playActionHit();
    if (orbProgress >= 0.52 && orbProgress <= 0.92 && orbDir === 1) {
      const nextStreak = streak + 1;
      const nextSpd = Math.min(240, Math.round(orbSpeed * 1.18));
      setStreak(nextStreak);
      setOrbSpeed(nextSpd);
      setOrbDir(-1);
      setCoins((c) => c + 35);
      setBannerText(`⚡ PERFECT PARRY x${nextStreak}! Orb Speed: ${nextSpd} studs/s (+35 Coins)`);
      onLog(`[OrbAuthority] ${creatorHandle} deflected orb! Streak=${nextStreak}, Speed=${nextSpd}`);
    } else {
      setBannerText('Wait until the red orb enters the green PARRY ZONE!');
    }
  };

  const handlePrimarySimAction = () => {
    sfx.playPop();
    if (system.sceneType === 'garden') {
      const roll = Math.random();
      const mut =
        roll < 0.12
          ? { label: 'CELESTIAL x25', reward: 650 }
          : roll < 0.35
          ? { label: 'GOLDEN x4', reward: 180 }
          : { label: 'FRESH HARVEST', reward: 55 };
      setCoins((c) => c + mut.reward);
      setStreak((s) => s + 1);
      setBannerText(`🌱 Harvested [${mut.label}] Crop! +${mut.reward} Sheckles`);
      onLog(`[GardenPlotServer] Harvested ${mut.label} -> +${mut.reward} currency`);
    } else if (system.sceneType === 'horror') {
      setFuel((f) => Math.min(100, f + 24));
      setStreak((s) => s + 1);
      setCoins((c) => c + 20);
      setBannerText('🔥 Threw Pine Logs onto Campfire! (+24% Fuel · Sanity Restored)');
      onLog(`[NightDirector] Campfire fuel replenished by ${creatorHandle}`);
    } else if (system.sceneType === 'pets' || system.sceneType === 'aura') {
      const tiers = [
        { name: 'Cyber Shiba (Common)', gain: 30 },
        { name: 'Crystal Kitsune (Epic 1-in-25)', gain: 160 },
        { name: 'ASTRAL SOVEREIGN (1-in-50,000!!)', gain: 1500 },
      ];
      const pick = Math.random() < 0.14 ? tiers[2] : Math.random() < 0.45 ? tiers[1] : tiers[0];
      setCoins((c) => c + pick.gain);
      setStreak((s) => s + 1);
      setBannerText(`✨ Rolled: ${pick.name} (+${pick.gain} Value)`);
      onLog(`[RNGServer] ${creatorHandle} pulled ${pick.name}`);
    } else {
      const gain = 60 + streak * 15;
      setCoins((c) => c + gain);
      setStreak((s) => s + 1);
      setBannerText(`✅ Triggered ${system.title} Server Action! +${gain} Coins`);
      onLog(`[${system.scripts[0]?.name || 'Server'}] Action validated -> +${gain} Coins`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0E16] rounded-xl border-2 border-[#21293D] overflow-hidden">
      {/* Authentic Roblox Studio Viewport Ribbon */}
      <div className="px-3 py-2 bg-[#141926] border-b border-[#232C42] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleTogglePlay}
            className={`px-3 py-1 rounded-lg font-builder font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
              isPlaying
                ? 'bg-[#EF4444] text-white shadow-[0_2px_0_#991B1B]'
                : 'bg-[#00A2FF] text-white shadow-[0_2px_0_#0369A1] hover:brightness-110'
            }`}
          >
            {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Stop (Shift+F5)' : 'Playtest (F5)'}</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 ml-2 pl-2 border-l border-[#263047] text-[#8B99B8]">
            <span className="p-1 rounded bg-[#1E2638] text-white" title="Select">
              <MousePointer className="w-3.5 h-3.5" />
            </span>
            <span className="p-1 rounded hover:bg-[#1E2638]" title="Move">
              <Move className="w-3.5 h-3.5" />
            </span>
            <span className="p-1 rounded hover:bg-[#1E2638]" title="Scale">
              <Maximize2 className="w-3.5 h-3.5" />
            </span>
            <span className="p-1 rounded hover:bg-[#1E2638]" title="Rotate">
              <RotateCw className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-luau text-[10.5px] text-[#8594B2]">
          <span className="px-2 py-0.5 rounded bg-[#0E121C] border border-[#222B40] text-[#00E676]">
            240 FPS
          </span>
          <span className="hidden md:inline">Studs: 1.0</span>
        </div>
      </div>

      {/* Main 3D Baseplate + In-Game ScreenGui Overlay */}
      <div
        className="relative flex-1 min-h-[290px] select-none overflow-hidden"
        onMouseDown={(e) => {
          draggingRef.current = true;
          lastXRef.current = e.clientX;
        }}
        onMouseMove={(e) => {
          if (!draggingRef.current) return;
          const dx = e.clientX - lastXRef.current;
          lastXRef.current = e.clientX;
          setYaw((y) => y + dx * 0.008);
        }}
        onMouseUp={() => {
          draggingRef.current = false;
        }}
        onMouseLeave={() => {
          draggingRef.current = false;
        }}
      >
        <canvas ref={canvasRef} width={680} height={360} className="w-full h-full object-cover cursor-grab active:cursor-grabbing" />

        {/* Booting Play Solo Flash */}
        {bootingPlay && (
          <div className="absolute inset-0 bg-[#090C14]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20">
            <div className="w-9 h-9 rounded-xl border-2 border-[#00A2FF] border-t-transparent animate-spin" />
            <p className="font-builder font-bold text-xs text-white">Starting Roblox Play Solo Server...</p>
          </div>
        )}

        {/* Top-Right Authentic Roblox In-Game Leaderstats Overlay */}
        <div className="absolute top-3 right-3 bg-[#090C14]/85 backdrop-blur-md border border-white/15 rounded-xl px-3 py-2 min-w-[165px] text-[11px] pointer-events-none">
          <div className="flex items-center justify-between text-[#7F8FA8] font-bold border-b border-white/10 pb-1 mb-1 text-[10px]">
            <span>People</span>
            <span className="flex gap-3">
              <span>Coins</span>
              <span>Streak</span>
            </span>
          </div>
          <div className="flex items-center justify-between font-builder font-bold text-white">
            <span className="truncate max-w-[85px] text-[#00E676]">{creatorHandle}</span>
            <span className="flex gap-4 font-luau">
              <span className="text-[#FFD54F]">{coins}</span>
              <span>{streak}</span>
            </span>
          </div>
        </div>

        {/* Edit Mode Hint */}
        {!isPlaying && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#0B0E17]/85 backdrop-blur-md border border-[#242E45] text-[11px] text-[#9EB0CE]">
            <span>Drag viewport to orbit 3D Baseplate · SelectionBox active</span>
            <button
              onClick={handleTogglePlay}
              className="text-[#2AF598] font-builder font-extrabold hover:underline cursor-pointer"
            >
              Click ▶ Playtest to interact →
            </button>
          </div>
        )}

        {/* Live Interactive Roblox ScreenGui when Playtesting! */}
        {isPlaying && (
          <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
            {/* Top Status Banner */}
            <div className="max-w-[68%] px-3 py-1.5 rounded-xl bg-[#090C13]/90 border-2 border-[#00E676]/50 text-xs font-builder font-bold text-white shadow-lg">
              {bannerText}
            </div>

            {/* Scene-Specific Interactive Mini-Mechanic */}
            {system.sceneType === 'blade' && (
              <div className="my-auto mx-auto w-full max-w-sm bg-[#0D111C]/90 border-2 border-[#2A3550] rounded-2xl p-3 pointer-events-auto space-y-2">
                <div className="flex justify-between text-[10px] font-builder font-extrabold uppercase">
                  <span className="text-[#94A3B8]">Bot Opponent</span>
                  <span className="text-[#00E676]">Parry Zone →</span>
                </div>
                <div className="relative h-6 rounded-full bg-[#161D2E] border border-[#2C3856] overflow-hidden">
                  {/* Green Parry Window */}
                  <div className="absolute right-[8%] top-0 bottom-0 w-[38%] bg-[#00E676]/25 border-x border-[#00E676]" />
                  {/* Homing Energy Orb */}
                  <div
                    style={{ left: `${Math.min(93, Math.max(4, orbProgress * 100))}%` }}
                    className="absolute top-1 w-4 h-4 -ml-2 rounded-full bg-[#FF3B5C] shadow-[0_0_12px_#FF3B5C]"
                  />
                </div>
              </div>
            )}

            {system.sceneType === 'rivals' && (
              <div className="relative flex-1 pointer-events-auto">
                <button
                  onClick={() => {
                    sfx.playActionHit();
                    setCoins((c) => c + 85);
                    setStreak((s) => s + 1);
                    setBannerText(`🎯 -85 HEADSHOT CRIT! Elimination Streak x${streak + 1}`);
                    setTargetPos({
                      x: 18 + Math.floor(Math.random() * 62),
                      y: 22 + Math.floor(Math.random() * 52),
                    });
                    onLog(`[HitscanValidator] Confirmed Headshot (85 dmg) on RivalBot`);
                  }}
                  style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-xl bg-[#FF3B5C] border-2 border-white text-[10px] font-builder font-black text-white shadow-[0_0_18px_#FF3B5C] cursor-crosshair flex items-center gap-1"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  SHOOT BOT
                </button>
              </div>
            )}

            {system.sceneType === 'horror' && (
              <div className="mx-auto w-full max-w-xs bg-[#0E1118]/90 border-2 border-[#FFB300]/50 rounded-xl p-2.5 pointer-events-auto">
                <div className="flex justify-between text-[11px] font-builder font-bold mb-1">
                  <span className="text-[#FFD54F] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Campfire Fuel
                  </span>
                  <span className="font-luau text-white">{fuel}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-[#1C2230] overflow-hidden">
                  <div
                    style={{ width: `${fuel}%` }}
                    className="h-full bg-gradient-to-r from-[#FF6D00] to-[#FFD54F] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Bottom Glossy Roblox Action ScreenGui */}
            <div className="pointer-events-auto flex items-center justify-center gap-2.5">
              {system.sceneType === 'blade' ? (
                <button
                  onClick={handleParryClick}
                  className="rbx-btn rbx-btn-emerald px-6 py-2.5 rounded-xl text-xs tracking-wide"
                >
                  <Shield className="w-4 h-4" />
                  <span>DEFLECT PARRY [CLICK]</span>
                </button>
              ) : (
                <button
                  onClick={handlePrimarySimAction}
                  className="rbx-btn rbx-btn-emerald px-6 py-2.5 rounded-xl text-xs tracking-wide"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {system.sceneType === 'garden'
                      ? 'PLANT & HARVEST MUTATED CROP'
                      : system.sceneType === 'horror'
                      ? 'FEED PINE LOGS TO CAMPFIRE'
                      : system.sceneType === 'pets'
                      ? 'HATCH TRIPLE PET EGG (FREE)'
                      : system.sceneType === 'aura'
                      ? 'ROLL 1-IN-1M AURA'
                      : `TEST ${system.shortTag} ACTION`}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
