import styled from "styled-components";

const Wrapper = styled.div`
  border: 2px solid black;
  background-color: white;
  padding: 8px;
  box-sizing: border-box;
  width: 280px;
  height: 410px;
  box-shadow: -5px 5px 0 0px black;
  display: flex;
  flex-direction: column;
`;

const InnerWrapper = styled.div`
  background-color: black;
  padding: 3px;
  box-sizing: border-box;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 18px;
  box-sizing: box-sizing;
  flex: 1 1 0;
  align-items: center;
  justify-content: center;
  color: white;

  h1 {
    text-align: center;
    margin-bottom: 12px;
  }

  p {
    margin-bottom: 12px;
  }
`;

export default function GetStartedCard() {
  return (
    <Wrapper>
      <InnerWrapper>
        <Body>
          <h1>Get Started</h1>
          <p>
            Wizard arena is a PVP play to earn game that runs full on chain.
          </p>
          <p>
            Select the order you wish to use your attacks; "fire", "earth" and
            "wind"
          </p>
          <p>
            Once you submit your attacks you will be matched with your opponent.
          </p>
          <p>
            Once both players have committed their attacks you will be able to
            reveal and settle the round claiming their winnings.
          </p>
        </Body>
      </InnerWrapper>
    </Wrapper>
  );
}
