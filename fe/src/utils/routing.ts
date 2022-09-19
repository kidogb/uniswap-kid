import tokens from "../abi/tokens";

export const pools = [
  {
    token0: tokens[2],
    token1: tokens[1],
    pair: "0xE66AF2e666537bAb8FF38eAb360289F90063AcC4",
  }, // 1
  {
    token0: tokens[0],
    token1: tokens[1],
    pair: "0xdE41d0F5133463B3B68046cbA02553E1099B4F18",
  }, // 2
  {
    token0: tokens[0],
    token1: tokens[5],
    pair: "0xd561A435a7f7E06DBe1eEFA9DdC56020E0aAAB6D",
  }, //0
  {
    token0: tokens[3],
    token1: tokens[4],
    pair: "0x9bB895ad40BFcD7386623184584Dc66cA7C8bBAA",
  }, //3
  {
    token0: tokens[4],
    token1: tokens[5],
    pair: "0x5b3624Fa699803B4ddaEFC3A5b6d1064d2A7053A",
  }, //0
];
const findPath = (
  token: string,
  pools: Array<Array<string>>,
  path: Array<string>
) => {
  const oneMatchPools = pools.filter((p) => p.includes(token));
  if (oneMatchPools.length > 0) {
    oneMatchPools.forEach((p) => {
      const newToken = p[0] === token ? p[1] : p[0];
      const newPools = pools.filter((pp) => pp[0] !== p[0] || pp[1] !== p[1]);
      if (newPools.length > 0) {
        path.push(token);
        findPath(newToken, newPools, path);
      } else {
        path.push(token, newToken);
      }
    });
  } else {
    path.push(token);
  }
};
export const getAllPairAddress = () => {
  return pools.map((p) => [p.token0.address, p.token1.address]);
};
export const getAllPairName = () => {
  return pools.map((p) => [p.token0.name, p.token1.name]);
};
export const findAllPath = (start: string | undefined) => {
  if (!start) return [];
  let allPath: Array<Array<string>> = [];
  const pairs = getAllPairName();
  let path: Array<string> = [];
  findPath(start, pairs, path);
  if (path.length === 1) return [];
  let temp: Array<string> = [];
  path.forEach((p, idx) => {
    if (p === start && temp.length !== 0) {
      allPath.push(temp);
      temp = [];
    }
    temp.push(p);
    // check last element
    if (idx === path.length - 1 && temp.length !== 0) {
      allPath.push(temp);
      temp = [];
    }
  });
  return allPath;
};

export const getTokenFromName = (name: string) => {
  const result = tokens.filter((t) => t.name === name);
  return result.length !== 0 ? result[0] : undefined;
};

export const getAddresses = (names: Array<string>) => {
  let addresses: Array<string> = [];
  names.forEach((name) => {
    const token = getTokenFromName(name);
    if (token) addresses.push(token.address);
    else return [];
  });
  return addresses;
};

export const getRoute = (start: string, end: string) => {
  let routes: Array<Array<string>> = [];
  const allPath = findAllPath(start);
  const avaiablePath = allPath.filter(
    (path) => path.includes(start) && path.includes(end)
  );
  if (avaiablePath.length === 0) return [];
  avaiablePath.forEach((p) => {
    const startIdx = p.indexOf(start);
    const endIdx = p.indexOf(end);
    const temp =
      startIdx < endIdx
        ? p.slice(startIdx, endIdx + 1)
        : p.slice(endIdx, startIdx + 1);
    routes.push(temp);
  });
  return routes;
};
