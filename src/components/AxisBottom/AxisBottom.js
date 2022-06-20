import React, { useMemo } from "react";
import TicksBottom from "./TicksBottom";

const AxisBottom = ({ xScale, height, domain, range }) => {
  const ticks = useMemo(() => {
    const width = range[1] - range[0] - 80;
    const domainWidth = domain[1] - domain[0];
    const pixelsPerTick = width / domainWidth;
    const tickInterval = 5;
    const numberOfTicksTarget =
      Math.max(1, Math.floor(width / pixelsPerTick)) / tickInterval;

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
      key: value,
    }));
  }, [xScale, domain, range]);

  return (
    <svg style={{ overflow: "visible" }}>
      <path
        d={["M", range[0], height, "v", 0, "H", range[1], "v", 0].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      <TicksBottom ticks={ticks} xScale={xScale} height={height} />
    </svg>
  );
};

export default AxisBottom;
