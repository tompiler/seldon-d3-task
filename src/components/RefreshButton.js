import React from "react";

import styled from "styled-components";

const RefreshButton = styled.button`
  display: inline-block;
  position: relative;
  height: 3vh;
  margin-left: 2em;
  /* top: -1vh; */
  /* margin: 1vh 0;
  width: 100%; */
  font-size: 1em;
  font-weight: 600;
  font-family: "Arial Rounded MT Bold";
  text-align: right;
  background-color: transparent;
  color: white;
  cursor: pointer;
  transition: 0.3s;
  border: none;
  border-bottom: 1.7px solid transparent;

  &:hover {
    border-bottom: 1.7px solid white;
    outline: none;
  }
`;

export default RefreshButton;
