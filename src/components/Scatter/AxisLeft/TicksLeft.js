import React, { useState, useEffect } from "react";
import { animated, useTransition, to, config } from "react-spring";

const TicksLeft = ({ ticks, yScale, height }) => {
  const transitions = useTransition(ticks, {
    from: ({ value }) => {
      return { yOffset: yScale(value), opacity: 0 };
    },
    enter: ({ yOffset }) => {
      return { yOffset: yOffset, opacity: 1 };
    },
    update: ({ yOffset }) => {
      return { yOffset: yOffset, opacity: 1 };
    },
    leave: ({ value }) => {
      return { yOffset: yScale(value), opacity: 0 };
    },
    keys: (item) => item.key,
    config: { duration: 200 },
  });

  return transitions((styles, item) => {
    return (
      <animated.g
        key={item.value}
        style={{
          opacity: styles.opacity,
          transform: to(styles.yOffset, (y) => `translate3d(0, ${y}px, 0)`),
        }}
      >
        <animated.line x1={height + -6} x2={height + 0} stroke="currentColor" />
        <animated.text
          x={height - 10}
          y={item.value === 0 ? 10 : 0}
          dy={"0.3em"}
          style={{
            fontSize: "10px",
            verticalAlign: "text-bottom",
            textAnchor: "end",
            transform: "translate(0px)",
          }}
        >
          {item.value}
        </animated.text>
      </animated.g>
    );
  });
};

export default TicksLeft;
