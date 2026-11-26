import { Module } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { BooksController } from './books.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { Category } from '../categories/entities/category.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Book,Category],), AuthModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
