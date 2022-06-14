import React, { useMemo } from "react";

const AxisBottom = ({ xScale, height, domain, range }) => {
  const ticks = useMemo(() => {
    const width = range[1] - range[0] - 80;
    const domainWidth = domain[1] - domain[0];
    const pixelsPerTick = width / domainWidth;
    const tickInterval = 2;
    const numberOfTicksTarget =
      Math.max(1, Math.floor(width / pixelsPerTick)) / tickInterval;

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [xScale, domain, range]);

  return (
    <svg style={{ overflow: "visible" }}>
      <path
        d={["M", range[0], height, "v", 0, "H", range[1], "v", 0].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y1={height} y2={height + 6} stroke="currentColor" />
          <text
            key={value}
            y={height + 15}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default AxisBottom;
