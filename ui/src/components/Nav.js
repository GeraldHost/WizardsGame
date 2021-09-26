import styled from "styled-components";

import { useWindows } from "../providers";
import Button from "./Button";

const Label = styled.label`
  display: none;
  position: absolute;
  left: calc(100% + 10px);
  top: 0;
  background-color: black;
  color: white;
  border: grey 1px solid;
  padding: 5px 10px;
  font-family: monospace;
`;

const Wrapper = styled.div`
  position: fixed;
  left: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  z-index: 1;

  ${Button} {
    margin: 10px 10px 0 10px;
  }

  ${Button}:hover ${Label} {
    display: block;
  }
`;

export default function Nav({ onNavClick }) {
  const { openWindow, windows } = useWindows();

  const handleClick = (id) => () => {
    openWindow(id);
  };

  return (
    <Wrapper>
      {Object.keys(windows).map((id) => (
        <Button onClick={handleClick(id)}>
          {id}
          <Label>{windows[id].title}</Label>
        </Button>
      ))}
    </Wrapper>
  );
}
