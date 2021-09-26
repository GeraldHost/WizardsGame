import styled, { css } from "styled-components";

import Button from "./Button";

import Fire from "../images/fire.svg";
import Earth from "../images/earth.svg";
import Wind from "../images/wind.svg";
import Submit from "../images/submit.svg";
import { useState } from "react";

const Wrapper = styled.div`
  margin: 0 40px;
  display: flex;
  flex-direction: column;

  ${Button} {
    margin: 4px 0;
  }
`;

const Row = styled.div`
  display: flex;

  ${Button} {
    width: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px 6px;
    margin: 8px 2px;
    font-size: 11px;

    img {
      width: 15px;
      vertical-align: middle;
    }
  }
`;

export default function Controls() {
  const [selected, setSelected] = useState([]);

  const handleSelect = (i, x) => () => {
    const copy = [...selected];
    copy[i] = x;
    setSelected(copy);
  };

  const handleCommit = () => {
    alert(selected.toString());
  };

  return (
    <Wrapper>
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Row>
            <Button active={selected[i] === 1} onClick={handleSelect(i, 1)}>
              <img src={Fire} />
              Fire
            </Button>
            <Button active={selected[i] === 2} onClick={handleSelect(i, 2)}>
              <img src={Earth} />
              Earth
            </Button>
            <Button active={selected[i] === 3} onClick={handleSelect(i, 3)}>
              <img src={Wind} />
              Wind
            </Button>
          </Row>
        ))}

      <Button
        style={{ marginTop: "20px" }}
        disabled={selected.reduce((x, y) => x + y, 0) < 3}
        onClick={handleCommit}
      >
        1. Commit
      </Button>

      <Button
        disabled={true}
        onClick={() => alert()}
      >
        2. Reveal
      </Button>

      <Button
        disabled={true}
        onClick={() => alert()}
      >
        3. Settle
      </Button>
    </Wrapper>
  );
}
