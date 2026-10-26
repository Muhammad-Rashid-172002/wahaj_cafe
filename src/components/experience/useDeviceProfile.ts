import { useEffect, useState } from "react";

export interface DeviceProfile {
  reducedMotion: boolean;
  lowPower: boolean;
  webgl: boolean;
}

function probeWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function detect(): DeviceProfile {
  if (typeof window === "undefined") return { reducedMotion: false, lowPower: false, webgl: false };
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const forced = new URLSearchParams(window.location.search).get("quality");
  const lowPower = forced ? forced === "low" : coarse || window.innerWidth < 768 || cores <= 4 || mem <= 4;
  return { reducedMotion, lowPower, webgl: probeWebGL() };
}

let cached: DeviceProfile | null = null;

/** Detects once per page load; reacts to reduced-motion preference changes. */
export function useDeviceProfile(): DeviceProfile {
  const [p, setP] = useState<DeviceProfile>(() => (cached ??= detect()));
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => {
      cached = { ...(cached ?? detect()), reducedMotion: mq.matches };
      setP(cached);
    };
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return p;
}
