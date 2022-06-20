import React, { useMemo } from "react";
import TicksLeft from "./TicksLeft";

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
      key: value,
    }));
  }, [yScale, domain, range]);

  return (
    <svg style={{ overflow: "visible" }}>
      <path
        d={["M", range[1], 0, "v", range[0], "H", 0, "v", 0].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      <TicksLeft ticks={ticks} yScale={yScale} />
    </svg>
  );
};

export default AxisLeft;
