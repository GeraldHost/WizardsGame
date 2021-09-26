import { useWeb3React } from "@web3-react/core";

import { useLegends } from "../useLegends";
import { handleTx } from "../../util";
import { useMyCreature } from "../useMyCreature";

export function useCommit() {
  const { library } = useWeb3React();
  const legends = useLegends();
  const [creature] = useMyCreature();

  return (a, b, c, inputs) =>
    handleTx(library, () => legends.commit(creature.tokenId, a, b, c, inputs));
}
