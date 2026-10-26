<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/77a2df03-d077-40fe-bfdb-95ceca6e1ed7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

---

## Cinematic 3D upgrade — how it's organised

| Area | Where |
| --- | --- |
| Product image manifest (one unique local image per menu item, source + licence + verified flag) | `src/utils/imageManifest.ts`, files in `public/images/menu/<id>.webp` |
| Recipe → 3D layer mapping (labels always use the exact menu ingredient text) | `src/three/recipes.ts` |
| Procedural food models (pizza crusts incl. Crown & Kabab crust, burger stack, fries) | `src/three/builders.ts`, `materials.ts`, `geometry.ts` |
| Scroll-driven WebGL stage (explode → labels → reassemble, lazy loaded, pauses offscreen) | `src/three/ShowcaseScene.ts` |
| Pinned scroll sections with selector, sizes and Add to Cart | `src/components/experience/ScrollShowcase.tsx` |
| Hero | `src/components/experience/CinematicHero.tsx` |

**Images.** 47 items use licensed Unsplash photographs that were visually checked against the product name; they are
*representative* images, not photos of Wahaj Cafe's own plates. Crown Crust and Kabab Crust Pizza use renders of the
site's own 3D models because no licensed photo of those crusts exists. To use the restaurant's own photography, replace
`public/images/menu/<id>.webp` (same file name) and set `kind: "restaurant-photo"`, `representative: false` in the manifest.

**Performance & accessibility.** Three.js is code-split and only loads near the 3D sections; rendering pauses when a
section is off screen; phones/low-power devices get fewer instances, no shadows and a lower pixel ratio
(`?quality=low|high` forces a tier). `prefers-reduced-motion` turns the pinned sections into static exploded views
with labels. Without WebGL the product photo is shown instead.
