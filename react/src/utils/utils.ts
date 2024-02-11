import { INotification } from "../../interfaces/interfaces"

export function isNotification(val: any): val is INotification {
  return "is_read" in val && "id" in val && "created_at" in val
}

export function deRef<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}
