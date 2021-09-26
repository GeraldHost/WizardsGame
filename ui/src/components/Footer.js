import React from "react";
import styled from "styled-components";

const Text = styled.p`
  font-family: monospace;
  font-size: 12px;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

export function Footer() {
  return <Text>Built by gerald</Text>;
}
