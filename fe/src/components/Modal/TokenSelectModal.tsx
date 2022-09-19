import {
  Box,
  Divider,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import tokens, { Token } from "../../abi/tokens";
import AppContext from "../../AppContext";
import theme from "../../theme";

type Props = {
  type:
    | "swap_in"
    | "swap_out"
    | "init_pool_0"
    | "init_pool_1"
    | "add_liquidity";
  isOpen: any;
  onClose: any;
};

export default function TokenSelectModal({ type, isOpen, onClose }: Props) {
  const {
    swap: { setTokenIn, setTokenOut },
    initPool: { setToken0, setToken1 },
  } = useContext(AppContext);
  const handleSelectToken = (token: Token) => {
    if (type === "swap_in") setTokenIn(token);
    else if (type === "swap_out") setTokenOut(token);
    else if (type === "init_pool_0") setToken0(token);
    else if (type === "init_pool_1") setToken1(token);
    onClose();
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
        <ModalHeader
          color={theme.colors.gray_text}
          px={4}
          fontSize="lg"
          fontWeight="medium"
        >
          <Text p="0.2rem" as="abbr" fontSize="2xl">
            Select a token
          </Text>
        </ModalHeader>
        <ModalCloseButton
          color={theme.colors.gray_dark}
          fontSize="md"
          _hover={{
            color: "black",
          }}
        />
        <ModalBody pt={0} px={0}>
          <Box w="100%" mx="auto">
            <Flex
              direction={["row", "column"]}
              alignItems="center"
              p="1rem 1.25rem 0.5rem"
              bg="white"
              color="rgb(86, 90, 105)"
              justifyContent="space-between"
              borderRadius="1.37rem 1.37rem 0 0"
            >
              <Divider />
              {tokens.map((token, index) => (
                <Flex
                  key={index}
                  w="100%"
                  _hover={{
                    bg: theme.colors.gray_light,
                  }}
                  align="center"
                  p="1rem"
                  onClick={() => {
                    handleSelectToken(token);
                  }}
                >
                  <Image boxSize="2.5rem" src={token.icon} alt="Logo" />
                  <Text noOfLines={1} px="1rem" fontSize="md" as="b">
                    {token.name}
                  </Text>

                  <Spacer />
                  {/* <Text fontSize="md" noOfLines={1} px="1rem" as="b">
                    100
                  </Text> */}
                </Flex>
              ))}
            </Flex>
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
