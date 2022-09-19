import { Flex, Box, Text, Button, useDisclosure } from "@chakra-ui/react";

import theme from "../theme";
import { pools } from "../utils/routing";
import PoolDetail from "../components/PoolDetail";
import AddLiquidityModal from "../components/Modal/AddLiquidityModal";
import { useContext } from "react";
import AppContext from "../AppContext";

export default function Pool() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    initPool: { token0, token1, setToken0, setToken1 },
  } = useContext(AppContext);

  const handleCloseAddLiquidityModal = () => {
    // clear token0, token1 then close modal
    setToken0(undefined);
    setToken1(undefined);
    onClose();
  };

  return (
    <Box
      w="50.62rem"
      mx="auto"
      mt="2.25rem"
      boxShadow="rgb(0 0 0 / 8%) 0rem 0.37rem 0.62rem"
      borderRadius="1.37rem"
    >
      <AddLiquidityModal
        type="init_pool"
        isOpen={isOpen}
        onClose={handleCloseAddLiquidityModal}
        token0={token0}
        token1={token1}
      />
      <Flex
        alignItems="center"
        p="1rem 1.25rem 0.5rem"
        bg="white"
        color="rgb(86, 90, 105)"
        justifyContent="space-between"
        borderRadius="1.37rem 1.37rem 0 0"
      >
        <Text as="abbr" color="black" fontSize="xl">
          Pool
        </Text>
        <Button
          isDisabled
          alignContent="right"
          mb="1rem"
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
          onClick={onOpen}
        >
          Add Position
        </Button>
      </Flex>
      <Box bg="white" p="0.5rem" borderRadius="0 0 1.37rem 1.37rem">
        {pools.map((pool, index) => (
          <PoolDetail
            key={index}
            token0={pool.token0}
            token1={pool.token1}
            pair={pool.pair}
          />
        ))}
      </Box>
    </Box>
  );
}
