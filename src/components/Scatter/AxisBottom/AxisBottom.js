import React, { useMemo } from "react";
import { min, max } from "d3-array";
import TicksBottom from "./TicksBottom";

const AxisBottom = ({ xScale, yScale, width, height, tickInterval }) => {
  const domain = xScale.domain();
  const range = xScale.range();

  const ticks = useMemo(() => {
    const domainWidth = domain[1] - domain[0];
    const pixelsPerTick = width / domainWidth;
    const numberOfTicksTarget =
      Math.max(1, Math.floor(width / pixelsPerTick)) / tickInterval;

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
      key: value,
    }));
  }, [xScale, domain, width, tickInterval]);

  const color = "rgb(60,60,60)";

  // When the chart pans to the point where the axis is out of
  // bounds, truncate the position so that it stays within view
  // and the tick labels are visible
  const truncatedYPos = min([height - 10, max([10, yScale(0)])]);

  return (
    <svg style={{ overflow: "visible" }}>
      <path
        stroke={color}
        d={["M", range[0], truncatedYPos, "v", 0, "H", range[1]].join(" ")}
        fill="none"
      />
      <g transform={`translate(${30},${yScale(0) - 10}) `}>
        <text
          style={{
            fontSize: "12px",
            verticalAlign: "text-bottom",
            textAnchor: "end",
            fill: color,
            strokeWidth: 0,
          }}
        >
          {"← 𝑥 →"}
        </text>
      </g>
      <TicksBottom
        ticks={ticks}
        xScale={xScale}
        height={truncatedYPos}
        color={color}
      />
    </svg>
  );
};

export default AxisBottom;
