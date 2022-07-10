import { useContext } from "react";
import styled from "styled-components";
import { Title } from "./styles";
import { DashboardContext } from "../../Context";

const DataSourceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  font-size: 1em;
  border-radius: 3px;
  padding: 1vh 0.4vw;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

const DataSourceButton = styled.button`
  width: 40%;
  font-size: 1em;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  padding: 10px;
  /* background-color: rgb(190, 200, 240); */

  background-color: ${(props) =>
    props.selected ? "rgb(255, 140, 59)" : "rgb(209, 214, 235)"};

  &:hover {
    /* background-color: rgba(255, 255, 255, 0.9); */
    /* opacity: 0.5; */
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
`;

const DataSource = () => {
  const [state, dispatch] = useContext(DashboardContext);

  const liveOn = state.source === "live";
  return (
    <DataSourceContainer>
      <Title>Data Source</Title>
      <ButtonContainer>
        <DataSourceButton
          selected={!liveOn}
          onClick={() => {
            if (liveOn) {
              dispatch({
                type: "multiple",
                payload: {
                  loading: true,
                  source: "reference",
                  randomSampleSize: state.randomSampleSize / 10,
                },
              });
            }
          }}
        >
          Reference
        </DataSourceButton>
        <DataSourceButton
          selected={liveOn}
          onClick={() => {
            if (!liveOn) {
              dispatch({
                type: "multiple",
                payload: {
                  loading: true,
                  source: "live",
                  randomSampleSize: state.randomSampleSize * 10,
                },
              });
            }
          }}
        >
          Live
        </DataSourceButton>
      </ButtonContainer>
    </DataSourceContainer>
  );
};

export default DataSource;
