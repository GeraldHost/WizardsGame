import useSWR from "swr";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { handleTx } from "../../util";
import { useConfig } from "../useConfig";
import { useContract } from "../useContract";
import ABI from "../../abis/erc20.json";

const getAllowance = (_, erc20, account, address) => {
  return erc20.allowance(account, address);
};

export function useApproval(address) {
  const { account, library } = useWeb3React();
  const erc20 = useContract(address, ABI);
  const config = useConfig();

  const shouldFetch = !!erc20 && !!account && !!config?.creatures;

  const { data, mutate } = useSWR(
    shouldFetch ? ["allowance", erc20, account, config?.creatures] : null,
    getAllowance
  );

  const approve = async () => {
    await handleTx(library, () =>
      erc20.approve(config?.creatures, ethers.constants.MaxInt256)
    );
    await mutate();
  };

  return { approve, isApproved: data?.gt("0") };
}
