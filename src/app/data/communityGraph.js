export const nodes = {
  main_gate: {
    id: "main_gate",
    label: "Main Entrance Gate",
    coordinates: [13.004709, 77.718304],
    type: "gate",
    description: "Security Gate & QR Scan Point",
  },
  villa_105: {
    id: "villa_105",
    label: "Villa 105",
    coordinates: [13.005998, 77.718383],
    type: "villa",
    description: "Resident Villa 105 (North-West Sector)",
  },
  villa_149: {
    id: "villa_149",
    label: "Villa 149",
    coordinates: [13.005808, 77.718856],
    type: "villa",
    description: "Resident Villa 149 (Central-East Sector)",
  },
  villa_127: {
    id: "villa_127",
    label: "Villa 127",
    coordinates: [13.007814, 77.719042],
    type: "villa",
    description: "Resident Villa 127 (North Sector)",
  },
  villa_128: {
    id: "villa_128",
    label: "Villa 128",
    coordinates: [13.007847, 77.719172],
    type: "villa",
    description: "Resident Villa 128 (North-East Sector)",
  },
  junction_a: {
    id: "junction_a",
    label: "Clubhouse Intersection",
    coordinates: [13.005300, 77.718500],
    type: "junction",
    description: "Clubhouse junction, speed limit 20 km/h",
  },
  junction_b: {
    id: "junction_b",
    label: "North Palm Avenue Junction",
    coordinates: [13.006800, 77.718800],
    type: "junction",
    description: "Avenue junction, speed limit 20 km/h",
  }
};

export const graph = {
  main_gate: [
    { to: "junction_a", distance: 80, speedLimit: 20, roadName: "Main Entrance Road" }
  ],
  junction_a: [
    { to: "main_gate", distance: 80, speedLimit: 20, roadName: "Main Entrance Road" },
    { to: "villa_105", distance: 90, speedLimit: 15, roadName: "Orchard Lane" },
    { to: "villa_149", distance: 70, speedLimit: 15, roadName: "Bougainvillea Path" },
    { to: "junction_b", distance: 180, speedLimit: 20, roadName: "Central Boulevard" }
  ],
  villa_105: [
    { to: "junction_a", distance: 90, speedLimit: 15, roadName: "Orchard Lane" }
  ],
  villa_149: [
    { to: "junction_a", distance: 70, speedLimit: 15, roadName: "Bougainvillea Path" },
    { to: "junction_b", distance: 120, speedLimit: 20, roadName: "Central Boulevard" }
  ],
  junction_b: [
    { to: "junction_a", distance: 180, speedLimit: 20, roadName: "Central Boulevard" },
    { to: "villa_149", distance: 120, speedLimit: 20, roadName: "Central Boulevard" },
    { to: "villa_127", distance: 110, speedLimit: 15, roadName: "North Palm Avenue" },
    { to: "villa_128", distance: 120, speedLimit: 15, roadName: "North Palm Avenue" }
  ],
  villa_127: [
    { to: "junction_b", distance: 110, speedLimit: 15, roadName: "North Palm Avenue" },
    { to: "villa_128", distance: 15, speedLimit: 10, roadName: "Shared Villa Driveway" }
  ],
  villa_128: [
    { to: "junction_b", distance: 120, speedLimit: 15, roadName: "North Palm Avenue" },
    { to: "villa_127", distance: 15, speedLimit: 10, roadName: "Shared Villa Driveway" }
  ]
};
