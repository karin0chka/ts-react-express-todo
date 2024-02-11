import axios from "axios"
import { ITodo, IUser, LoginUser } from "../../interfaces/interfaces"
import config from "./config"
import { LocalStorage } from "./handlers"

const api = config.API

axios.defaults.withCredentials = true

axios.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (
      error.response.status === 401 &&
      !error.response.config.url.includes(`auth/refresh`)
    ) {
      const { status } = await Auth.refresh()

      if (status === 200) {
        return axios(error.response.config)
      } else {
        LocalStorage.removeUser()
        location.reload()
      }
    } else if (error.response.status === 401) {
      LocalStorage.removeUser()
      location.reload()
    }
    return Promise.reject(error)
  }
)

// Auth request
namespace Auth {
  export async function checkConnection() {
    return (await axios.get(`${api}/health`)).data
  }
  export async function registerUser(
    userDto: Pick<IUser, "email" | "first_name" | "last_name" | "password">
  ) {
    const response = await axios.post(`${api}/auth/register`, userDto)
    return response.data
  }

  export async function loginUser(user: LoginUser) {
    const response = await axios.post(`${api}/auth/login`, user)
    return response.data
  }
  export async function refresh() {
    return await axios.post<string>(`${api}/auth/refresh`)
  }

  export async function logOut() {
    const response = await axios.post(`${api}/auth/log-out`)
    return response.data
  }
  export async function changePassword() {
    const response = await axios.put(`${api}/auth/change-password`)
    return response.data
  }
}

//User request
namespace User {
  export async function getUser() {
    const response = await axios.get(`${api}/user/`)
    return response.data
  }
  export async function updateUserInfo() {
    //@ts-ignore
    const response = await axios.put(`${api}/user/:${user.id}`)
    return response.data
  }
  export async function deleteUser() {
    const response = await axios.delete(`${api}/user/`)
    return response.data
  }
  export async function userTodos() {
    const response = await axios.get<any[]>(`${api}/user/todos`)
    return response.data
  }
}

//do request
namespace Todo {
  export async function createTodo(todo: Pick<ITodo, "title" | "description">) {
    const response = await axios.post(`${api}/todo/`, todo)
    return response.data
  }
  export async function updateTodo(todo: ITodo) {
    const response = await axios.put(`${api}/todo/${todo.id}`, todo)
    return response.data
  }

  export async function deleteTodo(todo: ITodo) {
    const response = await axios.delete(`${api}/todo/${todo.id}`)
    return response.data
  }
}

namespace Report {
  export async function createTodo() {
    const response = await axios.post(`${api}/report/create`)
    return response.data
  }
  export async function readTodo(reportId: number) {
    const response = await axios.get(`${api}/report/read/${reportId}`)
    return response.data
  }
  export async function updateTodo(reportId: number) {
    const response = await axios.put(`${api}/report/update/${reportId}`)
    return response.data
  }
}

namespace Notification {
  export async function connectToNotifications() {
    const credentials = {
      withCredentials: true,
    }
    return new EventSource(`${api}/notification/connect`, credentials)
  }

  export async function getNotification() {
    const response = await axios.get(`${api}/notification/user-related`)
    return response.data
  }

  export async function updateNotification(dto: {
    id: number
    is_read: boolean
  }) {
    const response = await axios.put(`${api}/notification/update/${dto.id}`, {
      is_read: dto.is_read,
    })
    return response.data
  }

  export async function deleteNotification(id: number) {
    const response = await axios.delete(`${api}/notification/delete/${id}`)
    return response.data
  }
}

export default { Auth, User, Todo, Report, Notification }
