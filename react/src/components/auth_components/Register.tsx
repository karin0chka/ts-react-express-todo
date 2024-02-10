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

export default function Register() {
  const [_, setSearchParams] = useSearchParams()
  const toast = useToast()

  const navigate = useNavigate()
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
        "Must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 6 characters long"
      ),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Password confirmation is required"),
  })

  const registerRequest = useMutation({
    mutationFn: api.Auth.registerUser,
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

  function createUser(val: any) {
    console.log("trigger")
    registerRequest.mutate({
      first_name: val.firstName,
      last_name: val.lastName,
      email: val.email,
      password: val.password,
    })
  }

  function handlePageSwitch() {
    setSearchParams({ page: "login" })
  }

  return (
    <div className={style.formWrapper}>
      <Formik
        validateOnBlur
        validateOnMount
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          repeatPassword: "",
        }}
        onSubmit={createUser}
        validationSchema={validationSchema}>
        {({ errors, touched, handleChange, isValid }) => (
          <Form>
            {/* First Name */}
            {/* VStack */}
            <FormControl isInvalid={!!errors.firstName && touched.firstName}>
              <FormLabel
                htmlFor="firstName"
                style={{ textAlign: "center" }}>
                First Name
              </FormLabel>
              <Field
                as={Input}
                type="text"
                id="firstName"
                name="firstName"
                onChange={handleChange}
              />
              {errors.firstName && touched.firstName && (
                <FormErrorMessage>{errors.firstName}</FormErrorMessage>
              )}
            </FormControl>
            {/*  Last Name */}
            <FormControl isInvalid={!!errors.lastName && touched.lastName}>
              <FormLabel
                htmlFor="lastName"
                style={{ textAlign: "center" }}>
                Last Name
              </FormLabel>
              <Field
                as={Input}
                type="text"
                id="lastName"
                name="lastName"
                onChange={handleChange}
              />
              {errors.lastName && touched.lastName && (
                <FormErrorMessage>{errors.lastName}</FormErrorMessage>
              )}
            </FormControl>
            {/*  Email */}
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
            {/* Repeat Password */}
            <FormControl
              isInvalid={!!errors.repeatPassword && touched.repeatPassword}>
              <FormLabel
                htmlFor="repeatPassword"
                style={{ textAlign: "center" }}>
                Repeat Password
              </FormLabel>
              <Field
                as={Input}
                type="password"
                id="repeatPassword"
                name="repeatPassword"
                onChange={handleChange}
              />
              {errors.repeatPassword && touched.repeatPassword && (
                <FormErrorMessage>{errors.repeatPassword}</FormErrorMessage>
              )}
            </FormControl>
            <div className={style.wrapper}>
              <Button
                type="submit"
                isDisabled={!isValid}
                className={style.button}
                style={{
                  background: "#caf0f8",
                }}>
                Register
              </Button>
              <Button
                onClick={handlePageSwitch}
                className={style.button}
                style={{
                  color: "#4f6b7c",
                  fontFamily: "cursive",
                  fontSize: "20px",
                }}>
                Already have an account
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
