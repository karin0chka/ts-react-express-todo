import {
  Avatar,
  Button,
  Card,
  CardBody,
  useOutsideClick,
} from "@chakra-ui/react"
import { useRef, useState } from "react"
import { LocalStorage } from "../../utils/handlers"
import LogOut from "../auth/LogOut"
import EditUserInfo from "./EditUserInfo"
import style from "./user.module.css"

export default function User() {
  const [modal, setModal] = useState(false)
  const [tab, setTab] = useState<null | "details" | "password">(null)
  const ref = useRef(null)
  useOutsideClick({
    ref: ref,
    handler: () => setModal(false),
  })

  function handleBack() {
    setTab(null)
  }

  const user = LocalStorage.getUser()

  return (
    user && (
      <section style={{ position: "relative" }}>
        <div
          className={style.userInfoWrapper}
          onClick={() => setModal(true)}>
          <h6 style={{ textTransform: "capitalize" }}>{user.first_name}</h6>
          <Avatar
            size="md"
            name={user.first_name}
            src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
          />
        </div>
        {modal && (
          <Card
            className={style.modal}
            ref={ref}>
            {!tab && (
              <CardBody className={style.navigationWrapper}>
                <Button
                  w="220px"
                  onClick={() => setTab("details")}>
                  Edit User Details
                </Button>
                <Button w="220px">Change Password</Button>

                <LogOut />
              </CardBody>
            )}
            {tab === "details" && (
              <EditUserInfo
                handleBack={handleBack}
                user={user}
              />
            )}
          </Card>
        )}
      </section>
    )
  )
}
