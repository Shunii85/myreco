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

type formInputs = {
  title: string;
  time: number;
};

export const MyRecord: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formInputs>();

  const onSubmit = async (data: any) => {
    const record = await addRecords(data.title, data.time);
    setRecords([...records, ...record]);
    onClose();
    reset();
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
          data-testid="open-modal"
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
          w={{
            base: "80vw",
            md: "70vw",
            lg: "60vw",
            xl: "50vw",
            "2xl": "40vw",
          }}
          p={6}
          m={0}
          data-testid="my-records"
        >
          {records.map((record) => (
            <ListItem fontSize={"28px"} key={record.id}>
              <Flex alignItems={"center"} mb={4}>
                <Flex alignItems={"center"}>
                  <Image
                    src={"orangeNew.png"}
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
              src={"orangeNew.png"}
              alt={"logo"}
              w={"60px"}
              borderRadius={"50%"}
            />
            Add New Record
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <FormControl isInvalid={Boolean(errors.title)}>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  id="title"
                  placeholder="Title"
                  defaultValue={""}
                  autoComplete="off"
                  {...register("title", { required: "内容の入力は必須です。" })}
                  data-testid="title"
                />
                <FormErrorMessage>
                  {errors.title && errors.title.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.time)}>
                <FormLabel htmlFor="time">Time</FormLabel>
                <Input
                  id="time"
                  placeholder="Time"
                  {...register("time", { required: "時間の入力は必須です。" })}
                  type="number"
                  defaultValue={""}
                  autoComplete="off"
                  data-testid="time"
                />
                <FormErrorMessage>
                  {errors.time && errors.time.message}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                bg={"#ffba1a"}
                color={"white"}
                _hover={{ opacity: "0.6" }}
                type="submit"
                data-testid="submit"
              >
                Create
              </Button>
              <Button onClick={() => reset()} ml={3}>
                Reset
              </Button>
              <Button ml={3} onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};
