import { IsNotEmpty } from "class-validator";

export class CreateBorrowBookDto {
    @IsNotEmpty()
    bookId: string;



}
