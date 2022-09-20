import { Flex, Box, Text, Divider } from "@chakra-ui/react";

import FarmDetail from "../components/FarmDetail";

import tokens from "../abi/tokens";

export default function Farm() {
  return (
    <Box
      w="60.62rem"
      mx="auto"
      mt="2.25rem"
      boxShadow="rgb(0 0 0 / 8%) 0rem 0.37rem 0.62rem"
      borderRadius="1.37rem"
    >
      <Flex
        alignItems="left"
        p="1rem 1.25rem 0.5rem"
        bg="white"
        color="rgb(86, 90, 105)"
        justifyContent="space-between"
        borderRadius="1.37rem 1.37rem 0 0"
      >
        <Text as="abbr" color="black" fontSize="xl">
          Farm
        </Text>
      </Flex>
      <Box bg="white" borderRadius="0 0 1.37rem 1.37rem">
        <Box>
          <Flex alignItems="center">
            <Box w="20%">
              <Flex p="1rem" w="100%" align="center">
                <Text px="1rem">Pool</Text>
              </Flex>
            </Box>
            <Box w="20%">
              <Flex p="1rem" w="100%" align="left">
                <Text px="1rem">Reward</Text>
              </Flex>
            </Box>
            <Box w="20%">
              <Flex p="1rem" w="100%" align="left">
                <Text>Total Deposited</Text>
              </Flex>
            </Box>
            <Box w="20%">
              <Flex p="1rem" w="100%" align="left">
                <Text>Deposited</Text>
              </Flex>
            </Box>

            <Box w="20%">
              <Flex p="1rem" w="100%" align="left">
                <Text>APR</Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
        <Divider />
        <FarmDetail token={tokens[2]} reward={tokens[6]} pid={0} allocPoint={1}/>
      </Box>
    </Box>
  );
}
