import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Image,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import {
  Goerli,
  useEthers,
  useTokenAllowance,
  useTokenBalance,
} from "@usedapp/core";
import theme from "../../theme";
import { useEffect, useState } from "react";
import { Token, uniswapV2Factory, uniswapV2Router } from "../../abi/tokens";
import routerABI from "./../../abi/UniswapV2Router.json";
import factoryABI from "./../../abi/UniswapV2Factory.json";
import pairABI from "./../../abi/UniswapV2Pair.json";
import { BigNumber, ethers } from "ethers";
import { useTotalSupply } from "../../hooks/useTotalSupply";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { DEADLINE, DECIMALS, SLIPPAGE } from "../../constant";
import { getErrorMessage, notify } from "../../utils/notify";

type Props = {
  token0: Token;
  token1: Token;
  isOpen: any;
  onClose: any;
};

type PercentProps = {
  text: string;
  onClick: () => void;
};

declare let window: any;

const PercentButton = ({ text, onClick }: PercentProps) => {
  return (
    <Button
      size="xs"
      color={theme.colors.pink_dark}
      bg={theme.colors.pink_light}
      width="100%"
      px="1rem"
      ml="1rem"
      borderRadius="1.25rem"
      _hover={{ bg: theme.colors.pink_light_hover }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default function RemoveLiquidityModal({
  isOpen,
  onClose,
  token0,
  token1,
}: Props) {
  const toast = useToast();
  const { account, chainId } = useEthers();
  const [isConnected, setConnected] = useState<boolean | undefined | "">(false);

  useEffect(() => {
    setConnected(account && chainId === Goerli.chainId);
  }, [account, chainId]);

  // for get pair address
  const [pair, setPair] = useState<string | undefined>("");
  useEffect(() => {
    if (token0 && token1) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const factoryContract = new ethers.Contract(
        uniswapV2Factory,
        factoryABI,
        signer
      );
      factoryContract
        .getPair(token0.address, token1.address)
        .then((result: string) => {
          console.log(result);
          setPair(result);
        })
        .catch((e: any) => {
          console.log(e);
        });
    }
  }, [token0, token1]);
  // get from contract
  const allowancePair = useTokenAllowance(pair, account, uniswapV2Router);
  const liquidityPoolTotalSupply = useTotalSupply(
    pair,
    new ethers.utils.Interface(pairABI)
  );
  const poolBalanceToken0 = useTokenBalance(token0?.address, pair);
  const poolBalanceToken1 = useTokenBalance(token1?.address, pair);
  // get from ui
  const [percentValue, setPercentValue] = useState<number>(0);
  const [estimateRemovedAmount0, setEstimateRemovedAmount0] = useState<
    BigNumber | undefined
  >();
  const [estimateRemovedAmount1, setEstimateRemovedAmount1] = useState<
    BigNumber | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);

  const estimatePooledOutAmount = (
    balanceInPool: BigNumber,
    liquidityRemoved: BigNumber,
    liquidityPool: BigNumber
  ) => {
    return balanceInPool.mul(liquidityRemoved).div(liquidityPool);
  };
  const onClickPercent = (percent: number) => {
    setPercentValue(percent);
    if (poolBalanceToken0?.isZero() || poolBalanceToken1?.isZero()) return;
    const removedAmount =
      liquidityPoolTotalSupply &&
      liquidityPoolTotalSupply.mul(percent).div(100);
    poolBalanceToken0 &&
      removedAmount &&
      liquidityPoolTotalSupply &&
      setEstimateRemovedAmount0(
        estimatePooledOutAmount(
          poolBalanceToken0,
          removedAmount,
          liquidityPoolTotalSupply
        )
      );

    poolBalanceToken1 &&
      removedAmount &&
      liquidityPoolTotalSupply &&
      setEstimateRemovedAmount1(
        estimatePooledOutAmount(
          poolBalanceToken1,
          removedAmount,
          liquidityPoolTotalSupply
        )
      );
  };

  const onChangeSlider = (value: number) => {
    setPercentValue(value);
    if (poolBalanceToken0?.isZero() || poolBalanceToken1?.isZero()) return;
    const removedAmount =
      liquidityPoolTotalSupply && liquidityPoolTotalSupply.mul(value).div(100);
    poolBalanceToken0 &&
      removedAmount &&
      liquidityPoolTotalSupply &&
      setEstimateRemovedAmount0(
        estimatePooledOutAmount(
          poolBalanceToken0,
          removedAmount,
          liquidityPoolTotalSupply
        )
      );

    poolBalanceToken1 &&
      removedAmount &&
      liquidityPoolTotalSupply &&
      setEstimateRemovedAmount1(
        estimatePooledOutAmount(
          poolBalanceToken1,
          removedAmount,
          liquidityPoolTotalSupply
        )
      );
  };

  const onApprove = async (
    tokenAddress: string,
    spenderAddress: string,
    amount: string
  ) => {
    try {
      setLoadingApprove(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let pairContract = new ethers.Contract(tokenAddress, pairABI, signer);
      const tx = await pairContract.approve(
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
      setLoadingApprove(false);
    }
  };

  const onRemoveLiquidity = async () => {
    if (poolBalanceToken0?.isZero() || poolBalanceToken1?.isZero()) return;
    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let routerContract = new ethers.Contract(
        uniswapV2Router,
        routerABI,
        signer
      );
      if (liquidityPoolTotalSupply) {
        const removeLiquidity = liquidityPoolTotalSupply
          .mul(percentValue)
          .div(100);
        console.log(formatUnits(liquidityPoolTotalSupply, DECIMALS));
        console.log(formatUnits(removeLiquidity, DECIMALS));

        const tx = await routerContract.removeLiquidity(
          token0.address,
          token1.address,
          removeLiquidity,
          estimateRemovedAmount0?.mul((1 - SLIPPAGE) * 1000).div(1000),
          estimateRemovedAmount0?.mul((1 - SLIPPAGE) * 1000).div(1000),
          account,
          parseUnits(DEADLINE, DECIMALS)
        );
        // notify transaction submited
        notify(toast, "Transaction is submited", "success");
        await tx.wait();
        // notify remove success
        notify(toast, "Remove Liquidity sucessfully", "success");
      }
    } catch (err) {
      console.log(err);
      const description = getErrorMessage(err);
      notify(toast, description, "error");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        background="white"
        border="0.06rem"
        borderStyle="solid"
        borderColor="gray.300"
        borderRadius="3xl"
      >
        <ModalHeader color="black" px={4} fontSize="lg" fontWeight="medium">
          Remove Liquidity
        </ModalHeader>
        <ModalCloseButton
          color="black"
          fontSize="sm"
          _hover={{
            color: "gray.600",
          }}
        />
        <ModalBody pt={0} px={4}>
          <Box p="0.5rem" bg="white" borderRadius="0 0 1.37rem 1.37rem">
            <Flex
              direction={["row", "column"]}
              alignItems="center"
              justifyContent="space-between"
              bg={theme.colors.gray_light}
              p="1rem 1rem 1.7rem"
              borderRadius="1.25rem"
              border="0.06rem solid rgb(237, 238, 242)"
              _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
            >
              <Flex w="100%">
                <Text color={theme.colors.gray_text} fontSize="1xl">
                  Amount
                </Text>
              </Flex>

              <Flex w="100%" align="center" justifyContent="space-between">
                <Text w="50rem" as="b" fontSize="2xl">
                  {percentValue} %
                </Text>
                <PercentButton text="25%" onClick={() => onClickPercent(25)} />
                <PercentButton text="50%" onClick={() => onClickPercent(50)} />
                <PercentButton text="75%" onClick={() => onClickPercent(75)} />
                <PercentButton
                  text="100%"
                  onClick={() => onClickPercent(100)}
                />
              </Flex>
              <Flex w="100%" mt="1rem">
                <Slider
                  aria-label="slider-ex-1"
                  value={percentValue}
                  onChange={(v) => onChangeSlider(v)}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
              </Flex>
            </Flex>

            <Box mt="1.0rem" color="black">
              <Flex p="1rem" direction={["column", "row"]}>
                <Image boxSize="1.5rem" src={token0.icon} alt="Logo" />
                <Text
                  noOfLines={1}
                  px="1rem"
                  as="samp"
                  color={theme.colors.gray_text}
                >
                  {`Pooled ${token0.name}`}
                </Text>
                <Spacer />
                <Text
                  noOfLines={1}
                  px="1rem"
                  as="samp"
                  color={theme.colors.gray_text}
                >
                  {estimateRemovedAmount0
                    ? formatUnits(estimateRemovedAmount0, DECIMALS)
                    : "--"}
                </Text>
              </Flex>
              <Flex p="1rem" direction={["column", "row"]}>
                <Image boxSize="1.5rem" src={token1.icon} alt="Logo" />
                <Text
                  noOfLines={1}
                  px="1rem"
                  as="samp"
                  color={theme.colors.gray_text}
                >
                  {`Pooled ${token1.name}`}
                </Text>
                <Spacer />
                <Text
                  noOfLines={1}
                  px="1rem"
                  as="samp"
                  color={theme.colors.gray_text}
                >
                  {estimateRemovedAmount1
                    ? formatUnits(estimateRemovedAmount1, DECIMALS)
                    : "--"}
                </Text>
              </Flex>
            </Box>
            <Box mt="1.5rem">
              {allowancePair &&
              liquidityPoolTotalSupply &&
              liquidityPoolTotalSupply
                .mul(percentValue)
                .div(100)
                .gt(allowancePair) ? (
                <Button
                  size="lg"
                  color={isConnected ? "white" : "blackAlpha.900"}
                  bg={
                    isConnected
                      ? theme.colors.pink_dark
                      : theme.colors.gray_light
                  }
                  width="100%"
                  p="1.62rem"
                  borderRadius="1.25rem"
                  _hover={{
                    bg: isConnected
                      ? theme.colors.pink_dark_hover
                      : theme.colors.gray_dark,
                  }}
                  isLoading={loadingApprove}
                  loadingText="Approving"
                  onClick={() =>
                    pair &&
                    onApprove(
                      pair,
                      uniswapV2Router,
                      formatUnits(liquidityPoolTotalSupply, DECIMALS)
                    )
                  }
                  isDisabled={!isConnected}
                >
                  {isConnected
                    ? "Approve"
                    : account
                    ? "Please switch network"
                    : "Please connect wallet"}
                </Button>
              ) : (
                <Button
                  size="lg"
                  color={isConnected ? "white" : "blackAlpha.900"}
                  bg={
                    isConnected
                      ? theme.colors.pink_dark
                      : theme.colors.gray_light
                  }
                  width="100%"
                  p="1.62rem"
                  borderRadius="1.25rem"
                  _hover={{
                    bg: isConnected
                      ? theme.colors.pink_dark_hover
                      : theme.colors.gray_dark,
                  }}
                  isLoading={loading}
                  loadingText="Removing"
                  onClick={onRemoveLiquidity}
                  isDisabled={!isConnected}
                >
                  {isConnected
                    ? "Remove"
                    : account
                    ? "Please switch network"
                    : "Please connect wallet"}
                </Button>
              )}
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter
          justifyContent="flex-start"
          background="rgb(237, 238, 242)"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={6}
        >
          {/* <Text color="black" fontWeight="medium" fontSize="md"></Text> */}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
