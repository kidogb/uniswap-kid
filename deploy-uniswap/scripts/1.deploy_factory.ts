import hre, { ethers } from "hardhat";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const WETH = "0x3FD5e02E25FA16362d619AB0d642643E505b76Bf";
  const [account] = await ethers.getSigners();
  const deployerAddress = account.address;
  console.log(`Deploying contracts using ${deployerAddress}`);

  const uniswapFactory = await ethers.getContractFactory("UniswapV2Factory");

  const factory = await uniswapFactory.deploy(deployerAddress);
  await factory.deployed();
  console.log(`Uniswap Factory is deployed at: ${factory.address}`);

  // wait for serverals time
  await sleep(10 * 10000);
  // verify contract
  console.log("Start verify...");

  await hre.run("verify:verify", {
    address: factory.address,
    constructorArguments: [deployerAddress],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
