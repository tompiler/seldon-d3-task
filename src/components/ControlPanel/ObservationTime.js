import styled from "styled-components";
import { Title, Input, FieldTitle, Field } from "./styles";
import { timeFormat } from "d3-time-format";

const ObservationTimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 80%;
  font-size: 1em;
  border-radius: 3px;
  padding: 1vh 0.4vw;
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  font-size: 1em;
  border-radius: 3px;
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
    <>
      <Title>Observation Time</Title>
      <ObservationTimeContainer>
        <DateContainer>
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
        </DateContainer>
        <DateContainer>
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
        </DateContainer>
      </ObservationTimeContainer>
    </>
  );
};

export default ObservationTime;
