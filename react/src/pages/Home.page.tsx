import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import style from "../style.module.css"

function Home() {
  return (
    <div className={style.homePageWrapper}>
      <Header />
      <div
        className={style.wrapper}
        style={{
          color: "#4f6b7c",
          fontFamily: "cursive",
          margin: "5px",
          fontSize: "30px",
        }}>
        <Link to="/auth?page=register">Create account</Link>
        <Link to="/auth?page=login">Log in</Link>
      </div>
      <Footer />
    </div>
  )
}

export default Home
