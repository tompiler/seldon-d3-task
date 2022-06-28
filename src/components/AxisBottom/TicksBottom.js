import React, { useState, useEffect } from "react";
import { animated, useTransition, to, config } from "react-spring";

const TicksLeft = ({ ticks, xScale, height }) => {
  const transitions = useTransition(ticks, {
    from: ({ value }) => {
      return { xOffset: xScale(value), opacity: 0 };
    },
    enter: ({ xOffset }) => {
      return { xOffset: xOffset, opacity: 1 };
    },
    update: ({ xOffset }) => {
      return { xOffset: xOffset, opacity: 1 };
    },
    leave: ({ value }) => {
      return { xOffset: xScale(value), opacity: 0 };
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
          transform: to(styles.xOffset, (x) => `translate3d(${x}px, 0, 0)`),
        }}
      >
        {/* <animated.line x1={-6} x2={0} stroke="currentColor" /> */}
        <animated.line y1={height} y2={height + 6} stroke="currentColor" />
        {item.value !== 0 && (
          <animated.text
            key={item.value}
            y={height + 15}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
            }}
          >
            {item.value}
          </animated.text>
        )}
      </animated.g>
    );
  });
};

export default TicksLeft;
