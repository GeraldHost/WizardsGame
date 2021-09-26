import { useWeb3React } from "@web3-react/core";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { RPC_URLS } from "../connectors";

export function useReadProvider() {
  const { chainId, library } = useWeb3React();
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (chainId && library) {
      if ([137, 80001].includes(chainId)) {
        setProvider(new JsonRpcProvider(RPC_URLS[chainId]));
      } else {
        setProvider(library.getSigner().provider);
      }
    }
  }, [chainId, library]);

  return provider;
}
