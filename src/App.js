import "./App.css";
import React, { useState, useEffect } from "react";
import Scatter from "./components/Scatter";
import RefreshButton from "./components/RefreshButton";
import { csv } from "d3-fetch";
import { shuffle } from "d3-array";
import rows from "./data/live.csv";
import styled from "styled-components";

const Nav = styled("nav")`
  display: inline-block;
  height: 100%;
  padding: 0 0em;
  width: 100%;
  background-image: linear-gradient(to right, #5159ff, #405df6, #00ded0);
`;

const Container = styled("div")`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2em;
  margin: 0;
  text-align: left;
  text-decoration: none;
  font-size: 1em;
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
    const newData = shuffled.slice(0, 30);
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
    return <pre>Loading...</pre>;
  }

  //   console.log(data);
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
      <Nav>
        <Container>
          <Title>Seldon</Title>
          <RefreshButton onClick={handleClick}>Refresh data </RefreshButton>
        </Container>
      </Nav>
      <Scatter data={data} open={open} />
    </div>
  );
}
