import { useEffect, useState } from "react";
import blender1 from "@/assets/blender-1.png";
import blender2 from "@/assets/blender-2.png";
import blender3 from "@/assets/blender-3.png";

interface BlenderLoaderProps {
  size?: number;
  /** Time per frame in ms. */
  intervalMs?: number;
}

const FRAMES = [blender1, blender2, blender3];

/**
 * Cycles through the three blender illustrations (left → middle → right → repeat)
 * to suggest the contents are slowly being mixed while the recipe is generated.
 */
export const BlenderLoader = ({ size = 160, intervalMs = 600 }: BlenderLoaderProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % FRAMES.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  // Preload the other frames so swaps are instant.
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {FRAMES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 m-auto object-contain transition-opacity duration-200"
          style={{
            width: size,
            height: size,
            opacity: i === index ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
};

export default BlenderLoader;
