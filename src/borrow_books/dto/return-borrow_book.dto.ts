import { IsEnum, IsNotEmpty } from "class-validator";
import { BorrowStatus } from "../../common/borrow-status.js";



export class ReturnBorrowDTO {
    @IsNotEmpty()
    @IsEnum(BorrowStatus)
    status:string 
}