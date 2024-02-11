import { ChatIcon } from "@chakra-ui/icons"
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Tab,
  TabList,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { INotification } from "../../interfaces/interfaces"
import { deRef, isNotification } from "../utils/utils"
import api from "../utils/api"
import { Notification } from "./Notification"

export function NotificationSideBar() {
  const [tabIndex, setTabIndex] = useState(0)

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  const [rawNotifications, setRawNotifications] = useState<INotification[]>([])

  //return read / unread depending on tabIndex
  const filteredNotifications = useMemo(
    () => rawNotifications.filter((n) => n.is_read === (tabIndex === 1)),
    [tabIndex, rawNotifications]
  )

  function updateNotificationList(id: number, type: "update" | "delete") {
    // unbinding and creating new value in memory, so we can change the raw state, as we can't change raw notification state directly
    const notifications = deRef(rawNotifications)
    const index = notifications.findIndex((v) => v.id === id)
    if (index === -1) {
      return
    }
    if (type === "update") {
      notifications[index].is_read = !notifications[index].is_read
      setRawNotifications(notifications)
    } else {
      notifications.splice(index, 1)
      setRawNotifications(notifications)
    }
    // TODO investigate why not working
    // if (type === "update") {
    //   setRawNotifications((r_n) => {
    //     r_n[index].is_read = !r_n[index].is_read
    //     return r_n
    //   })
    // } else {
    //   setRawNotifications((r_n) => {
    //     r_n.splice(index, 1)
    //     return r_n
    //   })
    // }
  }

  let SSE = useRef<EventSource | null>(null)

  //TODO implement this logic as a hook
  async function fetchData() {
    await new Promise((res) => setTimeout(res, 10))
    if (SSE.current) {
      return
    }
    SSE.current = await api.Notification.connectToNotifications()

    //when sse is open -> getAlluser notification and store them
    SSE.current.onopen = () => {
      api.Notification.getNotification().then((res) => {
        setRawNotifications(res)
      })
    }
    SSE.current.onerror = () => {
      setTimeout(fetchData, 1000 * 30)
    }
    //use JSON parse(parse data) && push it to notifications state
    SSE.current.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (isNotification(data)) {
        setRawNotifications((v) => {
          v.push(data)
          return v
        })
      }
    }
  }
  const timeout = useRef<NodeJS.Timeout | null>(null)

  function focusEventListener() {
    if (timeout.current) {
      clearTimeout(timeout.current)
    } else {
      fetchData()
    }
  }

  function blurEventListener() {
    timeout.current = setTimeout(() => {
      timeout.current = null
      SSE.current?.close()
      SSE.current = null
    }, 1000 * 30)
  }

  useEffect(() => {
    if (document.hasFocus()) fetchData()
    window.addEventListener("focus", focusEventListener)
    window.addEventListener("blur", blurEventListener)

    return () => {
      if (SSE.current) {
        SSE.current.close()
        SSE.current = null
      }
      window.removeEventListener("focus", focusEventListener)
      window.removeEventListener("blur", blurEventListener)
    }
  }, [])

  return (
    <>
      <IconButton
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
        isRound={true}
        variant="solid"
        aria-label="Notification"
        icon={<ChatIcon />}
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader textAlign="center">Notification</DrawerHeader>

          <DrawerBody>
            <Box>
              <Tabs
                index={tabIndex}
                onChange={handleTabsChange}>
                <TabList>
                  <Tab>Unread</Tab>
                  <Tab>Read</Tab>
                </TabList>
              </Tabs>
            </Box>
            <Box>
              {filteredNotifications.map((n, i) => (
                <Notification
                  notification={n}
                  key={i + "notification"}
                  updateNotificationList={updateNotificationList}
                />
              ))}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
