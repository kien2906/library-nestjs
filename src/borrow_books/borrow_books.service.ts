import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBorrowBookDto } from './dto/create-borrow_book.dto.js';
import { UpdateBorrowBookDto } from './dto/update-borrow_book.dto.js';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BorrowBook } from './entities/borrow_book.entity.js';
import { In, Repository } from 'typeorm';
import { Book } from '../books/entities/book.entity.js';
import { BorrowStatus } from '../common/borrow-status.js';
import { DataSource } from 'typeorm/browser';
import { ReturnBorrowDTO } from './dto/return-borrow_book.dto.js';
import { User } from '../users/entities/user.entity.js';
import { Roles } from '../common/role.enum.js';

@Injectable()
export class BorrowBooksService {

  constructor(
    @InjectRepository(BorrowBook)
    private readonly borrowBook: Repository<BorrowBook>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSoucre: DataSource
  ) { }

  async create(userId: any, createBorrowBookDto: CreateBorrowBookDto) {

    const book = await this.bookRepository.findOne({
      where: {
        id: createBorrowBookDto.bookId
      }
    })

    if (!book) {
      throw new BadRequestException('Book not found');
    }

    if (book.availableNumber < 1) {
      throw new BadRequestException('Book not available');
    }

    const existsBorrow = await this.borrowBook.findOne({
      where: {
        user: { id: userId },
        book: { id: createBorrowBookDto.bookId },
        status: In([BorrowStatus.PENDING, BorrowStatus.APPROVED])

      }
    })
    if (existsBorrow) {
      throw new BadRequestException('Book is already borrowed');
    }


    const createBorrow = this.borrowBook.create({
      user: { id: userId },
      book: { id: createBorrowBookDto.bookId },
      borrow_date: new Date(),
      expectReturnDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      penalty_money: book.price,
      status: BorrowStatus.PENDING,

    })
    await this.borrowBook.save(createBorrow)
    return {
      message: "Create Borrow Book successfully"
    }

  }

  async getAllBorrowBooks(userId: any) {
    const checkuser = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })

    if (!checkuser) {
      throw new BadRequestException("User not found")
    }

    if (checkuser.role === Roles.USER) {

      return await this.borrowBook.find({
        where: {
          user: {
            id: userId
          }
        }
      })
    }

    return await this.borrowBook.find({
      relations: {
        book: true,

      }

    })
  }

  async rejectBorrow(id: string) {

    const borrow = await this.borrowBook.findOne({
      where: {
        id: id
      }
    })

    if (!borrow) {
      throw new BadRequestException("Borrow not found")
    }

    if (borrow.status !== BorrowStatus.PENDING) {
      throw new BadRequestException("Borrow can not reject")
    }

    borrow.status = BorrowStatus.REJECTED;
    await this.borrowBook.save(borrow)
    return {
      message: "Reject Borrow Book"
    }

  }

  async returnBorrow(id: string, returnBorrowdto: ReturnBorrowDTO) {
    const queryRunner = this.dataSoucre.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const borrowBook = await queryRunner.manager.findOne(BorrowBook, {
        where: {
          id: id
        },
        relations: {
          book: true
        }
      })

      if (!borrowBook) {
        throw new BadRequestException("Borrow not found")
      }

      if (borrowBook.status !== BorrowStatus.APPROVED) {
        throw new BadRequestException("Borrow not in APPROVED status");
      }

      const book = borrowBook.book
      if (!book) {
        throw new BadRequestException("Book not found")
      }
      // trả sách
      if (returnBorrowdto.status === BorrowStatus.RETURNED) {
        book.availableNumber += 1;

        await queryRunner.manager.save(book);

        borrowBook.returnDate = new Date();
        borrowBook.status = BorrowStatus.RETURNED;

        await queryRunner.manager.save(borrowBook);
      }

      if (returnBorrowdto.status === BorrowStatus.MISSED) {
        //mat sach
        borrowBook.status = BorrowStatus.MISSED;
        await queryRunner.manager.save(borrowBook)
      }
      await queryRunner.commitTransaction()
      return borrowBook

    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }


  }

  async approveBorrow(id: string) {
    const queryRunner = this.dataSoucre.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction()


    try {
      // check id borrow book
      const borrowBook = await queryRunner.manager.findOne(BorrowBook, {
        where: { id },
        relations: {
          book: true
        }
      })

      if (!borrowBook) {
        throw new BadRequestException("Borrow not found")
      }

      // check status
      if (borrowBook.status !== BorrowStatus.PENDING) {
        throw new BadRequestException("Borrow is not in PEDING status")
      }

      const book = borrowBook.book


      if (!book) {
        throw new BadRequestException("Book not found")
      }

      if (book.availableNumber < 1) {
        throw new BadRequestException("Book not available")
      }

      // update quanity
      book.availableNumber = book.availableNumber - 1
      await queryRunner.manager.save(book)

      borrowBook.status = BorrowStatus.APPROVED;
      await queryRunner.manager.save(borrowBook);

      // commit toàn bộ transaction
      await queryRunner.commitTransaction()
      return borrowBook
    } catch (error) {
      //rollback trả lại hết nếu lỗi
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  remove(id: number) {
    return `This action removes a #${id} borrowBook`;
  }
}
