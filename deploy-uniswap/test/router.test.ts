import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import exp from "constants";
import { BigNumber, Contract } from "ethers";
import { formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
import { ethers } from "hardhat";
import UniswapV2Pair from "../artifacts/contracts/v2-core/UniswapV2Pair.sol/UniswapV2Pair.json";


const DECIMAL = 18;
const DEADLINE = "9999999";
describe("Router testing", () => {
  let weth: Contract;
  let factory: Contract;
  let router: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress;
  let LP: Contract, AAVE: Contract;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
    // deploy uniswap
    const wethFactory = await ethers.getContractFactory("WETH9");
    const factoryFactory = await ethers.getContractFactory("UniswapV2Factory");
    const routerFactory = await ethers.getContractFactory("UniswapV2Router02");
    const tokenFactory = await ethers.getContractFactory("Token");
    weth = await wethFactory.deploy();
    await weth.deployed();
    factory = await factoryFactory.deploy(weth.address);
    await factory.deployed();
    router = await routerFactory.deploy(factory.address, weth.address);
    await factory.deployed();
    LP = await tokenFactory.deploy("LP", "LP");
    await LP.deployed();
    AAVE = await tokenFactory.deploy("AAVE", "AAVE");
    await AAVE.deployed();
  });
  it("addLiquidity success", async () => {
    // mint LP, AAVE
    await LP.connect(owner).mint(parseUnits("1000", DECIMAL));
    await AAVE.connect(owner).mint(parseUnits("1000", DECIMAL));
    // approve
    await LP.connect(owner).approve(
      router.address,
      parseUnits("1000", DECIMAL)
    );
    await AAVE.connect(owner).approve(
      router.address,
      parseUnits("1000", DECIMAL)
    );
    const add = await router
      .connect(owner)
      .addLiquidity(
        LP.address,
        AAVE.address,
        parseUnits("500", DECIMAL),
        parseUnits("500", DECIMAL),
        parseUnits("1", DECIMAL),
        parseUnits("1", DECIMAL),
        owner.address,
        parseUnits(DEADLINE, DECIMAL)
      );
    const pair = await factory.getPair(LP.address, AAVE.address);
    expect(await factory.allPairsLength()).eq(1);
    expect(await LP.balanceOf(pair)).eq(parseUnits("500", DECIMAL));
    expect(await LP.balanceOf(pair)).eq(parseUnits("500", DECIMAL));
    console.log("Owner", owner.address);
  });
  it("removeLiquidity success", async () => {
    // mint LP, AAVE
    await LP.connect(owner).mint(parseUnits("10000", DECIMAL));
    await AAVE.connect(owner).mint(parseUnits("10000", DECIMAL));
    // approve
    await LP.connect(owner).approve(
      router.address,
      parseUnits("1000000", DECIMAL)
    );
    await AAVE.connect(owner).approve(
      router.address,
      parseUnits("1000000", DECIMAL)
    );
    
    const add = await router
      .connect(owner)
      .addLiquidity(
        LP.address,
        AAVE.address,
        parseUnits("5000", DECIMAL),
        parseUnits("5000", DECIMAL),
        parseUnits("1", DECIMAL),
        parseUnits("1", DECIMAL),
        owner.address,
        parseUnits(DEADLINE, DECIMAL)
      );
    const pair = await factory.getPair(LP.address, AAVE.address);
    expect(await factory.allPairsLength()).eq(1);
    expect(await LP.balanceOf(pair)).eq(parseUnits("5000", DECIMAL));
    expect(await LP.balanceOf(pair)).eq(parseUnits("5000", DECIMAL));
    console.log("Owner", owner.address);
    const pairContract = await ethers.getContractAt(UniswapV2Pair.abi, pair);
    await pairContract.connect(owner).approve(
      router.address,
      parseUnits("1000000", DECIMAL)
    );
    const b = await pairContract.connect(owner).balanceOf(owner.address);
    console.log('Pair balance', formatUnits(b, DECIMAL));
    const remove = await router
      .connect(owner)
      .removeLiquidity(
        LP.address,
        AAVE.address,
        parseUnits("200", DECIMAL),
        parseUnits("10", DECIMAL),
        parseUnits("10", DECIMAL),
        owner.address,
        parseUnits(DEADLINE, DECIMAL)
      );
  });
});
