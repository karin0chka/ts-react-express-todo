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
import api from "../utils/api"
import { INotification } from "../../interfaces/interfaces"
import { isNotification } from "../utils"

export function NotificationSideBar() {
  const [tabIndex, setTabIndex] = useState(0)

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef(null)

  const [rawNotifications, setRawNotifications] = useState<INotification[]>([])
  const activeNotifications = useMemo(
    () => rawNotifications.filter((n) => n.is_read === (tabIndex === 1)),
    [tabIndex, rawNotifications]
  )

  let SSE = useRef<EventSource|null>(null)

  //TODO implement this logic as a hook
  async function fetchData() {
    console.log("exist", SSE)
    if (SSE.current) {
      SSE.current.close()
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

  useEffect(() => {
    fetchData()
    return () => {
      if (SSE.current) {
        SSE.current.close()
      }
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
            <Box>{activeNotifications.length}</Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
