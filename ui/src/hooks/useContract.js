import { useMemo } from "react";
import { isAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";

export default function useContract(address, ABI) {
  const { library, account } = useWeb3React();

  return useMemo(
    () =>
      isAddress(address) && !!ABI && !!library
        ? new Contract(
            address,
            ABI,
            account ? library.getSigner(account) : library
          )
        : null,
    [address, ABI, library, account]
  );
}
