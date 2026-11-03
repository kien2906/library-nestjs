import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity.js';
import { BorrowBook } from '../../borrow_books/entities/borrow_book.entity.js';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  author: string;

  @Column()
  price: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  category: any;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @OneToMany(() => BorrowBook, (borrowBook) => borrowBook.book)
  borrowBooks: BorrowBook[];
}
