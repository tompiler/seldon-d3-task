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

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  background-color: rgb(225, 235, 255);
  border-radius: 3px;
  padding: 1vh 0.4vw;
`;

const ObservationTime = styled.div`
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

const Title = styled.div`
  margin: 2vh 0 1vh 0;
  border-bottom: 1px solid rgb(10, 10, 10);
  font-size: 1.1em;
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

const ControlPanel = ({
  selection,
  setSelection,
  sampleSize,
  setSampleSize,
  resample,
  source,
  setSource,
  setUnappliedChanges,
}) => {
  const parseTime = timeParse("%Y-%m-%d %H:%M");
  const formatTime = timeFormat("%Y-%m-%d %H:%M");

  const [startDate, setStartDate] = useState(formatTime(selection[0]));
  const [endDate, setEndDate] = useState(formatTime(selection[1]));

  const [startEdit, setStartEdit] = useState(false);
  const [endEdit, setEndEdit] = useState(false);

  useEffect(() => {
    setStartDate(() => "2021-09-03 00:00");
    setEndDate(() => "2021-09-03 08:00");
    setSelection(() => [
      parseTime("2021-09-03 00:00"),
      parseTime("2021-09-03 08:00"),
    ]);
  }, []);

  if (selection[0] === undefined) {
    return;
  }

  const applyControls = () => {
    const formatStartDate = parseTime(startDate);
    const formatEndDate = parseTime(endDate);
    setStartEdit(false);
    setEndEdit(false);
    setUnappliedChanges(false);
    resample();
    // Don't apply the date range in the control
    // panel if the inputs have not been edited
    console.log("this did work... right?");
    if (startEdit !== endEdit && startEdit) {
      console.log(" && startEdit");
      setSelection(() => [formatStartDate, selection[1]]);
    } else if (startEdit !== endEdit && endEdit) {
      console.log(" && endEdit");
      setSelection(() => [selection[0], formatEndDate]);
    } else if (!startEdit && !endEdit) {
      console.log("joni is the cutest");
      setSelection(() => [selection[0], selection[1]]);
    } else {
      setSelection(() => [formatStartDate, formatEndDate]);
    }
  };

  const startValue = startEdit ? startDate : formatTime(selection[0]);
  const endValue = endEdit ? endDate : formatTime(selection[1]);

  return (
    <Container>
      <OptionContainer>
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
        </ObservationTime>
        <SampleSize>
          <Title>Sample Size</Title>
          <Field>
            <Input
              type="text"
              value={sampleSize}
              onChange={(e) => setSampleSize(e.target.value)}
            />
            %
          </Field>
        </SampleSize>

        <Title>Data Source</Title>
        <DataSource>
          <DataSourceButton
            selected={source === "reference"}
            onClick={() => {
              setUnappliedChanges(true);
              setSource("reference");
            }}
          >
            Reference
          </DataSourceButton>
          <DataSourceButton
            selected={source === "live"}
            onClick={() => {
              setUnappliedChanges(true);
              setSource("live");
            }}
          >
            Live
          </DataSourceButton>
        </DataSource>
        <ApplyButton onClick={applyControls}>Apply</ApplyButton>
      </OptionContainer>
    </Container>
  );
};

export default ControlPanel;
