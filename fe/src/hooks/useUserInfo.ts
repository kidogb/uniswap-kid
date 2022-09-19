import { ethers, Contract } from "ethers";
import { useCall } from "@usedapp/core";

/**
 * Returns a balance of a given token for a given address.
 * @param poolAddress address of a pool token contract.
 * @param abi abi of pool token contract.
 * @public
 * @returns a balance which is `BigNumber`, or `undefined` if address or token is `Falsy` or not connected.
 */

export function useUserInfo(
  masterchef: string | undefined,
  abi: ethers.utils.Interface,
  _pid: number,
  account: string | undefined
) {
  const queryParams = masterchef &&
    account && {
      contract: new Contract(masterchef, abi),
      method: "userInfo",
      args: [_pid, account],
    };
  const { value, error } = useCall(queryParams) ?? {};
  if (error) {
    console.log(error.message);
  }
  return value;
}
