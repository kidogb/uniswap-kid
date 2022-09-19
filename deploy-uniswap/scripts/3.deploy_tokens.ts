import hre, { ethers } from "hardhat";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const tokenFactory = await ethers.getContractFactory("Token");
  const tokens = ["LP", "DAI", "SUSHI", "AAVE", "OP", "ETC"];
  // deploy tokens
  for (let i = 0; i < tokens.length; i++) {
    try {
      console.log(`Start deploy token ${tokens[i]}`);
      const token = await tokenFactory.deploy(tokens[i], tokens[i]);
      await token.deployed();
      console.log(`Deployed ${tokens[i]} at: ${token.address}`);
      // sleep
      await sleep(10000);
      //verify
      console.log(`Start verify token ${tokens[i]}`);
      await hre.run("verify:verify", {
        address: token.address,
        constructorArguments: [tokens[i], tokens[i]],
      });
    } catch (err) {
      console.log(`Error: ${err}`);
    } finally {
      console.log("=====================================");
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
