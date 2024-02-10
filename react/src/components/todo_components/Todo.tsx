import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  ListItem,
  useToast,
} from "@chakra-ui/react"
import { ITodo } from "../../../interfaces/interfaces"
import DeleteTodo from "./DeleteTodo"
import UpdateTodo from "./UpdateTodo"
import { useMutation } from "react-query"
import api from "../../utils/api"

export default function Todo({ todo }: { todo: ITodo }) {
  const toast = useToast()
  const { mutate, isLoading } = useMutation({
    mutationFn: api.Todo.updateTodo,
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

  return (
    <ListItem style={{ listStyleType: "none", padding: "5px" }}>
      <Accordion allowToggle>
        <AccordionItem
          display="grid"
          gridGap={2}
          gridTemplateColumns="3% 1fr 10% 10%">
          <Checkbox
            alignItems="start"
            mt="10px"
            isChecked={todo.is_done}
            isDisabled={isLoading}
            onChange={() => {
              if (todo.is_done === false) {
                todo.is_done = true
              } else {
                todo.is_done = false
              }
              mutate(todo)
            }}></Checkbox>
          <Box
            display="flex"
            flexDirection="column">
            <AccordionButton>
              <Box
                flex="1"
                textAlign="left"
                width="100%">
                <h2>{todo.title}</h2>
              </Box>
              {todo.description && <AccordionIcon justifyContent="flex-eng" />}
            </AccordionButton>
            {todo.description && (
              <AccordionPanel pb={4}>{todo.description}</AccordionPanel>
            )}
          </Box>

          <UpdateTodo todo={todo} />
          <DeleteTodo todo={todo} />
        </AccordionItem>
      </Accordion>
    </ListItem>
  )
}
