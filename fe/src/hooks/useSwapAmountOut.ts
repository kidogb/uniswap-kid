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

export function useSwapAmountOut(
  routerAddress: string | undefined,
  abi: ethers.utils.Interface,
  amountIn: BigNumber | undefined,
  reserveIn: BigNumber | undefined,
  reserveOut: BigNumber | undefined
): BigNumber | undefined {
  const queryParams = routerAddress &&
    amountIn &&
    reserveIn &&
    reserveOut && {
      contract: new Contract(routerAddress, abi),
      method: "getAmountOut",
      args: [amountIn, reserveIn, reserveOut],
    };
  const { value, error } = useCall(queryParams) ?? {};
  if (error) {
    console.log(error.message);
  }
  return value?.[0];
}
