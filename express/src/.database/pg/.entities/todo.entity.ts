import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import Default from "./default.entity"
import User from "./user.entity"
import { ITodo } from "../../../../interfaces/entities.interface"

@Entity()
class Todo extends Default implements ITodo {
  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column({ default: false })
  is_done: boolean

  @Column({ nullable: true })
  url: string | null

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn()
  user: User
}

export default Todo
