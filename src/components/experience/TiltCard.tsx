/**
 * TiltCard — subtle perspective tilt + moving specular highlight on pointer devices.
 * CSS variables drive everything (no re-renders). Disabled for touch & reduced motion via CSS.
 */
import React, { useRef } from "react";

export const TiltCard: React.FC<React.HTMLAttributes<HTMLDivElement> & { as?: "div" | "article" }> = ({ className = "", children, as = "article", ...rest }) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--ry", `${(x - 0.5) * 7}deg`);
      el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    });
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  const Tag = as as any;
  return (
    <Tag ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`tilt-card ${className}`} {...rest}>
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </Tag>
  );
};
