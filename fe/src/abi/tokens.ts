import redis from "../assets/redis.svg";
export interface Token {
  icon: string;
  name: string;
  address: string;
}

const tokens = [
  {
    icon: "https://static.coinstats.app/coins/aaveZSi.png",
    name: "AAVE",
    address: "0x443aCD98137cf4D55DDB879e45B1C074C21A363A",
    decimals: 18,
  },
  {
    icon: "https://static.coinstats.app/coins/1579614462667.png",
    name: "DAI",
    address: "0xeb779FfEa20BF4728DCC633894037A8E1fC55D86",
    decimals: 18,
  },
  {
    icon: "https://static.coinstats.app/coins/LitecoinGiD2Q.png",
    name: "LP",
    address: "0x0856ABFc6395de5BF4CD1c0b7a34774bdF07E556",
    decimals: 18,
  },
  {
    icon: "https://static.coinstats.app/coins/1608113339254.png",
    name: "SUSHI",
    address: "0x59Ac401f2F01D638fcB8d75CecFf3293010A8CBf",
    decimals: 18,
  },
  {
    icon: "https://static.coinstats.app/coins/ethereum-classicPfU.png",
    name: "ETC",
    address: "0x4246b366FC69269245F338818A7BD396162a524F",
    deciamals: 18,
  },
  {
    icon: "https://static.coinstats.app/coins/optimismcxE.png",
    name: "OP",
    address: "0x7c777135c9293dA683eDAAaAb1fe76aB6d43fB04",
  },
  {
    icon: redis,
    name: "RDX",
    address: "0x20Cf8d9e653B199965EDb8C063880C8F580118a9",
  },
];

export const masterchef = "0xD191658aC115C9e4cBd423206A20230C004644aE";
export const uniswapV2Router = "0xc8595f61bE6b5392893a5F7A4c8246b4D7D4860B";
export const uniswapV2Factory = "0xc9DD0991021b874f7F68e3e7ef762Ae43917bB1d";
export default tokens;
