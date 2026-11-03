import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Book } from '../../books/entities/book.entity.js';

@Entity('borrow_books')
export class BorrowBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  borrow_date: Date;

  @Column()
  expect_return_date: Date;

  @Column()
  penalty_money: number;

  @Column()
  status: string;

  @Column()
  return_date: string;

  @ManyToOne(() => User, (user) => user.borrowBooks)
  user: any;

  @ManyToOne(() => Book, (book) => book.borrowBooks)
  book: any;
}
