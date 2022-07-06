import React, { useState, useEffect, useReducer, useContext } from "react";
import styled from "styled-components";
import { timeParse, timeFormat } from "d3-time-format";
import { DashboardContext } from "../../Context";
import ObservationTime from "./ObservationTime";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 1vw 1vh;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  background-color: rgb(225, 235, 255);
  border-radius: 3px;
  padding: 1vh 0.4vw;
`;

const SampleSize = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  font-size: 1em;
  font-family: "Helvetica";
  background-color: rgb(225, 235, 255);
  border-radius: 3px;
  padding: 1vh 0.4vw;
`;

const DataSource = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 80%;
  font-size: 1em;
  font-family: "Helvetica";
  background-color: rgb(225, 235, 255);
  border-radius: 3px;
  padding: 1vh 0 0 0;
`;

const ApplyButton = styled.button`
  display: inline-block;
  width: 60%;
  height: 100%;
  margin: 3vh 0 0 0;
  font-size: 1.2em;
  font-weight: 400;
  font-family: Helvetica;
  text-align: center;
  background-color: #405df6;
  color: black;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  padding: 10px;
  background-color: rgb(190, 200, 240);
  transition: 0.3s all;
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
  }
`;

const DataSourceButton = styled.button`
  display: inline-block;
  height: 100%;
  font-size: 1em;
  font-weight: 400;
  font-family: Helvetica;
  text-align: center;
  background-color: #405df6;
  color: black;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  padding: 10px;
  /* background-color: rgb(190, 200, 240); */
  transition: 0.3s all;

  background-color: ${(props) =>
    props.selected ? "palevioletred" : "rgb(190, 200, 240)"};

  &:hover {
    /* background-color: rgba(255, 255, 255, 0.9); */
    /* opacity: 0.5; */
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
`;

const ControlPanel = () => {
  const parseTime = timeParse("%Y-%m-%d %H:%M");
  const formatTime = timeFormat("%Y-%m-%d %H:%M");

  const [state, dispatch] = useContext(DashboardContext);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [startEdit, setStartEdit] = useState(false);
  const [endEdit, setEndEdit] = useState(false);

  useEffect(() => {
    // dispatch({
    //   type: "dateRange",
    //   payload: [parseTime("2021-09-03 00:00"), parseTime("2021-09-03 08:00")],
    // });
    setStartDate(() => "2021-09-03 00:00");
    setEndDate(() => "2021-09-03 08:00");
  }, []);

  if (state.dateRange === undefined) {
    return;
  }

  const startValue =
    startDate === formatTime(state.dateRange[0]) || startEdit
      ? startDate
      : formatTime(state.dateRange[0]);
  const endValue =
    endDate === formatTime(state.dateRange[1]) || endEdit
      ? endDate
      : formatTime(state.dateRange[1]);

  const applyControls = () => {
    dispatch({
      type: "dateRange",
      payload: [startValue, endValue].map(parseTime),
    });
    // const formatStartDate = parseTime(startDate);
    // const formatEndDate = parseTime(endDate);
    // setStartEdit(false);
    // setEndEdit(false);
    // setUnappliedChanges(false);
    // resample();
    // Don't apply the date range in the control
    // panel if the inputs have not been edited
    // console.log("this did work... right?");
    // if (startEdit !== endEdit && startEdit) {
    //   console.log(" && startEdit");
    //   setSelection(() => [formatStartDate, selection[1]]);
    // } else if (startEdit !== endEdit && endEdit) {
    //   console.log(" && endEdit");
    //   setSelection(() => [selection[0], formatEndDate]);
    // } else if (!startEdit && !endEdit) {
    //   console.log("joni is the cutest");
    //   setSelection(() => [selection[0], selection[1]]);
    // } else {
    //   setSelection(() => [formatStartDate, formatEndDate]);
    // }
  };

  return (
    <Container>
      <OptionContainer>
        <ObservationTime
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setStartEdit={setStartEdit}
          setEndEdit={setEndEdit}
          startValue={startValue}
          endValue={endValue}
          dateRange={state.dateRange}
        />
        <ApplyButton onClick={applyControls}>Apply</ApplyButton>
      </OptionContainer>
    </Container>
  );
};

export default ControlPanel;
