import React from "react";
// import TicksBottom from "./TicksBottom";
import { timeFormat } from "d3-time-format";

const AxisBottom = ({ xScale, height }) => {
  const domain = xScale.domain();
  const range = xScale.range();

  const tickInterval = 16;

  const ticks = domain.filter((d, i) => {
    return i % tickInterval === 0;
  });

  const formatTime = timeFormat("%b %d %Y %H:%M");

  const bandWidth = xScale.bandwidth();
  return (
    <svg style={{ overflow: "visible" }}>
      <path
        d={["M", range[0], height, "v", 0, "H", range[1]].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map((d, i) => {
        return (
          <g
            key={i}
            style={{
              transform: `translate(${xScale(d) + bandWidth / 2}px, 0px)`,
            }}
          >
            <line y1={height} y2={height + 6} stroke="currentColor" />
            <text
              key={i}
              y={height + 15}
              style={{
                fontSize: "10px",
                textAnchor: "middle",
              }}
            >
              {formatTime(d)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default AxisBottom;
