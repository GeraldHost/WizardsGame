import { ethers } from "ethers";
import { commify } from "@ethersproject/units";
import { toK } from "./toK";

export function format(number, decimals = 2) {
  if (String(number).length > 8) return toK(number, true, 2);
  const n = Number(Number(number).toFixed(decimals));
  return commify(n);
}

export function formatDetailed(number, unit = null, decimals = 4) {
  if (number === null || number === undefined) return "NaN";
  const fullNumber = Number(number);
  const fixedNumber = Number(fullNumber.toFixed(decimals));
  const integerPart = Number(fullNumber.toFixed(0));
  const fixedDecimalPart = fixedNumber - integerPart;
  const fullDecimalPart = fullNumber - integerPart;

  let result = fixedNumber;
  // if the decimal part is being rounded to zero then set lowest decimal as 1
  if (fixedDecimalPart == 0 && fullDecimalPart > 0) {
    result += Math.pow(10, -1 * decimals);
  }

  return commify(result) + (unit ? " " + unit : "");
}

export function formatEther(number) {
  return format(ethers.utils.formatEther(number));
}
