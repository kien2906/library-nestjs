import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { BorrowBooksService } from './borrow_books.service.js';
import { CreateBorrowBookDto } from './dto/create-borrow_book.dto.js';
import { UpdateBorrowBookDto } from './dto/update-borrow_book.dto.js';
import { BorrowBook } from './entities/borrow_book.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard.js';
import { Role } from '../auth/decorators/roles.decorator.js';
import { Roles } from '../common/role.enum.js';
import { RolesGuard } from '../auth/guards/role.guard.js';
import { ReturnBorrowDTO } from './dto/return-borrow_book.dto.js';

@Controller('borrow-books')
export class BorrowBooksController {
  constructor(private readonly borrowBooksService: BorrowBooksService) { }


  @Get()
  @UseGuards(JwtAuthGuard)
  getAllBorrowBooks(@Req() req: any) {

    const userId = req.user.id
    return this.borrowBooksService.getAllBorrowBooks(userId);
  }



  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.USER)
  create(@Req() req: any, @Body() createBorrowBookDto: CreateBorrowBookDto) {
    const user = req.user
    const userId = user.id

    return this.borrowBooksService.create(userId, createBorrowBookDto);
  }

  // @Get()
  // findAll() {
  //   return this.borrowBooksService.findAll();
  // }

  
  //Api Admin duyệt sách
  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN, Roles.LIBRARIAN)
  update(@Param('id', ParseUUIDPipe) id: string) {
    return this.borrowBooksService.approveBorrow(id)

  }


  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN, Roles.LIBRARIAN)
  reject(@Param('id', ParseUUIDPipe) id: string) {
    return this.borrowBooksService.rejectBorrow(id)

  }

  @Patch(':id/return')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN, Roles.LIBRARIAN)
  return(@Param('id', ParseUUIDPipe) id: string, @Body() returnBorrowdto: ReturnBorrowDTO) {
    return this.borrowBooksService.returnBorrow(id, returnBorrowdto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowBooksService.remove(+id);
  }
}
