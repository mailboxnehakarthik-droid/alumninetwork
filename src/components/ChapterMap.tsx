"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { chapters } from "@/data/chapters";
// Bundled locally (Natural Earth 110m, via world-atlas) so the map never
// depends on a runtime fetch to a CDN. See src/data/world-110m.json.
import worldTopoJson from "@/data/world-110m.json";

// 2:1 viewBox — a world map's natural aspect ratio. Projection is pinned
// explicitly to geoEqualEarth (matching what scale/center below were verified
// against) rather than relying on ComposableMap's default. scale=150 with an
// explicit center=[0, 0] was checked by replicating react-simple-maps' own
// projection setup (translate([w/2,h/2]) -> center -> rotate -> scale) against
// this exact topojson in Node: the projected world bounds land at roughly
// [1.6, 4.2] to [798.4, 397.6] inside the 800x400 viewBox — i.e. the full
// world, equator vertically centered, no cropping, ~2px margin on every side.
const WIDTH = 800;
const HEIGHT = 400;
const PROJECTION: "geoEqualEarth" = "geoEqualEarth";
const PROJECTION_CONFIG = { scale: 150, center: [0, 0] as [number, number] };

const DEFAULT_CENTER: [number, number] = [0, 0];
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

// @types/react-simple-maps declares this as (element: SVGElement) => boolean,
// but at runtime react-simple-maps forwards the raw d3-zoom event (which has
// .type/.ctrlKey/.button, not an SVGElement) — see its useZoomPan source.
// Blocking "wheel" here stops d3-zoom from calling preventDefault on wheel
// events, so scrolling the page over the map behaves normally; touch
// (drag-pan, pinch-zoom) and mouse drag are untouched.
function filterZoomEvent(event: SVGElement) {
  const e = event as unknown as { type: string; ctrlKey: boolean; button: number };
  if (e.type === "wheel") return false;
  return !e.ctrlKey && !e.button;
}

export default function ChapterMap() {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(MIN_ZOOM);

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setCenter(position.coordinates);
    setZoom(position.zoom);
  };

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, z * 1.5));
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, z / 1.5));
  const resetView = () => {
    setCenter(DEFAULT_CENTER);
    setZoom(MIN_ZOOM);
  };

  return (
    <div>
      <div className="relative mx-auto aspect-[2/1] w-full max-h-[520px] overflow-hidden rounded-sm border border-gold/30 bg-ivory">
        <ComposableMap
          width={WIDTH}
          height={HEIGHT}
          projection={PROJECTION}
          projectionConfig={PROJECTION_CONFIG}
          role="img"
          aria-label="Map of BMS alumni chapter locations worldwide"
          className="h-full w-full"
        >
          <ZoomableGroup
            center={center}
            zoom={zoom}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            onMoveEnd={handleMoveEnd}
            filterZoomEvent={filterZoomEvent}
          >
            <Geographies geography={worldTopoJson}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: "color-mix(in oklab, var(--color-ink) 13%, var(--color-ivory))",
                        stroke:
                          "color-mix(in oklab, var(--color-ink) 45%, var(--color-ivory))",
                        strokeWidth: 0.6,
                        outline: "none",
                      },
                      hover: {
                        fill: "color-mix(in oklab, var(--color-ink) 13%, var(--color-ivory))",
                        stroke:
                          "color-mix(in oklab, var(--color-ink) 45%, var(--color-ivory))",
                        strokeWidth: 0.6,
                        outline: "none",
                      },
                      pressed: {
                        fill: "color-mix(in oklab, var(--color-ink) 13%, var(--color-ivory))",
                        stroke:
                          "color-mix(in oklab, var(--color-ink) 45%, var(--color-ivory))",
                        strokeWidth: 0.6,
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>

            {chapters.map((ch) => (
              <Marker key={ch.name} coordinates={ch.coordinates}>
                <g className="group">
                  <title>{ch.name}</title>
                  {/* Soft halo, only visible on hover */}
                  <circle
                    r={11}
                    className="fill-accent opacity-0 transition-opacity duration-150 group-hover:opacity-25"
                  />
                  <circle
                    r={5.5}
                    strokeWidth={1.75}
                    className="fill-oxblood stroke-ivory transition-transform duration-150 group-hover:scale-125"
                  />
                  <text
                    textAnchor="middle"
                    y={-13}
                    className="pointer-events-none select-none font-sans opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      paintOrder: "stroke",
                      stroke: "var(--color-ivory)",
                      strokeWidth: 3,
                      strokeLinejoin: "round",
                    }}
                    fill="var(--color-ink)"
                  >
                    {ch.name}
                  </text>
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Zoom controls — bottom-right, brand-styled, subtle */}
        <div className="absolute bottom-3 right-3 z-10 flex flex-col overflow-hidden rounded-sm border border-oxblood/25 bg-ivory/90 shadow-sm backdrop-blur-sm">
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            aria-label="Zoom in"
            className="flex h-8 w-8 items-center justify-center border-b border-oxblood/15 font-sans text-base font-semibold leading-none text-oxblood transition-colors hover:bg-oxblood hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-oxblood"
          >
            +
          </button>
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            aria-label="Zoom out"
            className="flex h-8 w-8 items-center justify-center border-b border-oxblood/15 font-sans text-base font-semibold leading-none text-oxblood transition-colors hover:bg-oxblood hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-oxblood"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetView}
            aria-label="Reset map view"
            className="flex h-8 w-8 items-center justify-center font-sans text-xs font-semibold leading-none text-oxblood transition-colors hover:bg-oxblood hover:text-ivory"
          >
            ↺
          </button>
        </div>
      </div>
      <p className="mt-3 hidden text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45 sm:block">
        Drag to explore · use + / − to zoom
      </p>
    </div>
  );
}
