import { useContext } from "react";
import styled from "styled-components";
import { timeFormat } from "d3-time-format";
import { DashboardContext } from "../../Context";
import { capitalizeFirstLetter } from "../../util";

const TooltipContainer = styled("div")`
  display: flex;
  position: absolute;
  top: ${(props) => (props.row ? `${props.row.pageY}px` : "0")};
  left: ${(props) => (props.row ? `${props.row.pageX}px` : "0")};
  border-radius: 5px;
  border: 1px solid rgb(60, 60, 60);
  background-color: rgb(253, 253, 253);
`;

const Content = styled("div")`
  display: flex;
  flex-direction: column;
`;

const Row = styled("div")`
  display: flex;
  flex-direction: row;
  font-size: 0.8em;
  width: 14vw;
  text-align: left;
  padding: 5px;
`;

const ColumnCell = styled("div")`
  font-weight: 600;
  width: 5vw;
`;

const ValueCell = styled("div")`
  width: 7vw;
`;

const Tooltip = ({ row }) => {
  const formatTime = timeFormat("%b %d %Y %H:%M");
  const [state] = useContext(DashboardContext);
  const predictionOrLabel = state.source === "live" ? "prediction" : "label";
  return (
    <TooltipContainer row={row}>
      <Content>
        {state.source === "live" && (
          <Row>
            <ColumnCell>Date:</ColumnCell>
            <ValueCell>{formatTime(row.timestamp)}</ValueCell>
          </Row>
        )}
        <Row>
          <ColumnCell>{`${capitalizeFirstLetter(
            predictionOrLabel
          )}: `}</ColumnCell>
          <ValueCell>{row[predictionOrLabel]}</ValueCell>
        </Row>
      </Content>
    </TooltipContainer>
  );
};

export default Tooltip;
