import {
  Flex,
  Box,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Spacer,
  useToast,
} from "@chakra-ui/react";

import { ArrowDownIcon } from "@chakra-ui/icons";
import SwapButton, { AlertButton } from "./../components/SwapButton";
import TokenSelect from "./../components/TokenSelect";
import React, { useContext, useEffect, useState } from "react";
import theme from "../theme";
import tokens, { uniswapV2Factory, uniswapV2Router } from "./../abi/tokens";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { DEADLINE, DECIMALS, SLIPPAGE } from "../constant";
import { BigNumber, ethers } from "ethers";
import routerABI from "./../abi/UniswapV2Router.json";
import factoryABI from "./../abi/UniswapV2Factory.json";
import pairABI from "./../abi/UniswapV2Pair.json";

import tokenABI from "../abi/Token.json";
import { useSwapAmountOut } from "../hooks/useSwapAmountOut";
import { useSwapAmountsOut } from "../hooks/useSwapAmountsOut";
import SwapDetail from "../components/SwapDetail";
import { getErrorMessage, notify } from "../utils/notify";
import AppContext from "../AppContext";
import {
  getAddresses,
  getRoute,
  getTokenFromName,
  pools,
} from "../utils/routing";

declare let window: any;
export default function Swap() {
  const toast = useToast();
  const { account } = useEthers();
  const {
    swap: { tokenIn, tokenOut, setTokenIn, setTokenOut },
  } = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingApproveInToken, setLoadingApproveInToken] = useState(false);
  const [swapAmountIn, setSwapAmountIn] = useState<string | undefined>("");
  // for get pair address
  const [pair, setPair] = useState<string | undefined>("");
  const [routes, setRoutes] = useState<Array<Array<string>> | undefined>();
  useEffect(() => {
    if (tokenIn && tokenOut) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const factoryContract = new ethers.Contract(
        uniswapV2Factory,
        factoryABI,
        signer
      );
      factoryContract
        .getPair(tokenIn.address, tokenOut.address)
        .then((result: string) => {
          console.log(result);
          setPair(result);
        })
        .catch((e: any) => {
          console.log(e);
        });
      tokenIn && tokenOut && setRoutes(getRoute(tokenIn.name, tokenOut.name));
    }
  }, [tokenIn, tokenOut]);

  console.log("Routes", routes);
  const balanceInputToken = useTokenBalance(tokenIn?.address, account);
  const balanceOutputToken = useTokenBalance(tokenOut?.address, account);
  const reserveIn = useTokenBalance(tokenIn?.address, pair);
  const reserveOut = useTokenBalance(tokenOut?.address, pair);
  const allowanceInToken = useTokenAllowance(
    tokenIn?.address,
    account,
    uniswapV2Router
  );

  const swapAmountsOut = useSwapAmountsOut(
    uniswapV2Router,
    new ethers.utils.Interface(routerABI),
    swapAmountIn ? parseUnits(swapAmountIn, DECIMALS) : undefined,
    routes && routes.length > 0 ? getAddresses(routes[0]) : []
  );
  const swapAmountOut =
    swapAmountsOut && swapAmountsOut[swapAmountsOut.length - 1];

  const rate =
    swapAmountOut && swapAmountIn
      ? parseFloat(swapAmountIn) /
        parseFloat(formatUnits(swapAmountOut, DECIMALS))
      : undefined;

  const onChangeAmountIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSwapAmountIn(e.target.value);
  };

  const onClickSwapArrow = () => {
    tokenOut && setTokenIn(tokenOut);
    tokenIn && setTokenOut(tokenIn);
  };

  const onClickMaxButton = () => {
    balanceInputToken &&
      setSwapAmountIn(formatUnits(balanceInputToken, DECIMALS));
  };

  const onApprove = async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ) => {
    try {
      setLoadingApproveInToken(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
      const tx = await tokenContract.approve(
        spenderAddress,
        parseUnits(amount, DECIMALS)
      );
      // notify transaction submited
      notify(toast, "Transaction is submited", "success");
      await tx.wait();
      // notify approve success
      notify(toast, "Approve sucessfully", "success");
    } catch (err) {
      console.log(err);
      const description = getErrorMessage(err);
      notify(toast, description, "error");
    } finally {
      setLoadingApproveInToken(false);
    }
  };

  const onSwapToken = async () => {
    if (!tokenIn || !tokenOut) return;
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let routerContract = new ethers.Contract(
        uniswapV2Router,
        routerABI,
        signer
      );
      if (swapAmountIn && swapAmountOut) {
        const tx = await routerContract.swapExactTokensForTokens(
          parseUnits(swapAmountIn, DECIMALS),
          swapAmountOut.mul((1 - SLIPPAGE) * 1000).div(1000), // slippage = 0.5 => 0.5 * 1000/1000 = 500/1000
          routes && routes.length > 0 ? getAddresses(routes[0]) : [],
          account,
          parseUnits(DEADLINE, DECIMALS)
        );
        // notify transaction submit
        notify(toast, "Transaction is submited", "success");
        await tx.wait();
        // notify swap success
        notify(toast, "Swap sucessfully", "success");
      }
    } catch (err) {
      console.log(err);
      const description = getErrorMessage(err);
      notify(toast, description, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="30.62rem"
      mx="auto"
      mt="2.25rem"
      boxShadow="rgb(0 0 0 / 8%) 0rem 0.37rem 0.62rem"
      borderRadius="1.37rem"
    >
      <Flex
        alignItems="center"
        p="1rem 1.25rem 0.5rem"
        bg="white"
        color="rgb(86, 90, 105)"
        justifyContent="space-between"
        borderRadius="1.37rem 1.37rem 0 0"
      >
        <Text color="black" fontWeight="500">
          Swap
        </Text>
        {/* <SettingsIcon
          fontSize="1.25rem"
          cursor="pointer"
          _hover={{ color: "rgb(128,128,128)" }}
        /> */}
      </Flex>

      <Box p="0.5rem" bg="white" borderRadius="0 0 1.37rem 1.37rem">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg={theme.colors.gray_light}
          p="1rem 1rem 1.7rem"
          borderRadius="1.25rem"
          border="0.06rem solid rgb(237, 238, 242)"
          _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
        >
          <VStack align="start">
            <HStack>
              <Box>
                <TokenSelect
                  image={tokenIn?.icon || ""}
                  value={tokenIn?.name || ""}
                  type="swap_in"
                />
              </Box>
              {allowanceInToken &&
                swapAmountIn &&
                allowanceInToken.lt(parseUnits(swapAmountIn, DECIMALS)) && (
                  <Box>
                    <Button
                      isLoading={loadingApproveInToken}
                      loadingText="Aprroving"
                      colorScheme="pink"
                      variant="link"
                      size="xs"
                      onClick={() =>
                        tokenIn &&
                        onApprove(
                          tokenIn.address,
                          tokens[2].address,
                          swapAmountIn
                        )
                      }
                    >
                      Approve
                    </Button>
                  </Box>
                )}
              <Box>
                <Input
                  placeholder="0.0"
                  fontWeight="500"
                  fontSize="1.5rem"
                  width="100%"
                  size="19rem"
                  textAlign="right"
                  bg="rgb(247, 248, 250)"
                  outline="none"
                  border="none"
                  focusBorderColor="none"
                  type="number"
                  color="black"
                  value={swapAmountIn}
                  onChange={onChangeAmountIn}
                />
              </Box>
            </HStack>

            <Flex w="100%">
              <Box px={5}>
                <Text noOfLines={1} mt=".25rem" fontSize="sm" as="samp">
                  Balance:{" "}
                  {balanceInputToken
                    ? formatUnits(balanceInputToken, DECIMALS)
                    : "--"}
                </Text>
              </Box>
              <Spacer />
              <Box px="1rem">
                <Button
                  onClick={onClickMaxButton}
                  colorScheme="pink"
                  variant="link"
                  size="sm"
                >
                  max
                </Button>
              </Box>
            </Flex>
          </VStack>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="transparent"
          p="0.18rem"
          borderRadius="0.75rem"
          pos="relative"
          top="-0.8rem"
          zIndex="1"
        >
          <ArrowDownIcon
            border="0.2rem solid white"
            bg={theme.colors.gray_light}
            color={theme.colors.gray_text}
            h="2rem"
            width="2rem"
            borderRadius="0.75rem"
            _hover={{ bg: theme.colors.gray_dark }}
            _active={{ bg: theme.colors.gray_light }}
            onClick={onClickSwapArrow}
          />
        </Flex>

        <Flex
          alignItems="center"
          justifyContent="space-between"
          bg={theme.colors.gray_light}
          pos="relative"
          p="1rem 1rem 1.7rem"
          borderRadius="1.25rem"
          top="-1.5rem"
          border="0.06rem solid rgb(237, 238, 242)"
          _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
        >
          <VStack align="start">
            <HStack>
              <Box>
                <TokenSelect
                  image={tokenOut?.icon || ""}
                  value={tokenOut?.name || ""}
                  type="swap_out"
                />
              </Box>
              <Box>
                <Input
                  readOnly
                  placeholder="0.0"
                  fontSize="1.5rem"
                  width="100%"
                  size="19rem"
                  textAlign="right"
                  bg={theme.colors.gray_light}
                  outline="none"
                  border="none"
                  focusBorderColor="none"
                  type="number"
                  color="black"
                  value={
                    swapAmountOut ? formatUnits(swapAmountOut, DECIMALS) : ""
                  }
                />
              </Box>
            </HStack>
            <Flex w="100%">
              <Box px="1rem">
                <Text noOfLines={1} mt=".25rem" fontSize="sm" as="samp">
                  Balance:{" "}
                  {balanceOutputToken
                    ? formatUnits(balanceOutputToken, DECIMALS)
                    : "--"}
                </Text>
              </Box>
            </Flex>
          </VStack>
        </Flex>
        <Box mt="-.5rem" px="1rem" color="black">
          <Text as="em">
            1 {tokenOut?.name} = {rate ? rate : "--"} {tokenIn?.name}
          </Text>
        </Box>
        <SwapDetail
          routes={routes}
          slippage={SLIPPAGE + ""}
          expectedAmountOut={
            swapAmountOut ? formatUnits(swapAmountOut, DECIMALS) : ""
          }
          currentAMountOut={
            swapAmountOut ? formatUnits(swapAmountOut, DECIMALS) : ""
          }
        />
        {swapAmountIn &&
        balanceInputToken &&
        parseUnits(swapAmountIn, DECIMALS).gt(balanceInputToken) ? (
          <AlertButton
            text={`Insufficient ${tokenIn?.name} balance`}
          ></AlertButton>
        ) : (
          <SwapButton onSwap={onSwapToken} loadingSwap={loading} />
        )}
      </Box>
    </Box>
  );
}
