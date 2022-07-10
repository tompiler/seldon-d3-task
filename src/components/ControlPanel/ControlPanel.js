import React, { useState, useEffect, useReducer, useContext } from "react";
import styled from "styled-components";
import { timeParse, timeFormat } from "d3-time-format";
import { DashboardContext } from "../../Context";
import ObservationTime from "./ObservationTime";
import DataSource from "./DataSource";
import RandomSampleSize from "./RandomSampleSize";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 1vh 1vw;
`;

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  font-family: Open Sans;
  color: rgb(50, 50, 50);
  background-color: rgb(240, 242, 245);
  border-radius: 3px;
  padding: 0.5vh 0.4vw;
`;

const ApplyButton = styled.button`
  display: inline-block;
  width: 60%;
  height: 100%;
  margin: 0vh 0 1vh 0;
  font-size: 1em;
  font-weight: 400;

  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  padding: 0.5em;
  background-color: rgb(255, 140, 59);
  transition: 0.2s all;

  &:hover {
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
        <DataSource />
        <RandomSampleSize dataSource={"live"} />
        <RandomSampleSize dataSource={"reference"} />
      </OptionContainer>
    </Container>
  );
};

export default ControlPanel;
