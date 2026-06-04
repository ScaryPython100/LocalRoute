import { translations } from './translations';

export const nodes = {
  main_gate: [13.004709, 77.718304],
  villa_149: [13.005808, 77.718856],
  villa_105: [13.005978, 77.718388],
  villa_104: [13.006048, 77.718388],
  villa_103: [13.006138, 77.718399],
  villa_102: [13.006218, 77.718420],
  villa_101: [13.006308, 77.718430],
  villa_100: [13.006408, 77.718450],
  villa_99:  [13.006500, 77.718470],
  villa_98:  [13.006677, 77.718489],
  villa_97:  [13.006757, 77.718509],
  villa_96:  [13.006767, 77.718509],
  villa_95:  [13.006847, 77.718519],
  villa_128: [13.007847, 77.719092],
  villa_127: [13.007794, 77.719082]
};

const internalWaypoints = {
  wp_bend1: [13.005574, 77.718472],
  wp_spine: [13.005839, 77.718535],
  wp_105_turn: [13.005868, 77.718362],
  wp_mid_turn: [13.005810, 77.718738],
  wp_ne_bend: [13.006527, 77.718851],
  wp_tr_lane: [13.007908, 77.719098]
};

const allNodes = { ...nodes, ...internalWaypoints };

const graphEdges = {
  main_gate: ['wp_bend1'],
  wp_bend1: ['main_gate', 'wp_spine'],
  wp_spine: ['wp_bend1', 'wp_105_turn', 'wp_mid_turn'],
  wp_105_turn: ['wp_spine', 'villa_105'],
  villa_105: ['wp_105_turn', 'villa_104'],
  villa_104: ['villa_105', 'villa_103'],
  villa_103: ['villa_104', 'villa_102'],
  villa_102: ['villa_103', 'villa_101'],
  villa_101: ['villa_102', 'villa_100'],
  villa_100: ['villa_101', 'villa_99'],
  villa_99: ['villa_100', 'villa_98'],
  villa_98: ['villa_99', 'villa_97'],
  villa_97: ['villa_98', 'villa_96'],
  villa_96: ['villa_97', 'villa_95'],
  villa_95: ['villa_96'],
  wp_mid_turn: ['wp_spine', 'villa_149', 'wp_ne_bend'],
  villa_149: ['wp_mid_turn'],
  wp_ne_bend: ['wp_mid_turn', 'wp_tr_lane'],
  wp_tr_lane: ['wp_ne_bend', 'villa_128', 'villa_127'],
  villa_128: ['wp_tr_lane'],
  villa_127: ['wp_tr_lane']
};

export function findShortestPath(startId, endId) {
  if (!startId || !endId || !allNodes[startId] || !allNodes[endId]) return [];
  if (startId === endId) return [];

  // Breadth-First Search (BFS) to find shortest path across the physical street network graph
  const queue = [[startId]];
  const visited = new Set([startId]);

  while (queue.length > 0) {
    const path = queue.shift();
    const currentNode = path[path.length - 1];

    if (currentNode === endId) {
      // Map path of IDs back to array of [lat, lng] coordinates
      return path.map(id => allNodes[id]);
    }

    const neighbors = graphEdges[currentNode] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [];
}

// Function to calculate Haversine distance in meters between two lat/lng coordinates
function getDistance(coord1, coord2) {
  const R = 6371e3; // Earth radius in meters
  const lat1 = coord1[0] * Math.PI / 180;
  const lat2 = coord2[0] * Math.PI / 180;
  const deltaLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const deltaLng = (coord2[1] - coord1[1]) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function getRouteMetadata(startId, endId, pathCoordinates, lang = 'en') {
  if (!startId || !endId) return null;

  const t = translations[lang] || translations['en'];

  let totalDistance = 0;
  if (pathCoordinates && pathCoordinates.length > 1) {
    for (let i = 0; i < pathCoordinates.length - 1; i++) {
      totalDistance += getDistance(pathCoordinates[i], pathCoordinates[i+1]);
    }
  }

  const distStr = totalDistance > 0 ? `${Math.round(totalDistance)}m` : "Unknown";
  const driveTime = Math.max(1, Math.round(totalDistance / 250));
  const walkTime = Math.max(1, Math.round(totalDistance / 83));
  const etaStr = t.eta.driveWalk.replace('{drive}', driveTime).replace('{walk}', walkTime);

  // If the user is routing from the Main Gate, use the localized text instructions
  if (startId === "main_gate" && t.routes[endId]) {
    return {
      distance: distStr,
      eta: etaStr,
      steps: t.routes[endId]
    };
  }

  // Otherwise, use localized generic fallback steps
  const startName = startId === "main_gate" ? t.map.mainGate : `${t.map.villa} ${startId.split("_")[1]}`;
  const endName = endId === "main_gate" ? t.map.mainGate : `${t.map.villa} ${endId.split("_")[1]}`;

  return {
    distance: distStr,
    eta: etaStr,
    steps: [
      t.routes.fallback[0].replace('{start}', startName),
      t.routes.fallback[1],
      t.routes.fallback[2].replace('{end}', endName)
    ]
  };
}
