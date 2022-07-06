import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { scaleLinear } from "d3-scale";
import AxisLeft from "./AxisLeft/AxisLeft";
import AxisBottom from "./AxisBottom/AxisBottom";
import { extent, max } from "d3-array";
import { select } from "d3-selection";
import { zoom, zoomTransform, zoomIdentity } from "d3-zoom";
import { useChartDimensions } from "../../hooks/useChartDimensions";

const ScatterContainer = styled("div")`
  width: 100%;
  height: 70%;
`;

const Scatter = ({ data, source, open, selection }) => {
  const svgRef = useRef();
  const [currentZoomState, setCurrentZoomState] = useState(zoomIdentity);
  // console.log("Scatter selection", selection);
  const filtered = data.filter((d) => {
    if (source === "live") {
      return d.timestamp >= selection[0] && d.timestamp <= selection[1];
    } else {
      return data;
    }
  });

  const props = useSpring({
    from: { r: 0, fill: "lightblue", opacity: 0.2 },
    to: {
      r: open ? 1.5 * currentZoomState.k : 1.5 * currentZoomState.k,
      fill: open ? "purple" : "lightblue",
      opacity: 0.8,
    },
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

  const margins = {
    marginTop: 30,
    marginRight: 150,
    marginBottom: 30,
    marginLeft: 150,
  };

  const [ref, dimensions] = useChartDimensions(margins);

  const { width, height, boundedWidth, boundedHeight, marginTop, marginLeft } =
    dimensions;

  const clipPathId = "clippath1";
  const clipPathPadding = 7.5;

  // We need to create two yScales and two xScales
  // to manage a 'clean' extent to center the chart on 0
  const xDomain = extent(data, (d) => d.x);
  const xScale = scaleLinear().domain(xDomain).range([0, boundedWidth]).nice();

  const yDomain = extent(data, (d) => d.y);
  const yScale = scaleLinear().domain(yDomain).range([boundedHeight, 0]).nice();

  const xMax = max(xScale.domain().map((d) => Math.abs(d)));
  const yMax = max(yScale.domain().map((d) => Math.abs(d)));

  const xScaleLive = scaleLinear()
    .domain([-xMax, xMax])
    .range([0, boundedWidth]);

  const yScaleLive = scaleLinear()
    .domain([-yMax, yMax])
    .range([boundedHeight, 0]);

  if (currentZoomState) {
    const newXScale = currentZoomState.rescaleX(xScaleLive);
    xScaleLive.domain(newXScale.domain());

    const newYScale = currentZoomState.rescaleY(yScaleLive);
    yScaleLive.domain(newYScale.domain());
  }

  useEffect(() => {
    const svg = select(svgRef.current);

    const zoomBehaviour = zoom()
      .scaleExtent([0.8, 5])
      .on("zoom", () => {
        const zoomState = zoomTransform(svg.node());
        setCurrentZoomState(zoomState);
      });

    svg.call(zoomBehaviour);
  }, [currentZoomState]);

  const tickInterval = currentZoomState.k >= 2.5 ? 2 : 5;

  const circles = filtered.map((d, i) => {
    const prediction = d.prediction.replace("-", "_").replace(" ", "_");
    return (
      <animated.circle
        key={i}
        r={props.r}
        cx={xScaleLive(d.x)}
        cy={yScaleLive(d.y)}
        style={{ fill: labelColours[prediction], opacity: props.opacity }}
      />
    );
  });

  return (
    <ScatterContainer ref={ref}>
      <svg ref={svgRef} width={width} height={height}>
        <defs>
          <clipPath id={clipPathId}>
            <rect // add padding for the clip path
              x={-clipPathPadding}
              y={-clipPathPadding}
              width={boundedWidth + clipPathPadding * 2}
              height={boundedHeight + clipPathPadding * 2}
            />
          </clipPath>
        </defs>
        <g
          clipPath={`url(#${clipPathId})`}
          transform={`translate(${marginLeft},${marginTop}) `}
        >
          <AxisLeft
            yScale={yScaleLive}
            xScale={xScaleLive}
            width={boundedWidth}
            height={boundedHeight}
            tickInterval={tickInterval}
          />
          <AxisBottom
            xScale={xScaleLive}
            yScale={yScaleLive}
            height={boundedHeight}
            width={boundedWidth}
            tickInterval={tickInterval}
          />
          {circles}
        </g>
      </svg>
    </ScatterContainer>
  );
};

export default Scatter;
