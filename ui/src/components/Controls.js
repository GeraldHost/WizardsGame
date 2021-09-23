import styled from "styled-components";

import Button from "./Button";

import Fire from "../images/fire.svg";
import Earth from "../images/earth.svg";
import Wind from "../images/wind.svg";
import Submit from "../images/submit.svg";

const Wrapper = styled.div`
  margin: 0 40px;
  display: flex;
  flex-direction: column;

  ${Button} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 6px;
    margin: 8px 0;

    img {
      margin-bottom: 4px;
    }
  }
`;

export default function Controls() {
  return (
    <Wrapper>
      <Button>
        <img src={Fire} />
        Fire
      </Button>
      <Button>
        <img src={Earth} />
        Earth
      </Button>
      <Button>
        <img src={Wind} />
        Wind
      </Button>
      <Button>
        <img src={Submit} />
        Submit
      </Button>
    </Wrapper>
  );
}
