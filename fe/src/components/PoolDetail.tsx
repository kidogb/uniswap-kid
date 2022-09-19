import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Image,
  Link,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useTokenBalance } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import { Token } from "../abi/tokens";
import { DECIMALS } from "../constant";
import theme from "../theme";
import AddLiquidityModal from "./Modal/AddLiquidityModal";
import RemoveLiquidityModal from "./Modal/RemoveLiquidityModal";

type Props = {
  token0: Token;
  token1: Token;
  pair: string;
};

export default function PoolDetail({ token0, token1, pair }: Props) {
  const balanceToken0 = useTokenBalance(token0.address, pair);
  const balanceToken1 = useTokenBalance(token1.address, pair);
  const balanceToken0Float =
    balanceToken0 && parseFloat(formatUnits(balanceToken0, DECIMALS));
  const balanceToken1Float =
    balanceToken1 && parseFloat(formatUnits(balanceToken1, DECIMALS));
  const ratioA =
    balanceToken0Float &&
    balanceToken1Float &&
    (100 * balanceToken0Float) / (balanceToken0Float + balanceToken1Float);
  const ratioB =
    balanceToken0Float &&
    balanceToken1Float &&
    (100 * balanceToken1Float) / (balanceToken0Float + balanceToken1Float);
  // for Add Liquidity modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  // for Remove Liquidity modal
  const {
    isOpen: isOpenRemoveModal,
    onOpen: onOpenRemoveModal,
    onClose: onCloseRemoveModal,
  } = useDisclosure();

  return (
    <Box p="0.5rem" borderRadius="0 0 1.37rem 1.37rem">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        bg={theme.colors.gray_light}
        p="1rem 1rem 1.7rem"
        borderRadius="1.25rem"
        border="0.06rem solid rgb(237, 238, 242)"
        _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
      >
        <Box>
          <Flex p="1rem" w="100%" align="center">
            <Image px="0.1rem" src={token0.icon} w="2.0rem"></Image>
            <Image px="0.1rem" src={token1.icon} w="2.0rem"></Image>
            <Text px="1rem" as="b">
              {`${token0.name} / ${token1.name}`.toUpperCase()}
            </Text>
          </Flex>
          <Center>
            <Button
              mr="0.5rem"
              bg={theme.colors.gray_light}
              color={theme.colors.gray_text}
              fontSize="1rem"
              fontWeight="semibold"
              borderRadius="xl"
              border={`0.06rem solid ${theme.colors.gray_dark}`}
              _hover={{
                borderColor: theme.colors.gray_light,
                bg: theme.colors.gray_dark,
              }}
              _active={{
                borderColor: theme.colors.gray_light,
              }}
              onClick={onOpen}
            >
              Add Liquidity
            </Button>
            <AddLiquidityModal
              type="add_liquidity"
              isOpen={isOpen}
              onClose={onClose}
              token0={token0}
              token1={token1}
            />
            <Button
              bg={theme.colors.pink_dark}
              color={theme.colors.pink_light}
              fontSize="1rem"
              fontWeight="semibold"
              borderRadius="xl"
              border="0.06rem solid rgb(253, 234, 241)"
              _hover={{
                borderColor: theme.colors.pink_dark,
                bg: theme.colors.pink_dark_hover,
              }}
              _active={{
                borderColor: theme.colors.pink_dark,
              }}
              onClick={onOpenRemoveModal}
            >
              Remove Liquidity
            </Button>
            <RemoveLiquidityModal
              isOpen={isOpenRemoveModal}
              onClose={onCloseRemoveModal}
              token0={token0}
              token1={token1}
            />
          </Center>
        </Box>
        <Box
          borderRadius="0.75rem"
          border="0.06rem solid rgb(237, 238, 242)"
          _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
          direction={["row", "column"]}
          p="1rem"
        >
          <Flex p="1rem" direction={["column", "row"]}>
            <Image boxSize="1.5rem" src={token0.icon} alt="Logo" mr="0.1rem" />
            <Text noOfLines={1} px="1rem" as="samp">
              <Tooltip label="Click to mint">
                <Link
                  href={`https://goerli.etherscan.io/address/${token0.address}#writeContract#F4`}
                  isExternal
                >
                  {token0.name.toUpperCase()}
                </Link>
              </Tooltip>
              {": "}
              {balanceToken0
                ? Math.round(
                    parseFloat(formatUnits(balanceToken0, DECIMALS)) * 1e16
                  ) / 1e16
                : "--"}
            </Text>
            <Spacer />
            <Badge variant="outline">{ratioA && ratioA.toFixed(2)} %</Badge>
          </Flex>
          <Flex p="1rem" direction={["column", "row"]}>
            <Image boxSize="1.5rem" src={token1.icon} alt="Logo" mr="0.1rem" />

            <Text noOfLines={1} px="1rem" as="samp">
              <Tooltip label="Click to mint">
                <Link
                  href={`https://goerli.etherscan.io/address/${token1.address}#writeContract#F4`}
                  isExternal
                >
                  {token1.name.toUpperCase()}
                </Link>
              </Tooltip>

              {": "}
              {balanceToken1
                ? Math.round(
                    parseFloat(formatUnits(balanceToken1, DECIMALS)) * 1e16
                  ) / 1e16
                : "--"}
            </Text>

            <Spacer />
            <Badge variant="outline">{ratioB && ratioB.toFixed(2)} %</Badge>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
