import express, { Request, Response } from "express"
import { jwtAuth } from "../.middleware/auth.middleware"
import UserService from "./user.service"
import { catchWrapper } from "../utils/errorHandler"
import { logger } from "../utils/winston.createLogger"

const user_router = express.Router()
user_router.use(express.json())

user_router.get(
  "/",
  jwtAuth,
  catchWrapper((req: Request, res: Response) => {
    logger.info(`User info is: ${JSON.stringify(req.body)}`, "get user info router")
    //@ts-ignore
    res.send(req.user)
  })
)
user_router.put(
  "/",
  jwtAuth,
  catchWrapper(async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.user.id
    const { first_name, last_name, email } = req.body
    await UserService.updateUserInfo({ first_name, last_name, email }, userId)
    logger.info(`User data was updated with: ${JSON.stringify({ first_name, last_name, email })}`, "user info update router")
    res.send("User info is successfully changed")
  })
)

user_router.delete(
  "/:id",
  jwtAuth,
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`User was deleted: ${JSON.stringify(req.body)}`, "user delete router")
    //@ts-ignore
    const userId = req.user.id
    await UserService.deleteUser(userId)
    res.send("User is deleted")
  })
)

export default user_router
