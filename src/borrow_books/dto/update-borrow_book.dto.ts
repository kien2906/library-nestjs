import { PartialType } from '@nestjs/mapped-types';
import { CreateBorrowBookDto } from './create-borrow_book.dto.js';

export class UpdateBorrowBookDto extends PartialType(CreateBorrowBookDto) {}
