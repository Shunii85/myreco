import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme/theme";
import { MyRecord } from "./MyRecord";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <MyRecord />
    </ChakraProvider>
  );
}

export default App;
