import React from "react";
import { animated, useTransition, to } from "react-spring";

const TicksLeft = ({ ticks, yScale, height, color }) => {
  // const transitions = useTransition(ticks, {
  //   from: ({ value }) => {
  //     return { yOffset: yScale(value), opacity: 0 };
  //   },
  //   enter: ({ yOffset }) => {
  //     return { yOffset: yOffset, opacity: 1 };
  //   },
  //   update: ({ yOffset }) => {
  //     return { yOffset: yOffset, opacity: 1 };
  //   },
  //   leave: ({ value }) => {
  //     return { yOffset: yScale(value), opacity: 0 };
  //   },
  //   keys: (item) => item.key,
  //   config: { duration: 200 },
  // });

  return ticks.map((item) => {
    return (
      <g
        key={item.value}
        style={{ transform: `translate3d(0, ${item.yOffset}px, 0)` }}
      >
        <line x1={height + -6} x2={height + 0} stroke={color} />
        <text
          x={height - 10}
          y={item.value === 0 ? 10 : 0}
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
          {item.value}
        </text>
      </g>
    );
  });
};

export default TicksLeft;
