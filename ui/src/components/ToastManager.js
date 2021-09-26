import styled, { css } from "styled-components";
import { toastState } from "../hooks/useToast";

const Wrapper = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 99999;
`;

const Notification = styled.p`
  display: block;
  width: 240px;
  padding: 8px 8px 8px 40px;
  box-sizing: border-box;
  border: 1px solid black;
  font-family: monospace;
  font-size: 12px;
  color: black;
  background: white;
  position: relative;

  &:before {
    content: "";
    border-radius: 100%;
    display: block;
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 8px;
    transform: translateY(-50%);

    ${(props) =>
      props.type === "pending"
        ? css`
            background-color: blue;
          `
        : props.type === "error"
        ? css`
            background-color: red;
          `
        : props.type === "success"
        ? css`
            background-color: green;
          `
        : css`
            background-color: black;
          `}
  }
`;

export default function ToastManager() {
  const toasts = toastState.useValue();

  return (
    <Wrapper>
      {toasts.map(({ body, type }) => (
        <Notification type={type}>{body}</Notification>
      ))}
    </Wrapper>
  );
}
