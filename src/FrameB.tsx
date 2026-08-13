import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Cpu, Monitor, Zap, HardDrive, Box, Layers, Target, ChevronRight } from 'lucide-react';

gsap.registerPlugin(useGSAP);

const iconMap: Record<string, React.ReactNode> = {
  CPU: <Cpu size={24} />, VGA: <Monitor size={24} />, MAIN: <Layers size={24} />,
  RAM: <HardDrive size={24} />, PSU: <Zap size={24} />, CASE: <Box size={24} />
};

export default function FrameB_HUDSpotlight({ data, aiMessage }: { data: any, aiMessage?: string | null }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const listRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);

  if (!data || !data.components || data.components.length === 0) return null;

  const activeItem = data.components[activeIndex];

  useGSAP(() => {
    gsap.from(".main-title", {
      textShadow: "0 0 0px #06b6d4",
      opacity: 0,
      x: -50,
      duration: 1,
      ease: "power4.out"
    });

    gsap.to(ringRef.current, {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

    gsap.from(listRef.current, {
      x: -100,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "back.out(1.5)"
    });
  }, { scope: container });

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(imageRef.current, 
      { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", scale: 1.2, filter: "blur(10px) contrast(200%)" },
      { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", scale: 1, filter: "blur(0px) contrast(100%)", duration: 0.8, ease: "power3.inOut" }
    );

    if (detailsRef.current) {
        tl.fromTo(detailsRef.current.children, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" },
        "-=0.4"
        );
    }

    gsap.fromTo(scannerRef.current, 
      { top: "0%", opacity: 1 },
      { top: "100%", opacity: 0.2, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" }
    );
  }, { dependencies: [activeIndex], scope: container });

  return (
    <div ref={container} className="w-full h-[85vh] flex p-8 gap-8 relative overflow-hidden bg-gradient-to-br from-[#020202] to-[#0a0a0a]">
      
      <svg ref={ringRef} className="absolute -right-64 -bottom-64 w-[800px] h-[800px] opacity-10 pointer-events-none" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="4 2 1 2" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="0.2" strokeDasharray="10 5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="1 10" />
      </svg>

      <div className="w-1/3 h-full flex flex-col z-10">
        <div className="mb-8 border-l-4 border-cyan-500 pl-4">
          <h2 className="main-title text-2xl font-black text-white tracking-widest font-mono uppercase">
            {data.title}
          </h2>
          {aiMessage && (
            <p className="mt-3 text-sm text-cyan-200/90 font-mono leading-relaxed bg-cyan-950/40 p-3 rounded-lg border border-cyan-500/20 shadow-lg backdrop-blur-md">
              {aiMessage}
            </p>
          )}
          <p className="text-cyan-400 font-mono text-xs mt-3 flex items-center gap-2">
            <Target size={12} className="animate-spin-slow" />
            SELECT COMPONENT TO ANALYZE
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-4 custom-scrollbar">
          {data.components.map((item: any, index: number) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={item.id}
                ref={el => listRef.current[index] = el}
                onClick={() => setActiveIndex(index)}
                className={`relative p-4 cursor-pointer transition-all duration-300 flex items-center gap-4 group overflow-hidden
                  ${isActive ? 'bg-cyan-500/10 border-cyan-500' : 'bg-white/5 border-transparent hover:bg-white/10'}
                  border-l-2
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent z-0" />
                )}
                
                <div className={`relative z-10 p-2 rounded bg-black/50 border transition-colors
                  ${isActive ? 'text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'text-slate-400 border-slate-700 group-hover:text-white'}
                `}>
                  {iconMap[item.type] || <Box size={24} />}
                </div>
                
                <div className="relative z-10 flex-1">
                  <div className="text-[10px] font-mono text-slate-500 tracking-wider mb-1">{item.type}</div>
                  <div className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {item.name}
                  </div>
                </div>

                <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'text-cyan-400 translate-x-0' : 'text-slate-600 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                  <ChevronRight size={20} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 border border-slate-800 bg-black/40 rounded-xl">
          <p className="text-xs text-slate-500 font-mono mb-1">TOTAL_ESTIMATION</p>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {data.totalPrice.toLocaleString('vi-VN')} ₫
          </p>
        </div>
      </div>

      <div className="flex-1 h-full relative flex items-center justify-center p-8 z-10">
        <div className="w-full h-full border border-slate-800/80 bg-black/40 rounded-2xl relative overflow-hidden flex">
          
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-500/50" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-cyan-500/50" />
          </div>

          <div className="w-3/5 h-full relative p-8 flex items-center justify-center">
            <div className="relative w-full aspect-square max-h-full">
              <img 
                ref={imageRef}
                src={activeItem.img} 
                alt={activeItem.name}
                className="w-full h-full object-cover rounded-xl filter grayscale border border-white/5"
              />
              <div 
                ref={scannerRef}
                className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_2px_rgba(6,182,212,0.8)] z-20 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-cyan-900/20 mix-blend-color z-10 pointer-events-none" />
            </div>
          </div>

          <div ref={detailsRef} className="w-2/5 h-full bg-gradient-to-l from-cyan-900/20 to-transparent border-l border-slate-800/50 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-cyan-400 mb-4">
              {iconMap[activeItem.type] || <Box size={24} />}
              <span className="font-mono text-sm tracking-[0.2em]">{activeItem.type}_MODULE</span>
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
              {activeItem.name}
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="bg-black/50 p-4 rounded-lg border border-white/5">
                <span className="block text-[10px] font-mono text-slate-500 mb-1">MARKET_VALUE</span>
                <span className="text-xl font-bold text-emerald-400">
                  {activeItem.price.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              
              <div className="bg-black/50 p-4 rounded-lg border border-white/5">
                <span className="block text-[10px] font-mono text-slate-500 mb-1">TECH_SPECS</span>
                <span className="text-sm text-slate-300 leading-relaxed font-mono">
                  {activeItem.specs}
                </span>
              </div>
            </div>

            <button className="group relative w-full px-4 py-3 bg-cyan-600/10 border border-cyan-500/50 text-cyan-400 font-mono text-sm hover:bg-cyan-500 hover:text-black transition-all duration-300">
              <span className="relative z-10">ANALYZE_IN_DEPTH</span>
              <div className="absolute inset-0 bg-cyan-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
