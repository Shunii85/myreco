import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#fcf0c7",
        color: "gray.800",
      },
    },
  },
  colors: {
    orange: {
      default: "#ffba1a",
      100: "#fce7ae",
      200: "#f9d67c",
      300: "#f7c340",
    },
  },
});
