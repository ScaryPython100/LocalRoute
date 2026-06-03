"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { nodes, findShortestPath, getRouteMetadata } from "../data/communityGraph";

const communityBounds = [
  [13.0035, 77.7168], // Southwest boundary
  [13.0085, 77.7198]  // Northeast boundary
];

// Helper component to handle map bounds and auto-zooming
function MapBoundsUpdater({ pathCoordinates, isNavigating }) {
  const map = useMap();
  useEffect(() => {
    if (isNavigating) return;
    if (pathCoordinates && pathCoordinates.length > 0) {
      const bounds = L.latLngBounds(pathCoordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 19, animate: true, duration: 1.5 });
    } else {
      map.setView(nodes.main_gate, 17.5, { animate: true, duration: 1.5 });
    }
  }, [pathCoordinates, map, isNavigating]);
  return null;
}

// Math helpers for clipping the route line behind the user
function getClosestPointOnSegment(p, a, b) {
  const atob = { lat: b[0] - a[0], lng: b[1] - a[1] };
  const atop = { lat: p[0] - a[0], lng: p[1] - a[1] };
  const len = atob.lat * atob.lat + atob.lng * atob.lng;
  const dot = atop.lat * atob.lat + atop.lng * atob.lng;
  const t = Math.min(1, Math.max(0, len > 0 ? dot / len : 0));
  return [a[0] + atob.lat * t, a[1] + atob.lng * t];
}

function getDistanceSq(p1, p2) {
  return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2;
}

// Component to lock the map view to the user's live location
function LocationFollower({ isNavigating, userLocation }) {
  const map = useMap();
  useEffect(() => {
    if (isNavigating && userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 18, { animate: true, duration: 1.0 });
    }
  }, [isNavigating, userLocation, map]);
  return null;
}

