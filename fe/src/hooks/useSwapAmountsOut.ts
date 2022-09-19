import { ethers, BigNumber, Contract } from "ethers";
import { useCall } from "@usedapp/core";

/**
 * Returns a balance of a given token for a given address.
 * @param tokenAddress address of a token contract.
 * @param abi abi of token contract.
 * @param amountIn amount of token contract want to swap.
 * @public
 * @returns a balance which is `BigNumber`, or `undefined` if address or token is `Falsy` or not connected.
 */

export function useSwapAmountsOut(
  routerAddress: string | undefined,
  abi: ethers.utils.Interface,
  amountIn: BigNumber | undefined,
  path: Array<string>
): Array<BigNumber> | undefined {
  const queryParams = routerAddress &&
    amountIn && {
      contract: new Contract(routerAddress, abi),
      method: "getAmountsOut",
      args: [amountIn, path],
    };
  const { value, error } = useCall(queryParams) ?? {};
  if (error) {
    console.log(error.message);
  }
  return value?.[0];
}
