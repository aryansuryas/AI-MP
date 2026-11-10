import React from 'react';

export const HouseIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 540 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-full sm:max-w-[500px] lg:max-w-[580px] h-auto drop-shadow-sm select-none"
      >
        {/* Subtle ground baseline */}
        <line x1="40" y1="320" x2="500" y2="320" stroke="#E5E5E5" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="70" y1="320" x2="470" y2="320" stroke="#171717" strokeWidth="2" />

        {/* Backdrop Grid Lines (Subtle architectural blueprint feel) */}
        <line x1="120" y1="90" x2="120" y2="320" stroke="#F0F0F0" strokeWidth="1" />
        <line x1="270" y1="60" x2="270" y2="320" stroke="#F0F0F0" strokeWidth="1" />
        <line x1="420" y1="120" x2="420" y2="320" stroke="#F0F0F0" strokeWidth="1" />

        {/* Main Building Body */}
        <rect
          x="140"
          y="150"
          width="260"
          height="170"
          rx="2"
          fill="#FFFFFF"
          stroke="#171717"
          strokeWidth="2"
        />

        {/* Left Wing / Garage / Studio */}
        <rect
          x="80"
          y="200"
          width="70"
          height="120"
          fill="#FAFAFA"
          stroke="#171717"
          strokeWidth="2"
        />
        {/* Left wing slanted roof */}
        <polygon
          points="70,200 150,165 150,200"
          fill="#EEEEEE"
          stroke="#171717"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Main Gable Roof */}
        <polygon
          points="270,70 120,152 420,152"
          fill="#F5F5F5"
          stroke="#171717"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Chimney */}
        <rect
          x="340"
          y="85"
          width="24"
          height="45"
          fill="#FFFFFF"
          stroke="#171717"
          strokeWidth="2"
        />
        <rect
          x="336"
          y="80"
          width="32"
          height="6"
          fill="#333333"
          stroke="#171717"
          strokeWidth="1.5"
        />

        {/* Attic Triangular Window */}
        <circle cx="270" cy="120" r="14" fill="#FAFAFA" stroke="#171717" strokeWidth="1.5" />
        <line x1="256" y1="120" x2="284" y2="120" stroke="#737373" strokeWidth="1.2" />
        <line x1="270" y1="106" x2="270" y2="134" stroke="#737373" strokeWidth="1.2" />

        {/* Second Floor Windows */}
        {/* Left Window */}
        <rect
          x="175"
          y="175"
          width="48"
          height="54"
          rx="1"
          fill="#FAFAFA"
          stroke="#171717"
          strokeWidth="1.5"
        />
        <line x1="199" y1="175" x2="199" y2="229" stroke="#737373" strokeWidth="1" />
        <line x1="175" y1="202" x2="223" y2="202" stroke="#737373" strokeWidth="1" />

        {/* Right Window */}
        <rect
          x="315"
          y="175"
          width="48"
          height="54"
          rx="1"
          fill="#FAFAFA"
          stroke="#171717"
          strokeWidth="1.5"
        />
        <line x1="339" y1="175" x2="339" y2="229" stroke="#737373" strokeWidth="1" />
        <line x1="315" y1="202" x2="363" y2="202" stroke="#737373" strokeWidth="1" />

        {/* Ground Floor Features */}
        {/* Front Door */}
        <rect
          x="248"
          y="248"
          width="44"
          height="72"
          fill="#333333"
          stroke="#171717"
          strokeWidth="1.5"
        />
        {/* Door Window & Handle */}
        <rect x="257" y="258" width="26" height="20" fill="#FFFFFF" stroke="#333333" strokeWidth="1" />
        <circle cx="284" cy="288" r="2.5" fill="#FFFFFF" />

        {/* Steps */}
        <rect x="242" y="316" width="56" height="4" fill="#EEEEEE" stroke="#171717" strokeWidth="1" />

        {/* Ground Floor Big Living Window */}
        <rect
          x="165"
          y="255"
          width="62"
          height="55"
          rx="1"
          fill="#FAFAFA"
          stroke="#171717"
          strokeWidth="1.5"
        />
        <line x1="185" y1="255" x2="185" y2="310" stroke="#737373" strokeWidth="1" />
        <line x1="206" y1="255" x2="206" y2="310" stroke="#737373" strokeWidth="1" />
        <line x1="165" y1="282" x2="227" y2="282" stroke="#737373" strokeWidth="1" />

        {/* Right Ground Floor Window */}
        <rect
          x="310"
          y="255"
          width="62"
          height="55"
          rx="1"
          fill="#FAFAFA"
          stroke="#171717"
          strokeWidth="1.5"
        />
        <line x1="330" y1="255" x2="330" y2="310" stroke="#737373" strokeWidth="1" />
        <line x1="351" y1="255" x2="351" y2="310" stroke="#737373" strokeWidth="1" />
        <line x1="310" y1="282" x2="372" y2="282" stroke="#737373" strokeWidth="1" />

        {/* Left Studio Garage Door with Horizontal Slats */}
        <rect x="92" y="240" width="46" height="80" fill="#FFFFFF" stroke="#171717" strokeWidth="1.5" />
        <line x1="92" y1="256" x2="138" y2="256" stroke="#E5E5E5" strokeWidth="1.5" />
        <line x1="92" y1="272" x2="138" y2="272" stroke="#E5E5E5" strokeWidth="1.5" />
        <line x1="92" y1="288" x2="138" y2="288" stroke="#E5E5E5" strokeWidth="1.5" />
        <line x1="92" y1="304" x2="138" y2="304" stroke="#E5E5E5" strokeWidth="1.5" />

        {/* Minimal Stylized Tree on Right */}
        <line x1="440" y1="240" x2="440" y2="320" stroke="#171717" strokeWidth="2" />
        <polygon
          points="440,195 415,245 465,245"
          fill="#FAFAFA"
          stroke="#171717"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <polygon
          points="440,225 410,275 470,275"
          fill="#EEEEEE"
          stroke="#171717"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Price Tag badge floating above roof */}
        <g transform="translate(370, 45)">
          <rect
            x="0"
            y="0"
            width="96"
            height="36"
            rx="6"
            fill="#FFFFFF"
            stroke="#171717"
            strokeWidth="1.5"
          />
          <text x="12" y="23" fontFamily="sans-serif" fontSize="13" fontWeight="bold" fill="#171717">
            $245
          </text>
          <text x="50" y="23" fontFamily="sans-serif" fontSize="10" fill="#737373">
            /night
          </text>
        </g>
      </svg>
    </div>
  );
};

