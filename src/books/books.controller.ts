import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard.js';
import { RolesGuard } from '../auth/guards/role.guard.js';
import { Role } from '../auth/decorators/roles.decorator.js';
import { Roles } from '../common/role.enum.js';
import { QueryDTO } from './dto/query-book.dto.js';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(@Query() queryDTO: QueryDTO) {
    return this.booksService.findAll(queryDTO);
  }

  @Get(":id")
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.booksService.remove(id);
  }
}
