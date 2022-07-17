import styled from "styled-components";

export const Title = styled.div`
  margin: 1.2vh 0 1vh 0;
  font-weight: 600;
  font-size: 1em;
`;

export const Input = styled.input`
  width: 95%;
  height: 80%;
  flex: 1;
  position: relative;
  border: none;
  border-radius: 4px;
  font-family: "Gotham SSm A", "Gotham SSm B", sans-serif;
  font-size: 0.8em;
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

export const Field = styled.div`
  flex: 1;
  width: 95%;
  height: 20%;
  margin: 0.5vh 0;
  padding: 1vh 0;
  border-radius: 4px;
  position: relative;
  background-color: white;
  transition: 0.3s all;

  &:hover {
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
  }
`;

export const FieldTitle = styled.div`
  font-size: 0.8em;
`;
