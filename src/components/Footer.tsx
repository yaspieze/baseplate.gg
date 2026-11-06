import React from 'react';
import { BaseplateLogo } from './Navbar';
import { useStudio } from '../context/StudioContext';

export const Footer: React.FC = () => {
  const { route, navigate } = useStudio();

  // Keep /studio crisp like a real web IDE
  if (route === '/studio') return null;

  return (
    <footer className="border-t-2 border-[#192032] bg-[#07090E] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <BaseplateLogo size={30} />
            <span className="font-builder font-black text-lg text-white">
              baseplate<span className="text-[#00E676]">.gg</span>
            </span>
          </div>
          <p className="text-[#8090AE] max-w-xs leading-relaxed">
            The #1 Free Forever AI game coding agent &amp; 9-slice GUI Forge built specifically for Roblox Studio creators.
          </p>
          <p className="text-[11px] text-[#5B6985]">
            © 2026 Baseplate Labs Inc. Not affiliated with or endorsed by Roblox Corporation.
          </p>
        </div>

        <div className="space-y-2.5">
          <h4 className="font-builder font-extrabold text-white uppercase tracking-wider text-[11px]">
            Platform
          </h4>
          <ul className="space-y-2 text-[#8998B6]">
            <li><button onClick={() => navigate('/studio')} className="hover:text-[#00E676] cursor-pointer">Studio AI Agent</button></li>
            <li><button onClick={() => navigate('/gui')} className="hover:text-[#00E676] cursor-pointer">9-Slice GUI Forge</button></li>
            <li><button onClick={() => navigate('/connect')} className="hover:text-[#00E676] cursor-pointer">Creator Store Plugin</button></li>
            <li><button onClick={() => navigate('/showcase')} className="hover:text-[#00E676] cursor-pointer">Community Showcase</button></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h4 className="font-builder font-extrabold text-white uppercase tracking-wider text-[11px]">
            Resources
          </h4>
          <ul className="space-y-2 text-[#8998B6]">
            <li><button onClick={() => navigate('/docs')} className="hover:text-[#00E676] cursor-pointer">Documentation</button></li>
            <li><button onClick={() => navigate('/connect')} className="hover:text-[#00E676] cursor-pointer">BaseplateMCP Setup</button></li>
            <li><button onClick={() => navigate('/pricing')} className="hover:text-[#00E676] cursor-pointer">Open Creator Grant ($0)</button></li>
          </ul>
        </div>

        <div className="space-y-2.5">
          <h4 className="font-builder font-extrabold text-white uppercase tracking-wider text-[11px]">
            System Status
          </h4>
          <div className="p-3 rounded-xl bg-[#0D111B] border border-[#1E263A] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#00E676] font-builder font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              All Clusters Operational
            </div>
            <p className="font-luau text-[10.5px] text-[#7D8CA8]">
              Baseplate-R3 · 99.98% Uptime
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
