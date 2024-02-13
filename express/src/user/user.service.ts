import { FindOneOptions } from "typeorm"
import { IUser } from "../../interfaces/entities.interface"
import User from "../.database/pg/.entities/user.entity"
import { myDataSource } from "../.database/pg/db"

namespace UserService {
  export function findOne(criteria: FindOneOptions<IUser>) {
    return myDataSource.getRepository(User).findOne(criteria)
  }
  export function findOneOrFail(criteria: FindOneOptions<IUser>) {
    return myDataSource.getRepository(User).findOneOrFail(criteria)
  }
  export async function updateUserInfo(dto: Partial<IUser>, id: number) {
    let newDto: Partial<Pick<IUser, "first_name" | "last_name" | "email">> = {}
    if (dto.first_name) newDto.first_name = dto.first_name
    if (dto.last_name) newDto.last_name = dto.last_name
    if (dto.email) newDto.email = dto.email

    return myDataSource.getRepository(User).update(id, newDto)
  }
  export async function deleteUser(id: number) {
    return myDataSource.getRepository(User).softDelete(id)
  }
}

export default UserService
//TODO implement update,delete and create functions
