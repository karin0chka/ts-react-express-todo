import express, { Request, Response } from "express"
import TodoService from "./todo.service"
import { jwtAuth } from "../.middleware/auth.middleware"
import { isTodoEligible } from "../.middleware/todo.middleware"
import { catchWrapper } from "../utils/errorHandler"
import { logger } from "../utils/winston.createLogger"
import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({ storage })

const todoRoute = express.Router()
todoRoute.use(express.json())

todoRoute.post(
  "/",
  jwtAuth,
  upload.single("file"),
  catchWrapper(async (req: Request, res: Response) => {
    logger.info(`Todo is created with: ${JSON.stringify(req.body)}`, "create todo router")
    //@ts-ignore
    const user = req.user
    const { title, description } = JSON.parse(req.body.data)
    const file = req.file
    res.json(await TodoService.createTodo({ title, description }, user, file || null))
  })
)

todoRoute.put(
  "/:id",
  jwtAuth,
  isTodoEligible,
  catchWrapper(async (req: Request, res: Response) => {
    const { title, description, is_done } = req.body
    await TodoService.updateTodo({ title, description, is_done }, +req.params.id)
    logger.info(`Todo was updated with: ${JSON.stringify({ title, description, is_done })}`, "update todo router")
    res.send("OK")
  })
)
todoRoute.get(
  "/",
  jwtAuth,
  catchWrapper(async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user
    logger.info(`Get User${user.id} todos: ${JSON.stringify(req.body)}`, "user todos router")
    const todos = await TodoService.getUserTodos(user.id)
    res.status(200).send(todos)
  })
)

todoRoute.delete(
  "/:id",
  jwtAuth,
  isTodoEligible,
  catchWrapper(async (req: Request, res: Response) => {
    await TodoService.softDelete(+req.params.id)
    logger.info(`Todo was deleted: ${JSON.stringify(+req.params.id)}`, "delete todo router")
    res.send("OK")
  })
)
export default todoRoute
