import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Content = styled.div`
  text-align: center;
  max-width: 600px;
`;

export default function Header() {
  return (
    <Wrapper>
      <h1>Wizard Arena</h1>
      <Content>
        <p>
          The Wizard's Cult is a collaborative legendarium. There are 10,000
          unique Wizard NFTs. The NFT holder is considered the Wizard owner and
          they hold not only the image, but the character of that Wizard.
        </p>
      </Content>
    </Wrapper>
  );
}
