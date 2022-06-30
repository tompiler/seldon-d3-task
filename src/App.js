import "./App.css";
import React, { useState, useEffect } from "react";
import Scatter from "./components/Scatter/Scatter";
import Brush from "./components/Brush/Brush";
import RefreshButton from "./components/RefreshButton";
import { csv } from "d3-fetch";
import { shuffle } from "d3-array";
import { timeParse } from "d3-time-format";
import rows from "./data/live.csv";
import styled from "styled-components";
import { flatRollup, ascending } from "d3-array";
import { timeHour } from "d3-time";

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
  border-bottom: 1px solid black;
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
  border-right: 1px solid black;
`;

const ChartsContainer = styled("div")`
  display: flex;
  flex-flow: column;
  width: 80%;
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
  const data = csv(rows, rowFunc).then((rows) => {
    rows.forEach((row) => {
      row.timestamp = parseTime(row.timestamp);
    });
    return rows;
  });
  return data;
};

const getRandomData = (data, nRows) => {
  const shuffled = shuffle(data);
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
  const [selection, setSelection] = useState([]);

  useEffect(() => {
    getData()
      .then((data) => {
        setData(() => data);
        return data;
      })
      .then((data) => {
        const grouped = getGroupData(data);
        setGroupedData(() => grouped);
      });
    return () => undefined;
  }, []);

  if (!data) {
    console.log("...loading");
    return <pre>Loading...</pre>;
  }

  function handleClick(e) {
    getData()
      .then((data) => {
        const randomRows = getRandomData(data, 100);
        setData(randomRows);
        return data;
      })
      .then((data) => {
        const grouped = getGroupData(data);
        setGroupedData(grouped);
      });
    if (open) {
      toggle(false);
    } else {
      toggle(true);
    }
  }

  return (
    <div className="App">
      <Section>
        <Nav>
          <NavContainer>
            <Title>Seldon</Title>
            <RefreshButton onClick={handleClick}>Refresh data </RefreshButton>
          </NavContainer>
        </Nav>
        <Main>
          <Controls></Controls>
          <ChartsContainer>
            <Scatter data={data} open={open} selection={selection} />
            <Brush
              data={groupedData}
              selection={selection}
              setSelection={setSelection}
            />
          </ChartsContainer>
        </Main>
      </Section>
    </div>
  );
}
