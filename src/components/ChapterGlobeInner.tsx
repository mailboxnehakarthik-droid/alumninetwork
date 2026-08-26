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

const GLOBE_MATERIAL = new MeshPhongMaterial({
  color: "#eef0f5", // ivory-dim
  shininess: 2,
});

const LAND_FILL = "#dbdcdf"; // ~13% ink tint over ivory
const LAND_STROKE = "#95949b"; // ~45% ink tint over ivory
const LAND_SIDE = "rgba(28, 24, 38, 0.15)"; // ink, low alpha
const PIN_COLOR = "#2f2544"; // oxblood

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
      globeMaterial={GLOBE_MATERIAL}
      polygonsData={worldFeatures}
      polygonCapColor={() => LAND_FILL}
      polygonSideColor={() => LAND_SIDE}
      polygonStrokeColor={() => LAND_STROKE}
      polygonAltitude={0.006}
      pointsData={points}
      pointLat="lat"
      pointLng="lng"
      pointColor={() => PIN_COLOR}
      pointAltitude={0.02}
      pointRadius={0.45}
      pointLabel={(d) =>
        `<div style="background:${PIN_COLOR};color:#f8f9fb;padding:4px 10px;border-radius:2px;font:600 11px/1.3 var(--font-sans, ui-sans-serif, system-ui, sans-serif);white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.25);">${
          (d as ChapterPoint).name
        }</div>`
      }
    />
  );
}
