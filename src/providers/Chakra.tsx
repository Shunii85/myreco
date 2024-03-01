import { ChakraProvider } from "@chakra-ui/react";
import React, { FC } from "react";
import { theme } from "../theme/theme";

type Props = {
    children: React.ReactNode;
};
export const Chakra: FC<Props> = (props) => {
  const { children } = props;
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};