export const nodes = {
  main_gate: [13.004708, 77.718294],
  villa_149: [13.005808, 77.718856],
  villa_105: [13.005998, 77.718383],
  villa_128: [13.007847, 77.719172],
  villa_127: [13.007814, 77.719042]
};

export const paths = {
  villa_149: [
    [13.004708, 77.718294], // Main Gate
    [13.005574, 77.718472], // Intermediate bend on the main lane
    [13.005839, 77.718535], // Intersection to turn toward 149
    [13.005810, 77.718738], // Row entrance point
    [13.005808, 77.718856]  // Villa 149 Doorstep
  ],
  villa_105: [
    [13.004708, 77.718294], // Main Gate
    [13.005574, 77.718472], // Intermediate bend
    [13.005839, 77.718535], // Spine intersection
    [13.005868, 77.718362], // Villa 105 row turn
    [13.005998, 77.718383]  // Villa 105 Doorstep
  ],
  villa_128: [
    [13.004708, 77.718294], // Main Gate
    [13.005574, 77.718472], // Intermediate bend
    [13.005839, 77.718535], // Spine intersection
    [13.005810, 77.718738], // Mid-point turn
    [13.006527, 77.718851], // Northeast spine bend
    [13.007908, 77.719098], // Top-right lane intersection
    [13.007847, 77.719172]  // Villa 128 Doorstep
  ],
  villa_127: [
    [13.004708, 77.718294], // Main Gate
    [13.005574, 77.718472], // Intermediate bend
    [13.005839, 77.718535], // Spine intersection
    [13.005810, 77.718738], // Mid-point turn
    [13.006527, 77.718851], // Northeast spine bend
    [13.007908, 77.719098], // Top-right lane intersection
    [13.007814, 77.719042]  // Villa 127 Doorstep
  ]
};
