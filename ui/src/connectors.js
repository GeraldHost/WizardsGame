import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

export const injected = new InjectedConnector({
  supportedChainIds: [4, 137, 80001],
});

export const RPC_URLS = {
  4: "https://rinkeby.infura.io/v3/351f0b09944348e1bbf8f2d844d27a06",
  137: "https://rpc-mainnet.matic.network",
  80001: "https://rpc-mumbai.matic.today",
};

export const network = new NetworkConnector({
  urls: {
    4: RPC_URLS[4],
    137: RPC_URLS[137],
    80001: RPC_URLS[80001],
  },
  defaultChainId: 137,
});

export const CONNECTORS = {
  Injected: injected,
};

export const SUPPORTED_WALLETS = {
  MetaMask: {
    connector: injected,
    name: "MetaMask",
  },
};
