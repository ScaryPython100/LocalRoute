"use client";

import dynamic from "next/dynamic";

// Dynamically import the MapComponent to avoid Next.js Server-Side Rendering (SSR) crashes.
// Leaflet requires window and document global objects which are unavailable on server.
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-900 text-white">
      <div className="text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto"></div>
        <p className="mt-3 text-sm text-slate-400 font-bold uppercase tracking-wider">Loading Navigation satellites...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased flex flex-col items-center">
      {/* Viewport container restricted to standard mobile-first layout */}
      <main className="w-full max-w-md h-screen bg-slate-900 shadow-2xl flex flex-col relative overflow-hidden border-x border-slate-800">
        
        {/* Fullscreen Map Panel */}
        <div className="flex-1 w-full h-full relative z-10">
          <MapComponent />
        </div>

        {/* Floating Header Banner */}
        <div className="absolute top-24 left-4 right-4 z-[999] pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                Live Gated Navigation
              </span>
            </div>
            <div className="text-[9px] text-cyan-400 font-black uppercase tracking-widest">
              Palm Meadows Gate
            </div>
          </div>
        </div>

        {/* Floating Guard Speed Notice at Bottom */}
        <div className="absolute bottom-4 left-4 right-4 z-[999] pointer-events-none">
          <div className="bg-slate-950/95 border border-slate-850 px-4 py-3 rounded-2xl shadow-2xl flex items-start gap-3 pointer-events-auto">
            <div className="h-9 w-9 rounded-xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">Delivery Driver Assistant</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                Ensure to stop at the gate and report resident villa number. Respect local community speed bumps and watch for children.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
