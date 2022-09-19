import hre, { ethers } from "hardhat";
import { keccak256 } from "ethers/lib/utils";
import UniswapV2Pair from "../artifacts/contracts/v2-core/UniswapV2Pair.sol/UniswapV2Pair.json";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function onErr(err: any) {
  console.log(err);
  return 1;
}

async function main() {
  const WETH = "0x3FD5e02E25FA16362d619AB0d642643E505b76Bf";
  const factoryAddress = "0xc9DD0991021b874f7F68e3e7ef762Ae43917bB1d";
  const [account] = await ethers.getSigners();
  const deployerAddress = account.address;
  console.log(`Deploying contracts using ${deployerAddress}`);

  const uniswapRouter = await ethers.getContractFactory("UniswapV2Router02");
  // deploy router
  const router = await uniswapRouter.deploy(factoryAddress, WETH);
  await router.deployed();
  console.log(`Uniswap router is deployed at: ${router.address}`);

  // wait for serverals time
  await sleep(20 * 1000);
  // verify contract
  console.log("Start verify...");

  await hre.run("verify:verify", {
    address: router.address,
    constructorArguments: [factoryAddress, WETH],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
