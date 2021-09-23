import Header from "./components/Header";
import Card from "./components/Card";
import Controls from "./components/Controls";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
`;

function App() {
  return (
    <div className="app">
      <Header />
      <Wrapper>
        <Card imageSrc="/tmp1.png" />
        <Controls />
        <Card imageSrc="/tmp2.png" />
      </Wrapper>
    </div>
  );
}

export default App;
