import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Header from "./components/Header";
import Card from "./components/Card";
import GetStartedCard from "./components/GetStartedCard";
import Controls from "./components/Controls";
import ToastManager from "./components/ToastManager";
import Nav from "./components/Nav";
import styled from "styled-components";
import Windows from "./components/Windows";
import { WindowsProvider } from "./providers";
import useEagerConnect from "./hooks/useEagerConnect";
import useInactiveListener from "./hooks/useInactiveListener";
import { useChainIdUpdater } from "./hooks/useChainId";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
`;

function getLibrary(provider) {
  return new Web3Provider(provider);
}

function ConnectWeb3({ children }) {
  useEagerConnect();
  useInactiveListener();
  useChainIdUpdater();

  return children;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="app">
        <ToastManager />
        <ConnectWeb3>
          <WindowsProvider>
            <Windows />
            <Header />
            <Wrapper>
              <Nav />
              <Card imageSrc="/tmp1.png" />
              <Controls />
              <GetStartedCard />
            </Wrapper>
          </WindowsProvider>
        </ConnectWeb3>
      </div>
    </Web3ReactProvider>
  );
}

export default App;
