import { DeleteIcon } from "@chakra-ui/icons"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react"

import { useRef } from "react"
import { useMutation, useQueryClient } from "react-query"
import api from "../../utils/api"
import { ITodo } from "../../../interfaces/interfaces"
import { QueryName } from "../../../interfaces/enum"

export default function DeleteTodo({ todo }: { todo: ITodo }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutate, isLoading: isLoadingDeleteTodo } = useMutation({
    mutationFn: api.Todo.deleteTodo,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QueryName.GetTodos] })
    },
    onError() {
      toast({
        title: "Something went wrong",
        // description: "We've created your account for you.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    },
  })

  function deleteTodo() {
    mutate(todo)
  }

  return (
    <>
      <IconButton
        colorScheme="red"
        onClick={onOpen}
        isRound={true}
        variant="solid"
        aria-label="delete button"
        size="sm"
        mt="5px"
        icon={<DeleteIcon />}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold">
              Delete Todo
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                isLoading={isLoadingDeleteTodo}
                onClick={deleteTodo}
                ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
