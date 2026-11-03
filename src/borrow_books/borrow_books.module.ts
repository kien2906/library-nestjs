import { Module } from '@nestjs/common';
import { BorrowBooksService } from './borrow_books.service.js';
import { BorrowBooksController } from './borrow_books.controller.js';

@Module({
  controllers: [BorrowBooksController],
  providers: [BorrowBooksService],
})
export class BorrowBooksModule {}
