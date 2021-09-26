import { useChainId } from "./useChainId";
import { config } from "../config";

export default function useConfig() {
  const chainId = useChainId();
  return config[chainId] || config.default;
}
