import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BorrowBook } from '../../borrow_books/entities/borrow_book.entity.js';
import { IsEmail } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ unique: true, nullable: true })
  @IsEmail()
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

  @OneToMany(() => BorrowBook, (borrowBook) => borrowBook.user)
  borrowBooks: BorrowBook[];


  @Column({ nullable: true })
  avatar: string
}


