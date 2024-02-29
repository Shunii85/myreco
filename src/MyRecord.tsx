import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { getAllRecords } from "./utils/supabaseFunctions";

//学習内容と学習時間をもつ学習記録クラス
export class Record {
  constructor(public id: string, public title: string, public time: string) {}
}

export const MyRecord: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRecords = async () => {
      setLoading(true);
      const data = await getAllRecords();
      setRecords(data);
      setLoading(false);
    };
    getRecords();
  }, []);
  return loading ? (
    <Center h={"100vh"}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="gray.500"
        size="xl"
      />
    </Center>
  ) : (
    <Box mx={"15vw"}>
      <Center m={10} display={"flex"} flexDirection={"column"}>
        <Heading>マイレコ</Heading>
      </Center>
      <Button onClick={onOpen} colorScheme="teal">
        Open Modal
      </Button>
      <Center>
        <UnorderedList
          bg={"white"}
          spacing={4}
          listStyleType={"none"}
          borderRadius={"1em"}
          w={"700px"}
          p={6}
        >
          {records.map((record) => (
            <>
              <Flex justifyItems={"center"} alignItems={"center"}>
                <ListItem key={record.id} fontSize={"28px"}>
                  {record.title}: {record.time}時間
                </ListItem>
                <Spacer />
                <Button>Edit</Button>
                <Button ml={4}>Delete</Button>
              </Flex>
              <Divider />
            </>
          ))}
        </UnorderedList>
      </Center>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input placeholder="学習内容" />
          </ModalBody>

          <ModalFooter>
            <Button>Save</Button>
            <Button colorScheme="blue" mr={3} ml={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
