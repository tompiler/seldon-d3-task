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
  font-size: 1em;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  padding: 10px;

  background-color: ${(props) =>
    props.selected ? "rgb(255, 140, 59)" : "rgb(209, 214, 235)"};

  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
`;

const RandomiseButton = styled.button`
  width: 90%;
  font-size: 0.8em;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  margin: 0.7vh 0;
  padding: 5px;

  background-color: ${(props) =>
    props.selected ? "rgb(255, 140, 59)" : "rgb(209, 214, 235)"};

  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
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
