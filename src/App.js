import "./App.css";
import React, { useState, useEffect, useReducer, useContext } from "react";
import Scatter from "./components/Scatter/Scatter";
import Brush from "./components/Brush/Brush";
import RefreshButton from "./components/RefreshButton";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import { csv } from "d3-fetch";
import { shuffle } from "d3-array";
import { timeParse, timeFormat } from "d3-time-format";
import liveData from "./data/live.csv";
import referenceData from "./data/reference.csv";
import styled from "styled-components";
import { flatRollup, ascending } from "d3-array";
import { timeHour } from "d3-time";
import { min, max } from "d3-array";

import { DashboardContext } from "./Context";

const Section = styled("section")`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column;
`;

const NavContainer = styled("div")`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2em;
  margin: 0;
  text-align: left;
  text-decoration: none;
  font-size: 1em;
`;

const Nav = styled("nav")`
  padding: 0 0em;
  background-image: linear-gradient(to right, #5159ff, #405df6, #00ded0);
`;

const Main = styled("div")`
  display: flex;
  flex: 4;
  overflow: auto;
`;

const Controls = styled("div")`
  display: flex;
  width: 25%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
`;

const ChartsContainer = styled("div")`
  display: flex;
  flex-flow: column;
  width: 75%;
  height: 100%;
`;

const Title = styled("h1")`
  text-align: left;
  font-family: "Arial Rounded MT Bold";
  color: #ffffff;
`;

const rowFunc = (d) => {
  d.x = +d.x;
  d.y = +d.y;
  return d;
};

const getData = () => {
  const parseTime = timeParse("%d-%m-%Y %H:%M:%S.%f");
  // const rows = source === "live" ? liveData : referenceData;
  const rows = liveData;
  // console.log(source, source === "live");
  const data = csv(rows, rowFunc).then((rows) => {
    rows.forEach((row) => {
      row.timestamp = parseTime(row.timestamp);
    });
    return rows;
  });
  return data;
};

const getRandomData = (data, samplePercentage) => {
  const shuffled = shuffle(data);
  const nRows = Math.ceil((data.length * samplePercentage) / 100);
  const randomRows = shuffled.slice(0, nRows);
  return randomRows;
};

const getGroupData = (data) => {
  const groupedData = flatRollup(
    data,
    (v) => v.length,
    (d) => timeHour(d.timestamp)
  );
  const renamed = groupedData.map(([Date, Count]) => ({ Date, Count }));

  renamed.sort((a, b) => {
    return ascending(a.Date, b.Date);
  });

  return renamed;
};

export default function App() {
  const [data, setData] = useState(null);
  const [groupedData, setGroupedData] = useState(null);
  const [open, toggle] = useState(false);
  const [source, setSource] = useState("live");
  const [unappliedChanges, setUnappliedChanges] = useState(false);
  const [randomSampleSizePercent, setRandomSampleSizePercent] = useState(10);

  const formatTime = timeFormat("%Y-%m-%d %H:%M");

  const [state, dispatch] = useContext(DashboardContext);

  useEffect(() => {
    console.log("...really loading");

    getData()
      .then((data) => {
        const randomRows = getRandomData(data, randomSampleSizePercent);
        setData(() => randomRows);
        return randomRows;
      })
      .then((data) => {
        const minTs = timeHour.floor(min(data, (d) => d.timestamp));
        const maxTs = timeHour.offset(minTs, 10);
        dispatch({
          type: "multiple",
          payload: {
            loading: false,
            dateRange: [minTs, maxTs],
          },
        });
        return data;
      })
      .then((data) => {
        const grouped = getGroupData(data);
        setGroupedData(() => grouped);
      });

    return () => undefined;
  }, []);

  if (state.loading) {
    console.log("...loading");
    return <pre>Loading...</pre>;
  }

  console.log("...loaded");

  // function refreshData(e) {
  //   getData(source)
  //     .then((data) => {
  //       const randomRows = getRandomData(data, randomSampleSizePercent);
  //       setData(() => randomRows);
  //       return randomRows;
  //     })
  //     .then((data) => {
  //       const grouped = getGroupData(data);
  //       setGroupedData(grouped);
  //     });
  //   if (open) {
  //     toggle(false);
  //   } else {
  //     toggle(true);
  //   }
  // }

  // const resample = () => {
  //   getData(source)
  //     .then((data) => {
  //       console.log(data);
  //       const randomRows = getRandomData(data, randomSampleSizePercent);
  //       setData(() => randomRows);
  //       return randomRows;
  //     })
  //     .then((data) => {
  //       const grouped = getGroupData(data);
  //       setGroupedData(grouped);
  //     });
  // };

  return (
    <div className="App">
      <Section>
        <Nav>
          <NavContainer>
            <Title>Seldon</Title>
          </NavContainer>
        </Nav>
        <Main>
          <Controls>{!state.loading && <ControlPanel />}</Controls>
          <ChartsContainer>
            {state.dateRange && (
              <Scatter data={data} source={source} open={open} />
            )}
            {state.dateRange && <Brush data={groupedData} />}
          </ChartsContainer>
        </Main>
      </Section>
    </div>
  );
}
