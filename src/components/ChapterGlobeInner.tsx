"use client";

import { useEffect, useMemo, useRef } from "react";
import { MeshPhongMaterial } from "three";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { feature } from "topojson-client";
import type { FeatureCollection, GeometryObject } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import { chapters } from "@/data/chapters";
// Bundled locally (Natural Earth 110m, via world-atlas) so the landmass
// outlines never depend on a runtime fetch to a CDN. See src/data/world-110m.json.
import worldTopoJson from "@/data/world-110m.json";

// This module is only ever loaded client-side (dynamic-imported with
// ssr: false from ChapterMap.tsx), so touching `Globe`/`three` here at import
// time never runs during SSR.

type ChapterPoint = { lat: number; lng: number; name: string };

// Land is the site's actual deep-maroon token (matches the maroon boxes/cards
// elsewhere), with a darker maroon for country outlines so borders stay
// legible against the solid fill.
const LAND_FILL = "#71293c"; // maroon token
const LAND_STROKE = "#5a1f2f"; // darker maroon, for definition
const LAND_SIDE = "rgba(90, 31, 47, 0.35)"; // darker maroon, low alpha
// Ivory-fill, navy-stroke teardrop pins so they read clearly against both
// the deep-maroon land and the white ocean.
const PIN_FILL = "#f7f3ec"; // ivory
const PIN_STROKE = "#2f2544"; // navy (oxblood/ink family)

// Ocean/base sphere: a plain light ivory fill.
function createOceanMaterial() {
  return new MeshPhongMaterial({ color: "#f8f9fb", shininess: 4 });
}

// Classic teardrop/map-pin: rounded head, pointed tip. The wrapper has zero
// intrinsic size — three-globe's CSS2DObject centers it at the geo point —
// so the pin SVG (an absolutely-positioned child) can be shifted by its own
// half-width/full-height via translate(-50%, -100%) to put its POINTED TIP
// exactly on that point, with the rounded head floating above it.
function createPinElement(name: string): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.width = "0px";
  wrapper.style.height = "0px";

  const pin = document.createElement("div");
  pin.style.position = "absolute";
  pin.style.left = "0";
  pin.style.top = "0";
  pin.style.transform = "translate(-50%, -100%)";
  pin.style.cursor = "pointer";
  pin.innerHTML = `
    <svg width="18" height="24" viewBox="0 0 18 24" xmlns="http://www.w3.org/2000/svg" style="display:block;">
      <path
        d="M9 0C4.03 0 0 4.03 0 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.97-4.03-9-9-9z"
        fill="${PIN_FILL}"
        stroke="${PIN_STROKE}"
        stroke-width="1.5"
      />
    </svg>
  `;

  const label = document.createElement("div");
  label.textContent = name;
  label.style.cssText = `
    position:absolute; left:50%; bottom:calc(100% + 6px); transform:translateX(-50%);
    background:${PIN_FILL}; color:${PIN_STROKE}; border:1px solid ${PIN_STROKE};
    padding:3px 8px; border-radius:3px; white-space:nowrap;
    font:600 11px/1.2 var(--font-sans, ui-sans-serif, system-ui, sans-serif);
    opacity:0; pointer-events:none; transition:opacity 0.15s ease;
  `;
  pin.appendChild(label);

  pin.addEventListener("mouseenter", () => {
    label.style.opacity = "1";
  });
  pin.addEventListener("mouseleave", () => {
    label.style.opacity = "0";
  });

  wrapper.appendChild(pin);
  return wrapper;
}

const worldTopology = worldTopoJson as unknown as Topology;
const worldObjectName = Object.keys(worldTopology.objects)[0];
const worldFeatures = (
  feature(
    worldTopology,
    worldTopology.objects[worldObjectName] as GeometryCollection
  ) as FeatureCollection<GeometryObject>
).features;

export default function ChapterGlobeInner({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  const oceanMaterial = useMemo(() => createOceanMaterial(), []);

  const points = useMemo<ChapterPoint[]>(
    () =>
      chapters.map((c) => ({
        lat: c.coordinates[1],
        lng: c.coordinates[0],
        name: c.name,
      })),
    []
  );

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    // Gentle autoRotate, paused while the user is dragging and resumed a
    // moment after they let go.
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;

    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    const handleStart = () => {
      controls.autoRotate = false;
      clearTimeout(resumeTimer);
    };
    const handleEnd = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        controls.autoRotate = true;
      }, 2500);
    };
    controls.addEventListener("start", handleStart);
    controls.addEventListener("end", handleEnd);

    // Wheel over the globe must scroll the PAGE, not zoom the globe — same
    // convention as embedded Google Maps: hold Ctrl/Cmd (or pinch on a
    // trackpad, which browsers report as a ctrl-modified wheel event) to
    // zoom. Attached with capture:true on the same canvas OrbitControls
    // listens on, so an unmodified wheel event never reaches its handler and
    // is never preventDefault-ed — the browser's native scroll proceeds.
    // Touch (drag-rotate, two-finger pinch-zoom) is untouched by this; it
    // goes through OrbitControls' separate touch handlers, not wheel.
    const canvas = globe.renderer().domElement;
    const guardWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) e.stopPropagation();
    };
    canvas.addEventListener("wheel", guardWheel, { capture: true });

    return () => {
      controls.removeEventListener("start", handleStart);
      controls.removeEventListener("end", handleEnd);
      canvas.removeEventListener("wheel", guardWheel, {
        capture: true,
      } as EventListenerOptions);
      clearTimeout(resumeTimer);
    };
  }, []);

  return (
    <Globe
      ref={globeRef}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      showAtmosphere
      atmosphereColor="#d5d7e1"
      atmosphereAltitude={0.18}
      globeMaterial={oceanMaterial}
      polygonsData={worldFeatures}
      polygonCapColor={() => LAND_FILL}
      polygonSideColor={() => LAND_SIDE}
      polygonStrokeColor={() => LAND_STROKE}
      polygonAltitude={0.006}
      htmlElementsData={points}
      htmlLat="lat"
      htmlLng="lng"
      htmlAltitude={0.02}
      htmlElement={(d) => createPinElement((d as ChapterPoint).name)}
    />
  );
}
