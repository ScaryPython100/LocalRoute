"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { nodes, paths } from "../data/communityGraph";

const communityBounds = [
  [13.0035, 77.7168], // Southwest boundary
  [13.0085, 77.7198]  // Northeast boundary
];

// Helper component to handle map bounds and auto-zooming
function MapBoundsUpdater({ pathCoordinates }) {
  const map = useMap();
  useEffect(() => {
    if (pathCoordinates && pathCoordinates.length > 0) {
      const bounds = L.latLngBounds(pathCoordinates);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 18.5, animate: true, duration: 1.5 });
    } else {
      map.setView(nodes.main_gate, 17.5, { animate: true, duration: 1.5 });
    }
  }, [pathCoordinates, map]);
  return null;
}

// Developer helper component to listen for map click coordinates
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      console.log(`[${lat.toFixed(6)}, ${lng.toFixed(6)}],`);
      if (onMapClick) {
        onMapClick({ lat, lng });
      }
    },
  });
  return null;
}

export default function MapComponent() {
  const [destination, setDestination] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [lastClicked, setLastClicked] = useState(null);
  
  // Autocomplete search states
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  const availableVillas = [
    { id: "villa_149", number: "149", name: "Villa 149 (Central-East)" },
    { id: "villa_105", number: "105", name: "Villa 105 (North-West)" },
    { id: "villa_128", number: "128", name: "Villa 128 (North-East)" },
    { id: "villa_127", number: "127", name: "Villa 127 (North Sector)" }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Click outside suggestions dropdown handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setShowSuggestions(true);

    if (val.trim() === "") {
      setDestination("");
      return;
    }

    // Direct match auto-routing
    const exactMatch = availableVillas.find(v => v.number === val.trim());
    if (exactMatch) {
      setDestination(exactMatch.id);
    } else {
      const activeVilla = availableVillas.find(v => v.id === destination);
      if (activeVilla && `Villa ${activeVilla.number}` !== val.trim()) {
        setDestination("");
      }
    }
  };

  const handleSelectVilla = (villa) => {
    setDestination(villa.id);
    setSearchQuery(`Villa ${villa.number}`);
    setShowSuggestions(false);
  };

  // Filter suggestions based on searchQuery
  const filteredSuggestions = searchQuery.trim() === ""
    ? availableVillas
    : availableVillas.filter(v => 
        v.number.includes(searchQuery.trim()) || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

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
      
      {/* Premium Autocomplete Search Container */}
      <div 
        ref={containerRef}
        className="absolute top-4 left-4 right-4 z-[1000] p-3.5 bg-slate-950/95 backdrop-blur-md border border-slate-850 shadow-2xl rounded-2xl flex flex-col gap-2.5"
      >
        <div>
          <label className="block text-[9px] uppercase font-black tracking-widest text-slate-400 mb-1.5">
            📍 Target Destination Villa
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="🔍 Enter Villa Number..."
              className="w-full bg-slate-900 border-2 border-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-3.5 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setDestination("");
                  setShowSuggestions(false);
                }}
                className="absolute right-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown List */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-950/98 backdrop-blur border border-slate-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-[2000] divide-y divide-slate-850">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((villa) => (
                  <button
                    key={villa.id}
                    onClick={() => handleSelectVilla(villa)}
                    className="w-full text-left px-4 py-3 hover:bg-cyan-950/40 hover:text-cyan-400 transition-colors text-xs font-bold text-slate-300 flex items-center justify-between cursor-pointer"
                  >
                    <span>🏡 {villa.name}</span>
                    <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest font-black">
                      Villa {villa.number}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3.5 text-xs font-bold text-slate-500 text-center">
                  ❌ No matching villas found
                </div>
              )}
            </div>
          )}
        </div>

        {destination && (
          <div className="flex items-center justify-between px-1 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500">Origin:</span>
              <span className="text-[10px] font-extrabold text-amber-500">Main Entry Gate</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-black text-cyan-400 animate-pulse">● ROUTING ACTIVE</span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Developer Helper: Click Coordinate Display HUD */}
      {lastClicked && (
        <div className="absolute top-40 left-4 right-4 z-[1000] p-3 bg-slate-950/95 border-2 border-amber-500/80 shadow-2xl rounded-xl flex items-center justify-between text-xs font-mono text-amber-400">
          <div>
            <span className="block text-[8px] font-black uppercase text-amber-500/80 tracking-widest leading-none mb-1">
              🛠️ Developer Coords Picker
            </span>
            <span className="text-[11px] font-bold text-white">
              [ {lastClicked.lat.toFixed(6)}, {lastClicked.lng.toFixed(6)} ],
            </span>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`[${lastClicked.lat.toFixed(6)}, ${lastClicked.lng.toFixed(6)}],`);
            }}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 transition-colors text-slate-950 font-bold text-[10px] rounded-lg shadow"
          >
            Copy
          </button>
        </div>
      )}

      {/* React-Leaflet Map Container */}
      <MapContainer
        center={nodes.main_gate}
        zoom={17.5}
        minZoom={17}
        maxZoom={19}
        maxBounds={communityBounds}
        maxBoundsViscosity={1.0}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* Bounds management component */}
        <MapBoundsUpdater pathCoordinates={activePath} />

        {/* Listen for map clicks */}
        <MapClickHandler onMapClick={setLastClicked} />

        {/* Premium CartoDB Voyager Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Navigation Route Path Rendering */}
        {activePath.length > 0 && (
          <>
            <Polyline
              positions={activePath}
              color="#0f172a"
              weight={10}
              opacity={0.8}
            />
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
