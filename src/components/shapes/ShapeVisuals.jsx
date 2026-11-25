export function ShapeThumbSvg({ shapeId }) {
  switch (shapeId) {
    case 'circle':
      return (
        <svg width="52" height="52" viewBox="0 0 64 64" aria-hidden="true">
          <circle
            cx="32"
            cy="32"
            r="24"
            className="fill-realm-challenge-soft stroke-realm-challenge"
            strokeWidth="4"
          />
        </svg>
      );
    case 'triangle':
      return (
        <svg width="52" height="52" viewBox="0 0 64 64" aria-hidden="true">
          <polygon
            points="32,8 56,54 8,54"
            className="fill-realm-tables-soft stroke-realm-tables"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'square':
      return (
        <svg width="52" height="52" viewBox="0 0 64 64" aria-hidden="true">
          <rect
            x="10"
            y="10"
            width="44"
            height="44"
            rx="4"
            className="fill-realm-geometry stroke-light-on-surface"
            strokeWidth="4"
          />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width="52" height="52" viewBox="0 0 64 64" aria-hidden="true">
          <rect
            x="6"
            y="16"
            width="52"
            height="32"
            rx="4"
            className="fill-realm-calculator-soft stroke-realm-calculator"
            strokeWidth="4"
          />
        </svg>
      );
    case 'pentagon':
      return (
        <svg width="52" height="52" viewBox="0 0 64 64" aria-hidden="true">
          <polygon
            points="32,6 58,25 48,56 16,56 6,25"
            className="fill-light-secondary-container stroke-light-secondary"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width="52" height="52" viewBox="0 0 64 64" aria-hidden="true">
          <polygon
            points="32,6 54,19 54,45 32,58 10,45 10,19"
            className="fill-realm-geometry-soft stroke-realm-geometry"
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function ShapeHeroSvg({ shapeId }) {
  switch (shapeId) {
    case 'circle':
      return (
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <circle
            cx="90"
            cy="90"
            r="68"
            className="fill-realm-challenge-soft stroke-realm-challenge"
            strokeWidth="6"
          />
          <circle cx="90" cy="90" r="5" className="fill-light-on-surface" />
          <line
            x1="90"
            y1="90"
            x2="158"
            y2="90"
            className="stroke-light-on-surface"
            strokeWidth="3"
            strokeDasharray="5 4"
          />
        </svg>
      );
    case 'triangle':
      return (
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <polygon
            points="90,22 158,148 22,148"
            className="fill-realm-tables-soft stroke-realm-tables"
            strokeWidth="6"
            strokeLinejoin="round"
          />
          <circle cx="90" cy="22" r="6" className="fill-light-primary" />
          <circle cx="158" cy="148" r="6" className="fill-light-primary" />
          <circle cx="22" cy="148" r="6" className="fill-light-primary" />
        </svg>
      );
    case 'square':
      return (
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <rect
            x="26"
            y="26"
            width="128"
            height="128"
            rx="8"
            className="fill-realm-geometry-soft stroke-realm-geometry"
            strokeWidth="6"
          />
          <circle cx="26" cy="26" r="6" className="fill-light-secondary" />
          <circle cx="154" cy="26" r="6" className="fill-light-secondary" />
          <circle cx="154" cy="154" r="6" className="fill-light-secondary" />
          <circle cx="26" cy="154" r="6" className="fill-light-secondary" />
        </svg>
      );
    case 'rectangle':
      return (
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <rect
            x="16"
            y="46"
            width="148"
            height="88"
            rx="8"
            className="fill-realm-calculator-soft stroke-realm-calculator"
            strokeWidth="6"
          />
          <circle cx="16" cy="46" r="6" className="fill-light-secondary" />
          <circle cx="164" cy="46" r="6" className="fill-light-secondary" />
          <circle cx="164" cy="134" r="6" className="fill-light-secondary" />
          <circle cx="16" cy="134" r="6" className="fill-light-secondary" />
        </svg>
      );
    case 'pentagon':
      return (
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <polygon
            points="90,18 160,68 134,152 46,152 20,68"
            className="fill-light-secondary-container stroke-light-secondary"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'hexagon':
      return (
        <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
          <polygon
            points="90,18 152,54 152,126 90,162 28,126 28,54"
            className="fill-realm-geometry-soft stroke-realm-geometry"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
