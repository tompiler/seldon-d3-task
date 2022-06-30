import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { scaleLinear, scaleBand, scaleTime } from "d3-scale";
import AxisLeft from "../Brush/AxisLeft";
import AxisBottom from "../Brush/AxisBottom";
import { extent } from "d3-array";
import { select } from "d3-selection";
import { useChartDimensions } from "../../hooks/useChartDimensions";
import { usePrevious } from "../../hooks/usePrevious";

import { timeHour } from "d3-time";
import { brushX } from "d3-brush";

const BrushContainer = styled("div")`
  width: 100%;
  height: 30%;
  border: 1px dashed blue;
`;

const scaleBandInvert = (scale) => {
  var domain = scale.domain();
  var paddingOuter = scale(domain[0]);
  var eachBand = scale.step();
  return function (value) {
    var index = Math.floor((value - paddingOuter) / eachBand);
    return domain[Math.max(0, Math.min(index, domain.length - 1))];
  };
};

const Brush = ({ data, selection, setSelection }) => {
  const margins = {
    marginTop: 20,
    marginRight: 150,
    marginBottom: 50,
    marginLeft: 150,
  };

  const svgRef = useRef();
  const brushRef = useRef();

  const [ref, dimensions] = useChartDimensions(margins);
  const { width, height, boundedWidth, boundedHeight, marginTop, marginLeft } =
    dimensions;

  const xExtent = extent(data, (d) => d.Date);
  const xDomain = timeHour.range(xExtent[0], timeHour.offset(xExtent[1], 1));

  const previousSelection = usePrevious(selection);

  useEffect(() => {
    setSelection(() => [xDomain[0], xDomain[6]]);
  }, []);

  const paddingOuter = 2;
  const paddingInner = 0.2;
  const xScale = scaleBand()
    .domain(xDomain)
    .range([0, boundedWidth])
    .paddingInner(paddingInner)
    .paddingOuter(paddingOuter);

  const yDomain = extent(data, (d) => d.Count);
  const yScale = scaleLinear().domain(yDomain).range([boundedHeight, 0]);

  const bandWidth = xScale.bandwidth();

  const xBrushScale = scaleTime().domain(xExtent).range([0, boundedWidth]);

  useEffect(() => {
    const svg = select(svgRef.current);

    const maxBrushSize = 50;
    let ps = [];
    const brush = brushX()
      .extent([
        [0, 0],
        [boundedWidth, boundedHeight],
      ])
      .on("start brush end", (event) => {
        var s = event.selection;
        const indexSelection = event.selection.map(scaleBandInvert(xScale));
        if (event.type === "start") {
          ps = event.selection;
        } else if (event.type === "end" || event.type === "brush") {
          const selectionTooBig = s[1] - s[0] > maxBrushSize;
          const movedRight = ps[1] <= s[1];
          const movedLeft = ps[0] >= s[0];
          const movedBoth = ps[0] !== s[0] && ps[1] !== s[1];
          if ((movedBoth || movedLeft || movedRight) && !selectionTooBig) {
            setSelection(() => indexSelection);
          } else if (selectionTooBig && movedLeft) {
            // truncate the brush size if too wide a range is selected
            const truncatedSelection = [s[0], s[0] + maxBrushSize];
            const indexSelection = truncatedSelection.map(
              scaleBandInvert(xScale)
            );
            svg.select(".brush").call(brush.move, truncatedSelection);
            setSelection(() => indexSelection);
          } else if (selectionTooBig && movedRight) {
            // truncate the brush size if too wide a range is selected
            const truncatedSelection = [s[1] - maxBrushSize, s[1]];
            const indexSelection = truncatedSelection.map(
              scaleBandInvert(xScale)
            );
            svg.select(".brush").call(brush.move, truncatedSelection);
            setSelection(() => indexSelection);
          }
        }
      });

    if (previousSelection === selection) {
      svg.select(".brush").call(brush).call(brush.move, selection.map(xScale));
    }
  }, [
    data,
    dimensions,
    selection,
    setSelection,
    boundedWidth,
    boundedHeight,
    xBrushScale,
    previousSelection,
    xScale,
  ]);

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
      <svg
        ref={svgRef}
        style={{ border: "1px solid green" }}
        width={width}
        height={height}
      >
        <g transform={`translate(${marginLeft},${marginTop}) `}>
          <AxisBottom xScale={xScale} height={boundedHeight} />
          <AxisLeft yScale={yScale} height={boundedHeight} tickInterval={50} />
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
