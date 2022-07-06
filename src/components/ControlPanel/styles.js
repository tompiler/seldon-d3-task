import styled from "styled-components";

export const Title = styled.div`
  margin: 2vh 0 1vh 0;
  border-bottom: 1px solid rgb(10, 10, 10);
  font-size: 1.1em;
`;

export const Input = styled.input`
  width: 80%;
  height: 80%;
  flex: 1;
  position: relative;
  border: none;
  border-radius: 4px;
  font-family: "Gotham SSm A", "Gotham SSm B", sans-serif;
  font-size: 14px;
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
  width: 80%;
  height: 20%;
  margin: 1vh 0;
  padding: 1vh 0;
  border-radius: 4px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.4);
  transition: 0.3s all;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
  }
`;

export const FieldTitle = styled.div`
  font-size: 14px;
`;
