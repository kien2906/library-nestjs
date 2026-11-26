import { Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID, Min } from "class-validator";


export class QueryDTO {

    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1
    limit: number = 10


    @IsOptional()
    @IsUUID()
    categoryId?: string;
}