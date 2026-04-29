interface CarrotHourglassLoaderProps {
  size?: number;
}

/**
 * Animated carrot-shaped hourglass loader.
 * Pure SVG + CSS, geen externe afhankelijkheden.
 */
export const CarrotHourglassLoader = ({ size = 160 }: CarrotHourglassLoaderProps) => {
  return (
    <div
      className="carrot-hourglass-wrapper"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <style>{`
        .carrot-hourglass-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .carrot-flip {
          transform-origin: 50% 50%;
          animation: carrot-flip 4s ease-in-out infinite;
        }
        @keyframes carrot-flip {
          0%, 45% { transform: rotate(0deg); }
          50%, 95% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        .leaf-wiggle {
          transform-origin: 50% 100%;
          animation: leaf-wiggle 1.6s ease-in-out infinite;
        }
        @keyframes leaf-wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .sand-top {
          animation: sand-top 4s ease-in-out infinite;
          transform-origin: 50% 50%;
        }
        @keyframes sand-top {
          0% { transform: scaleY(1); opacity: 1; }
          40% { transform: scaleY(0); opacity: 0.4; }
          50%, 100% { transform: scaleY(0); opacity: 0; }
        }
        .sand-bottom {
          animation: sand-bottom 4s ease-in-out infinite;
          transform-origin: 50% 100%;
        }
        @keyframes sand-bottom {
          0% { transform: scaleY(0); opacity: 0; }
          40% { transform: scaleY(1); opacity: 1; }
          50%, 100% { transform: scaleY(1); opacity: 1; }
        }
        .sand-stream {
          animation: sand-stream 4s ease-in-out infinite;
        }
        @keyframes sand-stream {
          0%, 5% { opacity: 0; }
          10%, 40% { opacity: 1; }
          45%, 100% { opacity: 0; }
        }
      `}</style>
      <svg
        viewBox="0 0 120 180"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="carrot-flip">
          {/* Loof / blaadjes */}
          <g className="leaf-wiggle">
            <path
              d="M60 22 C50 6, 38 4, 36 14 C34 22, 44 26, 52 26 Z"
              fill="#9BB510"
            />
            <path
              d="M60 22 C60 4, 70 0, 76 8 C82 16, 74 26, 66 26 Z"
              fill="#B3CA17"
            />
            <path
              d="M60 22 C68 8, 82 8, 86 18 C90 28, 78 30, 70 28 Z"
              fill="#9BB510"
            />
          </g>

          {/* Wortel-lichaam */}
          <path
            d="M30 38 Q60 28 90 38 L74 168 Q60 180 46 168 Z"
            fill="#F08400"
            stroke="#DB7202"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Streepjes op de wortel */}
          <g stroke="#DB7202" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
            <line x1="36" y1="60" x2="42" y2="58" />
            <line x1="80" y1="60" x2="86" y2="58" />
            <line x1="40" y1="100" x2="46" y2="98" />
            <line x1="78" y1="100" x2="84" y2="98" />
            <line x1="48" y1="140" x2="54" y2="138" />
            <line x1="70" y1="140" x2="76" y2="138" />
          </g>

          {/* Zandloper-uitsparing (wit) */}
          <path
            d="M42 50 L78 50 L62 100 L78 150 L42 150 L58 100 Z"
            fill="#FFFFFF"
            stroke="#DB7202"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Zand bovenin */}
          <g className="sand-top">
            <path
              d="M44 52 L76 52 L63 92 L57 92 Z"
              fill="#DB7202"
            />
          </g>

          {/* Zand-stroom door de hals */}
          <g className="sand-stream">
            <circle cx="60" cy="100" r="1.4" fill="#DB7202" />
            <circle cx="60" cy="106" r="1.4" fill="#DB7202" />
            <circle cx="60" cy="112" r="1.4" fill="#DB7202" />
            <circle cx="60" cy="118" r="1.4" fill="#DB7202" />
            <circle cx="60" cy="124" r="1.4" fill="#DB7202" />
          </g>

          {/* Zand onderin */}
          <g className="sand-bottom">
            <path
              d="M50 148 L70 148 L76 150 L44 150 Z"
              fill="#DB7202"
            />
            <path
              d="M48 140 L72 140 L76 150 L44 150 Z"
              fill="#DB7202"
              opacity="0.85"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default CarrotHourglassLoader;
