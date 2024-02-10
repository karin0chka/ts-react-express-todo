import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react"
import { Field, Form, Formik } from "formik"
import { useMutation } from "react-query"
import { useNavigate, useSearchParams } from "react-router-dom"
import * as Yup from "yup"
import style from "../../style.module.css"
import api from "../../utils/api"
import { LocalStorage } from "../../utils/handlers"

export default function Login() {
  const [_, setSearchParams] = useSearchParams()
  const toast = useToast()

  const navigate = useNavigate()
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  })

  const loginRequest = useMutation({
    mutationFn: api.Auth.loginUser,
    onSuccess(data, _variables, _context) {
      LocalStorage.saveUser(data)
      navigate("/dashboard")
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

  function logInUser(val: any) {
    console.log("triggered")
    loginRequest.mutate({
      email: val.email,
      password: val.password,
    })
  }

  function handlePageSwitch() {
    setSearchParams({ page: "register" })
  }

  return (
    <>
      <div className={style.formWrapper}>
        <Formik
          validateOnBlur
          validateOnMount
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={logInUser}
          validationSchema={validationSchema}>
          {({ errors, touched, handleChange, isValid }) => (
            <Form>
              {/* Email */}
              <FormControl isInvalid={!!errors.email && touched.email}>
                <FormLabel
                  htmlFor="email"
                  style={{ textAlign: "center" }}>
                  Email
                </FormLabel>
                <Field
                  as={Input}
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                />
                {errors.email && touched.email && (
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                )}
              </FormControl>
              {/* Password */}
              <FormControl isInvalid={!!errors.password && touched.password}>
                <FormLabel
                  htmlFor="password"
                  style={{ textAlign: "center" }}>
                  Password
                </FormLabel>
                <Field
                  as={Input}
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                />
                {errors.password && touched.password && (
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                )}
              </FormControl>
              <div className={style.wrapper}>
                <Button
                  type="submit"
                  isDisabled={!isValid}
                  className={style.button}
                  isLoading={loginRequest.isLoading}
                  style={{
                    background: "#caf0f8",
                  }}>
                  Login
                </Button>

                <Button
                  onClick={handlePageSwitch}
                  className={style.button}
                  style={{
                    color: "#4f6b7c",
                    fontFamily: "cursive",
                    fontSize: "20px",
                  }}>
                  Don't have an account
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}
