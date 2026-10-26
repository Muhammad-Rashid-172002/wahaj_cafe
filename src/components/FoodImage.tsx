/**
 * Wahaj Cafe — The Pizza Lab
 * FoodImage — local, product-specific image with skeleton loading.
 * On failure it shows a neutral branded placeholder, never a different dish.
 */

import React, { useState } from "react";
import { PLACEHOLDER_IMAGE } from "../utils/imageManifest";

interface FoodImageProps {
  src: string;
  alt: string;
  className?: string;
  badge?: string;
  onClick?: () => void;
  eager?: boolean;
  sizes?: string;
}

export const FoodImage: React.FC<FoodImageProps> = ({ src, alt, className = "w-full h-full object-cover", badge, onClick, eager }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div onClick={onClick} className={`relative w-full h-full overflow-hidden bg-[#1A060A] ${onClick ? "cursor-pointer" : ""}`}>
      {!loaded && <div className="absolute inset-0 shimmer" aria-hidden="true" />}
      <img
        src={failed ? PLACEHOLDER_IMAGE : src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        width={1200}
        height={900}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!failed) setFailed(true);
          setLoaded(true);
        }}
        className={`${className} food-img transition-[opacity,transform] duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#10090B]/75 via-transparent to-transparent pointer-events-none" />
      {badge && (
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#10090B]/70 border border-[#D4AF66]/40 text-[#F3D99B] text-[10px] font-semibold tracking-[0.14em] uppercase pointer-events-none backdrop-blur-md">
          {badge}
        </span>
      )}
    </div>
  );
};
