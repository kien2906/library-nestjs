import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { BooksModule } from './books/books.module.js';
import { User } from './users/entities/user.entity.js';
import { Category } from './categories/entities/category.entity.js';
import { Book } from './books/entities/book.entity.js';
import { BorrowBook } from './borrow_books/entities/borrow_book.entity.js';
import { AuthModule } from './auth/auth.module.js';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',

        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Category, Book,BorrowBook], //chỉ định entity ở đây
        synchronize: true, // tự động tạo bảng từ entity (chỉ dùng ở local)
        logging: true, // tự động chạy log sql query chỉ dùng ở loc/dev
      }),
    }),

    UsersModule,

    CategoriesModule,

    BooksModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
