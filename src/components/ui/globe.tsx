"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;
  const colors = ["#eab308", "#fbbf24", "#f59e0b"];

const studentConnections = [
  {
    order: 1,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 40.7128,
    endLng: -74.006, // New York
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 1,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 37.7749,
    endLng: -122.4194, // San Francisco
    arcAlt: 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 2,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: -33.8688,
    endLng: 151.2093, // Sydney
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 2,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 35.6762,
    endLng: 139.6503, // Tokyo
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 3,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 28.6139,
    endLng: 77.209, // Delhi
    arcAlt: 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 3,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 1.3521,
    endLng: 103.8198, // Singapore
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 4,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: -22.9068,
    endLng: -43.1729, // Rio
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 4,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 52.52,
    endLng: 13.405, // Berlin
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 5,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 48.8566,
    endLng: 2.3522, // Paris
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 5,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 34.0522,
    endLng: -118.2437, // Los Angeles
    arcAlt: 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 6,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 43.6532,
    endLng: -79.3832, // Toronto
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 6,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: -26.2041,
    endLng: 28.0473, // Johannesburg
    arcAlt: 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 7,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 55.7558,
    endLng: 37.6176, // Moscow
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 7,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 31.2304,
    endLng: 121.4737, // Shanghai
    arcAlt: 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 8,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 25.2048,
    endLng: 55.2708, // Dubai
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 8,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: -1.2921,
    endLng: 36.8219, // Nairobi
    arcAlt: 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 9,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 19.4326,
    endLng: -99.1332, // Mexico City
    arcAlt: 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 9,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 41.9028,
    endLng: 12.4964, // Rome
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 10,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: 59.9311,
    endLng: 30.3609, // St Petersburg
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
  {
    order: 10,
    startLat: 54.526,
    startLng: -2.9623, // UK
    endLat: -34.6037,
    endLng: -58.3816, // Buenos Aires
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
  },
];
// Create a set of all unique locations for markers
const allLocations = new Map();

// Add UK hub
allLocations.set('54.526,-2.9623', { location: [54.526, -2.9623], size: 0.1 });

// Add all destination locations
studentConnections.forEach(conn => {
  const key = `${conn.endLat},${conn.endLng}`;
  if (!allLocations.has(key)) {
    allLocations.set(key, { location: [conn.endLat, conn.endLng], size: 0.05 });
  }
});

const GLOBE_MARKERS = Array.from(allLocations.values()).concat([
  { location: [14.5995, 120.9842], size: 0.03 }, // Manila
  { location: [19.076, 72.8777], size: 0.1 },   // Mumbai
  { location: [23.8103, 90.4125], size: 0.05 }, // Dhaka
  { location: [30.0444, 31.2357], size: 0.07 }, // Cairo
  { location: [39.9042, 116.4074], size: 0.08 }, // Beijing
  { location: [-23.5505, -46.6333], size: 0.1 }, // São Paulo
  { location: [19.4326, -99.1332], size: 0.1 }, // Mexico City
  { location: [40.7128, -74.006], size: 0.1 },   // New York
  { location: [34.6937, 135.5022], size: 0.05 }, // Osaka
  { location: [41.0082, 28.9784], size: 0.06 },  // Istanbul
]);

// const GLOBE_ARCS = GLOBE_MARKERS.slice(0, -1).map((marker, index) => ({
//   from: marker.location,
//   to: GLOBE_MARKERS[index + 1].location,
// }));
const GLOBE_ARCS = GLOBE_MARKERS.flatMap((marker, i) =>
  GLOBE_MARKERS.slice(i + 1).map((target) => ({
    from: marker.location,
    to: target.location,
  }))
);

const GLOBE_CONFIG: COBEOptions = {
  width: 1000,
  height: 1000,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  mapSamples: 36000,
  diffuse: 1.2,
  mapBrightness: 6,
  baseColor: [0.43, 0.42, 0.44],
  markerColor: [0.2, 0.55, 0.7],
  glowColor: [1, 0.97, 0.99] ,
  markers: GLOBE_MARKERS,
  arcs: GLOBE_ARCS,

  arcColor: [0.7, 0.5, 0],
  arcWidth: 0.3,
  arcHeight: 0.3,
};

export default function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      r.set(r.get() + delta / MOVEMENT_DAMPING);
    }
  };
  
  useEffect(() => {
    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
    };
    onResize();
    window.addEventListener('resize', onResize);

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
    });
    let phi = 0
    function animate() {
      if (!pointerInteracting.current) phiRef.current += 0.005;
      phi = phiRef.current + rs.get();
      globe.update({ phi })
      requestAnimationFrame(animate)
    }
    animate()


    setTimeout(() => (canvasRef.current!.style.opacity = "1"), 0);
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [rs, config]);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity aspect-square duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX;
          updatePointerInteraction(e.clientX);
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