export default function MapComponent() {
  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("main_gate");
  const [isClient, setIsClient] = useState(false);
  
  // Live Navigation tracking states
  const [isNavigating, setIsNavigating] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [hasArrived, setHasArrived] = useState(false);
  
  // Autocomplete search states (Destination)
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  // Autocomplete search states (Origin)
  const [originQuery, setOriginQuery] = useState("Main Entry Gate");
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const originRef = useRef(null);

  const availableLocations = [
    { id: "main_gate", number: "Gate", name: "Main Entry Gate" },
    { id: "villa_149", number: "149", name: "Villa 149 (Central-East)" },
    { id: "villa_105", number: "105", name: "Villa 105 (North-West)" },
    { id: "villa_128", number: "128", name: "Villa 128 (North-East)" },
    { id: "villa_127", number: "127", name: "Villa 127 (North Sector)" }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle Geolocation tracking
  useEffect(() => {
    let watchId;
    if (isNavigating) {
      setHasArrived(false);
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error watching position: ", error);
            alert("Could not access your location. Please check browser permissions.");
            setIsNavigating(false);
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
        setIsNavigating(false);
      }
    } else if (!hasArrived) {
      setUserLocation(null);
    }
    
    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isNavigating, hasArrived]);

  // Check for arrival
  useEffect(() => {
    if (isNavigating && userLocation && destination && nodes[destination]) {
      const destCoords = nodes[destination];
      const distSq = getDistanceSq([userLocation.lat, userLocation.lng], destCoords);
      // Threshold reduced to approx 4-5 meters (from 22 meters)
      if (distSq < 0.000000002) {
        setHasArrived(true);
        setIsNavigating(false);
      }
    }
  }, [userLocation, isNavigating, destination]);

  // Click outside suggestions dropdown handlers
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (originRef.current && !originRef.current.contains(event.target)) {
        setShowOriginSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDestChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setShowSuggestions(true);
    setHasArrived(false);

    if (val.trim() === "") {
      setDestination("");
      return;
    }

    const exactMatch = availableLocations.find(v => v.number === val.trim() && v.id !== "main_gate");
    if (exactMatch) {
      setDestination(exactMatch.id);
    }
  };

  const handleOriginChange = (e) => {
    const val = e.target.value;
    setOriginQuery(val);
    setShowOriginSuggestions(true);
    setHasArrived(false);

    if (val.trim() === "") {
      setOrigin("");
      return;
    }

    const exactMatch = availableLocations.find(v => v.number === val.trim());
    if (exactMatch) {
      setOrigin(exactMatch.id);
    }
  };

  const handleSelectDest = (loc) => {
    setDestination(loc.id);
    setSearchQuery(loc.id === "main_gate" ? loc.name : `Villa ${loc.number}`);
    setShowSuggestions(false);
    setHasArrived(false);
  };

  const handleSelectOrigin = (loc) => {
    setOrigin(loc.id);
    setOriginQuery(loc.id === "main_gate" ? loc.name : `Villa ${loc.number}`);
    setShowOriginSuggestions(false);
    setHasArrived(false);
  };

  const filteredDest = searchQuery.trim() === ""
    ? availableLocations.filter(v => v.id !== "main_gate")
    : availableLocations.filter(v => 
        v.id !== "main_gate" && (
        v.number.includes(searchQuery.trim()) || 
        v.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const filteredOrigin = originQuery.trim() === ""
    ? availableLocations
    : availableLocations.filter(v => 
        v.number.includes(originQuery.trim()) || 
        v.name.toLowerCase().includes(originQuery.toLowerCase())
      );

  // Get dynamic path from origin to destination
  const fullPath = destination && origin && destination !== origin ? findShortestPath(origin, destination) : [];
  const routeMetadata = destination && origin && destination !== origin ? getRouteMetadata(origin, destination, fullPath) : null;

  // Clip the route so it disappears behind the user as they move
  let activePath = [...fullPath];
  if (isNavigating && userLocation && fullPath.length > 1) {
    const userPt = [userLocation.lat, userLocation.lng];
    let minIdx = 0;
    let minDistSq = Infinity;
    let closestProj = null;

    for (let i = 0; i < fullPath.length - 1; i++) {
      const proj = getClosestPointOnSegment(userPt, fullPath[i], fullPath[i+1]);
      const dSq = getDistanceSq(userPt, proj);
      if (dSq < minDistSq) {
        minDistSq = dSq;
        minIdx = i;
        closestProj = proj;
      }
    }

    // Only clip if the user is reasonably close to the path (approx < 100m)
    if (minDistSq < 0.000001) {
      activePath = [closestProj, ...fullPath.slice(minIdx + 1)];
    }
  }

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
        <div class="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/80 text-white border border-white/80 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
          </svg>
        </div>
      `;
    } else if (type === "destination") {
      iconHtml = `
        <div class="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/80 text-slate-900 border border-white/80 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-slate-950 font-black">
            <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
          </svg>
        </div>
      `;
    } else if (type === "user") {
      iconHtml = `
        <div class="relative flex items-center justify-center w-8 h-8">
          <div class="absolute bg-blue-400/40 rounded-full w-8 h-8 animate-ping"></div>
          <div class="absolute bg-blue-500/20 rounded-full w-6 h-6 flex items-center justify-center"></div>
          <div class="absolute bg-blue-600 rounded-full w-4 h-4 border-2 border-white shadow-lg"></div>
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
      iconSize: type === "user" ? [32, 32] : type === "destination" || type === "gate" ? [24, 24] : [28, 28],
      iconAnchor: type === "user" ? [16, 16] : type === "destination" || type === "gate" ? [12, 12] : [14, 14],
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md dark:border-slate-800">
      
      {/* Premium Autocomplete Search Container */}
      <div className="absolute top-4 left-4 right-4 z-[1000] p-3.5 bg-slate-950/95 backdrop-blur-md border border-slate-850 shadow-2xl rounded-2xl flex flex-col gap-3">
        
        {/* Origin Search */}
        <div ref={originRef} className="relative">
          <label className="block text-[9px] uppercase font-black tracking-widest text-slate-400 mb-1.5">
            🟢 Start / Origin
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={originQuery}
              onChange={handleOriginChange}
              onFocus={() => setShowOriginSuggestions(true)}
              placeholder="🔍 Enter Start Location..."
              className="w-full bg-slate-900 border-2 border-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
            {originQuery && (
              <button
                onClick={() => { setOriginQuery(""); setOrigin(""); setShowOriginSuggestions(false); }}
                className="absolute right-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {showOriginSuggestions && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-950/98 backdrop-blur border border-slate-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-[2000] divide-y divide-slate-850">
              {filteredOrigin.length > 0 ? (
                filteredOrigin.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectOrigin(loc)}
                    className="w-full text-left px-4 py-3 hover:bg-amber-950/40 hover:text-amber-400 transition-colors text-xs font-bold text-slate-300 flex items-center justify-between cursor-pointer"
                  >
                    <span>{loc.id === "main_gate" ? "🚪" : "🏡"} {loc.name}</span>
                    {loc.id !== "main_gate" && (
                      <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest font-black">
                        {loc.number}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3.5 text-xs font-bold text-slate-500 text-center">❌ No match</div>
              )}
            </div>
          )}
        </div>

        {/* Destination Search */}
        <div ref={containerRef} className="relative">
          <label className="block text-[9px] uppercase font-black tracking-widest text-slate-400 mb-1.5">
            📍 Target Destination
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleDestChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="🔍 Enter Destination..."
              className="w-full bg-slate-900 border-2 border-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setDestination(""); setShowSuggestions(false); }}
                className="absolute right-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          {showSuggestions && (
            <div className="absolute left-0 right-0 mt-2 bg-slate-950/98 backdrop-blur border border-slate-800 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-[2000] divide-y divide-slate-850">
              {filteredDest.length > 0 ? (
                filteredDest.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectDest(loc)}
                    className="w-full text-left px-4 py-3 hover:bg-cyan-950/40 hover:text-cyan-400 transition-colors text-xs font-bold text-slate-300 flex items-center justify-between cursor-pointer"
                  >
                    <span>{loc.id === "main_gate" ? "🚪" : "🏡"} {loc.name}</span>
                    {loc.id !== "main_gate" && (
                      <span className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-500 uppercase tracking-widest font-black">
                        {loc.number}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3.5 text-xs font-bold text-slate-500 text-center">❌ No match</div>
              )}
            </div>
          )}
        </div>

        {destination && origin && destination !== origin && (
          <div className="flex items-center justify-between px-1 text-slate-300 mt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500">Status:</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] font-black text-cyan-400 animate-pulse">● ROUTING ACTIVE</span>
            </div>
          </div>
        )}
      </div>

      {/* React-Leaflet Map Container */}
      <MapContainer
        center={nodes.main_gate}
        zoom={17.5}
        minZoom={16}
        maxZoom={22}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* Bounds management component */}
        <MapBoundsUpdater pathCoordinates={activePath} isNavigating={isNavigating} />

        {/* Navigation tracking location panning */}
        <LocationFollower isNavigating={isNavigating} userLocation={userLocation} />

        {/* Standard OpenStreetMap to guarantee high zoom tile availability */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={22}
          maxNativeZoom={19}
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
          icon={createMarkerIcon("gate", "Main Security Gate", origin === "main_gate")}
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
          const isOrigin = id === origin;

          return (
            <Marker
              key={id}
              position={coordinates}
              icon={createMarkerIcon(isTargetDestination || isOrigin ? "destination" : "villa", id.replace("_", " "), isTargetDestination || isOrigin)}
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

        {/* User Live Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createMarkerIcon("user", "Your Location", false)}
            zIndexOffset={1000}
          />
        )}
      </MapContainer>

      {/* Navigation Bottom Sheet */}
      {destination && origin && destination !== origin && routeMetadata && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4 pb-6 md:bottom-4 md:left-4 md:right-auto md:pb-4 md:w-[420px]">
          <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-transform duration-300 transform translate-y-0">
            
            {/* Header / Top Row */}
            {hasArrived ? (
              <div className="p-5 flex flex-col gap-4 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-black text-green-600 dark:text-green-400 flex items-center gap-2">
                      <span>🎉</span> You Have Arrived!
                    </h3>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
                      Welcome to {destination === "main_gate" ? "Main Gate" : `Villa ${destination.split("_")[1]}`}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setDestination(""); setSearchQuery(""); setIsNavigating(false); setHasArrived(false); setUserLocation(null); }}
                    className="p-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/40 dark:hover:bg-green-800/60 rounded-full transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-700 dark:text-green-500">
                      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-blue-500">📍</span> Routing to {destination === "main_gate" ? "Main Gate" : `Villa ${destination.split("_")[1]}`}
                    </h3>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border border-slate-200 dark:border-slate-800">
                        <span>📏</span> {routeMetadata.distance}
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 border border-blue-200 dark:border-blue-800/50">
                        <span>⏱️</span> {routeMetadata.eta}
                      </div>
                    </div>
                  </div>
                  
                  {/* Close / Clear Route Button */}
                  <button 
                    onClick={() => { setDestination(""); setSearchQuery(""); setIsNavigating(false); setHasArrived(false); setUserLocation(null); }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-500 dark:text-slate-400">
                      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-slate-800"></div>

            {/* Steps Row */}
            <div className="p-5 max-h-48 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
              <ol className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-5">
                {routeMetadata.steps.map((step, index) => (
                  <li key={index} className="ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-white dark:bg-slate-950 rounded-full -left-[13px] ring-4 ring-slate-50 dark:ring-slate-900/50 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-500 dark:text-slate-400">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug pt-0.5">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Bottom Controls */}
            <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
              {/* Start/Stop Navigation Button */}
              {!isNavigating ? (
                <button
                  onClick={() => setIsNavigating(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-base"
                >
                  <span>🚀 Start Navigation</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsNavigating(false)}
                  className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-500/30 font-bold px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-base"
                >
                  <span>🛑 Stop Navigation</span>
                </button>
              )}

              {/* Speed Limit Notice */}
              <div className="shrink-0 rounded-xl bg-slate-50 dark:bg-slate-900 px-3 py-2.5 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 border-2 border-white text-xs font-extrabold leading-none text-white">
                  15
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider leading-none">Limit</div>
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-0.5">Strictly Monitored</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
