import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { SHOWCASE_PRESETS, GeneratedSystem } from '../data/presets';
import { ShowcaseSceneCard } from '../components/ShowcaseSceneCard';
import { useStudio } from '../context/StudioContext';

const FILTERS = ['All Genres', 'Combat & FPS', 'Simulators', 'Survival & Mystery'];

export const ShowcasePage: React.FC = () => {
  const { navigate, setActiveSystem } = useStudio();
  const [filter, setFilter] = useState('All Genres');
  const [query, setQuery] = useState('');

  const filtered = SHOWCASE_PRESETS.filter((item) => {
    const matchesQuery =
      !query.trim() ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.prompt.toLowerCase().includes(query.toLowerCase()) ||
      item.genre.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;
    if (filter === 'Combat & FPS') return ['blade', 'rivals', 'bedwars'].includes(item.sceneType);
    if (filter === 'Simulators') return ['garden', 'pets', 'aura'].includes(item.sceneType);
    if (filter === 'Survival & Mystery') return ['horror', 'mystery'].includes(item.sceneType);
    return true;
  });

  const handleRemix = (sys: GeneratedSystem) => {
    setActiveSystem(sys);
    navigate('/studio', sys.prompt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-builder font-extrabold uppercase tracking-wider text-[#00E676]">
            640,000+ CREATOR COMMUNITY
          </span>
          <h1 className="font-builder font-black text-3xl sm:text-4xl text-white">
            Built with Baseplate.gg
          </h1>
          <p className="text-sm text-[#93A2C0] mt-1">
            Click any community system to inspect its <code className="font-luau text-[#00E676]">--!strict</code> Luau code, playtest it, or remix its prompt for free.
          </p>
        </div>

        <button
          onClick={() => navigate('/studio')}
          className="rbx-btn rbx-btn-emerald px-4 py-2.5 rounded-xl text-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Custom Game</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rbx-panel rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-builder font-extrabold cursor-pointer transition-colors ${
                filter === f
                  ? 'bg-[#00E676] text-[#052112]'
                  : 'bg-[#121725] text-[#8E9CB8] hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#7382A0] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Blade Ball, Rivals, Garden..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0A0D15] border border-[#242E46] text-xs text-white outline-none focus:border-[#00E676]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((sys) => (
          <ShowcaseSceneCard key={sys.id} system={sys} onSelect={handleRemix} />
        ))}
      </div>
    </div>
  );
};
