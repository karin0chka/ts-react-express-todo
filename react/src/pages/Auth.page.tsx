import { useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import Login from "../components/auth_components/Login"
import Register from "../components/auth_components/Register"
import Header from "../components/Header"
import Footer from "../components/Footer"

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = useMemo(() => searchParams.get("page"), [searchParams])

  useEffect(() => {
    if (!searchParams.get("page")) setSearchParams({ page: "login" })
  }, [])

  return (
    <>
      <Header />
      <main style={style}>{page === "register" ? <Register /> : <Login />}</main>
      <Footer />
    </>
  )
}
const style: React.CSSProperties = {
  display: "flex",
  flexGrow: 1,
  alignItems: "center",
  justifyContent: "center",
}
