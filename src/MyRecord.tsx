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
import {
  addRecords,
  deleteRecord,
  getAllRecords,
  updateRecord,
} from "./utils/supabaseFunctions";
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
  const [currentRecord, setCurrentRecord] = useState<Record | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formInputs>();

  const onClickDelete = async (id: string) => {
    // await deleteRecord(id);;
    setRecords(records.filter((record) => record.id !== id));
    deleteRecord(id);
  };

  const onSubmit = async (data: formInputs) => {
    const { title, time } = data;
    if (currentRecord) {
      const updatedRecord = await updateRecord(currentRecord.id, title, time);
      setRecords(
        records.map((record) =>
          record.id === currentRecord.id ? updatedRecord[0] : record
        )
      );
    } else {
      const newRecord = await addRecords(title, time);
      setRecords([...records, newRecord[0]]);
    }
    onClose();
    reset();
  };

  const openNewModeModal = () => {
    setCurrentRecord(null);
    onOpen();
    reset({
      title: "",
      time: 0,
    });
  };
  const openEditModeModal = (record: Record) => {
    setCurrentRecord(record);
    onOpen();
    reset({
      title: record.title,
      time: record.time,
    });
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
    <Center h={"100vh"} data-testid="loading">
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
        <Heading as={"h1"} color={"orange"} data-testid="app-title">
          マイレコ
        </Heading>
      </Center>
      <Center mb={4}>
        <Button
          onClick={openNewModeModal}
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
          minH={"300px"}
          p={6}
          m={0}
          data-testid="my-records"
        >
          {records.map((record) => (
            <ListItem fontSize={{ base: "16px", md: "24px" }} key={record.id}>
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
                  <IconButton
                    aria-label="edit"
                    icon={<FaRegEdit />}
                    onClick={() => openEditModeModal(record)}
                    data-testid="edit-button"
                  />
                  <IconButton
                    aria-label="delete"
                    ml={4}
                    icon={<RiDeleteBin5Line />}
                    onClick={() => onClickDelete(record.id)}
                    data-testid="delete-button"
                  />
                </IconContext.Provider>
              </Flex>
              <Divider />
            </ListItem>
          ))}
        </UnorderedList>
      </Center>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            alignItems={"center"}
            data-testid="modal-title"
          >
            <Image
              src={"orangeNew.png"}
              alt={"logo"}
              w={"60px"}
              borderRadius={"50%"}
            />
            {currentRecord ? "記録編集" : "新規登録"}
          </ModalHeader>
          <ModalCloseButton data-testid="modal-close-button" />
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
                <FormErrorMessage data-testid="title-error">
                  {errors.title && errors.title.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={Boolean(errors.time)}>
                <FormLabel htmlFor="time">Time</FormLabel>
                <Input
                  id="time"
                  placeholder="Time"
                  {...register("time", {
                    required: "時間の入力は必須です。",
                    validate: (value) => {
                      return value >= 0 || "0以上の数値を入力してください。";
                    },
                  })}
                  defaultValue={""}
                  autoComplete="off"
                  data-testid="time"
                />
                <FormErrorMessage data-testid="time-error">
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
                {currentRecord ? "Update" : "Create"}
              </Button>
              <Button onClick={() => reset()} ml={3}>
                Reset
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};
