import React, { useContext } from "react";
import styled, { css } from "styled-components";
import { Title } from "./styles";
import { DashboardContext } from "../../Context";

const trackH = "0.4em";
const thumbD = "1.5em";
const trackC = "#ccced0";
const filllC = "rgb(255, 140, 59)";

const RandomSampleSizeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  font-size: 1em;
  border-radius: 3px;
  padding: 0.7vh 0.4vw;
`;

const track = css`
  box-sizing: border-box;
  border: none;
  height: 4px;
  background: ${trackC};
  border-radius: 8px;
`;

const trackFill = css`
  ${track};
  height: 6px;
  background-color: transparent;
  background-image: linear-gradient(${filllC}, ${filllC}),
    linear-gradient(${trackC}, ${trackC});
  background-size: var(--sx) 6px, calc(100% - var(--sx)) 4px;
  background-position: left center, right center;
  background-repeat: no-repeat;
`;

const fill = css`
  height: ${trackH};
  background: ${filllC};
  border-radius: 4px;
`;

const thumb = css`
  box-sizing: border-box;
  border: none;
  width: ${thumbD};
  height: ${thumbD};
  border-radius: 50%;
  background: white;
  box-shadow: 0px 0px 5px rgba(66, 97, 255, 0.5);
`;

const Input = styled.input`
  display: flex;
  &,
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  &:focus {
    outline: none;
  }

  &:focus::-webkit-slider-thumb {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:focus::-moz-range-thumb {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:focus::-ms-thumb {
    outline: -webkit-focus-ring-color auto 5px;
  }

  --range: calc(var(--max) - var(--min));
  --ratio: calc((var(--val) - var(--min)) / var(--range));
  --sx: calc(0.5 * ${thumbD} + var(--ratio) * (100% - ${thumbD}));

  margin: 0;
  padding: 0;
  height: ${thumbD};
  background: transparent;
  font: 1em/1 arial, sans-serif;

  &::-webkit-slider-runnable-track {
    ${trackFill};
  }

  &::-moz-range-track {
    ${track};
  }

  &::-ms-track {
    ${track};
  }

  &::-moz-range-progress {
    ${fill};
  }

  &::-ms-fill-lower {
    ${fill};
  }

  &::-webkit-slider-thumb {
    margin-top: calc(0.5 * (${trackH} - ${thumbD}));
    ${thumb};
  }

  &::-moz-range-thumb {
    ${thumb};
  }

  &::-ms-thumb {
    margin-top: 0;
    ${thumb};
  }

  &::-ms-tooltip {
    display: none;
  }

  &::-moz-focus-outer {
    border: 0;
  }
`;

function Slider({ dataSource }) {
  // const [value, setValue] = React.useState(50);
  const [state, dispatch] = useContext(DashboardContext);
  // console.log(state[`${dataSource}SampleSize`]);
  const divisor = dataSource === "live" ? 100 : 1000;
  const step = dataSource === "live" ? 5 : 10;
  const max = dataSource === "live" ? 100 : 10;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // console.log(state.liveSampleSize);
  return (
    <RandomSampleSizeContainer>
      <Title>{`Sample Size - ${capitalizeFirstLetter(dataSource)}`}</Title>
      <Input
        onInput={(e) => {
          dispatch({
            type: `${dataSource}SampleSize`,
            payload: e.target.value / divisor,
          });
        }}
        value={state[`${dataSource}SampleSize`] * divisor}
        type="range"
        step={step}
        style={{
          width: "100%",
          "--min": 0,
          "--max": max,
          "--val": state[`${dataSource}SampleSize`] * 100,
        }}
      />
      <div>
        <b>{Math.floor(state[`${dataSource}SampleSize`] * 100)}%</b>
      </div>
    </RandomSampleSizeContainer>
  );
}

export default Slider;
