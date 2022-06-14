import React from "react";
import { useSpring, animated } from "react-spring";
import { scaleLinear } from "d3-scale";
import AxisLeft from "./AxisLeft";
import AxisBottom from "./AxisBottom";
import { extent } from "d3-array";

const Scatter = ({ data, open }) => {
  const props = useSpring({
    from: { r: 0, fill: "lightblue" },
    to: { r: open ? 5 : 3, fill: open ? "purple" : "lightblue" },
  });

  const labelColours = {
    ankle_boot: "#4c72b0",
    t_shirt: "#dd8452",
    dress: "#55a868",
    pullover: "#c44e52",
    sneaker: "#8172b3",
    sandal: "#937860",
    trouser: "#da8bc3",
    shirt: "#8c8c8c",
    coat: "#ccb974",
    bag: "#64b5cd",
  };

  const w = 600,
    h = 600,
    margin = {
      top: 40,
      bottom: 40,
      left: 40,
      right: 40,
    };

  const width = w - margin.right - margin.left,
    height = h - margin.top - margin.bottom;

  const xDomain = extent(data, (d) => d.x);
  const xScale = scaleLinear().domain(xDomain).range([0, width]).nice();

  const yDomain = extent(data, (d) => d.y);
  const yScale = scaleLinear().domain(yDomain).range([height, 0]).nice();

  const circles = data.map((d, i) => {
    const prediction = d.prediction.replace("-", "_").replace(" ", "_");
    return (
      <animated.circle
        key={i}
        r={props.r}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        style={{ fill: labelColours[prediction] }}
      />
    );
  });

  return (
    <div>
      <svg width={w} height={h}>
        <g transform={`translate(${margin.left},${margin.top}) `}>
          <AxisLeft yScale={yScale} domain={yDomain} range={[height, 0]} />
          <AxisBottom
            xScale={xScale}
            height={height}
            domain={xDomain}
            range={[0, width]}
          />
          {circles}
        </g>
      </svg>
    </div>
  );
};

export default Scatter;
