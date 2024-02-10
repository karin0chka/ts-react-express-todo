import { ChakraProvider } from "@chakra-ui/react"
import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "react-query"
import { RouterProvider, createBrowserRouter, redirect } from "react-router-dom"
import "./global.css"
import Auth from "./pages/Auth.page"
import Dashboard from "./pages/Dashboard"
import Home from "./pages/Home.page"
import { LocalStorage } from "./utils/handlers"
import Header from "./components/Header"
import Footer from "./components/Footer"

const twentyFourHoursInMs = 1000 * 60 * 60 * 24
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
    loader: () => {
      const user = LocalStorage.getUser()
      if (user) return redirect("/dashboard")
      return null
    },
  },
  {
    path: "/dashboard",
    element: (
      <>
        <Header />
        <Dashboard />
        <Footer />
      </>
    ),
    loader: () => {
      LocalStorage.getUser()
      const user = LocalStorage.getUser()
      if (!user) return redirect("/auth?page=login")
      return null
    },
  },
])

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
