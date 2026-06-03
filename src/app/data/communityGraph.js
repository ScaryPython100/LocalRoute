export const nodes = {
  main_gate: [13.004708, 77.718294],
  villa_149: [13.005808, 77.718856],
  villa_105: [13.005998, 77.718383],
  villa_128: [13.007847, 77.719172],
  villa_127: [13.007814, 77.719042]
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
  villa_105: ['wp_105_turn'],
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

const hardcodedMetadata = {
  villa_105: {
    distance: "180m",
    eta: "1 min drive / 2 min walk",
    steps: [
      "Enter through the Main Gate security check.",
      "Drive straight along the main avenue for 150 meters.",
      "Villa 105 will be immediately on your right hand side."
    ]
  },
  villa_149: {
    distance: "210m",
    eta: "1 min drive / 3 min walk",
    steps: [
      "Enter through the Main Gate security check.",
      "Follow the main avenue straight past the first intersection.",
      "Turn right at the second junction.",
      "Villa 149 is the first house on the left."
    ]
  },
  villa_128: {
    distance: "380m",
    eta: "2 min drive / 5 min walk",
    steps: [
      "Enter through the Main Gate.",
      "Follow the spine road all the way to the north-east sector.",
      "Take the final right turn into the East Lane.",
      "Villa 128 is located at the end of the cul-de-sac on the right."
    ]
  },
  villa_127: {
    distance: "360m",
    eta: "2 min drive / 4 min walk",
    steps: [
      "Enter through the Main Gate.",
      "Follow the spine road to the north-east sector.",
      "Take the final right turn into the East Lane.",
      "Villa 127 is the second-to-last house on the left side."
    ]
  }
};

export function getRouteMetadata(startId, endId, pathCoordinates) {
  if (!startId || !endId) return null;

  // If the user is routing from the Main Gate, use the hardcoded text instructions
  if (startId === "main_gate" && hardcodedMetadata[endId]) {
    return hardcodedMetadata[endId];
  }

  // Otherwise, calculate dynamic distance and generate generic steps
  let totalDistance = 0;
  if (pathCoordinates && pathCoordinates.length > 1) {
    for (let i = 0; i < pathCoordinates.length - 1; i++) {
      totalDistance += getDistance(pathCoordinates[i], pathCoordinates[i+1]);
    }
  }

  const distStr = totalDistance > 0 ? `${Math.round(totalDistance)}m` : "Unknown";
  // Assuming driving speed ~ 15km/h (250m/min) and walking ~ 5km/h (83m/min)
  const driveTime = Math.max(1, Math.round(totalDistance / 250));
  const walkTime = Math.max(1, Math.round(totalDistance / 83));

  const startName = startId === "main_gate" ? "the Main Gate" : `Villa ${startId.split("_")[1]}`;
  const endName = endId === "main_gate" ? "the Main Gate" : `Villa ${endId.split("_")[1]}`;

  return {
    distance: distStr,
    eta: `${driveTime} min drive / ${walkTime} min walk`,
    steps: [
      `Depart from ${startName}.`,
      `Follow the highlighted navigation path along the community roads.`,
      `Arrive at your destination: ${endName}.`
    ]
  };
}
