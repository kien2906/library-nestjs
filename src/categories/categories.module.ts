import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { BorrowBooksModule } from '../borrow_books/borrow_books.module.js';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [BorrowBooksModule],
})
export class CategoriesModule {}
