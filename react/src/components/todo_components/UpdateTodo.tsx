import { CheckIcon, EditIcon } from "@chakra-ui/icons"
import {
  Button,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { Field, Form, Formik } from "formik"
import { useEffect } from "react"
import { useMutation, useQueryClient } from "react-query"
import * as Yup from "yup"
import { QueryName } from "../../../interfaces/enum"
import { ITodo } from "../../../interfaces/interfaces"
import api from "../../utils/api"

export default function UpdateTodo({ todo }: { todo: ITodo }) {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
  })
  const queryClient = useQueryClient()

  const {
    mutate,
    isLoading: todoIsUpdating,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: api.Todo.updateTodo,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QueryName.GetTodos] })
    },
    onError(error) {
      console.log(error)
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    },
  })

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose()
        reset()
      }, 1000)
    }
  }, [isSuccess])

  return (
    <>
      <IconButton
        onClick={onOpen}
        marginLeft="auto"
        isRound={true}
        variant="solid"
        size="sm"
        mt="5px"
        aria-label="update button"
        icon={<EditIcon />}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit</ModalHeader>
          <ModalCloseButton />
          <Formik
            validateOnBlur
            validateOnMount
            initialValues={todo}
            onSubmit={(values, { setSubmitting }) => {
              mutate(values)
              console.log("->   ", values)
              setSubmitting(false)
            }}
            validationSchema={validationSchema}>
            {({ errors, touched, handleChange, isValid }) => (
              <Form>
                <ModalBody>
                  <FormControl isInvalid={!!errors.title && touched.title}>
                    <Field
                      as={Input}
                      type="text"
                      id="title"
                      name="title"
                      size="sm"
                      placeholder="Title"
                      onChange={handleChange}
                    />
                    {errors.title && touched.title && (
                      <FormErrorMessage>{errors.title}</FormErrorMessage>
                    )}
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.description && touched.description}>
                    <Field
                      as={Textarea}
                      type="text"
                      id="description"
                      name="description"
                      size="sm"
                      placeholder="Description"
                      onChange={handleChange}
                    />
                    {errors.description && touched.description && (
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    )}
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    isDisabled={!isValid}
                    isLoading={todoIsUpdating}
                    variant="ghost">
                    {isSuccess ? <CheckIcon /> : "Update"}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  )
}
