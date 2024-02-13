import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons"
import {
  Button,
  CardBody,
  FormControl,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react"
import { Field, Form, Formik } from "formik"
import { useMutation } from "react-query"
import * as Yup from "yup"
import { IUser } from "../../../interfaces/interfaces"
import api from "../../utils/api"
import { LocalStorage } from "../../utils/handlers"
import style from "./user.module.css"
import { useEffect } from "react"

export default function EditUserInfo({
  handleBack,
  user,
}: {
  user: IUser
  handleBack: () => void
}) {
  const toast = useToast()
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().required("Email is required"),
  })

  const { mutate, isSuccess, reset } = useMutation({
    mutationFn: api.User.updateUserInfo,
    onSuccess(data, _variables, _context) {
      LocalStorage.saveUser(data)
    },
    onError() {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    },
  })

  function changeUserData(
    val: Pick<IUser, "first_name" | "last_name" | "email">
  ) {
    mutate({
      first_name: val.first_name,
      last_name: val.last_name,
      email: val.email,
    })
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        reset()
      }, 1000)
    }
  }, [isSuccess])

  return (
    <Formik
      validateOnBlur
      validateOnMount
      initialValues={{
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      }}
      onSubmit={changeUserData}
      validationSchema={validationSchema}>
      {({ errors, touched, handleChange }) => (
        <CardBody className={style.editUserInfo}>
          <p>Edit User Details</p>
          <Form>
            <FormControl isInvalid={!!errors.first_name && touched.first_name}>
              <Field
                as={Input}
                type="text"
                id="first_name"
                name="first_name"
                size="sm"
                placeholder={user?.first_name}
                onChange={handleChange}
              />
              {errors.first_name && touched.first_name && (
                <FormErrorMessage>{errors.first_name}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.last_name && touched.last_name}>
              <Field
                as={Input}
                type="text"
                id="last_name"
                name="last_name"
                size="sm"
                placeholder={user?.last_name}
                onChange={handleChange}
              />
              {errors.last_name && touched.last_name && (
                <FormErrorMessage>{errors.last_name}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.email && touched.email}>
              <Field
                as={Input}
                type="text"
                id="email"
                name="email"
                size="sm"
                placeholder={user?.email}
                onChange={handleChange}
              />
              {errors.email && touched.email && (
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              )}
            </FormControl>
            <section className={style.userChoice}>
              <Button
                colorScheme="gray"
                size="md"
                onClick={handleBack}>
                <ArrowBackIcon />
              </Button>
              <Button
                type="submit"
                colorScheme="green"
                size="md">
                {isSuccess ? <CheckIcon /> : "Save"}
              </Button>
            </section>
          </Form>
        </CardBody>
      )}
    </Formik>
  )
}
