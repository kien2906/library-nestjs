import { IsNotEmpty, MinLength } from "class-validator";
import { Column } from "typeorm";

export class createAccountByAdmin {


    @IsNotEmpty()
    fullname: string


    @IsNotEmpty()
    email: string


    @IsNotEmpty()
    @MinLength(6)
    password: string;


    @Column({ nullable: true })
    phone: string

    @Column({ nullable: true })
    avatar: string
}