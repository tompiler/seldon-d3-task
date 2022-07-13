import { useContext, useEffect } from "react";
import { DashboardContext } from "../../Context";
import { extent, mean } from "d3-array";
import { labelColours } from "../../fixed";
import { zoom, zoomTransform, ZoomTransform, zoomIdentity } from "d3-zoom";

const Circles = ({ xScale, yScale, xReScale, yReScale, currentZoomState }) => {
  const [state, dispatch] = useContext(DashboardContext);
  const predictionOrLabel = state.source === "live" ? "prediction" : "label";

  const filtered = state.randomLiveData.filter((d) => {
    return (
      d.timestamp >= state.dateRange[0] && d.timestamp <= state.dateRange[1]
    );
  });

  const dataset =
    state.source === "live" ? filtered : state.randomReferenceData;

  useEffect(() => {
    const dataset =
      state.source === "live" ? filtered : state.randomReferenceData;

    const selectedClusterData = dataset.filter((d) => {
      return (
        d[predictionOrLabel].replace("-", "_").replace(" ", "_") ===
        state.selectedCluster
      );
    });

    const xCentroid = mean(selectedClusterData, (d) => d.x) || 0;
    const yCentroid = mean(selectedClusterData, (d) => d.y) || 0;

    dispatch({
      type: "selectedClusterCentroid",
      payload: [xCentroid, yCentroid],
    });
  }, [state.selectedCluster]);

  return dataset.map((d, i) => {
    const prediction = d[predictionOrLabel].replace("-", "_").replace(" ", "_");

    return (
      <circle
        key={i}
        r={Math.min(3, currentZoomState.k * 2)}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        style={{
          fill: state.selectedCluster
            ? state.selectedCluster === prediction
              ? labelColours[prediction]
              : "rgb(210,210,210)"
            : labelColours[prediction],
          opacity: 0.9,
        }}
      />
    );
  });
};

export default Circles;
