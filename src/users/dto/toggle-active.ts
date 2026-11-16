import { IsNotEmpty } from "class-validator";

export class toggleActiceDTO {

    @IsNotEmpty()
    isActive: boolean

}