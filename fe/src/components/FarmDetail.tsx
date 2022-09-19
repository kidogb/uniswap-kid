import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Input,
  Spacer,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { ethers } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { useState } from "react";
import { masterchef, Token } from "../abi/tokens";
import tokenABI from "../abi/Token.json";
import masterchefABI from "../abi/Masterchef.json";
import { DECIMALS } from "../constant";
import theme from "../theme";
import { getErrorMessage, notify } from "../utils/notify";
import { useUserInfo } from "../hooks/useUserInfo";
import { usePendingReward } from "../hooks/usePendingReward";

type Props = {
  token: Token;
  reward: Token;
  pid: number;
};
declare let window: any;

export default function FarmDetail({ token, reward, pid }: Props) {
  const toast = useToast();
  const { account } = useEthers();
  const [expand, setExpand] = useState<boolean>(false);
  const [depositAmount, setDepositAmount] = useState<string | undefined>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string | undefined>("");
  const [claimAmount, setClaimAmount] = useState<string | undefined>("");
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [loadingClaimAll, setLoadingClaimAll] = useState(false);

  const lpTokenBalance = useTokenBalance(token.address, account);
  const totalDeposited = useTokenBalance(token.address, masterchef);
  const userInfo = useUserInfo(
    masterchef,
    new ethers.utils.Interface(masterchefABI),
    pid,
    account
  );
  const depositedBalance = userInfo?.amount;
  const pendingReward = usePendingReward(
    masterchef,
    new ethers.utils.Interface(masterchefABI),
    pid,
    account
  );

  const allowanceLpToken = useTokenAllowance(
    token.address,
    account,
    masterchef
  );

  const onChangeDeposit = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepositAmount(e.target.value);
  };
  const onChangeWithdraw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawAmount(e.target.value);
  };
  const onChangeClaim = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClaimAmount(e.target.value);
  };

  const onClickMaxButtonDeposit = () => {
    lpTokenBalance && setDepositAmount(formatUnits(lpTokenBalance, DECIMALS));
  };
  const onClickMaxButtonWithdraw = () => {
    depositedBalance &&
      setWithdrawAmount(formatUnits(depositedBalance, DECIMALS));
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
      setLoadingApprove(false);
    }
  };

  const onDeposit = async () => {
    if (!depositAmount) return;
    try {
      setLoadingDeposit(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let masterchefContract = new ethers.Contract(
        masterchef,
        masterchefABI,
        signer
      );
      const tx = await masterchefContract.deposit(
        pid,
        parseUnits(depositAmount, DECIMALS)
      );
      // notify transaction submited
      notify(toast, "Transaction is submited", "success");
      await tx.wait();
      // notify approve success
      notify(toast, "Deposit sucessfully", "success");
    } catch (err) {
      console.log(err);
      const description = getErrorMessage(err);
      notify(toast, description, "error");
    } finally {
      setLoadingDeposit(false);
    }
  };

  const onWithDraw = async () => {
    if (!withdrawAmount) return;
    try {
      setLoadingWithdraw(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let masterchefContract = new ethers.Contract(
        masterchef,
        masterchefABI,
        signer
      );
      const tx = await masterchefContract.withdraw(
        pid,
        parseUnits(withdrawAmount, DECIMALS)
      );
      // notify transaction submited
      notify(toast, "Transaction is submited", "success");
      await tx.wait();
      // notify approve success
      notify(toast, "Withdraw sucessfully", "success");
    } catch (err) {
      console.log(err);
      const description = getErrorMessage(err);
      notify(toast, description, "error");
    } finally {
      setLoadingWithdraw(false);
    }
  };

  const onClaim = async () => {
    if (!claimAmount) return;
    try {
      setLoadingClaim(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let masterchefContract = new ethers.Contract(
        masterchef,
        masterchefABI,
        signer
      );
      const tx = await masterchefContract.claimPendingRdx(
        pid,
        parseUnits(claimAmount, DECIMALS)
      );
      // notify transaction submited
      notify(toast, "Transaction is submited", "success");
      await tx.wait();
      // notify approve success
      notify(toast, "Claim sucessfully", "success");
    } catch (err) {
      console.log(err);
      const description = getErrorMessage(err);
      notify(toast, description, "error");
    } finally {
      setLoadingClaim(false);
    }
  };
  const onClaimAll = async () => {
    try {
      setLoadingClaimAll(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let masterchefContract = new ethers.Contract(
        masterchef,
        masterchefABI,
        signer
      );
      const tx = await masterchefContract.withdraw(
        pid,
        parseUnits("0", DECIMALS)
      );
      // notify transaction submited
      notify(toast, "Transaction is submited", "success");
      await tx.wait();
      // notify approve success
      notify(toast, "Claim all sucessfully", "success");
    } catch (err) {
      console.log(err);
      const description = getErrorMessage(err);
      notify(toast, description, "error");
    } finally {
      setLoadingClaimAll(false);
    }
  };

  return (
    <Box p="0.5rem" borderRadius="0 0 1.37rem 1.37rem">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        bg={theme.colors.gray_light}
        p="1rem 1rem 1.7rem"
        borderRadius={expand ? "none" : "1rem"}
        border="0.06rem solid rgb(237, 238, 242)"
        _hover={{ border: "0.06rem solid rgb(211,211,211)" }}
      >
        <Box w="20%">
          <Flex p="1rem" w="100%" align="center">
            <Image px="0.1rem" src={reward.icon} w="2.0rem"></Image>
            <Image px="0.1rem" src={token.icon} w="2.0rem"></Image>

            <Text px="1rem" as="b">
              {`${reward.name}/${token.name}`.toUpperCase()}
            </Text>
          </Flex>
        </Box>
        <Box w="20%">
          <Flex p="1rem" w="100%" align="center">
            <Image boxSize="2.5rem" src={reward.icon}></Image>
            <VStack p="0.5rem" align="center">
              <Text px="1rem" as="b">
                {`${reward.name}/${token.name}`.toUpperCase()}
              </Text>
              <Text p="0.2rem" as="sup">
                {`Earn - per day`}
              </Text>
            </VStack>
          </Flex>
        </Box>
        <Box w="20%">
          <Flex p="1rem" w="100%" align="center">
            <Text>
              {totalDeposited ? formatUnits(totalDeposited, DECIMALS) : "-"}
            </Text>
          </Flex>
        </Box>
        <Box w="20%">
          <Flex p="1rem" w="100%" align="center">
            <Text>
              {depositedBalance ? formatUnits(depositedBalance, DECIMALS) : "-"}
            </Text>
          </Flex>
        </Box>

        <Box w="20%">
          <Flex p="1rem" w="100%" align="center">
            <Text>12,641,864%</Text>
          </Flex>
        </Box>
        {expand ? (
          <ChevronUpIcon
            bg={theme.colors.gray_light}
            h="1rem"
            width="1rem"
            onClick={() => setExpand(false)}
          />
        ) : (
          <ChevronDownIcon
            bg={theme.colors.gray_light}
            h="1rem"
            width="1rem"
            onClick={() => setExpand(true)}
          />
        )}
      </Flex>
      {expand && (
        <Flex
          borderRadius={expand ? "none" : "1rem"}
          p="0.5rem"
          bg={theme.colors.gray_light}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box
            w="33%"
            p="0.5rem"
            ml="0.5rem"
            borderRadius="1rem"
            border={`0.06rem solid ${theme.colors.gray_dark}`}
          >
            <Flex p="1rem" direction={["column", "row"]}>
              <Text fontSize="sm">Deposit</Text>
              <Spacer />
              <Text noOfLines={1} fontSize="sm">{`Balance: ${
                lpTokenBalance
                  ? parseFloat(formatUnits(lpTokenBalance, DECIMALS)).toFixed(2)
                  : "-"
              } LP`}</Text>
            </Flex>
            <Center
              border={`0.06rem solid ${theme.colors.gray_dark}`}
              borderRadius="1rem"
            >
              <Input
                placeholder="0.0"
                fontSize="1.0rem"
                width="100%"
                size="lg"
                textAlign="left"
                outline="none"
                border="none"
                focusBorderColor="none"
                type="number"
                color="black"
                value={depositAmount}
                onChange={onChangeDeposit}
              />
              <Box px="1rem">
                <Button
                  colorScheme="pink"
                  variant="link"
                  size="sm"
                  onClick={onClickMaxButtonDeposit}
                >
                  max
                </Button>
              </Box>
            </Center>

            <Center>
              {allowanceLpToken &&
              depositAmount &&
              allowanceLpToken.lt(parseUnits(depositAmount, DECIMALS)) ? (
                <Button
                  isLoading={loadingApprove}
                  loadingText="Approving"
                  mt="0.5rem"
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
                  onClick={() =>
                    onApprove(token.address, masterchef, depositAmount)
                  }
                >
                  Approve
                </Button>
              ) : (
                <Button
                  isLoading={loadingDeposit}
                  loadingText="Depositing"
                  mt="0.5rem"
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
                  onClick={onDeposit}
                >
                  Deposit
                </Button>
              )}
            </Center>
          </Box>
          <Box
            w="33%"
            p="0.5rem"
            ml="0.5rem"
            borderRadius="0.5rem"
            border={`0.06rem solid ${theme.colors.gray_dark}`}
          >
            <Flex p="1rem" direction={["column", "row"]}>
              <Text fontSize="sm">Withdraw</Text>
              <Spacer />
              <Text fontSize="sm">
                Deposited:{" "}
                {lpTokenBalance
                  ? parseFloat(formatUnits(depositedBalance, DECIMALS)).toFixed(
                      2
                    )
                  : "-"}{" "}
                LP
              </Text>
            </Flex>
            <Center
              border={`0.06rem solid ${theme.colors.gray_dark}`}
              borderRadius="1rem"
            >
              <Input
                placeholder="0.0"
                fontSize="1.0rem"
                width="100%"
                size="lg"
                textAlign="left"
                outline="none"
                border="none"
                focusBorderColor="none"
                type="number"
                color="black"
                value={withdrawAmount}
                onChange={onChangeWithdraw}
              />
              <Box px="1rem">
                <Button
                  colorScheme="pink"
                  variant="link"
                  size="sm"
                  onClick={onClickMaxButtonWithdraw}
                >
                  max
                </Button>
              </Box>
            </Center>
            <Center>
              <Button
                isLoading={loadingWithdraw}
                loadingText="Withdrawing"
                mt="0.5rem"
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
                onClick={onWithDraw}
              >
                Withdraw
              </Button>
            </Center>
          </Box>
          <Box
            w="33%"
            p="0.5rem"
            ml="0.5rem"
            borderRadius="0.5rem"
            border={`0.06rem solid ${theme.colors.gray_dark}`}
          >
            <Flex p="1rem" direction={["column", "row"]}>
              <Text fontSize="sm">Unclaimed rewards</Text>
              <Spacer />
              <Text fontSize="sm">
                {pendingReward
                  ? parseFloat(formatUnits(pendingReward, DECIMALS)).toFixed(2)
                  : "-"}{" "}
                RDX
              </Text>
            </Flex>
            <Center
              border={`0.06rem solid ${theme.colors.gray_dark}`}
              borderRadius="1rem"
            >
              <Input
                px="1rem"
                placeholder="0.0"
                fontSize="1.0rem"
                width="100%"
                size="lg"
                textAlign="left"
                outline="none"
                border="none"
                focusBorderColor="none"
                type="number"
                color="black"
                value={claimAmount}
                onChange={onChangeClaim}
              />
            </Center>
            <Center>
              <Button
                isLoading={loadingClaimAll}
                loadingText="Claiming"
                mt="0.5rem"
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
                onClick={onClaimAll}
              >
                Claim all
              </Button>
              <Button
                isLoading={loadingClaim}
                loadingText="Claiming"
                mt="0.5rem"
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
                onClick={onClaim}
                isDisabled={
                  claimAmount
                    ? parseUnits(claimAmount, DECIMALS).gt(pendingReward)
                    : false
                }
              >
                Claim
              </Button>
            </Center>
          </Box>
        </Flex>
      )}
    </Box>
  );
}
