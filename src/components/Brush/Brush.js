import React, { useEffect, useRef, useContext } from "react";
import styled from "styled-components";

import { scaleLinear, scaleBand } from "d3-scale";
import AxisLeft from "../Brush/AxisLeft";
import AxisBottom from "../Brush/AxisBottom";
import { extent, max, min, sum } from "d3-array";
import { select } from "d3-selection";
import { useChartDimensions } from "../../hooks/useChartDimensions";
import { usePrevious } from "../../hooks/usePrevious";
import { DashboardContext } from "../../Context";

import { timeHour } from "d3-time";
import { brushX } from "d3-brush";

const BrushContainer = styled("div")`
  width: 100%;
  height: 30%;
`;

const scaleBandInvert = (scale) => {
  // Not very precise but passable for band scales...
  var domain = scale.domain();
  var paddingOuter = scale(domain[0]);
  var eachBand = scale.step();
  return function (value) {
    var index = Math.floor((value - paddingOuter) / eachBand);
    return domain[Math.max(0, Math.min(index, domain.length - 1))];
  };
};

const Brush = ({ data, selection }) => {
  const margins = {
    marginTop: 20,
    marginRight: 150,
    marginBottom: 50,
    marginLeft: 150,
  };

  const [state, dispatch] = useContext(DashboardContext);

  const svgRef = useRef();
  const brushRef = useRef();

  const [ref, dimensions] = useChartDimensions(margins);
  const { width, height, boundedWidth, boundedHeight, marginTop, marginLeft } =
    dimensions;

  const xExtent = extent(data, (d) => d.Date);
  const xDomain = timeHour.range(xExtent[0], timeHour.offset(xExtent[1], 2));

  const previousSelection = usePrevious(state.dateRange);
  const maxBrushSizeHours = 100;

  const paddingOuter = 2;
  const paddingInner = 0.2;

  const xScale = scaleBand()
    .domain(xDomain)
    .range([0, boundedWidth])
    .paddingInner(paddingInner)
    .paddingOuter(paddingOuter);

  const yMax = max(data, (d) => d.Count);
  const yScale = scaleLinear().domain([0, yMax]).range([boundedHeight, 0]);

  const bandWidth = xScale.bandwidth();

  useEffect(() => {
    // Defines the behaviour of the brush when the brush itself is moved
    const svg = select(svgRef.current);

    // Maximum width of Brush - so as to not overload chart with svg elements
    const maxBrushSize =
      (xScale.paddingInner() + xScale.step()) * maxBrushSizeHours;
    let ps = [];

    const brush = brushX()
      .extent([
        [xScale(xExtent[0]), 0],
        [boundedWidth - xScale(xExtent[0]), boundedHeight],
      ])
      .on("start brush end", (event) => {
        if (!event.sourceEvent) return; // don't process events which don't come from interaction with the brush

        var s = event.selection;
        const newDateRange = event.selection.map(scaleBandInvert(xScale));
        if (event.type === "start") {
          ps = event.selection;
        } else if (event.type === "end" || event.type === "brush") {
          const selectionTooBig = s[1] - s[0] > maxBrushSize;
          const movedRight = ps[1] <= s[1];
          const movedLeft = ps[0] > s[0];
          const movedBoth = ps[0] !== s[0] && ps[1] !== s[1];
          if ((movedBoth || movedLeft || movedRight) && !selectionTooBig) {
            dispatch({ type: "dateRange", payload: newDateRange });
          } else if (selectionTooBig && movedLeft) {
            // truncate the brush size if too wide a range is selected
            const truncatedBounds = [s[0], s[0] + maxBrushSize];
            const newDateRange = truncatedBounds.map(scaleBandInvert(xScale));
            svg.select(".brush").call(brush.move, truncatedBounds);
            dispatch({ type: "dateRange", payload: newDateRange });
          } else if (selectionTooBig && movedRight) {
            // truncate the brush size if too wide a range is selected
            const truncatedBounds = [s[1] - maxBrushSize, s[1]];
            const newDateRange = truncatedBounds.map(scaleBandInvert(xScale));
            svg.select(".brush").call(brush.move, truncatedBounds);
            dispatch({ type: "dateRange", payload: newDateRange });
          }
        }
      });

    if (previousSelection !== state.dateRange) {
      svg
        .select(".brush")
        .call(brush)
        .call(brush.move, state.dateRange.map(xScale));
    }

    if (previousSelection === state.dateRange) {
      svg
        .select(".brush")
        .call(brush)
        .call(brush.move, state.dateRange.map(xScale));
    }
  }, [
    data,
    dimensions,
    selection,
    boundedWidth,
    boundedHeight,
    previousSelection,
    xScale,
  ]);

  const color = "rgb(60,60,60)";

  const bars = data.map((d, i) => {
    return (
      <rect
        key={i}
        x={xScale(d.Date)}
        y={yScale(d.Count)}
        width={bandWidth}
        height={boundedHeight - yScale(d.Count)}
        style={{ fill: "rgba(0,70,200,0.5" }}
      />
    );
  });

  return (
    <BrushContainer ref={ref}>
      <svg ref={svgRef} width={width} height={height}>
        <g transform={`translate(${marginLeft},${marginTop}) `}>
          <AxisBottom xScale={xScale} height={boundedHeight} color={color} />
          <AxisLeft
            yScale={yScale}
            height={boundedHeight}
            tickInterval={Math.max(
              5,
              Math.min(50, sum(data, (d) => d.Count) / 1000)
            )}
            color={color}
          />
          {bars}
        </g>
        <g
          ref={brushRef}
          transform={`translate(${marginLeft},${marginTop}) `}
          className="brush"
        ></g>
      </svg>
    </BrushContainer>
  );
};

export default Brush;
