/**
 * Wahaj Cafe — The Pizza Lab
 * Three.js 3D Hero Scene
 * 
 * Complies strictly with the Three.js skill constitution:
 * - 3-12 Part Composite Procedural Model (THREE.Group)
 * - Studio PBR Lighting & RoomEnvironment PMREM reflections
 * - Software-WebGL detection & lossless damped 60fps loop
 * - Zero external 404 dependencies (100% procedural textures & geometries)
 * - Collapsible horizontal bottom control dock (zero viewport occlusion)
 * - Cinema / Zen Mode drawer toggle
 */

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Sparkles, Eye, Sliders, RotateCcw, Flame } from "lucide-react";

interface ThreeHeroSceneProps {
  onOrderNowClick?: () => void;
  onExploreMenuClick?: () => void;
}

export const ThreeHeroScene: React.FC<ThreeHeroSceneProps> = ({
  onOrderNowClick,
  onExploreMenuClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Bottom dock state
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [explodedValue, setExplodedValue] = useState(0); // 0 to 1
  const [pizzaStyle, setPizzaStyle] = useState<"standard" | "crispy" | "cheese" | "crown">("standard");
  const [isRotating, setIsRotating] = useState(true);
  const [steamEnabled, setSteamEnabled] = useState(true);

  // Mutable refs for animation loop
  const targetExplodeRef = useRef(0);
  const targetStyleRef = useRef(pizzaStyle);
  const isRotatingRef = useRef(isRotating);
  const steamEnabledRef = useRef(steamEnabled);

  useEffect(() => {
    targetExplodeRef.current = explodedValue;
  }, [explodedValue]);

  useEffect(() => {
    targetStyleRef.current = pizzaStyle;
  }, [pizzaStyle]);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    steamEnabledRef.current = steamEnabled;
  }, [steamEnabled]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement("canvas");
        const gl = probeCanvas.getContext("webgl2");
        if (!gl) return true;
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Setup Three.js Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#10090B");
    scene.fog = new THREE.FogExp2("#10090B", 0.04);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 650;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 7.8);
    camera.lookAt(0, 0, 0);

    // 3. Renderer configuration
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Studio Lighting Rig
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xffecd2, 3.2);
    keyLight.position.set(4, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0xfff7ea, 0x26070d, 1.4);
    scene.add(hemiLight);

    // Antique Gold Rim Light
    const rimLight = new THREE.DirectionalLight(0xd4af66, 2.0);
    rimLight.position.set(-5, 4, -4);
    scene.add(rimLight);

    // Ground Contact Shadow Disc
    const groundShadowGeo = new THREE.PlaneGeometry(8, 8);
    const groundShadowMat = new THREE.MeshBasicMaterial({
      color: 0x050102,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(groundShadowGeo, groundShadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -0.55;
    scene.add(groundShadow);

    // 6. PROCEDURAL PIZZA LAB MODEL (Composite THREE.Group)
    // ----------------------------------------------------
    const pizzaRootGroup = new THREE.Group();
    scene.add(pizzaRootGroup);

    // Group layers for Exploded View separation
    const crustGroup = new THREE.Group();
    const sauceGroup = new THREE.Group();
    const cheeseGroup = new THREE.Group();
    const toppingsGroup = new THREE.Group();
    const steamGroup = new THREE.Group();

    pizzaRootGroup.add(crustGroup);
    pizzaRootGroup.add(sauceGroup);
    pizzaRootGroup.add(cheeseGroup);
    pizzaRootGroup.add(toppingsGroup);
    pizzaRootGroup.add(steamGroup);

    // A. Crust Base & Rim (Part 1 & 2)
    const crustCanvas = document.createElement("canvas");
    crustCanvas.width = 512;
    crustCanvas.height = 512;
    const crustCtx = crustCanvas.getContext("2d")!;
    // Bake gradient
    const crustGrad = crustCtx.createRadialGradient(256, 256, 50, 256, 256, 256);
    crustGrad.addColorStop(0, "#C7904A");
    crustGrad.addColorStop(0.7, "#A86F30");
    crustGrad.addColorStop(0.9, "#7E4919");
    crustGrad.addColorStop(1, "#44210B");
    crustCtx.fillStyle = crustGrad;
    crustCtx.fillRect(0, 0, 512, 512);
    // Charred oven specks
    crustCtx.fillStyle = "rgba(40, 20, 10, 0.4)";
    for (let i = 0; i < 200; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      crustCtx.beginPath();
      crustCtx.arc(rx, ry, Math.random() * 4 + 1, 0, Math.PI * 2);
      crustCtx.fill();
    }
    const crustTexture = new THREE.CanvasTexture(crustCanvas);
    crustTexture.colorSpace = THREE.SRGBColorSpace;

    const baseDoughGeo = new THREE.CylinderGeometry(2.4, 2.45, 0.16, 48);
    const crustMat = new THREE.MeshStandardMaterial({
      map: crustTexture,
      roughness: 0.85,
      metalness: 0.05,
    });
    const baseDough = new THREE.Mesh(baseDoughGeo, crustMat);
    baseDough.position.y = -0.08;
    baseDough.receiveShadow = !isSoftwareGl;
    crustGroup.add(baseDough);

    // Golden Hand-Rolled Outer Crust Rim
    const rimGeo = new THREE.TorusGeometry(2.32, 0.26, 24, 64);
    const rimMat = new THREE.MeshStandardMaterial({
      map: crustTexture,
      roughness: 0.75,
      metalness: 0.1,
    });
    const crustRim = new THREE.Mesh(rimGeo, rimMat);
    crustRim.rotation.x = Math.PI / 2;
    crustRim.position.y = 0.06;
    crustRim.castShadow = !isSoftwareGl;
    crustRim.receiveShadow = !isSoftwareGl;
    crustGroup.add(crustRim);

    // Crown Crust Studs / Pockets (Part 3)
    const crownStudsGroup = new THREE.Group();
    const studGeo = new THREE.ConeGeometry(0.2, 0.42, 16);
    studGeo.rotateX(Math.PI / 2);
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const stud = new THREE.Mesh(studGeo, rimMat);
      stud.position.x = Math.cos(angle) * 2.38;
      stud.position.z = Math.sin(angle) * 2.38;
      stud.position.y = 0.18;
      stud.rotation.y = -angle + Math.PI / 2;
      stud.rotation.z = 0.2;
      crownStudsGroup.add(stud);
    }
    crownStudsGroup.visible = false;
    crustGroup.add(crownStudsGroup);

    // B. Rich Herb Marinara Sauce Bed (Part 4)
    const sauceCanvas = document.createElement("canvas");
    sauceCanvas.width = 256;
    sauceCanvas.height = 256;
    const sauceCtx = sauceCanvas.getContext("2d")!;
    sauceCtx.fillStyle = "#8D191D";
    sauceCtx.fillRect(0, 0, 256, 256);
    // Oregano specks
    sauceCtx.fillStyle = "#2D4C1E";
    for (let i = 0; i < 120; i++) {
      sauceCtx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
    const sauceTexture = new THREE.CanvasTexture(sauceCanvas);
    sauceTexture.colorSpace = THREE.SRGBColorSpace;

    const sauceGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.04, 48);
    const sauceMat = new THREE.MeshStandardMaterial({
      map: sauceTexture,
      roughness: 0.5,
      metalness: 0.05,
    });
    const sauceMesh = new THREE.Mesh(sauceGeo, sauceMat);
    sauceMesh.position.y = 0.02;
    sauceGroup.add(sauceMesh);

    // C. Melted Bubbly Mozzarella & Cheddar Surface (Part 5)
    const cheeseCanvas = document.createElement("canvas");
    cheeseCanvas.width = 512;
    cheeseCanvas.height = 512;
    const cheeseCtx = cheeseCanvas.getContext("2d")!;
    const cheeseGrad = cheeseCtx.createRadialGradient(256, 256, 40, 256, 256, 256);
    cheeseGrad.addColorStop(0, "#FFF5D0");
    cheeseGrad.addColorStop(0.5, "#F8D468");
    cheeseGrad.addColorStop(0.85, "#EAA43A");
    cheeseGrad.addColorStop(1, "#B45F1B");
    cheeseCtx.fillStyle = cheeseGrad;
    cheeseCtx.fillRect(0, 0, 512, 512);
    // Melt blistering
    cheeseCtx.fillStyle = "rgba(160, 70, 20, 0.55)";
    for (let i = 0; i < 35; i++) {
      const bx = Math.random() * 512;
      const by = Math.random() * 512;
      const br = Math.random() * 14 + 4;
      cheeseCtx.beginPath();
      cheeseCtx.arc(bx, by, br, 0, Math.PI * 2);
      cheeseCtx.fill();
    }
    const cheeseTexture = new THREE.CanvasTexture(cheeseCanvas);
    cheeseTexture.colorSpace = THREE.SRGBColorSpace;

    const cheeseGeo = new THREE.CylinderGeometry(2.14, 2.14, 0.06, 48);
    const cheeseMat = new THREE.MeshStandardMaterial({
      map: cheeseTexture,
      roughness: 0.38,
      metalness: 0.12,
    });
    const cheeseMesh = new THREE.Mesh(cheeseGeo, cheeseMat);
    cheeseMesh.position.y = 0.05;
    cheeseMesh.receiveShadow = !isSoftwareGl;
    cheeseGroup.add(cheeseMesh);

    // D. TOPPINGS (Parts 6, 7, 8, 9, 10)
    // 1. Crispy Pepperoni Cups (with beveled curl)
    const pepGeo = new THREE.CylinderGeometry(0.36, 0.38, 0.05, 24);
    const pepMat = new THREE.MeshStandardMaterial({
      color: 0x9e2a1b,
      roughness: 0.45,
      metalness: 0.1,
    });
    const pepCoords = [
      [0, 0], [0.8, 0.6], [-0.9, 0.7], [1.1, -0.6], [-0.7, -0.9],
      [1.4, 0.2], [-1.3, -0.2], [0.2, 1.2], [-0.2, -1.3], [0.6, -1.2]
    ];
    pepCoords.forEach(([px, pz]) => {
      const pep = new THREE.Mesh(pepGeo, pepMat);
      pep.position.set(px, 0.08, pz);
      pep.rotation.y = Math.random() * Math.PI;
      pep.rotation.x = (Math.random() - 0.5) * 0.1;
      pep.rotation.z = (Math.random() - 0.5) * 0.1;
      pep.castShadow = !isSoftwareGl;
      toppingsGroup.add(pep);
    });

    // 2. Fresh Bell Pepper Strips (Curved curves)
    const pepperGeo = new THREE.TorusGeometry(0.32, 0.06, 12, 16, Math.PI * 0.75);
    const pepperMat = new THREE.MeshStandardMaterial({
      color: 0x3d8b2d,
      roughness: 0.3,
      metalness: 0.15,
    });
    const pepperPositions = [
      [0.4, 0.4, 0.3], [-0.5, 0.9, -0.8], [0.9, -0.3, 1.2], [-1.1, 0.4, -0.4], [0.5, -0.8, -1.0]
    ];
    pepperPositions.forEach(([x, z, rot]) => {
      const pepStrip = new THREE.Mesh(pepperGeo, pepperMat);
      pepStrip.position.set(x, 0.11, z);
      pepStrip.rotation.x = Math.PI / 2;
      pepStrip.rotation.z = rot;
      toppingsGroup.add(pepStrip);
    });

    // 3. Black Olive Rings (Tube Geometry)
    const oliveGeo = new THREE.TorusGeometry(0.14, 0.05, 12, 20);
    const oliveMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.35,
      metalness: 0.15,
    });
    const oliveCoords = [
      [0.5, 0.8], [-0.4, -0.5], [1.2, 0.7], [-1.2, 0.6], [0.7, -0.7], [-0.8, -1.1]
    ];
    oliveCoords.forEach(([ox, oz]) => {
      const olive = new THREE.Mesh(oliveGeo, oliveMat);
      olive.position.set(ox, 0.11, oz);
      olive.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
      toppingsGroup.add(olive);
    });

    // 4. Fresh Basil Leaves (Detailed organic plates)
    const basilShape = new THREE.Shape();
    basilShape.moveTo(0, 0);
    basilShape.quadraticCurveTo(0.2, 0.3, 0.0, 0.6);
    basilShape.quadraticCurveTo(-0.2, 0.3, 0, 0);
    const basilGeo = new THREE.ShapeGeometry(basilShape);
    const basilMat = new THREE.MeshStandardMaterial({
      color: 0x246322,
      roughness: 0.4,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const basilCoords = [
      [0.3, -0.2, 0.4], [-0.3, 0.3, -1.2], [-0.7, 0.1, 2.1], [0.8, 0.2, -0.9]
    ];
    basilCoords.forEach(([bx, bz, rot]) => {
      const basil = new THREE.Mesh(basilGeo, basilMat);
      basil.position.set(bx, 0.13, bz);
      basil.rotation.x = -Math.PI / 2 + 0.1;
      basil.rotation.z = rot;
      basil.scale.set(0.7, 0.7, 0.7);
      toppingsGroup.add(basil);
    });

    // 5. Floating Spice Flecks & Steam Particles
    const steamCount = 28;
    const steamGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const steamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    const steamParticles: { mesh: THREE.Mesh; speed: number; seed: number }[] = [];
    for (let i = 0; i < steamCount; i++) {
      const p = new THREE.Mesh(steamGeo, steamMat);
      p.position.set(
        (Math.random() - 0.5) * 3.2,
        Math.random() * 1.8 + 0.2,
        (Math.random() - 0.5) * 3.2
      );
      steamGroup.add(p);
      steamParticles.push({
        mesh: p,
        speed: 0.008 + Math.random() * 0.012,
        seed: Math.random() * 100,
      });
    }

    // Gentle Pizza Tilt for cinematic presentation
    pizzaRootGroup.rotation.x = 0.42;

    // 7. Mouse/Touch Parallax Rig
    let targetRotY = 0;
    let targetRotX = 0.42;
    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = nx * 0.45;
      targetRotX = 0.42 + ny * 0.25;
    };
    window.addEventListener("pointermove", handlePointerMove);

    // 8. Animation & Damped Kinematics Loop
    let lastTime = performance.now();
    let frameId = 0;

    const tick = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Rotate pizza if enabled
      if (isRotatingRef.current) {
        pizzaRootGroup.rotation.y += delta * 0.4;
      }

      // Parallax damping
      pizzaRootGroup.rotation.x = THREE.MathUtils.damp(pizzaRootGroup.rotation.x, targetRotX, 4, delta);

      // Exploded View kinematics
      const explode = targetExplodeRef.current;
      sauceGroup.position.y = THREE.MathUtils.damp(sauceGroup.position.y, explode * 0.35, 6, delta);
      cheeseGroup.position.y = THREE.MathUtils.damp(cheeseGroup.position.y, explode * 0.75, 6, delta);
      toppingsGroup.position.y = THREE.MathUtils.damp(toppingsGroup.position.y, explode * 1.35, 6, delta);

      // Steam animation
      if (steamEnabledRef.current) {
        steamGroup.visible = true;
        steamParticles.forEach((sp) => {
          sp.mesh.position.y += sp.speed;
          sp.mesh.position.x += Math.sin(now * 0.002 + sp.seed) * 0.002;
          if (sp.mesh.position.y > 2.4) {
            sp.mesh.position.y = 0.2;
            sp.mesh.position.x = (Math.random() - 0.5) * 2.8;
            sp.mesh.position.z = (Math.random() - 0.5) * 2.8;
          }
        });
      } else {
        steamGroup.visible = false;
      }

      // Style switch updates
      const currentStyle = targetStyleRef.current;
      crownStudsGroup.visible = currentStyle === "crown";
      if (currentStyle === "crispy") {
        crustMat.color.setHex(0x5a2d10);
        cheeseMat.roughness = 0.55;
      } else if (currentStyle === "cheese") {
        crustMat.color.setHex(0xc7904a);
        cheeseMat.roughness = 0.22;
        cheeseMesh.scale.set(1, 1.3, 1);
      } else {
        crustMat.color.setHex(0xc7904a);
        cheeseMat.roughness = 0.38;
        cheeseMesh.scale.set(1, 1, 1);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        frameId = window.setTimeout(tick, 80);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || 650;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      if (isSoftwareGl) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[620px] md:h-[720px] bg-[#10090B] overflow-hidden select-none">
      {/* 3D WebGL Canvas Mount (Isolated from React UI) */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Brand Hero Overlay Copy (Left Aligned, Non-obstructive) */}
      <div className="absolute top-16 md:top-24 left-6 md:left-16 max-w-xl pointer-events-none z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#26070D]/90 border border-[#D4AF66]/40 text-[#D4AF66] text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#F3D99B]" />
          <span>The Pizza Lab • Wahaj Cafe</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#FFF4DF] tracking-tight leading-[1.1] font-heading drop-shadow-md">
          CRAFTED FOR <span className="gold-gradient-text">CRAVINGS.</span>
        </h1>

        <p className="mt-4 text-[#FFF4DF]/80 text-base md:text-lg leading-relaxed max-w-lg">
          Discover signature pizzas, indulgent burgers, delicious wraps, and handcrafted mocktails at Wahaj Cafe. Gourmet recipes perfected through culinary science.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-4 pointer-events-auto">
          <button
            onClick={onExploreMenuClick}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF66] to-[#F3D99B] text-[#10090B] font-bold text-sm tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Explore the Menu
          </button>

          <button
            onClick={onOrderNowClick}
            className="px-6 py-3.5 rounded-xl bg-[#500B19]/80 hover:bg-[#500B19] text-[#FFF4DF] border border-[#D4AF66]/40 font-semibold text-sm tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-sm"
          >
            Order on WhatsApp
          </button>
        </div>
      </div>

      {/* Minimal Top-Right Feature Badge */}
      <div className="absolute top-6 right-6 z-10 pointer-events-none hidden sm:block">
        <div className="px-3.5 py-1.5 rounded-lg bg-[#10090B]/90 border border-[#D4AF66]/30 text-xs text-[#F3D99B] flex items-center gap-2">
          <Flame className="w-4 h-4 text-[#D4AF66]" />
          <span>Real-time 3D Pizza Lab Preview</span>
        </div>
      </div>

      {/* 
        ERGONOMIC UNIFIED COLLAPSIBLE BOTTOM DOCK (Zero Viewport Occlusion)
        Strictly follows Directive 5 of Three.js skill
      */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-3xl transition-transform duration-300 ease-out ${
          isDockCollapsed ? "translate-y-[calc(100%-36px)]" : "translate-y-0"
        }`}
      >
        {/* Cinema / Zen Mode Toggle Bar */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsDockCollapsed((prev) => !prev)}
            className="px-4 py-1.5 rounded-t-xl bg-[#26070D] border-t border-x border-[#D4AF66]/40 text-[#F3D99B] text-xs font-semibold flex items-center gap-1.5 shadow-xl hover:bg-[#500B19] transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isDockCollapsed ? "▴ Show 3D Lab Controls" : "▾ Cinema Mode (Hide Controls)"}</span>
          </button>
        </div>

        {/* Bottom Control Dock Surface */}
        <div className="p-4 rounded-2xl bg-[#1A060A]/95 border border-[#D4AF66]/35 shadow-2xl backdrop-blur-md text-[#FFF4DF]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Style Selector */}
            <div>
              <label className="text-[11px] font-semibold tracking-wider text-[#D4AF66] uppercase block mb-1.5 flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                <span>Pizza Style</span>
              </label>
              <div className="grid grid-cols-4 gap-1 bg-[#10090B] p-1 rounded-lg border border-[#D4AF66]/20 text-xs">
                {(["standard", "crispy", "cheese", "crown"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setPizzaStyle(s)}
                    className={`py-1 rounded capitalize font-medium transition-all cursor-pointer ${
                      pizzaStyle === s
                        ? "bg-[#D4AF66] text-[#10090B] font-bold shadow"
                        : "text-[#FFF4DF]/70 hover:text-[#FFF4DF]"
                    }`}
                  >
                    {s === "cheese" ? "4-Cheese" : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Exploded View Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-semibold text-[#D4AF66] uppercase mb-1">
                <span>Exploded Anatomy</span>
                <span className="text-[#FFF4DF]">{Math.round(explodedValue * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedValue}
                onChange={(e) => setExplodedValue(parseFloat(e.target.value))}
                className="w-full accent-[#D4AF66] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#FFF4DF]/50 mt-0.5">
                <span>Baked</span>
                <span>Layers Separated</span>
              </div>
            </div>

            {/* Interactive Toggles */}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsRotating((r) => !r)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRotating
                    ? "bg-[#500B19] border-[#D4AF66]/60 text-[#FFF4DF]"
                    : "bg-[#10090B] border-white/10 text-[#FFF4DF]/60"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#F3D99B]" />
                <span>{isRotating ? "Auto Spin" : "Paused"}</span>
              </button>

              <button
                onClick={() => setSteamEnabled((s) => !s)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  steamEnabled
                    ? "bg-[#500B19] border-[#D4AF66]/60 text-[#FFF4DF]"
                    : "bg-[#10090B] border-white/10 text-[#FFF4DF]/60"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#D4AF66]" />
                <span>{steamEnabled ? "Hot Steam" : "Steam Off"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
