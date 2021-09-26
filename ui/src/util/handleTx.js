import { getReceipt } from "./getReceipt";
import { handleTxError } from "./handleTxError";
import { addToast, FLAVORS } from "../hooks/useToast";

export async function handleTx(library, callback, onComplete) {
  try {
    const { hash } = await callback();
    const { hide: hidePending } = addToast(FLAVORS.TX_PENDING(hash));
    await getReceipt(hash, library);

    if (typeof onComplete === "function") {
      onComplete();
    }

    hidePending();
    addToast(FLAVORS.TX_SUCCESS(hash));
  } catch (error) {
    console.log(error);
    handleTxError(error);
  }
}
