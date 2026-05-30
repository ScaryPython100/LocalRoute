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



      </main>
    </div>
  );
}
