import { keccak256 } from "ethers/lib/utils";
import UniswapV2Pair from "../artifacts/contracts/v2-core/UniswapV2Pair.sol/UniswapV2Pair.json";

// Hash of the bytecode is fixed.
const bytecodeHash = keccak256(UniswapV2Pair.bytecode).toString();

console.log(bytecodeHash);
