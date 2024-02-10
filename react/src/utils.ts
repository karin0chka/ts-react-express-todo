import { INotification } from "../interfaces/interfaces";

export function isNotification(val: any):val is INotification {
  return "is_read" in val && "id" in val && "created_at" in val
}
