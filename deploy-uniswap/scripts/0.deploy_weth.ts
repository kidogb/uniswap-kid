import hre, { ethers } from "hardhat";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // const WETH = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
  const [account] = await ethers.getSigners();
  const deployerAddress = account.address;
  console.log(`Deploying contracts using ${deployerAddress}`);

  const wETHFactory = await ethers.getContractFactory("WETH9");
  // deploy WETH
  const weth = await wETHFactory.deploy();
  await weth.deployed();
  console.log(`WETH is deployed at: ${weth.address}`);
  await sleep(10 * 10000);

  await hre.run("verify:verify", {
    address: weth.address,
    constructorArguments: [],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
