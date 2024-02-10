import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { Field, Form, Formik } from "formik"

import { AddIcon } from "@chakra-ui/icons"
import { useMutation, useQueryClient } from "react-query"
import * as Yup from "yup"
import style from "../../style.module.css"
import api from "../../utils/api"
import { QueryName } from "../../../interfaces/enum"

export default function AddTodo() {
  const toast = useToast()
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
  })

  const queryClient = useQueryClient()

  const { isLoading: isLoadingAddTodo, mutate } = useMutation({
    mutationFn: api.Todo.createTodo,
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

  return (
    <Formik
      validateOnBlur
      validateOnMount
      initialValues={{
        title: "",
        description: "",
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        mutate(values, { onSuccess: () => resetForm() })
        setSubmitting(false)
      }}
      validationSchema={validationSchema}>
      {({ errors, touched, handleChange, isValid }) => (
        <Form className={style.wrapper}>
          <FormControl
            isInvalid={!!errors.title && touched.title}
            className={style.inlineWrapper}>
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
            isInvalid={!!errors.description && touched.description}
            className={style.inlineWrapper}>
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
          <Button
            type="submit"
            isDisabled={!isValid}
            isLoading={isLoadingAddTodo}
            className={style.button}
            style={{
              background: "#caf0f8",
            }}>
            <AddIcon boxSize={3} />
          </Button>

          {/* <DeleteTodo /> */}
        </Form>
      )}
    </Formik>
  )
}
