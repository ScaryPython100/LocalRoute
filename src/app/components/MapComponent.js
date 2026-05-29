"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { nodes, graph } from "../data/communityGraph";

// Custom components to interact with leaflet map instance
function MapUpdater({ center, bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18, animate: true, duration: 1.5 });
    } else if (center) {
      map.setView(center, 17, { animate: true, duration: 1.5 });
    }
  }, [center, bounds, map]);
  return null;
}

export default function MapComponent({ selectedOrigin, selectedDestination, onRouteCalculated }) {
  const [routePath, setRoutePath] = useState([]);
  const [routeEdges, setRouteEdges] = useState([]);
  const [mapBounds, setMapBounds] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when running in the browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Standard coordinates for centering if nothing is selected
  const defaultCenter = nodes.main_gate.coordinates;

  // Dijkstra shortest path algorithm
  const calculateRoute = (startId, endId) => {
    if (!startId || !endId || startId === endId) {
      setRoutePath([]);
      setRouteEdges([]);
      setMapBounds(null);
      if (onRouteCalculated) onRouteCalculated(null);
      return;
    }

    const distances = {};
    const prev = {};
    const queue = [];

    Object.keys(nodes).forEach((nodeId) => {
      distances[nodeId] = Infinity;
      prev[nodeId] = null;
      queue.push(nodeId);
    });
    distances[startId] = 0;

    while (queue.length > 0) {
      // Find node with minimum distance
      queue.sort((a, b) => distances[a] - distances[b]);
      const u = queue.shift();

      if (u === endId) break;
      if (distances[u] === Infinity) break;

      const neighbors = graph[u] || [];
      for (const neighbor of neighbors) {
        const v = neighbor.to;
        if (!queue.includes(v)) continue;
        const alt = distances[u] + neighbor.distance;
        if (alt < distances[v]) {
          distances[v] = alt;
          prev[v] = { from: u, edgeInfo: neighbor };
        }
      }
    }

    // Reconstruct path
    const pathIds = [];
    const edges = [];
    let curr = endId;

    while (prev[curr]) {
      pathIds.unshift(curr);
      edges.unshift(prev[curr].edgeInfo);
      curr = prev[curr].from;
    }
    
    if (pathIds.length > 0) {
      pathIds.unshift(startId);
    }

    const pathCoordinates = pathIds.map((id) => nodes[id].coordinates);
    setRoutePath(pathCoordinates);
    setRouteEdges(edges);

    // Calculate map bounds to fit the route
    if (pathCoordinates.length > 0) {
      const bounds = L.latLngBounds(pathCoordinates);
      setMapBounds(bounds);
    }

    // Trigger parent callback with route details
    if (onRouteCalculated) {
      const totalDistance = edges.reduce((sum, edge) => sum + edge.distance, 0);
      const totalTimeSeconds = edges.reduce((sum, edge) => {
        // time = distance / speed
        // speed is in km/h, convert to m/s: speed * (1000 / 3600) = speed / 3.6
        const speedMPS = edge.speedLimit / 3.6;
        return sum + (edge.distance / speedMPS);
      }, 0);
      
      onRouteCalculated({
        pathIds,
        edges,
        totalDistance,
        totalTimeMinutes: Math.ceil(totalTimeSeconds / 60),
        landmarks: pathIds
          .map(id => nodes[id])
          .filter(node => node.type === "villa" || node.id === "main_gate"),
      });
    }
  };

  // Recalculate route when selection changes
  useEffect(() => {
    calculateRoute(selectedOrigin, selectedDestination);
  }, [selectedOrigin, selectedDestination]);

  if (!isClient) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-3 text-sm text-slate-500 font-medium">Initializing navigation satellite map...</p>
        </div>
      </div>
    );
  }

  // Leaflet custom icons using SVG templates for clean high-contrast presentation
  const createCustomIcon = (type, isActive) => {
    let iconHtml = "";
    if (type === "gate") {
      iconHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-white border-2 border-white shadow-lg shadow-amber-500/50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
          </svg>
        </div>
      `;
    } else if (type === "villa") {
      const bgColor = isActive ? "bg-emerald-600 border-emerald-200 animate-pulse shadow-emerald-500/50" : "bg-indigo-600 border-indigo-200 shadow-indigo-500/40";
      iconHtml = `
        <div class="flex items-center justify-center w-8 h-8 rounded-full ${bgColor} text-white border-2 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69Z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.43Z" />
          </svg>
        </div>
      `;
    } else {
      // Junction/Intersection node
      iconHtml = `
        <div class="flex items-center justify-center w-4 h-4 rounded-full bg-slate-500 text-white border border-white shadow">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      `;
    }

    return L.divIcon({
      html: iconHtml,
      className: "custom-leaflet-icon",
      iconSize: type === "junction" ? [16, 16] : [32, 32],
      iconAnchor: type === "junction" ? [8, 8] : [16, 16],
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md dark:border-slate-800">
      <MapContainer
        center={defaultCenter}
        zoom={17}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* Dynamic Map panning / Zoom bounds adjustment */}
        <MapUpdater center={defaultCenter} bounds={mapBounds} />

        {/* Premium CartoDB Voyager Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Community Route Highlight */}
        {routePath.length > 0 && (
          <>
            {/* Outline backing line for enhanced high-contrast visual depth */}
            <Polyline
              positions={routePath}
              color="#0f172a"
              weight={8}
              opacity={0.8}
            />
            {/* Glowing inner core indicating actual custom route */}
            <Polyline
              positions={routePath}
              color="#10b981"
              weight={4}
              opacity={1}
              dashArray="8, 8"
            />
          </>
        )}

        {/* Overlay Markers for survey nodes */}
        {Object.values(nodes).map((node) => {
          const isSource = node.id === selectedOrigin;
          const isTarget = node.id === selectedDestination;
          const isActive = isSource || isTarget;

          // Hide junctions if they aren't part of an active route to keep UI clean
          if (node.type === "junction" && !routePath.some(coord => coord[0] === node.coordinates[0] && coord[1] === node.coordinates[1])) {
            return null;
          }

          return (
            <Marker
              key={node.id}
              position={node.coordinates}
              icon={createCustomIcon(node.type, isTarget)}
            >
              <Popup className="custom-popup">
                <div className="p-1 font-sans">
                  <div className="font-bold text-slate-900">{node.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{node.description}</div>
                  <div className="mt-1 text-[10px] text-slate-400 font-mono">
                    [{node.coordinates[0].toFixed(6)}, {node.coordinates[1].toFixed(6)}]
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Speed & Limit notice directly on the map context */}
      {routeEdges.length > 0 && (
        <div className="absolute top-4 left-4 z-[400] rounded-xl bg-slate-900/95 backdrop-blur-md px-3 py-2 text-white border border-slate-700 shadow-xl flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 border border-white text-xs font-bold leading-none">
            20
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Max Limit</div>
            <div className="text-xs font-semibold text-emerald-400">Gated Area Speed Control</div>
          </div>
        </div>
      )}
    </div>
  );
}
