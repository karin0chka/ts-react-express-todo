import { IUser } from "../../interfaces/interfaces"

export namespace LocalStorage {
  export function saveUser(user: IUser) {
    localStorage.setItem("user", JSON.stringify(user))
  }

  export function getUser(): IUser | null {
    const user = localStorage.getItem("user")
    if (user) {
      try {
        return JSON.parse(user)
      } catch (e) {
        console.error(e)
      }
    }
    return null
  }

  export function removeUser() {
    localStorage.removeItem("user")
  }
}
