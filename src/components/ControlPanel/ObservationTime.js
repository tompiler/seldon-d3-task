import styled from "styled-components";
import { Title, Input, FieldTitle, Field } from "./styles";
import { timeFormat } from "d3-time-format";

const ObservationTimeContainer = styled.div`
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

const ObservationTime = ({
  startValue,
  setStartDate,
  setStartEdit,
  setEndEdit,
  endValue,
  setEndDate,
  dateRange,
}) => {
  const formatTime = timeFormat("%Y-%m-%d %H:%M");

  return (
    <ObservationTimeContainer>
      <Title>Observation Time</Title>
      <FieldTitle>Start Timestamp:</FieldTitle>
      <Field>
        <Input
          onFocus={() => {
            setStartEdit(true);
            setStartDate(() => formatTime(dateRange[0]));
          }}
          type="text"
          value={startValue}
          onChange={(e) => setStartDate(() => e.target.value)}
        />
      </Field>
      <FieldTitle>End timestamp:</FieldTitle>
      <Field>
        <Input
          onFocus={() => {
            setEndEdit(true);
            setEndDate(() => formatTime(dateRange[1]));
          }}
          type="text"
          value={endValue}
          onChange={(e) => setEndDate(() => e.target.value)}
        />
      </Field>
    </ObservationTimeContainer>
  );
};

export default ObservationTime;
