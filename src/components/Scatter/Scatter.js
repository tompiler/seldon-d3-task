import React, { useState, useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { scaleLinear } from "d3-scale";
import AxisLeft from "./AxisLeft/AxisLeft";
import AxisBottom from "./AxisBottom/AxisBottom";
import { extent, max, min } from "d3-array";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import { useChartDimensions } from "../../hooks/useChartDimensions";
import { DashboardContext } from "../../Context";
import Points from "./Points";

const ScatterContainer = styled("div")`
  width: 100%;
  height: 70%;
`;

const Scatter = () => {
  const gRef = useRef();
  const [currentZoomState, setCurrentZoomState] = useState(zoomIdentity);
  const [state] = useContext(DashboardContext);

  const margins = {
    marginTop: 30,
    marginRight: 150,
    marginBottom: 30,
    marginLeft: 150,
  };

  const [ref, dimensions] = useChartDimensions(margins);

  const { width, height, boundedWidth, boundedHeight, marginTop, marginLeft } =
    dimensions;

  // We need to create two yScales and two xScales
  // to manage a 'clean' extent to center the chart on 0
  const xExtents = [state.liveData, state.referenceData].map((dataset) => {
    return extent(dataset, (d) => {
      return d.x;
    });
  });

  const yExtents = [state.liveData, state.referenceData].map((dataset) => {
    return extent(dataset, (d) => {
      return d.y;
    });
  });

  const xDomain = [
    min(xExtents, (d) => {
      return d[0];
    }),
    max(xExtents, (d) => {
      return d[1];
    }),
  ];

  const yDomain = [
    min(yExtents, (d) => {
      return d[0];
    }),
    max(yExtents, (d) => {
      return d[1];
    }),
  ];
  const xScale = scaleLinear().domain(xDomain).range([0, boundedWidth]).nice();
  const yScale = scaleLinear().domain(yDomain).range([boundedHeight, 0]).nice();

  const xMax = max(xScale.domain().map((d) => Math.abs(d)));
  const yMax = max(yScale.domain().map((d) => Math.abs(d)));

  xScale.domain([-xMax, xMax]);
  yScale.domain([-yMax, yMax]);

  const newXScale = currentZoomState.rescaleX(xScale);
  xScale.domain(newXScale.domain());

  const newYScale = currentZoomState.rescaleY(yScale);
  yScale.domain(newYScale.domain());

  useEffect(() => {
    const g = select(gRef.current);
    const zoomBehaviour = zoom()
      .scaleExtent([0.5, 6])
      .on("zoom", ({ transform }) => {
        if (transform.k) {
          console.log("Hello");
          setCurrentZoomState(transform);
        }
      });

    g.transition().duration(750).call(zoomBehaviour.transform, zoomIdentity);
  }, [state.zoomReset]);

  useEffect(() => {
    const g = select(gRef.current);

    const zoomBehaviour = zoom()
      .scaleExtent([0.5, 6])
      .on("zoom", ({ transform }) => {
        setCurrentZoomState(transform);
      });
    g.call(zoomBehaviour);
  }, [currentZoomState]);

  useEffect(() => {
    const g = select(gRef.current);
    if (state.selectedCluster === undefined) return;

    // Have to replicate zoom behaviour above here
    const zoomBehaviour = zoom()
      .scaleExtent([0.5, 6])
      .on("zoom", ({ transform }) => {
        setCurrentZoomState(transform);
      });

    if (state.selectedCluster === null) {
      // If there is no cluster selected
      g.transition().duration(750).call(zoomBehaviour.transform, zoomIdentity);
    } else {
      // See 'random' method here -> https://observablehq.com/@d3/programmatic-zoom
      console.log("New cluster selected", xScale(0));

      const xScaleZ = scaleLinear()
        .domain([-25, +25])
        .range([0, boundedWidth]);

      const yScaleZ = scaleLinear()
        .domain([-20, +20])
        .range([boundedHeight, 0]);

      const zoomChange = zoomIdentity
        .translate(boundedWidth / 2, boundedHeight / 2)
        .scale(3)
        .translate(
          -xScaleZ(state.selectedClusterCentroid[0]),
          -yScaleZ(state.selectedClusterCentroid[1])
        );
      g.transition().duration(750).call(zoomBehaviour.transform, zoomChange);
    }
    g.call(zoomBehaviour);
  }, [state.selectedClusterCentroid]);

  const tickInterval = currentZoomState.k >= 2.5 ? 2 : 5;
  const clipPathId = "clippath1";
  const clipPathPadding = 7.5;

  return (
    <ScatterContainer ref={ref}>
      <svg width={width} height={height}>
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
          ref={gRef}
          clipPath={`url(#${clipPathId})`}
          transform={`translate(${marginLeft},${marginTop}) `}
        >
          <rect // for detecting zoom events
            height={boundedHeight}
            width={boundedWidth}
            style={{ fill: "transparent" }}
          ></rect>
          <AxisLeft
            yScale={yScale}
            xScale={xScale}
            width={boundedWidth}
            height={boundedHeight}
            tickInterval={tickInterval}
          />
          <AxisBottom
            xScale={xScale}
            yScale={yScale}
            height={boundedHeight}
            width={boundedWidth}
            tickInterval={tickInterval}
          />
          <Points
            yScale={yScale}
            xScale={xScale}
            currentZoomState={currentZoomState}
          />
        </g>
      </svg>
    </ScatterContainer>
  );
};

export default Scatter;
