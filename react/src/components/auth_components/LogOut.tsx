import { useMutation } from "react-query"
import api from "../../utils/api"
import { LocalStorage } from "../../utils/handlers"
import { useNavigate } from "react-router-dom"
import { Button } from "@chakra-ui/react"

export default function LogOut() {

  const navigate = useNavigate()
  const logOut = useMutation({
    mutationFn: api.Auth.logOut,
    onSuccess() {
      LocalStorage.removeUser()
      navigate("/auth?page=login")
      console.log(document.cookie)
    },
  })

  function logOutUser() {
    logOut.mutate()
  }
  return (
    <>
      <Button
        style={button}
        onClick={logOutUser}>
        Log Out
      </Button>
    </>
  )
}
const button: React.CSSProperties = {
  backgroundColor: "Red",
  fontFamily: "cursive",
  color: "black",
  fontSize: 15,
  padding: "5px",
  margin: "5px",
}
