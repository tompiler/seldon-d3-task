import React, { useMemo } from "react";

const AxisLeft = ({ yScale, height, tickInterval, color }) => {
  const domain = yScale.domain();
  const range = yScale.range();

  const ticks = useMemo(() => {
    const domainHeight = domain[1] - domain[0];
    const pixelsPerTick = height / domainHeight;
    const numberOfTicksTarget =
      Math.max(1, Math.floor(height / pixelsPerTick)) / tickInterval;

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
      key: value,
    }));
  }, [yScale, domain, height, tickInterval]);

  // When the chart pans to the point where the axis is out of
  // bounds, truncate the position so that it stays within view
  // and the tick labels are visible
  return (
    <svg style={{ overflow: "visible" }}>
      <path
        d={["M", 0, range[1], "v", range[0], "H", 0].join(" ")}
        fill="none"
        stroke={color}
      />
      {ticks.map((d, i) => {
        return (
          <g
            key={d.key}
            style={{ transform: `translate(0, ${yScale(d.value)}px)` }}
          >
            <line x1={-6} x2={0} stroke={color} />
            <text
              x={-10}
              y={0}
              dy={"0.3em"}
              style={{
                fontSize: "10px",
                verticalAlign: "text-bottom",
                textAnchor: "end",
                transform: "translate(0px)",
                fill: color,
                strokeWidth: 0,
              }}
            >
              {d.value}
            </text>
          </g>
        );
      })}
      <g transform={`translate(${-40},${120}) `}>
        <text
          style={{
            fontSize: "12px",
            verticalAlign: "text-bottom",
            textAnchor: "end",
            fill: color,
            strokeWidth: 0,
            transform: "rotate(0.75turn)",
          }}
        >
          Total
        </text>
        <text
          x={5}
          style={{
            fontSize: "12px",
            verticalAlign: "text-bottom",
            // textAnchor: "end",
            fill: color,
            strokeWidth: 0,
            transform: "rotate(0.75turn)",
          }}
        >
          Observations
        </text>
      </g>
    </svg>
  );
};

export default AxisLeft;
