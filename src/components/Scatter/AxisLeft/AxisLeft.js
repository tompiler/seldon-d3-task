import React, { useMemo } from "react";
import { min, max } from "d3-array";
import TicksLeft from "./TicksLeft";

const AxisLeft = ({ yScale, xScale, height, width, tickInterval }) => {
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

  const color = "rgb(60,60,60)";
  // When the chart pans to the point where the axis is out of
  // bounds, truncate the position so that it stays within view
  // and the tick labels are visible
  const truncatedXPos = min([width, max([10, xScale(0)])]);
  return (
    <svg style={{ overflow: "visible" }}>
      <path
        stroke={color}
        d={[
          "M",
          truncatedXPos,
          range[1],
          "v",
          range[0],
          "H",
          truncatedXPos,
        ].join(" ")}
        fill="none"
      />
      <g transform={`translate(${xScale(0) + 15},0) `}>
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
          {"← 𝑦 →"}
        </text>
      </g>
      <TicksLeft
        ticks={ticks}
        yScale={yScale}
        height={truncatedXPos}
        color={color}
      />
    </svg>
  );
};

export default AxisLeft;
