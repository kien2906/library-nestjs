import { IsNotEmpty, IsString, MinLength } from "class-validator"


export class AdminChangePasswordDto{
    

    @IsNotEmpty()
    userId :string

    @IsString()
    @IsNotEmpty()
    oldPassword: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    newPassword: string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    cofirmPassword: string
}