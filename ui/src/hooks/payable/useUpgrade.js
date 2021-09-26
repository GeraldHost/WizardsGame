import { useWeb3React } from "@web3-react/core";

import { useCreatures } from "../useCreatures";
import { handleTx } from "../../util";
import { useMyCreatures } from "../useMyCreatures";

export function useUpgrade() {
  const { library } = useWeb3React();
  const creatures = useCreatures();
  const { mutate: updateMyCreatures } = useMyCreatures();

  return (tokenId, creatureLevel) =>
    handleTx(
      library,
      () => creatures.upgrade(tokenId, creatureLevel),
      updateMyCreatures
    );
}
