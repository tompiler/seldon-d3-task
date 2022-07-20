import React from "react";
// import TicksBottom from "./TicksBottom";
import { timeFormat } from "d3-time-format";

const AxisBottom = ({ xScale, height, color }) => {
  const domain = xScale.domain();
  const range = xScale.range();

  const tickInterval = 24; // constant to keep it simple

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
        stroke={color}
      />
      {ticks.map((d, i) => {
        return (
          <g
            key={i}
            style={{
              transform: `translate(${xScale(d) + bandWidth / 2}px, 0px)`,
            }}
          >
            <line y1={height} y2={height + 6} stroke={color} />
            <text
              key={i}
              y={height + 15}
              style={{
                fontSize: "10px",
                textAnchor: "middle",
                fill: color,
                strokeWidth: 0,
              }}
            >
              {formatTime(d)}
            </text>
          </g>
        );
      })}
      <g transform={`translate(${530},${210}) `}>
        <text
          style={{
            fontSize: "12px",
            verticalAlign: "text-bottom",
            textAnchor: "end",
            fill: color,
            strokeWidth: 0,
          }}
        >
          Timestamp (Hourly Intervals)
        </text>
      </g>
    </svg>
  );
};

export default AxisBottom;
