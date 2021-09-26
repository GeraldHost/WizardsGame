import styled, { css } from "styled-components";

export default styled.button`
  apperance: none;  
  background-color: white;
  border-radius: 0;
  border: 1px solid black;
  padding: 5px;
  box-shadow: -2px 2px 0 0 black;
  cursor: pointer;
  position: relative;
  font-family: "Roboto Mono", monospace;

  &:active {
    box-shadow -1px 1px 0 0 black;
    top: 1px;
    left: -1px;
  }

  ${(props) =>
    props.active &&
    css`
      background-color: #bdbdbd !important;
    `}
`;
