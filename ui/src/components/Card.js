import styled from "styled-components";
import { usePalette } from "react-palette";

import Button from "./Button";

const Wrapper = styled.div`
  border: 2px solid black;
  background-color: white;
  padding: 8px;
  box-sizing: border-box;
  width: 280px;
  height: 410px;
  box-shadow: -5px 5px 0 0px black;
`;

const InnerWrapper = styled.div`
  background-color: black;
  padding: 3px;
  box-sizing: border-box;
`;

const Body = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 8px;
  box-sizing: box-sizing;
  background: ${(props) => props.bg};
`;

const Image = styled.img`
  width: 100%;
`;

const Title = styled.p`
  font-family: alagard, sans-serif;
  background-color: black;
  color: white;
  font-size: 16px;
  padding: 2px 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Content = styled.div`
  color: white;
`;

export default function Card({ imageSrc }) {
  const { data } = usePalette(imageSrc);

  console.log({ data });

  return (
    <Wrapper>
      <InnerWrapper>
        <Body bg={data.darkMuted}>
          <Image src={imageSrc} />
          <Title>Oracle Oberon of the Expanse</Title>
          <Content>
            <p>Level: 12</p>
            <p>XP: 1,000</p>
            <p>Battles: 13</p>
          </Content>
          <Button>Upgrade to level 2 (10 GLD)</Button>
        </Body>
      </InnerWrapper>
    </Wrapper>
  );
}
