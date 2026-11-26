import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Book } from '../../books/entities/book.entity.js';

@Entity('borrow_books')
export class BorrowBook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  borrow_date: Date;

  @Column({ nullable: false })
  expectReturnDate: Date;

  @Column()
  penalty_money: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  returnDate: Date;

  @ManyToOne(() => User, (user) => user.borrowBooks)
  user: any;

  @ManyToOne(() => Book, (book) => book.borrowBooks)
  book: any;
}
