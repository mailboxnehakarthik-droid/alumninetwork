"use client";

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

// Roughly centered between the Americas, Europe, and Asia — where most
// chapters actually are — rather than the default [0, 0], which leans on the
// empty Atlantic/Pacific.
const MAP_CENTER: [number, number] = [20, 15];

export default function ChapterMap() {
  return (
    <div>
      <div className="h-[300px] w-full overflow-hidden rounded-sm border border-gold/30 bg-ivory sm:h-[380px] md:h-[460px] lg:h-[520px]">
        <ComposableMap
          width={800}
          height={450}
          role="img"
          aria-label="Map of BMS alumni chapter locations worldwide"
          className="h-full w-full"
        >
          <ZoomableGroup center={MAP_CENTER} zoom={1} minZoom={1} maxZoom={5}>
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
      </div>
      <p className="mt-3 text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/45">
        Drag to explore · scroll to zoom
      </p>
    </div>
  );
}
