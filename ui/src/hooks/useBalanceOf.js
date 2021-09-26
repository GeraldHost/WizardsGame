import useSWR from "swr";
import { useWeb3React } from "@web3-react/core";

import { useToken } from "./useToken";
import { useConfig } from "./useConfig";

const balanceOf = async (_, contract, address) => {
  const resp = await contract.balanceOf(address);
  return resp.toString();
};

export default function useBalanceOf(tokenAddress) {
  const { account } = useWeb3React();
  const contract = useToken(tokenAddress);

  const shouldFetch = !!contract && !!account && !!tokenAddress;

  return useSWR(
    shouldFetch ? [`balance-of-${tokenAddress}`, contract, account] : null,
    balanceOf
  );
}
