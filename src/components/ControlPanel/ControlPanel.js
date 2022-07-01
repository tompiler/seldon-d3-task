import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { timeParse, timeFormat } from "d3-time-format";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 1vw 1vh;
`;

const ObservationTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  font-size: 1.2em;
  font-family: "Helvetica";
  background-color: rgb(240, 240, 240);
  border-radius: 10px;
  border: 2px solid rgb(140, 140, 140);
  padding: 1vh 0.4vw;
`;

const Title = styled.div`
  margin: 1vh 0 2vh 0;
  border-bottom: 1px solid rgb(10, 10, 10);
`;

const DateRangeButton = styled.button`
  display: inline-block;
  width: 60%;
  height: 100%;
  margin: 1vh 0 0 0;
  font-size: 1.2em;
  font-weight: 400;
  font-family: "Arial";
  text-align: center;
  background-color: #405df6;
  color: black;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  padding: 10px;
  background-color: rgba(200, 200, 200, 0.4);
  transition: 0.3s all;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
  }
`;

const Input = styled.input`
  width: 80%;
  height: 80%;
  flex: 1;
  position: relative;
  border: none;
  border-radius: 4px;
  font-family: "Gotham SSm A", "Gotham SSm B", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  background-color: transparent;
  color: #282828;
  outline: none;
  box-shadow: 0px 4px 20px 0px transparent;
  transition: 0.3s background-color ease-in-out, 0.3s box-shadow ease-in-out,
    0.1s padding ease-in-out;
  -webkit-appearance: none;
`;

const Field = styled.div`
  flex: 1;
  width: 80%;
  height: 20%;
  margin: 1vh 0;
  padding: 1vh 0;
  border-radius: 4px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.4);
  transition: 0.3s all;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
  }
`;

const FieldTitle = styled.div`
  font-size: 14px;
`;

const ControlPanel = ({ selection, setSelection }) => {
  const parseTime = timeParse("%Y-%m-%d %H:%M");
  const formatTime = timeFormat("%Y-%m-%d %H:%M");

  const [startDate, setStartDate] = useState(formatTime(selection[0]));
  const [endDate, setEndDate] = useState(formatTime(selection[1]));

  const [startEdit, setStartEdit] = useState(false);
  const [endEdit, setEndEdit] = useState(false);

  if (selection[0] === undefined) {
    return;
  }

  const handleClick = () => {
    const formatStartDate = parseTime(startDate);
    const formatEndDate = parseTime(endDate);
    setStartEdit(false);
    setEndEdit(false);
    setSelection(() => [formatStartDate, formatEndDate]);
  };

  const startValue = startEdit ? startDate : formatTime(selection[0]);
  const endValue = endEdit ? endDate : formatTime(selection[1]);

  return (
    <Container>
      <ObservationTime>
        <Title>Observation Time</Title>
        <FieldTitle>Start Timestamp:</FieldTitle>
        <Field>
          <Input
            onFocus={() => {
              console.log("Focus: true");
              setStartEdit(true);
              setStartDate(formatTime(selection[0]));
            }}
            type="text"
            value={startValue}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Field>
        <FieldTitle>End timestamp:</FieldTitle>
        <Field>
          <Input
            onFocus={() => {
              setEndEdit(true);
              setEndDate(formatTime(selection[1]));
            }}
            type="text"
            value={endValue}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Field>
        <DateRangeButton onClick={handleClick}>Apply</DateRangeButton>
      </ObservationTime>
    </Container>
  );
};

export default ControlPanel;
