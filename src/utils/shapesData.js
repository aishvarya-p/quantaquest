function formatMetric(value) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export const SHAPES = {
  circle: {
    id: 'circle',
    name: 'Circle',
    sides: '0 Straight Sides',
    corners: '0 Corners',
    fact: 'Every point on a circle’s edge is the exact same distance from its center—perfect for wheels and planets!',
    properties:
      'A circle has one smooth curved edge, no straight sides, and no corners. The distance from the center to the edge is the radius (r).',
    formula: 'Area = π × r² · Circumference = 2 × π × r',
    primaryLabel: 'Radius (r)',
    secondMetricLabel: 'Circumference',
    calculate(r) {
      return {
        area: `${formatMetric(Math.PI * r * r)} cm²`,
        secondMetric: `${formatMetric(2 * Math.PI * r)} cm`,
        dimBadge: `Radius r = ${formatMetric(r)} cm`,
      };
    },
  },
  triangle: {
    id: 'triangle',
    name: 'Triangle',
    sides: '3 Sides',
    corners: '3 Corners',
    fact: 'Triangles are the strongest shape in engineering—bridges and towers use them because they never wobble!',
    properties:
      'An equilateral triangle has 3 straight sides of equal length, 3 corners, and 3 equal 60° angles that add up to 180°.',
    formula: 'Equilateral: Area ≈ 0.433 × s² · Perimeter = 3 × s',
    primaryLabel: 'Side (s)',
    secondMetricLabel: 'Perimeter',
    calculate(s) {
      return {
        area: `${formatMetric((Math.sqrt(3) / 4) * s * s)} cm²`,
        secondMetric: `${formatMetric(3 * s)} cm`,
        dimBadge: `Side s = ${formatMetric(s)} cm`,
      };
    },
  },
  square: {
    id: 'square',
    name: 'Square',
    sides: '4 Sides',
    corners: '4 Corners',
    fact: 'All four sides are equal in length, and every corner is a crisp 90° right angle—just like a chessboard tile!',
    properties:
      'A square has 4 equal straight sides, 4 right-angle (90°) corners, and two pairs of parallel opposite sides.',
    formula: 'Area = s × s · Perimeter = 4 × s',
    primaryLabel: 'Side (s)',
    secondMetricLabel: 'Perimeter',
    calculate(s) {
      return {
        area: `${formatMetric(s * s)} cm²`,
        secondMetric: `${formatMetric(4 * s)} cm`,
        dimBadge: `Side s = ${formatMetric(s)} cm`,
      };
    },
  },
  rectangle: {
    id: 'rectangle',
    name: 'Rectangle',
    sides: '4 Sides',
    corners: '4 Corners',
    fact: 'Opposite sides are parallel and equal, with four 90° corners—just like books, doors, and tablets!',
    properties:
      'A rectangle has 4 straight sides where opposite sides are equal in length, plus 4 crisp 90° right-angle corners.',
    formula: 'Area = l × w · Perimeter = 2 × (l + w)',
    primaryLabel: 'Width (w)',
    secondaryLabel: 'Length (l)',
    secondMetricLabel: 'Perimeter',
    calculate(w, l) {
      return {
        area: `${formatMetric(l * w)} cm²`,
        secondMetric: `${formatMetric(2 * (l + w))} cm`,
        dimBadge: `w = ${formatMetric(w)} cm · l = ${formatMetric(l)} cm`,
      };
    },
  },
  pentagon: {
    id: 'pentagon',
    name: 'Pentagon',
    sides: '5 Sides',
    corners: '5 Corners',
    fact: 'A regular pentagon has 5 equal sides and 5 equal angles of 108°—often seen in soccer ball patches!',
    properties:
      '“Penta” means five. A regular pentagon has 5 equal straight sides, 5 corners, and 5 lines of symmetry.',
    formula: 'Regular: Area ≈ 1.72 × s² · Perimeter = 5 × s',
    primaryLabel: 'Side (s)',
    secondMetricLabel: 'Perimeter',
    calculate(s) {
      const area = (5 * s * s) / (4 * Math.tan(Math.PI / 5));
      return {
        area: `${formatMetric(area)} cm²`,
        secondMetric: `${formatMetric(5 * s)} cm`,
        dimBadge: `Side s = ${formatMetric(s)} cm`,
      };
    },
  },
  hexagon: {
    id: 'hexagon',
    name: 'Hexagon',
    sides: '6 Sides',
    corners: '6 Corners',
    fact: 'Honeybees build hexagonal cells because 6-sided tiles pack together tightly with zero wasted space!',
    properties:
      '“Hexa” means six. A regular hexagon has 6 equal straight sides, 6 corners, and six 120° interior angles.',
    formula: 'Regular: Area ≈ 2.60 × s² · Perimeter = 6 × s',
    primaryLabel: 'Side (s)',
    secondMetricLabel: 'Perimeter',
    calculate(s) {
      const area = ((3 * Math.sqrt(3)) / 2) * s * s;
      return {
        area: `${formatMetric(area)} cm²`,
        secondMetric: `${formatMetric(6 * s)} cm`,
        dimBadge: `Side s = ${formatMetric(s)} cm`,
      };
    },
  },
};

export const SHAPE_LIST = [
  SHAPES.circle,
  SHAPES.triangle,
  SHAPES.square,
  SHAPES.rectangle,
  SHAPES.pentagon,
  SHAPES.hexagon,
];

export const SHAPE_QUIZ_QUESTIONS = [
  {
    id: 'riddle-pentagon',
    prompt:
      '“I have 5 equal sides and 5 corners, just like a home plate on a baseball field. Who am I?”',
    options: ['Triangle', 'Pentagon', 'Hexagon'],
    correctAnswer: 'Pentagon',
    explanation: '“Penta” means five, so a Pentagon has 5 sides and 5 corners.',
  },
  {
    id: 'riddle-hexagon',
    prompt:
      '“Honeybees build their honeycomb cells in my shape because my 6 equal sides fit together with zero gaps. Who am I?”',
    options: ['Square', 'Pentagon', 'Hexagon'],
    correctAnswer: 'Hexagon',
    explanation: 'A Hexagon has 6 sides and 6 corners.',
  },
  {
    id: 'riddle-circle',
    prompt:
      '“I have 0 straight sides and 0 corners, and every point on my edge stays the same distance from the center. Who am I?”',
    options: ['Circle', 'Triangle', 'Square'],
    correctAnswer: 'Circle',
    explanation: 'A Circle is completely round with 0 straight sides and 0 corners.',
  },
  {
    id: 'riddle-triangle',
    prompt:
      '“Engineers love using me in bridges because my 3 sides and 3 corners never wobble. Who am I?”',
    options: ['Triangle', 'Rectangle', 'Pentagon'],
    correctAnswer: 'Triangle',
    explanation: 'A Triangle has 3 sides and 3 corners.',
  },
  {
    id: 'riddle-square',
    prompt:
      '“I have 4 equal sides and four crisp 90° right-angle corners, just like a chessboard tile. Who am I?”',
    options: ['Triangle', 'Square', 'Hexagon'],
    correctAnswer: 'Square',
    explanation: 'A Square has 4 equal sides and 4 right-angle corners.',
  },
  {
    id: 'riddle-rectangle',
    prompt:
      '“I have 4 corners of 90° and 4 sides, where opposite sides match in length like a door or notebook. Who am I?”',
    options: ['Circle', 'Rectangle', 'Pentagon'],
    correctAnswer: 'Rectangle',
    explanation: 'A Rectangle has 4 right angles and equal opposite sides.',
  },
];
