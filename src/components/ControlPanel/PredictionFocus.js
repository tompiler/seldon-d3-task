import { useContext } from "react";
import styled from "styled-components";
import { Title } from "./styles";
import { DashboardContext } from "../../Context";
import { labels, labelColours } from "../../fixed";

const PredictionFocusContainer = styled.div`
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
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
`;

const ClusterButton = styled.button`
  width: 45%;
  font-size: 0.9em;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  padding: 8px;
  margin: 3px;
  color: rgb(50, 50, 50);
  background-color: rgb(209, 214, 235);

  border-left: ${(props) =>
    props.selected
      ? `12px solid ${props.color}`
      : `12px solid rgb(209, 214, 235)`};

  border-right: 12px solid rgb(209, 214, 235);

  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
`;

const PredictionFocus = () => {
  const [state, dispatch] = useContext(DashboardContext);

  const selectCluster = (label) => {
    dispatch({
      type: "selectedCluster",
      payload: state.selectedCluster === label ? null : label,
    });
  };

  return (
    <PredictionFocusContainer>
      <Title>Cluster Filter</Title>
      <ButtonContainer>
        {labels.map((label) => {
          const cleanedLabel = label.replace("-", "_").replace(" ", "_");
          return (
            <ClusterButton
              key={label}
              selected={state.selectedCluster === cleanedLabel}
              color={labelColours[cleanedLabel]}
              onClick={() => selectCluster(cleanedLabel)}
            >
              {label}
            </ClusterButton>
          );
        })}
      </ButtonContainer>
    </PredictionFocusContainer>
  );
};

export default PredictionFocus;
