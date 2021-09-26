import ABI from "../abis/erc20.json";
import { useContract } from "./useContract";

export default function useToken(address) {
  return useContract(address, ABI);
}
