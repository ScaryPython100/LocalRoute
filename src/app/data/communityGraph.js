export const nodes = {
  main_gate: [13.004709, 77.718304],
  villa_149: [13.005808, 77.718856],
  villa_105: [13.005998, 77.718383],
  villa_128: [13.007847, 77.719172],
  villa_127: [13.007814, 77.719042]
};

export const paths = {
  villa_149: [
    [13.004709, 77.718304], // Main Gate
    [13.005750, 77.718310], // Intersection
    [13.005780, 77.718820], // Turn toward 149
    [13.005808, 77.718856]  // Villa 149 Doorstep
  ],
  villa_105: [
    [13.004709, 77.718304], // Main Gate
    [13.005950, 77.718310], // Turn intersection for Villa 105 row
    [13.005998, 77.718383]  // Villa 105 Doorstep
  ],
  villa_128: [
    [13.004709, 77.718304], // Main Gate
    [13.007800, 77.718350], // Drive all the way up the main layout spine road
    [13.007820, 77.719100], // Turn right into the top cross road
    [13.007847, 77.719172]  // Villa 128 Doorstep
  ],
  villa_127: [
    [13.004709, 77.718304], // Main Gate
    [13.007800, 77.718350], // Drive up the main layout spine road
    [13.007810, 77.719000], // Turn right into the top cross road
    [13.007814, 77.719042]  // Villa 127 Doorstep
  ]
};
