import {
  Card,
  CardBody,
  CardHeader,
  IconButton,
  useToast,
} from "@chakra-ui/react"
import { INotification } from "../../interfaces/interfaces"
import { DeleteIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { useMutation } from "react-query"
import api from "../utils/api"

export function Notification({
  notification,
  updateNotificationList,
}: {
  notification: INotification
  updateNotificationList: (id: number, type: "update" | "delete") => void
}) {
  const toast = useToast()
  const { mutate: deleteReq } = useMutation({
    mutationFn: api.Notification.deleteNotification,
    onSuccess() {
      updateNotificationList(notification.id, "delete")
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

  const { mutate: updateReq } = useMutation({
    mutationFn: api.Notification.updateNotification,
    onSuccess() {
        updateNotificationList(notification.id, "update")
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
    <Card mt="10px">
      <CardHeader
        pb="0"
        pr="5px"
        pt="5px"
        display="flex"
        gap="5px"
        alignItems="center">
        <span style={{ fontStyle: "italic", marginLeft: "auto" }}>
          {new Date(notification.created_at).toLocaleDateString()}
        </span>
        <IconButton
          color="blue"
          aria-label="read message"
          icon={notification.is_read ? <ViewIcon /> : <ViewOffIcon />}
          isRound={true}
          size="sm"
          onClick={() =>
            updateReq({ id: notification.id, is_read: !notification.is_read })
          }
        />
        <IconButton
          color="tomato"
          aria-label="delete message"
          icon={<DeleteIcon />}
          isRound={true}
          size="sm"
          onClick={() => deleteReq(notification.id)}
        />
      </CardHeader>
      <CardBody
        pt="0"
        pb="5px">
        <h6>{notification.title}</h6>
        <p>{notification.message}</p>
      </CardBody>
    </Card>
  )
}
