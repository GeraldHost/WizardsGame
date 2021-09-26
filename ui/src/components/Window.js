import Draggable from "react-draggable";
import styled from "styled-components";

import Button from "./Button";
import { useWindows } from "../providers";

const Wrapper = styled.div`
  width: 280px;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 8px 8px 0 0 black;
  user-select: none;
  background-color: white;
  border: 2px solid black;
  z-index: 1;
  padding: 0 8px;
`;

const Header = styled.div`
  padding: 8px 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Window({ large, children, id, title, onClose }) {
  const { closeWindow } = useWindows();

  const handleClose = () => {
    closeWindow(id);
    if (typeof onClose === "function") {
      onClose(id);
    }
  };

  return (
    <Draggable handle=".handle" defaultPosition={{ x: 100, y: 100 }} scale={1}>
      <div>
        <Wrapper large={large}>
          <Header className="handle">
            <h3>{title}</h3> <Button onClick={handleClose}>X</Button>
          </Header>
          {children}
        </Wrapper>
      </div>
    </Draggable>
  );
}
