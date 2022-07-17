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
  padding: 0.7vh 0.4vw;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-around;
`;

const DataSourceButton = styled.button`
  width: 90%;
  font-size: 0.9em;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: ${(props) =>
    props.selected
      ? "1.2px solid rgb(90, 114, 205)"
      : "1.2px solid rgb(203, 203, 203)"};
  padding: 10px;

  background-color: ${(props) =>
    props.selected ? "rgb(170,194,245)" : "rgb(203, 203, 203)"};

  color: rgb(30, 30, 30);

  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
`;

const RandomiseButton = styled.button`
  width: 90%;
  font-size: 0.75em;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  margin: 0.7vh 0;
  padding: 5px;

  background-color: ${(props) =>
    props.selected ? "rgb(209, 214, 235)" : "rgb(240, 240, 250)"};

  color: ${(props) => (props.selected ? "rgb(30,30,30)" : "rgb(220,240,255)")};
  pointer-events: ${(props) => (props.selected ? "all" : "none")};
  &:hover {
    box-shadow: ${(props) =>
      props.selected ? "0px 4px 8px 0px rgba(0, 0, 0, 0.2)" : "none"};
  }
`;

const DataSource = () => {
  const [state, dispatch] = useContext(DashboardContext);

  const liveOn = state.source === "live";
  return (
    <DataSourceContainer>
      <Title>Data Source</Title>
      <Container>
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
                  },
                });
              }
            }}
          >
            Reference
          </DataSourceButton>
          <RandomiseButton
            selected={!liveOn}
            onClick={() => {
              if (!liveOn) {
                console.log(state.referenceSampleSize);
                dispatch({
                  type: "randomReferenceDataRefresh",
                });
              }
            }}
          >
            Randomise
          </RandomiseButton>
        </ButtonContainer>
        <ButtonContainer>
          <DataSourceButton
            selected={liveOn}
            onClick={() => {
              if (!liveOn) {
                dispatch({
                  type: "multiple",
                  payload: {
                    loading: true,
                    source: "live",
                  },
                });
              }
            }}
          >
            Live
          </DataSourceButton>
          <RandomiseButton
            selected={liveOn}
            onClick={() => {
              if (liveOn) {
                console.log(state.liveSampleSize);
                dispatch({
                  type: "randomLiveDataRefresh",
                });
              }
            }}
          >
            Randomise
          </RandomiseButton>
        </ButtonContainer>
      </Container>
    </DataSourceContainer>
  );
};

export default DataSource;
