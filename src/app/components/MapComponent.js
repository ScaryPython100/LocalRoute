"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { nodes, paths } from "../data/communityGraph";

// Helper component to handle map bounds and auto-zooming
function MapBoundsUpdater({ pathCoordinates }) {
  const map = useMap();
  useEffect(() => {
    if (pathCoordinates && pathCoordinates.length > 0) {
      // Bounding box containing the Main Gate and the chosen villa
      const bounds = L.latLngBounds(pathCoordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18, animate: true, duration: 1.5 });
    } else {
      // Default center at Main Gate with high-zoom detail
      map.setView(nodes.main_gate, 17, { animate: true, duration: 1.5 });
    }
  }, [pathCoordinates, map]);
  return null;
}

export default function MapComponent() {
  const [destination, setDestination] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  // Get coordinates for active path
  const activePath = destination ? paths[destination] : [];

  if (!isClient) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-2xl">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto"></div>
          <p className="mt-3 text-sm text-slate-500 font-bold uppercase tracking-wider">Initializing satellite maps...</p>
        </div>
      </div>
    );
  }

  // Create custom premium markers with Leaflet DivIcon
  const createMarkerIcon = (type, label, isActive) => {
    let iconHtml = "";

    if (type === "gate") {
      iconHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white border-2 border-white shadow-xl shadow-amber-500/50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4.5 h-4.5">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
          </svg>
        </div>
      `;
    } else if (type === "destination") {
      iconHtml = `
        <div class="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-500 text-slate-900 border-2 border-white shadow-2xl animate-pulse shadow-cyan-500/70">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-slate-950 font-black">
            <path fill-rule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
          </svg>
        </div>
      `;
    } else {
      // Standard inactive villa
      iconHtml = `
        <div class="flex items-center justify-center w-7 h-7 rounded-full bg-slate-700 text-white border border-slate-200/50 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
            <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69Z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.43Z" />
          </svg>
        </div>
      `;
    }

    return L.divIcon({
      html: iconHtml,
      className: "custom-leaflet-marker",
      iconSize: type === "destination" ? [36, 36] : type === "gate" ? [32, 32] : [28, 28],
      iconAnchor: type === "destination" ? [18, 18] : type === "gate" ? [16, 16] : [14, 14],
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md dark:border-slate-800">
      
      {/* High-contrast Gated Community Selector Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-slate-200 dark:border-slate-850 shadow-2xl rounded-2xl flex flex-col gap-2.5">
        <div>
          <label className="block text-[10px] uppercase font-black tracking-widest text-slate-450 dark:text-slate-400 mb-1.5">
            📍 Target Destination Villa
          </label>
          <div className="relative">
            <select
              value={destination}
              onChange={handleDestinationChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-4 py-3.5 text-base font-extrabold focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-500 cursor-pointer appearance-none"
            >
              <option value="">🏡 Select Destination Villa...</option>
              <option value="villa_149">🏡 Villa 149 (Central-East)</option>
              <option value="villa_105">🏡 Villa 105 (North-West)</option>
              <option value="villa_128">🏡 Villa 128 (North-East)</option>
              <option value="villa_127">🏡 Villa 127 (North Sector)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
              <svg className="fill-current h-5 w-5 stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>

        {destination && (
          <div className="flex items-center justify-between px-1 text-slate-900 dark:text-white">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Origin:</span>
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">Main Entry Gate</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 animate-pulse">● ROUTING ACTIVE</span>
            </div>
          </div>
        )}
      </div>

      {/* React-Leaflet Map Container */}
      <MapContainer
        center={nodes.main_gate}
        zoom={17}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* Bounds management component */}
        <MapBoundsUpdater pathCoordinates={activePath} />

        {/* Premium CartoDB Voyager Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Navigation Route Path Rendering */}
        {activePath.length > 0 && (
          <>
            {/* Outline backing line for enhanced visual high-contrast depth */}
            <Polyline
              positions={activePath}
              color="#0f172a"
              weight={10}
              opacity={0.8}
            />
            {/* Highly visible vibrant neon-blue path overlay */}
            <Polyline
              positions={activePath}
              color="#00f0ff"
              weight={6}
              opacity={0.9}
              lineCap="round"
              lineJoin="round"
            />
          </>
        )}

        {/* Main Entry Gate Node Marker */}
        <Marker
          position={nodes.main_gate}
          icon={createMarkerIcon("gate", "Main Security Gate", false)}
        >
          <Popup className="custom-popup">
            <div className="p-1 font-sans">
              <div className="font-bold text-slate-900 text-sm">🚪 Main Security Entrance</div>
              <div className="text-xs text-slate-500 mt-0.5">Community QR scan point. Speed control begins here.</div>
            </div>
          </Popup>
        </Marker>

        {/* Dynamic Gated Community Villa Node Markers */}
        {Object.entries(nodes).map(([id, coordinates]) => {
          if (id === "main_gate") return null;

          const isTargetDestination = id === destination;

          return (
            <Marker
              key={id}
              position={coordinates}
              icon={createMarkerIcon(isTargetDestination ? "destination" : "villa", id.replace("_", " "), isTargetDestination)}
            >
              <Popup className="custom-popup">
                <div className="p-1 font-sans">
                  <div className="font-bold text-slate-900 text-sm">
                    🏡 Villa {id.split("_")[1]}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {isTargetDestination ? "🎯 Selected Delivery Target Destination" : "Gated Resident Villa"}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Speed & Limit notice directly on the map context */}
      {destination && (
        <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-slate-950/95 backdrop-blur px-3 py-2 text-white border border-slate-800 shadow-xl flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 border border-white text-xs font-extrabold leading-none">
            15
          </div>
          <div>
            <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider leading-none">Community Limit</div>
            <div className="text-[11px] font-bold text-cyan-400">Strictly Monitored Speed</div>
          </div>
        </div>
      )}
    </div>
  );
}
