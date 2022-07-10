import React, { useEffect, useRef, useContext } from "react";
import styled from "styled-components";

import { scaleLinear, scaleBand } from "d3-scale";
import AxisLeft from "../Brush/AxisLeft";
import AxisBottom from "../Brush/AxisBottom";
import { extent, max, sum } from "d3-array";
import { line, curveCatmullRom } from "d3-shape";
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

const Brush = ({ data }) => {
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
        svg.select(".brush").call(brushHandle, event.selection);
        console.log(event.selection);
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

    const points = [
      [0, 0],
      [-12, boundedHeight / 2],
      [0, boundedHeight],
    ];

    const wrapper = (points, type) => {
      return line()
        .x((d, i) => {
          console.log(d, i, d[0], -d[0], type);
          return type === 1 ? -d[0] : +d[0];
        })
        .y((d) => d[1])
        .curve(curveCatmullRom.alpha(0.5))(points);
    };

    const brushHandle = (g, selection) =>
      g
        .selectAll(".handle--custom")
        .data([{ type: "w" }, { type: "e" }])
        .join((enter) =>
          enter
            .append("path")
            .attr("class", "handle--custom")
            .style("fill", "rgb(100, 100, 100)")
            .style("fill-opacity", 1)
            .attr("cursor", "ew-resize")
            .attr("d", (_, i) => {
              return wrapper(points, i);
            })
        )
        .attr("display", selection === null ? "none" : null)
        .attr(
          "transform",
          selection === null ? null : (d, i) => `translate(${selection[i]},0)`
        );

    if (state.source === "reference") {
      svg.select(".overlay").style("pointer-events", "none");
      svg.select(".brush").style("pointer-events", "none");
    } else {
      svg.select(".overlay").style("pointer-events", "all");
      svg.select(".brush").style("pointer-events", "all");
    }

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
        .call(brush.move, state.dateRange.map(xScale))
        .call(brushHandle, state.dateRange.map(xScale));
      svg
        .select(".selection")
        .style("stroke", "rgb(50,50,50)")
        .style("fill", "rgba(10,10,200)")
        .style("fill-opacity", 0.12);
    }
  }, [
    data,
    dimensions,
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
        style={{ fill: "rgba(0,70,200,0.5", rx: "2px", ry: "2px" }}
      />
    );
  });

  return (
    <BrushContainer ref={ref}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          opacity: state.source === "reference" ? 0.6 : 1,
        }}
      >
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
