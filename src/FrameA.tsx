import React, { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from 'lenis';
import { Cpu, Monitor, Zap, HardDrive, Box, Layers, ShieldCheck, CheckCircle2, ChevronRight, Activity, ZapIcon, Flame, Server } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin);

const iconMap: Record<string, React.ReactNode> = {
  CPU: <Cpu size={20} />, VGA: <Monitor size={20} />, MAIN: <Layers size={20} />,
  RAM: <HardDrive size={20} />, PSU: <Zap size={20} />, CASE: <Box size={20} />
};

export default function FrameA_ExplodedView({ data, aiMessage }: { data: any, aiMessage?: string | null }) {
  const mainContainer = useRef<HTMLDivElement>(null);

  // Map components by type for easy access
  const comp = useMemo(() => {
    if (!data?.components) return {};
    return data.components.reduce((acc: any, curr: any) => {
      acc[curr.type] = curr;
      return acc;
    }, {});
  }, [data]);

  useGSAP(() => {
    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initial 3D states
    gsap.set(".scene-wrapper", { rotationY: 0, rotationX: 0, z: -100 });
    gsap.set(".glass-panel", { z: 120 });
    gsap.set(".motherboard-group", { x: -800, z: 200, opacity: 0 });
    gsap.set(".cpu-group", { y: -400, z: 300, opacity: 0 });
    gsap.set(".cooler-group", { y: -500, z: 400, opacity: 0 });
    gsap.set(".ram-1, .ram-2", { y: -400, z: 300, opacity: 0 });
    gsap.set(".gpu-group", { x: 500, z: 500, opacity: 0 });
    gsap.set(".psu-group", { y: 500, opacity: 0 });
    gsap.set(".info-panel", { opacity: 0, x: -50 });
    gsap.set(".final-dashboard", { opacity: 0, scale: 0.9, pointerEvents: 'none', y: 50 });

    // 2. Setup Scrollytelling Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-track",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrub
      }
    });

    // Intro hold
    tl.to({}, { duration: 2 });
    tl.to(".hero-overlay", { opacity: 0, scale: 0.9, duration: 1 });

    // Step 1: Case Open (Vỏ Thùng Máy)
    tl.to(".scene-wrapper", { rotationY: -35, rotationX: 10, scale: 1.1, duration: 2, ease: "power1.inOut" })
      .to(".glass-panel", { x: 400, z: 300, rotationY: 45, opacity: 0.1, duration: 2, ease: "power2.out" }, "<")
      .to(".info-case", { opacity: 1, x: 20, duration: 1 }, "-=1");

    tl.to({}, { duration: 3 }); // hold
    tl.to(".info-case", { opacity: 0, x: -20, duration: 1 });

    // Step 2: Mainboard (Bo Mạch Chủ)
    tl.to(".motherboard-group", { x: 0, z: 10, opacity: 1, duration: 2, ease: "back.out(1.2)" })
      .to(".info-main", { opacity: 1, x: 20, duration: 1 }, "-=1")
      .to(".xray-glow", { opacity: 1, duration: 1, stagger: 0.2 }, "+=0.2");

    tl.to({}, { duration: 3 }); // hold
    tl.to(".info-main", { opacity: 0, x: -20, duration: 1 });

    // Step 3: CPU & Cooler
    tl.to(".cpu-group", { y: 0, z: 20, opacity: 1, duration: 1.5, ease: "power3.in" })
      .to(".cpu-socket-lock", { rotationX: -180, duration: 0.5 })
      .to(".cooler-group", { y: 0, z: 40, opacity: 1, duration: 1.5, ease: "bounce.out" })
      .to(".thermal-wave", { scale: 3, opacity: 1, duration: 0.2 })
      .to(".thermal-wave", { backgroundColor: "rgba(59, 130, 246, 0.8)", borderColor: "rgba(59, 130, 246, 0)", opacity: 0, duration: 1.5, ease: "power2.out" }, ">")
      .to(".info-cpu", { opacity: 1, x: 20, duration: 1 }, "-=2");

    tl.to({}, { duration: 3 }); // hold
    tl.to(".info-cpu", { opacity: 0, x: -20, duration: 1 });

    // Step 4: RAM (Dual Channel)
    tl.to(".ram-1", { y: 0, z: 30, opacity: 1, duration: 1, ease: "power2.inOut" })
      .to(".ram-2", { y: 0, z: 30, opacity: 1, duration: 1, ease: "power2.inOut" }, "-=0.8")
      .to(".ram-pulse-line", { strokeDashoffset: 0, opacity: 1, duration: 1, ease: "none" })
      .to(".info-ram", { opacity: 1, x: 20, duration: 1 }, "-=1");

    tl.to({}, { duration: 3 }); // hold
    tl.to(".info-ram", { opacity: 0, x: -20, duration: 1 });

    // Step 5: GPU
    tl.to(".gpu-group", { x: 0, y: 0, z: 50, opacity: 1, duration: 1.5, ease: "power4.in" })
      .to(".scene-wrapper", { y: 15, duration: 0.05, yoyo: true, repeat: 5 }) // Camera shake
      .to(".gpu-group", { boxShadow: "0px 0px 50px 10px rgba(6, 182, 212, 0.4)", duration: 1 }) // RGB Power up
      .to(".info-gpu", { opacity: 1, x: 20, duration: 1 }, "-=1");

    tl.to({}, { duration: 3 }); // hold
    tl.to(".info-gpu", { opacity: 0, x: -20, duration: 1 });

    // Step 6: PSU
    tl.to(".psu-group", { y: 0, opacity: 1, duration: 1.5, ease: "back.out(1)" })
      .to(".electric-surge-line", { strokeDashoffset: 0, opacity: 1, duration: 1.5, ease: "none", stagger: 0.3 })
      .to(".fan-spin", { rotation: "+=1080", duration: 4, ease: "power1.inOut" }, "<")
      .to(".info-psu", { opacity: 1, x: 20, duration: 1 }, "-=1");

    tl.to({}, { duration: 3 }); // hold
    tl.to(".info-psu", { opacity: 0, x: -20, duration: 1 });

    // Step 7: Final
    tl.to(".glass-panel", { x: 0, z: 120, rotationY: 0, opacity: 0.4, duration: 2, ease: "power2.inOut" })
      .to(".scene-wrapper", { rotationY: 360, rotationX: 0, scale: 0.85, duration: 4, ease: "sine.inOut" }, "<")
      .to(".final-dashboard", { opacity: 1, scale: 1, y: 0, pointerEvents: "auto", duration: 1.5, ease: "power3.out" });

    // AI Typing triggered near end
    ScrollTrigger.create({
      trigger: ".scroll-track",
      start: "90% center", 
      onEnter: () => {
        gsap.to(".ai-typing-text", {
          text: { value: aiMessage || "Quá trình phân tích hoàn tất. Cấu hình đã được tối ưu 100%." },
          duration: Math.min((aiMessage?.length || 30) * 0.03, 4),
          ease: "none"
        });
      }
    });

    return () => lenis.destroy();
  }, { scope: mainContainer, dependencies: [data, aiMessage] });

  if (!data) return null;

  const InfoPanel = ({ c, className }: { c: any, className: string }) => {
    if (!c) return null;
    return (
      <div className={`info-panel ${className} absolute top-1/2 -translate-y-1/2 left-[5%] max-w-sm bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl pointer-events-none z-50`}>
         <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-950/50 rounded-lg text-cyan-400 border border-cyan-500/30">
              {iconMap[c.type] || <Box size={20} />}
            </div>
            <span className="text-emerald-400 font-mono text-sm font-bold bg-emerald-950/30 px-3 py-1 rounded-lg border border-emerald-500/20">
              {c.price?.toLocaleString('vi-VN')} ₫
            </span>
         </div>
         <h3 className="text-xl font-bold text-white mb-2 leading-tight">{c.name}</h3>
         <p className="text-slate-400 text-xs font-mono leading-relaxed mb-4 line-clamp-3">{c.specs}</p>
         <div className="pt-4 border-t border-white/10">
            <span className="text-[10px] font-mono text-cyan-500 mb-2 block uppercase tracking-wider">AI Architect Reason</span>
            <p className="text-cyan-100 text-sm">{c.reason}</p>
         </div>
      </div>
    );
  };

  return (
    <div ref={mainContainer} className="w-full font-sans text-white">
      {/* Scroll Track: ~10 steps total */}
      <div className="scroll-track relative w-full h-[2200vh]">
        
        {/* STICKY VIEWPORT */}
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center p-4">
          
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_60%)]" />
            <div className="w-full h-full opacity-20" style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
          </div>

          {/* HERO OVERLAY */}
          <div className="hero-overlay absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 mb-6">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">AI Validated Configuration</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-cyan-600 tracking-tighter leading-tight drop-shadow-2xl text-center max-w-5xl">
              {data.title || "SYSTEM ARCHITECTURE"}
            </h2>
            <div className="mt-8 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/10 shadow-2xl">
              <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">Total Value</span>
              <div className="h-6 w-px bg-white/20 mx-2"></div>
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
                {data.totalPrice?.toLocaleString('vi-VN')} ₫
              </span>
            </div>
            <div className="absolute bottom-16 flex flex-col items-center gap-3 text-cyan-400/70 animate-pulse">
              <span className="font-mono text-xs tracking-[0.3em] uppercase">Scroll to Assemble</span>
              <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center p-1">
                 <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>

          {/* 3D SCENE */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10" style={{ perspective: 1200 }}>
             <div className="scene-wrapper relative w-[320px] h-[450px] md:w-[400px] md:h-[520px]" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* 1. CASE BASE */}
                <div className="chassis absolute inset-0 bg-[#0a0f16] border-2 border-slate-700/50 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] rounded-lg overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                   {comp.CASE?.img && <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen" style={{ backgroundImage: `url(${comp.CASE.img})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }} />}
                   
                   {/* 2. PSU BAY */}
                   <div className="psu-group absolute bottom-4 left-4 w-32 h-20 bg-slate-900 border border-slate-600 rounded-md overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                      {comp.PSU?.img && <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ backgroundImage: `url(${comp.PSU.img})`, backgroundSize: 'cover', filter: 'grayscale(100%)' }} />}
                      <div className="absolute top-2 left-2 w-8 h-8 rounded-full border border-slate-500/50 fan-spin" />
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" />
                   </div>

                   {/* Electric Surge SVGs */}
                   <svg className="absolute bottom-24 left-10 w-[300px] h-[200px] overflow-visible pointer-events-none z-10">
                      <path className="electric-surge-line opacity-0" d="M 0 0 L 0 -100 L 150 -100" stroke="#06b6d4" strokeWidth="2" fill="none" strokeDasharray="300" strokeDashoffset="300" style={{ filter: 'drop-shadow(0 0 4px #06b6d4)' }} />
                      <path className="electric-surge-line opacity-0" d="M 20 0 L 20 -50 L 250 -50" stroke="#a855f7" strokeWidth="2" fill="none" strokeDasharray="300" strokeDashoffset="300" style={{ filter: 'drop-shadow(0 0 4px #a855f7)' }} />
                   </svg>

                   {/* 3. MOTHERBOARD */}
                   <div className="motherboard-group absolute top-6 right-6 w-56 h-80 bg-emerald-950/20 border border-emerald-500/30 rounded-sm" style={{ transformStyle: 'preserve-3d' }}>
                      {comp.MAIN?.img && <div className="absolute inset-0 opacity-20 mix-blend-screen" style={{ backgroundImage: `url(${comp.MAIN.img})`, backgroundSize: 'cover' }} />}
                      
                      {/* X-Ray Glows */}
                      <div className="xray-glow absolute top-[15%] left-[25%] w-[40%] h-[20%] bg-cyan-400/20 blur-xl opacity-0 rounded-full" />
                      <div className="xray-glow absolute top-[40%] right-[10%] w-[30%] h-[20%] bg-purple-400/20 blur-xl opacity-0 rounded-full" />
                      <div className="xray-glow absolute bottom-[25%] left-[5%] w-[80%] h-[15%] bg-emerald-400/20 blur-xl opacity-0 rounded-full" />
                      
                      {/* CPU SOCKET */}
                      <div className="cpu-socket absolute top-12 left-10 w-16 h-16 border-2 border-white/20 bg-black/40 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                          <div className="cpu-socket-lock absolute top-0 -right-2 w-1 h-full bg-slate-400 origin-bottom" style={{ transform: 'rotateX(0deg)' }} />
                          <div className="thermal-wave absolute w-full h-full rounded-full bg-red-500 opacity-0 pointer-events-none" style={{ transform: 'translateZ(1px)' }} />
                          
                          {/* CPU CHIP */}
                          <div className="cpu-group absolute w-10 h-10 bg-slate-800 border border-slate-400 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                              <span className="text-[6px] font-mono font-bold text-slate-300">CPU</span>
                              {comp.CPU?.img && <div className="absolute inset-0 opacity-50 mix-blend-screen" style={{ backgroundImage: `url(${comp.CPU.img})`, backgroundSize: 'cover' }} />}
                          </div>
                          
                          {/* COOLER */}
                          <div className="cooler-group absolute w-20 h-20 rounded-full border-4 border-slate-700 bg-slate-900/90 shadow-2xl flex items-center justify-center">
                             <div className="fan-spin w-[90%] h-[90%] rounded-full border-dashed border-4 border-slate-400/40" />
                             <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(6,182,212,0.5)]" />
                          </div>
                      </div>

                      {/* RAM SLOTS */}
                      <div className="ram-slots absolute top-10 right-4 w-12 h-24 flex justify-between" style={{ transformStyle: 'preserve-3d' }}>
                          <div className="w-1.5 h-full bg-white/10 rounded-sm" />
                          <div className="w-1.5 h-full relative" style={{ transformStyle: 'preserve-3d' }}>
                             <div className="ram-1 absolute inset-0 bg-slate-800 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                {comp.RAM?.img && <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ backgroundImage: `url(${comp.RAM.img})`, backgroundSize: 'cover' }} />}
                             </div>
                          </div>
                          <div className="w-1.5 h-full bg-white/10 rounded-sm" />
                          <div className="w-1.5 h-full relative" style={{ transformStyle: 'preserve-3d' }}>
                             <div className="ram-2 absolute inset-0 bg-slate-800 border border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                {comp.RAM?.img && <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{ backgroundImage: `url(${comp.RAM.img})`, backgroundSize: 'cover' }} />}
                             </div>
                          </div>
                      </div>

                      {/* RAM Pulse SVG */}
                      <svg className="absolute top-20 right-16 w-16 h-4 pointer-events-none overflow-visible">
                         <path className="ram-pulse-line opacity-0" d="M 64 2 L 0 2" stroke="#34d399" strokeWidth="2" fill="none" strokeDasharray="64" strokeDashoffset="64" style={{ filter: 'drop-shadow(0 0 4px #34d399)' }} />
                      </svg>

                      {/* GPU / PCIe SLOT */}
                      <div className="pcie-slot absolute bottom-20 left-2 w-48 h-6 border-2 border-slate-600/50 bg-black/50" style={{ transformStyle: 'preserve-3d' }}>
                         <div className="gpu-group absolute top-1 left-4 w-56 h-16 bg-slate-900 border-2 border-slate-700 shadow-2xl rounded-sm flex items-center justify-start pl-4 gap-2">
                             {comp.VGA?.img && <div className="absolute inset-0 opacity-50 mix-blend-screen rounded-sm" style={{ backgroundImage: `url(${comp.VGA.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                             <div className="w-8 h-8 rounded-full border border-slate-500/50 fan-spin z-10" />
                             <div className="w-8 h-8 rounded-full border border-slate-500/50 fan-spin z-10" />
                             <div className="absolute top-0 right-4 w-12 h-1 bg-cyan-400 shadow-[0_0_15px_5px_rgba(6,182,212,0.8)] opacity-80" />
                         </div>
                      </div>
                   </div>
                </div>

                {/* 4. GLASS PANEL */}
                <div className="glass-panel absolute inset-0 rounded-lg bg-cyan-900/10 backdrop-blur-[2px] border-2 border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)]" />
             </div>
          </div>

          {/* INFO PANELS OVERLAY */}
          <InfoPanel c={comp.CASE} className="info-case" />
          <InfoPanel c={comp.MAIN} className="info-main" />
          <InfoPanel c={comp.CPU} className="info-cpu" />
          <InfoPanel c={comp.RAM} className="info-ram" />
          <InfoPanel c={comp.VGA} className="info-gpu" />
          <InfoPanel c={comp.PSU} className="info-psu" />

          {/* FINAL DASHBOARD */}
          <div className="final-dashboard absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none p-4 bg-black/60 backdrop-blur-md">
             <div className="max-w-4xl w-full bg-[#0a0a0a]/95 border border-cyan-500/30 rounded-[2rem] p-10 md:p-12 shadow-[0_0_100px_rgba(6,182,212,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div>
                       <div className="flex items-center gap-4 mb-6">
                           <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/20">
                               <CheckCircle2 size={28} />
                           </div>
                           <div>
                               <h3 className="text-2xl font-black text-white">SYSTEM READY</h3>
                               <p className="text-cyan-400/80 font-mono text-sm uppercase">100% Compatibility Validated</p>
                           </div>
                       </div>
                       
                       <div className="space-y-4 mb-8">
                          <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                             <div className="flex items-center gap-3"><Activity size={18} className="text-emerald-400" /><span className="font-mono text-sm text-slate-300">Est. Performance</span></div>
                             <span className="font-bold text-emerald-400">Ultra / 144Hz</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                             <div className="flex items-center gap-3"><Flame size={18} className="text-orange-400" /><span className="font-mono text-sm text-slate-300">Thermal Load</span></div>
                             <span className="font-bold text-orange-400">Stable / 65°C</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                             <div className="flex items-center gap-3"><ZapIcon size={18} className="text-yellow-400" /><span className="font-mono text-sm text-slate-300">Power Draw</span></div>
                             <span className="font-bold text-yellow-400">Optimized</span>
                          </div>
                       </div>
                       
                       <button className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group">
                          Proceed to Checkout
                          <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                       </button>
                   </div>
                   
                   <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                          <Server size={20} className="text-cyan-500" />
                          <h4 className="font-mono text-sm tracking-widest uppercase text-slate-400">AI Architect Report</h4>
                      </div>
                      <p className="ai-typing-text text-lg md:text-xl text-cyan-50 leading-relaxed font-light min-h-[150px]"></p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

