import { IsNotEmpty } from "class-validator";

export class CreateBookDto {

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    author: string
    price: number
    categoryId: string



}
