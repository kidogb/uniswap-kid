import { createContext, useState } from "react";
import { Token } from "./abi/tokens";

interface Props {
  children: any;
}

interface AppContextProps {
  account: string | undefined;
  setAccount: (account: string) => void;
  swap: {
    tokenIn: Token | undefined;
    setTokenIn: (token: Token) => void;
    tokenOut: Token | undefined;
    setTokenOut: (token: Token) => void;
  };
  initPool: {
    token0: Token | undefined;
    setToken0: (token: Token | undefined) => void;
    token1: Token | undefined;
    setToken1: (token: Token | undefined) => void;
  };
}
const defautContext: AppContextProps = {
  swap: {
    tokenIn: undefined,
    setTokenIn: () => {},
    tokenOut: undefined,
    setTokenOut: () => {},
  },
  initPool: {
    token0: undefined,
    setToken0: () => {},
    token1: undefined,
    setToken1: () => {},
  },
  account: undefined,
  setAccount: () => {},
};
const AppContext = createContext(defautContext);

export const AppProvider = function ({ children }: Props) {
  const [account, setAccount] = useState<string | undefined>();
  const [tokenIn, setTokenIn] = useState<Token | undefined>();
  const [tokenOut, setTokenOut] = useState<Token | undefined>();
  const [token0, setToken0] = useState<Token | undefined>();
  const [token1, setToken1] = useState<Token | undefined>();

  return (
    <AppContext.Provider
      value={{
        account,
        setAccount,
        swap: {
          tokenIn,
          setTokenIn,
          tokenOut,
          setTokenOut,
        },
        initPool: {
          token0,
          setToken0,
          token1,
          setToken1,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
