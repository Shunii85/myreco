import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Image,
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
  TagLabel,
  Text,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addRecords, getAllRecords } from "./utils/supabaseFunctions";
import { Record } from "./domain/record";
import { FaRegEdit } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { RiDeleteBin5Line } from "react-icons/ri";

export const MyRecord: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: { title: string; time: number }) => {
    const record = await addRecords(data.title, data.time);
    setRecords([...records, ...record]);
    onClose();
  };

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
    <Box>
      <Center mt={10} mb={6} display={"flex"} flexDirection={"column"}>
        <Heading as={"h1"} color={"orange"}>
          マイレコ
        </Heading>
      </Center>
      <Center mb={4}>
        <Button
          onClick={onOpen}
          bg={"#ffba1a"}
          color={"white"}
          _hover={{ opacity: "0.6" }}
        >
          New
        </Button>
      </Center>
      <Center>
        <UnorderedList
          bg={"white"}
          spacing={4}
          listStyleType={"none"}
          borderRadius={"1em"}
          w={"700px"}
          p={6}
          m={0}
        >
          {records.map((record) => (
            <ListItem fontSize={"28px"} key={record.id}>
              <Flex>
                <Flex mb={4} alignItems={"center"}>
                  <Image
                    src={"./public/orangeNew.png"}
                    alt={"logo"}
                    w={"60px"}
                    borderRadius={"50%"}
                  />
                  <Text>{record.title}</Text>
                </Flex>
                <Spacer />
                <Text mr={6}>{record.time}時間</Text>
                <IconContext.Provider value={{ size: "1.5em" }}>
                  <IconButton aria-label="edit" icon={<FaRegEdit />} />
                  <IconButton
                    aria-label="delete"
                    ml={4}
                    icon={<RiDeleteBin5Line />}
                  />
                </IconContext.Provider>
              </Flex>
              <Divider />
            </ListItem>
          ))}
        </UnorderedList>
      </Center>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} alignItems={"center"}>
            <Image
              src={"./public/orangeNew.png"}
              alt={"logo"}
              w={"60px"}
              borderRadius={"50%"}
            />
            Add New Record
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  id="title"
                  placeholder="Title"
                  {...register("title", { required: true })}
                  type="text"
                />
                <FormErrorMessage>
                  {errors.title && "Title is required"}
                </FormErrorMessage>
                <FormLabel htmlFor="time">Time</FormLabel>
                <Input
                  id="time"
                  placeholder="Time"
                  {...register("time", { required: true })}
                  type="number"
                />
                <FormErrorMessage>
                  {errors.time && "Time is required"}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                bg={"#ffba1a"}
                color={"white"}
                _hover={{ opacity: "0.6" }}
                type="submit"
              >
                Create
              </Button>
              <Button mr={3} ml={3} onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};
