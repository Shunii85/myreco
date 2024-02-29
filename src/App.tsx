import { ChakraProvider } from "@chakra-ui/react";
import { MyRecord } from "./MyRecord";
import { theme } from "./theme/theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <MyRecord />
    </ChakraProvider>
  );
}

export default App;
