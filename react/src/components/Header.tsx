import { Link } from "react-router-dom"
import LogOut from "./auth_components/LogOut"
import { LocalStorage } from "../utils/handlers"
import { NotificationSideBar } from "./NotificationSideBar"

export default function Header() {
  return (
    <header style={style}>
      <Link to="/"> TODO</Link>
      <section style={icon_wrapper}>
        {LocalStorage.getUser() && <NotificationSideBar />}
        {LocalStorage.getUser() && <LogOut />}
      </section>
    </header>
  )
}

const style: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  backgroundColor: "#caf0f8",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  fontSize: 30,
  fontFamily: "cursive",
  color: "#4f6b7c",
}

const icon_wrapper: React.CSSProperties = {
  position: "absolute",
  right: 0,
}
