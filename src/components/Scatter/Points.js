import { useContext } from "react";
import { DashboardContext } from "../../Context";

const Circles = ({ yScale, xScale, currentZoomState }) => {
  const [state] = useContext(DashboardContext);
  const predictionOrLabel = state.source === "live" ? "prediction" : "label";

  const filtered = () => {
    const data = state.randomLiveData.filter((d) => {
      return (
        d.timestamp >= state.dateRange[0] && d.timestamp <= state.dateRange[1]
      );
    });
    return data;
  };

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

  const dataset =
    state.source === "live" ? filtered() : state.randomReferenceData;
  return dataset.map((d, i) => {
    const prediction = d[predictionOrLabel].replace("-", "_").replace(" ", "_");
    return (
      <circle
        key={i}
        r={Math.min(5, currentZoomState.k * 2)}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        style={{ fill: labelColours[prediction], opacity: 0.7 }}
      />
    );
  });
};

export default Circles;
