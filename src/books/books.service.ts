import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Book } from './entities/book.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { QueryDTO } from './dto/query-book.dto.js';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) { }
  async create(createBookDto: CreateBookDto) {
    const existsBook = await this.bookRepository.findOne({
      where: {
        name: createBookDto.name
      }
    })
    if (existsBook) {
      throw new BadRequestException("Book exists")

    }

    const existCategory = await this.categoryRepository.findOne({
      where: {
        id: createBookDto.categoryId
      }
    })
    if (!existCategory) {
      throw new NotFoundException("Category not found")
    }

    const book = {
      ...createBookDto,
      createAt: new Date(),
      updateAt: new Date(),
      category: existCategory
    }

    return this.bookRepository.save(book)
  }

  findAll(queryDTO: QueryDTO) {

    const { page, limit, categoryId } = queryDTO
    const offset = (page - 1) * limit

    return this.bookRepository.find({
      relations: {
        category: true
      },
      where: categoryId ? {
        category: {
          id: categoryId
        }
      } : {},
      skip: offset,
      take: limit
    })
}


  async findOne(id: string) {
    const existsBook = await this.bookRepository.findOne({
      where: {
        id
      }

    })
    if (!existsBook) {
      throw new NotFoundException("Book not exists")

    }

    return this.bookRepository.findOne({
      where: {
        id
      },
      relations: {
        category: true
      }
    })

  }

  async update(id: string, updateBookDto: UpdateBookDto) {

    if (updateBookDto.name) {
      const existsBook = await this.bookRepository.findOne({
        where: {
          name: updateBookDto.name,
          id: Not(id)
        }
      })

      if (existsBook) {
        throw new BadRequestException("Name is exists")
      }
    }


    const book = await this.bookRepository.findOne({
      where: {
        id
      }
    })
    if (!book) {
      throw new NotFoundException("Book not found");
    }

    let existCategory = null
    if (book.category?.id !== updateBookDto.categoryId && updateBookDto.categoryId) {
      existCategory = await this.categoryRepository.findOne({
        where: {
          id: updateBookDto.categoryId
        }
      })
      if (!existCategory) {
        throw new NotFoundException("Category not found")
      }

    }


    book.name = updateBookDto.name ?? book.name,
      book.author = updateBookDto.author ?? book.author
    book.price = updateBookDto.price ?? book.price
    book.category = existCategory ?? book.category
    book.updateAt = new Date()

    await this.bookRepository.save(book)
    return {
      message: "Update Book successfully"

    }
  }

  async remove(id: string) {
    const existsBook = await this.bookRepository.findOne({
      where: {

        id: id
      }
    })

    if (!existsBook) {
      throw new NotFoundException("Book not found")
    }
    await this.bookRepository.delete(id)
    return {
      message: "Delete Book successfully"

    }
  }
}
