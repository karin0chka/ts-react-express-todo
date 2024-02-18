import { ITodo, IUser } from "../../interfaces/entities.interface"
import Todo from "../.database/pg/.entities/todo.entity"
import { myDataSource } from "../.database/pg/db"
import notificationService from "../notification/notification.service"
import { sendNotificationMessage } from "../utils/handlers"
import { v2 as cloudinary } from "cloudinary"
import config from "../utils/config"
import { Readable } from "stream"

cloudinary.config({
  cloud_name: config.CLOUDINARY.NAME,
  api_key: config.CLOUDINARY.KEY,
  api_secret: config.CLOUDINARY.SECRET,
})

namespace TodoService {
  export async function createTodo(todoDto: Pick<ITodo, "title" | "description">, user: IUser, file: null | Express.Multer.File) {
    const todoRepository = myDataSource.getRepository(Todo)

    let url: null | string = null

    if (file) {
      url = await new Promise((res, rej) => {
        const stream = new Readable({
          read() {
            this.push(file.buffer)
            this.push(null)
          },
        })
        const upload_stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "todo_express",
          },
          (err, response) => {
            if (err) {
              rej(err.message)
            }
            res(response.url)
          }
        )
        stream.pipe(upload_stream)
      })
    }

    const newTodo = todoRepository.create({
      user: user,
      title: todoDto.title,
      description: todoDto.description,
      url,
    })
    const todo = await todoRepository.save(newTodo)
    const notificaton = await notificationService.create(
      {
        title: "New todo created",
        message: "Hello",
      },
      user
    )

    notificaton.user = undefined
    sendNotificationMessage(user.id, notificaton)
    return todo
  }

  export async function updateTodo(todo: Pick<ITodo, "title" | "description" | "is_done">, id: number) {
    return await myDataSource.getRepository(Todo).update(id, todo)
  }

  export async function softDelete(id: number) {
    return await myDataSource.getRepository(Todo).softDelete(id)
  }

  export async function getUserTodos(userID: number) {
    return await myDataSource.getRepository(Todo).find({ where: { user: { id: userID } }, order: { created_at: "DESC" } })
  }
}

export default TodoService
