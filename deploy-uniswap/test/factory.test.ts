import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { LP, DAI, SUSHI, AAVE, OP, ETC } from "./address";

describe("Factory testing", () => {
  let weth: Contract;
  let factory: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
    // deploy
    const wethFactory = await ethers.getContractFactory("WETH9");
    const factoryFactory = await ethers.getContractFactory("UniswapV2Factory");
    const routerFactory = await ethers.getContractFactory("UniswapV2Router02");
    weth = await wethFactory.deploy();
    await weth.deployed();
    factory = await factoryFactory.deploy(weth.address);
    await factory.deployed();
  });

  it("createPair success", async () => {
    await factory.createPair(LP, AAVE);
    await factory.createPair(LP, ETC);
    const numberOfPairs = await factory.allPairsLength();
    expect(numberOfPairs).to.eq(2);
  });
  it("createPair fail: same token", async () => {
    await expect(factory.createPair(LP, LP)).to.be.revertedWith(
      "UniswapV2: IDENTICAL_ADDRESSES"
    );
  });
  it("createPair fail: zero address", async () => {
    await expect(factory.createPair(LP, ethers.constants.AddressZero)).to.be.revertedWith(
      "UniswapV2: ZERO_ADDRESS"
    );
  });
  it("createPair fail: existed pool", async () => {
    await factory.createPair(LP, AAVE);
    await expect(factory.createPair(LP, AAVE)).to.be.revertedWith(
      "UniswapV2: PAIR_EXISTS"
    );
  });
});
