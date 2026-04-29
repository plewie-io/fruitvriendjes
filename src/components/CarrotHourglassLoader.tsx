interface CarrotHourglassLoaderProps {
  size?: number;
}

/**
 * Carrot-shaped hourglass loader that smoothly fills from top to bottom.
 * Pure SVG + CSS, no external dependencies, no rotation.
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
        .leaf-wiggle {
          transform-origin: 50% 100%;
          animation: leaf-wiggle 2.4s ease-in-out infinite;
        }
        @keyframes leaf-wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        /* Top sand: shrinks slowly from full to empty over the whole cycle */
        .sand-top-rect {
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: sand-top-fill 8s linear infinite;
        }
        @keyframes sand-top-fill {
          0%   { transform: scaleY(1); }
          100% { transform: scaleY(0); }
        }
        /* Bottom sand: grows slowly from empty to full */
        .sand-bottom-rect {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: sand-bottom-fill 8s linear infinite;
        }
        @keyframes sand-bottom-fill {
          0%   { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
        /* Continuous thin stream through the neck */
        .sand-stream {
          animation: sand-stream 1.2s linear infinite;
          transform-origin: 50% 0%;
        }
        @keyframes sand-stream {
          0%   { transform: translateY(-4px); opacity: 0.2; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(8px); opacity: 0.2; }
        }
        /* Fade the stream out at the very end so the cycle resets cleanly */
        .stream-wrapper {
          animation: stream-fade 8s linear infinite;
        }
        @keyframes stream-fade {
          0%, 92% { opacity: 1; }
          96%, 100% { opacity: 0; }
        }
      `}</style>
      <svg
        viewBox="0 0 120 180"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Clip path so sand never paints outside the hourglass shape */}
        <defs>
          <clipPath id="hourglass-clip">
            <path d="M42 50 L78 50 L62 100 L78 150 L42 150 L58 100 Z" />
          </clipPath>
        </defs>

        {/* Loof / blaadjes */}
        <g className="leaf-wiggle">
          <path d="M60 22 C50 6, 38 4, 36 14 C34 22, 44 26, 52 26 Z" fill="#9BB510" />
          <path d="M60 22 C60 4, 70 0, 76 8 C82 16, 74 26, 66 26 Z" fill="#B3CA17" />
          <path d="M60 22 C68 8, 82 8, 86 18 C90 28, 78 30, 70 28 Z" fill="#9BB510" />
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

        {/* Sand layers, clipped to hourglass shape */}
        <g clipPath="url(#hourglass-clip)">
          {/* Top sand: a rectangle covering the top half. ScaleY shrinks it from top. */}
          <rect
            className="sand-top-rect"
            x="40"
            y="51"
            width="40"
            height="48"
            fill="#DB7202"
          />

          {/* Bottom sand: a rectangle covering the bottom half. ScaleY grows from bottom. */}
          <rect
            className="sand-bottom-rect"
            x="40"
            y="101"
            width="40"
            height="48"
            fill="#DB7202"
          />

          {/* Continuous stream through the neck */}
          <g className="stream-wrapper">
            <g className="sand-stream">
              <rect x="59" y="96" width="2" height="14" fill="#DB7202" rx="1" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default CarrotHourglassLoader;
