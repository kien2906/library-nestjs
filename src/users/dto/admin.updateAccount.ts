import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Roles } from "../../common/role.enum.js"
import { Role } from "../../auth/decorators/roles.decorator.js"


export class updateAccountUserByAdminDTO {

    @IsOptional()
    @IsString()
    fullname?: string


    @IsOptional()
    @IsEmail()
    email?: string;


    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsEnum(Roles)
    role?: string


}