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
    const newData = shuffled.slice(0, 50);
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
    // setData([
    //   {
    //     x: 14.570322,
    //     y: -10.469496,
    //     prediction: "bag",
    //     timestamp: "05-09-2021 23:41:05.694446",
    //   },
    //   {
    //     x: 15.7093115,
    //     y: 10.980132,
    //     prediction: "sneaker",
    //     timestamp: "07-09-2021 17:10:38.483584",
    //   },
    //   {
    //     x: 15.6710205,
    //     y: -9.053257,
    //     prediction: "bag",
    //     timestamp: "03-09-2021 07:45:21.961154",
    //   },
    // ]);
    return () => undefined;
  }, []);

  if (!data) {
    console.log("...loading");
    return <pre>Loading...</pre>;
  }

  function handleClick(e) {
    getRandomData().then(setData);
    // setData([
    //   {
    //     x: 16.51299,
    //     y: 11.967254,
    //     prediction: "sneaker",
    //     timestamp: "07-09-2021 00:46:02.208671",
    //   },
    //   {
    //     x: 7.1073494,
    //     y: -7.025962,
    //     prediction: "pullover",
    //     timestamp: "03-09-2021 09:59:21.601728",
    //   },
    //   {
    //     x: 8.1568,
    //     y: -4.590148,
    //     prediction: "pullover",
    //     timestamp: "03-09-2021 05:41:28.822777",
    //   },
    // ]);
    if (open) {
      toggle(false);
    } else {
      toggle(true);
    }
  }

  // console.log("NewData:", data);

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
