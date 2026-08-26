"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { chapters } from "@/data/chapters";
// Bundled locally (Natural Earth 110m, via world-atlas) so the map never
// depends on a runtime fetch to a CDN. See src/data/world-110m.json.
import worldTopoJson from "@/data/world-110m.json";

export default function ChapterMap() {
  return (
    <div className="mx-auto aspect-[4/3] w-full max-h-[380px] overflow-hidden rounded-sm border border-gold/30 bg-ivory-dim/40 md:max-h-[460px]">
      <ComposableMap
        width={800}
        height={600}
        role="img"
        aria-label="Map of BMS alumni chapter locations worldwide"
        className="h-full w-full"
      >
        <Geographies geography={worldTopoJson}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "var(--color-ivory-dim)",
                    stroke: "var(--color-gold)",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  hover: {
                    fill: "var(--color-ivory-dim)",
                    stroke: "var(--color-gold)",
                    strokeWidth: 0.5,
                    outline: "none",
                  },
                  pressed: {
                    fill: "var(--color-ivory-dim)",
                    stroke: "var(--color-gold)",
                    strokeWidth: 0.5,
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
                r={7}
                className="fill-accent opacity-0 transition-opacity duration-150 group-hover:opacity-20"
              />
              <circle
                r={3.2}
                strokeWidth={1}
                className="fill-oxblood stroke-ivory transition-transform duration-150 group-hover:scale-125"
              />
              <text
                textAnchor="middle"
                y={-9}
                className="pointer-events-none select-none font-sans opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                style={{ fontSize: 9, fontWeight: 600 }}
                fill="var(--color-ink)"
              >
                {ch.name}
              </text>
            </g>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
