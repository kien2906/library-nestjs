import { Module } from '@nestjs/common';
import { BorrowBooksService } from './borrow_books.service.js';
import { BorrowBooksController } from './borrow_books.controller.js';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowBook } from './entities/borrow_book.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { Book } from '../books/entities/book.entity.js';
import { User } from '../users/entities/user.entity.js';


@Module({
  imports: [TypeOrmModule.forFeature([BorrowBook, Book,User]), AuthModule],
  controllers: [BorrowBooksController],
  providers: [BorrowBooksService],
})
export class BorrowBooksModule { }
