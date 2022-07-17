import { useContext } from "react";
import styled from "styled-components";
import { Title } from "./styles";
import { DashboardContext } from "../../Context";

const ResetContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 80%;
  font-size: 1em;
  border-radius: 3px;
  padding: 1vh 0.4vw;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const ResetButton = styled.button`
  width: 60%;
  font-size: 0.8em;
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 4px;
  border: none;
  margin: 0.3vh 0;
  padding: 5px;

  background-color: rgb(170, 194, 245);

  &:hover {
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
`;

const Reset = () => {
  const [state, dispatch] = useContext(DashboardContext);

  const liveOn = state.source === "live";
  return (
    <ResetContainer>
      <ButtonContainer>
        <ResetButton
          onClick={() => {
            dispatch({
              type: "zoomReset",
            });
          }}
        >
          Reset zoom
        </ResetButton>
      </ButtonContainer>
    </ResetContainer>
  );
};

export default Reset;
