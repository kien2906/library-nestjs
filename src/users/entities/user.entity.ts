import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BorrowBook } from '../../borrow_books/entities/borrow_book.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: false })
  role: string;

  @Column({ nullable: true, default: true })
  isActive: boolean;

  @Column()
  createAt: Date;

  @Column()
  updateAt: Date;

  @OneToMany(()=>BorrowBook, (borrowBook) =>borrowBook.user)
  borrowBooks : BorrowBook[];
}


