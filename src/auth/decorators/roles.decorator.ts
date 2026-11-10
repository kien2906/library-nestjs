import { SetMetadata } from "@nestjs/common"
import { Roles } from "../../common/role.enum.js"


export const Role_key = "roles"

export const Role = (...roles: Roles[])=> SetMetadata(Role_key ,roles);