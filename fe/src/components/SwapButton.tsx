import { Button, Box } from '@chakra-ui/react';
import theme from './../theme';

import { Goerli, useEthers } from '@usedapp/core';

interface Props {
  onSwap: () => void;
  loadingSwap: boolean;
}
interface AlertButtonProps {
  text: string;
}

export function AlertButton({ text }: AlertButtonProps) {
  return (
    <Box mt="0.5rem">
      <Button
        size="lg"
        variant="ghost"
        color={theme.colors.gray_dark}
        bg={theme.colors.gray_light}
        width="100%"
        p="1.62rem"
        borderRadius="1.25rem"
        _hover={{ bg: theme.colors.gray_light }}
      >
        {text}
      </Button>
    </Box>
  );
}

export default function SwapButton({ onSwap, loadingSwap }: Props) {
  const { activateBrowserWallet, account, chainId } = useEthers();

  async function handleConnectWallet() {
    try {
      activateBrowserWallet();
    } catch (err) {
      console.log(err);
    }
  }

  return account && chainId === Goerli.chainId ? (
    <Box mt="0.5rem">
      <Button
        size="lg"
        color="white"
        bg={theme.colors.pink_dark}
        width="100%"
        p="1.62rem"
        borderRadius="1.25rem"
        _hover={{ bg: theme.colors.pink_dark_hover }}
        isLoading={loadingSwap}
        loadingText="Swapping"
        onClick={onSwap}
      >
        Swap
      </Button>
    </Box>
  ) : account ? (
    <Button
      size="lg"
      color={'blackAlpha.900'}
      bg={theme.colors.gray_light}
      width="100%"
      p="1.62rem"
      borderRadius="1.25rem"
      _hover={{
        bg: theme.colors.gray_dark,
      }}
      isDisabled
    >
      Please switch network
    </Button>
  ) : (
    <Box mt="0.5rem">
      <Button
        size="lg"
        color={theme.colors.pink_dark}
        bg={theme.colors.pink_light}
        width="100%"
        p="1.62rem"
        borderRadius="1.25rem"
        _hover={{ bg: theme.colors.pink_light_hover }}
        onClick={handleConnectWallet}
      >
        Connect Wallet
      </Button>
    </Box>
  );
}
