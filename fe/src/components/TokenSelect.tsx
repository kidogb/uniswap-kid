import { Button, Image, useDisclosure } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import theme from "../theme";
import TokenSelectorModal from "./Modal/TokenSelectModal";

type Props = {
  type:
    | "swap_in"
    | "swap_out"
    | "init_pool_0"
    | "init_pool_1"
    | "add_liquidity";
  value: any;
  image: string;
};

export default function TokenSelect({ type, value, image }: Props) {
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleOpenModal = () => {
    if (type !== "add_liquidity") onOpen();
  };

  return (
    <>
      <TokenSelectorModal type={type} isOpen={isOpen} onClose={onClose} />
      {value !== "" ? (
        <Button
          bg="white"
          borderRadius="1.12rem"
          boxShadow="rgba(0, 0, 0, 0.075) 0px 6px 10px"
          fontWeight="500"
          mr="0.5rem"
          color="black"
          _hover={{ bg: theme.colors.gray_dark }}
          rightIcon={
            <ChevronDownIcon
              color={theme.colors.gray_dark}
              fontSize="1.37rem"
              cursor="pointer"
            />
          }
          onClick={handleOpenModal}
        >
          <Image boxSize="1.5rem" src={image} alt="Logo" mr="0.5rem" />
          {value}
        </Button>
      ) : (
        <Button
          bg={theme.colors.pink_dark}
          color="white"
          p="0rem 1rem"
          borderRadius="1.12rem"
          _hover={{ bg: theme.colors.pink_dark_hover }}
          rightIcon={<ChevronDownIcon fontSize="1.37rem" cursor="pointer" />}
          onClick={handleOpenModal}
        >
          Select token
        </Button>
      )}
    </>
  );
}
