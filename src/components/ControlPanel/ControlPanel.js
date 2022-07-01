import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { timeParse, timeFormat } from "d3-time-format";

const ScatterContainer = styled("div")`
  width: 100%;
  height: 70%;
  border: 1px dashed blue;
`;

const DateRangeButton = styled.button`
  display: inline-block;
  position: relative;
  font-size: 1em;
  font-weight: 400;
  font-family: "Arial";
  text-align: right;
  background-color: #405df6;
  color: black;
  cursor: pointer;
  transition: 0.3s;
  border: none;
  border-bottom: 1.7px solid transparent;

  &:hover {
    background-color: #00ded0;
    outline: none;
  }
`;

const ControlPanel = ({ selection, setSelection }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const parseTime = timeParse("%Y-%m-%d %H:%M");
  const formatTime = timeFormat("%Y-%m-%d %H:%M");
  useEffect(() => {
    // console.log("does this run?");
    setStartDate(() => "2021-09-03 00:00");
    setEndDate(() => "2021-09-03 06:00");
    setSelection(() => [
      parseTime("2021-09-03 00:00"),
      parseTime("2021-09-03 06:00"),
    ]);
  }, []);

  if (selection[0] === undefined) {
    return;
  }
  console.log("startDate:", startDate, "endDate:", endDate, selection);
  const handleClick = () => {
    // console.log()
    const formatStartDate = parseTime(startDate);
    const formatEndDate = parseTime(endDate);
    console.log(formatStartDate, formatEndDate);
    setSelection(() => [formatStartDate, formatEndDate]);
  };
  return (
    <div>
      <form>
        <label>
          Start timestamp:
          <input
            type="text"
            defaultValue={startDate}
            // placeholder="yyyy-mm-dd HH:MM"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      </form>
      <form>
        <label>
          End timestamp:
          <input
            type="text"
            value={endDate}
            // defaultValue={endDate}
            // placeholder="yyyy-mm-dd HH:MM"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </form>
      <DateRangeButton onClick={handleClick}>Apply date range</DateRangeButton>
      <div>{formatTime(selection[0])}</div>
      <div>{formatTime(selection[1])}</div>
    </div>
  );
};

export default ControlPanel;
