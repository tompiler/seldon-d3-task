import "./App.css";
import React, { useState, useEffect } from "react";
import Scatter from "./components/Scatter";
import RefreshButton from "./components/RefreshButton";
import { csv } from "d3-fetch";
import { shuffle } from "d3-array";
import rows from "./data/live.csv";
import styled from "styled-components";
import { useChartDimensions } from "./hooks/useChartDimensions";

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
  /* justify-content: flex-start; */
  /* align-items: center; */
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

const BrushContainer = styled("div")`
  width: 100%;
  height: 14%;
  border: 1px dashed red;
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

const getRandomData = () => {
  const newData = csv(rows, rowFunc).then((rows) => {
    const shuffled = shuffle(rows);
    const newData = shuffled.slice(0, 500);
    // console.log(newData);
    return newData;
    // return rows.slice(0, 5);
  });
  return newData;
};

export default function App() {
  const [data, setData] = useState(null);
  const [open, toggle] = useState(false);

  useEffect(() => {
    getRandomData().then(setData);
    return () => undefined;
  }, []);

  if (!data) {
    console.log("...loading");
    return <pre>Loading...</pre>;
  }

  function handleClick(e) {
    getRandomData().then(setData);
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
            <Scatter data={data} open={open} />
            <BrushContainer />
          </ChartsContainer>
        </Main>
      </Section>
    </div>
  );
}
