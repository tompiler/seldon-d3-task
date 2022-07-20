import "./App.css";
import React, { useState, useEffect, useContext } from "react";
import Scatter from "./components/Scatter/Scatter";
import Legend from "./components/Scatter/Legend";
import Brush from "./components/Brush/Brush";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import { csv } from "d3-fetch";
import { shuffle } from "d3-array";
import { timeParse } from "d3-time-format";
import liveData from "./data/live.csv";
import referenceData from "./data/reference.csv";
import styled from "styled-components";
import { flatRollup, ascending } from "d3-array";
import { timeHour } from "d3-time";
import { min } from "d3-array";

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
  width: 20%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
`;

const ChartsContainer = styled("div")`
  display: flex;
  flex-flow: column;
  width: 50%;
  height: 100%;
`;

const ExplainContainer = styled("div")`
  display: flex;
  flex-flow: row;
  width: 30%;
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

const getRandomData = (data, samplePercentage) => {
  const shuffled = shuffle(data);
  const nRows = Math.ceil(data.length * samplePercentage);
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
  const [groupedData, setGroupedData] = useState(null);
  const [state, dispatch] = useContext(DashboardContext);

  const getReferenceData = () => {
    const data = csv(referenceData, rowFunc).then((rows) => {
      return rows;
    });
    return data;
  };

  const getLiveData = () => {
    const parseTime = timeParse("%d-%m-%Y %H:%M:%S.%f");
    const data = csv(liveData, rowFunc).then((rows) => {
      rows.forEach((row) => {
        row.timestamp = parseTime(row.timestamp);
      });
      return rows;
    });
    return data;
  };

  useEffect(() => {
    getReferenceData().then((data) => {
      dispatch({ type: "referenceData", payload: data });
      const randomRows = getRandomData(data, state.referenceSampleSize);
      dispatch({ type: "randomReferenceData", payload: randomRows });
    });

    getLiveData()
      .then((data) => {
        dispatch({ type: "liveData", payload: data });
        const randomRows = getRandomData(data, state.liveSampleSize);
        dispatch({ type: "randomLiveData", payload: randomRows });
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

  const resampleLiveData = () => {
    const randomRows = getRandomData(state.liveData, state.liveSampleSize);
    dispatch({ type: "randomLiveData", payload: randomRows });
    const grouped = getGroupData(randomRows);
    setGroupedData(grouped);
  };

  const resampleReferenceData = (data) => {
    const randomRows = getRandomData(data, state.referenceSampleSize);
    dispatch({ type: "randomReferenceData", payload: randomRows });
  };

  useEffect(() => {
    if (state.liveData !== undefined) {
      resampleLiveData();
    }
  }, [state.liveSampleSize, state.randomLiveDataRefresh]);

  useEffect(() => {
    if (state.referenceData !== undefined) {
      resampleReferenceData(state.referenceData);
    }
  }, [state.referenceSampleSize, state.randomReferenceDataRefresh]);

  return (
    <div className="App">
      <Section>
        <Nav>
          <NavContainer>
            <Title>Seldon</Title>
          </NavContainer>
        </Nav>
        <Main>
          <Controls>
            <ControlPanel />
          </Controls>
          <ChartsContainer>
            {state.dateRange && <Scatter source={state.source} />}
            {state.dateRange && <Brush data={groupedData} />}
          </ChartsContainer>
          <ExplainContainer>
            {state.dateRange && <Legend source={state.source} />}
          </ExplainContainer>
        </Main>
      </Section>
    </div>
  );
}
