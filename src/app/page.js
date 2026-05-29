"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { nodes } from "./data/communityGraph";

// Dynamically import the MapComponent to avoid Next.js Server-Side Rendering (SSR) crashes.
// Leaflet requires window and document global objects which are unavailable on server.
const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full min-h-[350px] items-center justify-center bg-slate-100 rounded-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
        <p className="mt-3 text-sm text-slate-500 font-medium">Loading Local Satellite Map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [origin, setOrigin] = useState("main_gate");
  const [destination, setDestination] = useState("");
  const [activeRoute, setActiveRoute] = useState(null);

  // Handle route calculation updates from map component
  const handleRouteCalculated = (routeData) => {
    setActiveRoute(routeData);
  };

  // Quick select helpers for popular locations
  const handleQuickSelect = (villaId) => {
    setOrigin("main_gate");
    setDestination(villaId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans antialiased flex flex-col items-center">
      {/* Outer Mobile Wrapper */}
      <main className="w-full max-w-md min-h-screen bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-x border-slate-100 dark:border-slate-800">
        
        {/* Upper Header Section */}
        <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Vibrant Logo */}
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                LR
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-950 dark:text-slate-50 leading-none">
                  LocalRoute
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide mt-1 uppercase">
                  Palm Meadows Gated Community
                </p>
              </div>
            </div>
            {/* Live Indicator Status */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                GPS Active
              </span>
            </div>
          </div>
        </header>

        {/* Core Content Area */}
        <section className="flex-1 p-4 space-y-4 overflow-y-auto pb-8">
          
          {/* Destination Form Selector Box */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5">
                Starting Location
              </label>
              <div className="relative">
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none font-medium cursor-pointer"
                >
                  <option value="main_gate">🚪 Main Security Gate (Standard Start)</option>
                  {Object.values(nodes).map((node) => {
                    if (node.id === "main_gate" || node.type === "junction") return null;
                    return (
                      <option key={`origin-${node.id}`} value={node.id}>
                        📍 {node.label}
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5">
                Destination Resident Villa
              </label>
              <div className="relative">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer"
                >
                  <option value="">✨ Select Destination Villa...</option>
                  {Object.values(nodes).map((node) => {
                    if (node.id === "main_gate" || node.type === "junction") return null;
                    return (
                      <option key={`dest-${node.id}`} value={node.id} className="text-slate-900 dark:text-white">
                        🏡 {node.label} ({node.description.split("(")[1]?.replace(")", "") || node.type})
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Map Window Wrapper */}
          <div className="h-[350px] w-full">
            <MapComponent
              selectedOrigin={origin}
              selectedDestination={destination}
              onRouteCalculated={handleRouteCalculated}
            />
          </div>

          {/* Quick Route Selector Recommendations */}
          {!destination && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Frequently Visited Villas
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickSelect("villa_149")}
                  className="p-3 text-left bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-sm"
                >
                  <div className="font-bold text-sm text-slate-850 dark:text-white">Villa 149</div>
                  <div className="text-[10px] text-slate-450 dark:text-slate-400 truncate">Bougainvillea Road</div>
                </button>
                <button
                  onClick={() => handleQuickSelect("villa_105")}
                  className="p-3 text-left bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-sm"
                >
                  <div className="font-bold text-sm text-slate-850 dark:text-white">Villa 105</div>
                  <div className="text-[10px] text-slate-450 dark:text-slate-400 truncate">Orchard Lane</div>
                </button>
                <button
                  onClick={() => handleQuickSelect("villa_128")}
                  className="p-3 text-left bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-sm"
                >
                  <div className="font-bold text-sm text-slate-850 dark:text-white">Villa 128</div>
                  <div className="text-[10px] text-slate-450 dark:text-slate-400 truncate">North Palm Ave</div>
                </button>
                <button
                  onClick={() => handleQuickSelect("villa_127")}
                  className="p-3 text-left bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-sm"
                >
                  <div className="font-bold text-sm text-slate-850 dark:text-white">Villa 127</div>
                  <div className="text-[10px] text-slate-450 dark:text-slate-400 truncate">North Palm Ave</div>
                </button>
              </div>
            </div>
          )}

          {/* Active Navigation Card Overlay (Dynamic Bottom Sheet) */}
          {activeRoute && destination && (
            <div className="space-y-4">
              {/* Route Summary Panel */}
              <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">
                      Active Navigation Path
                    </span>
                    <h2 className="text-xl font-bold mt-1 text-white">
                      To {nodes[destination]?.label || "Villa"}
                    </h2>
                  </div>
                  {/* Distance and ETA */}
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400 leading-none">
                      {activeRoute.totalTimeMinutes} <span className="text-xs font-normal">min</span>
                    </div>
                    <div className="text-[10px] text-slate-450 font-semibold tracking-wider uppercase mt-1">
                      {activeRoute.totalDistance} meters
                    </div>
                  </div>
                </div>

                <hr className="border-slate-800" />

                {/* Gated community speed rules warnings */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0 text-amber-500">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
                  </svg>
                  <p className="text-[11px] font-semibold leading-relaxed">
                    Internal Speed Limit is <strong className="text-white">15 km/h</strong>. Guard patrols are active inside.
                  </p>
                </div>

                {/* Step-by-step turn by turn logs */}
                <div className="space-y-2.5 pt-1">
                  <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Turn-By-Turn Navigation Directions
                  </h3>
                  <div className="space-y-3 font-medium">
                    {/* Beginning Step */}
                    <div className="flex gap-3 text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">
                          1
                        </div>
                        <div className="w-0.5 h-6 bg-slate-800"></div>
                      </div>
                      <div className="pt-0.5">
                        <span className="text-white">Start at {nodes[origin]?.label}</span>
                        <p className="text-slate-400 text-[10px] mt-0.5">Prepare to follow local gate roads.</p>
                      </div>
                    </div>

                    {/* Dynamic intermediate path edges */}
                    {activeRoute.edges.map((edge, idx) => {
                      const stepNum = idx + 2;
                      const isLast = idx === activeRoute.edges.length - 1;
                      
                      return (
                        <div key={`step-${idx}`} className="flex gap-3 text-xs">
                          <div className="flex flex-col items-center">
                            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-[10px] font-bold">
                              {stepNum}
                            </div>
                            {!isLast && <div className="w-0.5 h-6 bg-slate-800"></div>}
                          </div>
                          <div className="pt-0.5">
                            <span className="text-slate-200">
                              Go straight along <strong className="text-white font-bold">{edge.roadName}</strong>
                            </span>
                            <p className="text-slate-400 text-[10px] mt-0.5">
                              Distance: {edge.distance}m • Limit: {edge.speedLimit} km/h
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Target destination point arrived */}
                    <div className="flex gap-3 text-xs pt-1">
                      <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px]">
                        🏁
                      </div>
                      <div>
                        <span className="text-white font-bold">Arrive at {nodes[destination]?.label}</span>
                        <p className="text-emerald-400 text-[10px] font-semibold mt-0.5">Destination is on your side.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset button to clear search */}
                <button
                  onClick={() => setDestination("")}
                  className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-750 transition-colors border border-slate-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5"
                >
                  Clear Route & Scan Again
                </button>
              </div>
            </div>
          )}

          {/* Simple QR Helper banner if no villa is loaded */}
          {!destination && (
            <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/30 dark:border-emerald-800/20 rounded-2xl flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                📱
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Instant Driver Access</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Scanning the gate QR badge bypasses standard mapping apps and opens this precise spatial tracker instantly on your mobile.
                </p>
              </div>
            </div>
          )}

        </section>

        {/* Footer Navigation Bar */}
        <footer className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center">
          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">
            Powered by LocalRoute • Private Community GPS V1.0
          </p>
        </footer>
      </main>
    </div>
  );
}
