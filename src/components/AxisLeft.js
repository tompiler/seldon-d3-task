import React, { useMemo } from "react";
import { useSpring, animated } from "react-spring";

const AxisLeft = ({ yScale, domain, range }) => {
  const ticks = useMemo(() => {
    const height = range[1] - range[0] - 80;
    const domainHeight = domain[1] - domain[0];
    const pixelsPerTick = height / domainHeight;
    const tickInterval = 5;
    const numberOfTicksTarget =
      Math.max(1, Math.floor(height / pixelsPerTick)) / tickInterval;

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
    }));
  }, [yScale, domain, range]);

  return (
    <svg style={{ overflow: "visible" }}>
      <path
        d={["M", range[1], 0, "v", range[0], "H", 0, "v", 0].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, yOffset }) => (
        <g key={value} transform={`translate(0, ${yOffset})`}>
          <animated.line x1={-6} x2={0} stroke="currentColor" />
          <text
            key={value}
            x={-10}
            dy={"0.3em"}
            style={{
              fontSize: "10px",
              verticalAlign: "text-bottom",
              textAnchor: "end",
              transform: "translate(0px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default AxisLeft;
