import 'multer'
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Role } from '../auth/decorators/roles.decorator.js';
import { Roles } from '../common/role.enum.js';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard.js';
import { RolesGuard } from '../auth/guards/role.guard.js';
import type { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.js';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { diskStorage } from 'multer';
import { AdminChangePasswordDto } from './dto/admin.change-password.js';
import { createAccountByAdmin } from './dto/create-user-by-admin.dto.js';
import { updateAccountUserByAdminDTO } from './dto/admin.updateAccount.js';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Get()
  getUser() {
    return this.usersService.getUsers()
  }


  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    const user: any = req.user
    return this.usersService.getProfile(user.id);
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  changesPassword(@Req() req: Request, @Body() changesPassword: ChangePasswordDto) {
    const user: any = req.user
    return this.usersService.changesPassword(user, changesPassword)
  }


  @Patch("change-avatar")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatar',
      filename: (req, file, cb) => {
        const ramdom = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
        return cb(null, `${ramdom}_${file.originalname}`)
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("Invalid file type"), false)
      }
      return cb(null, true)
    }
  }))
  changeAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const user: any = req.user

    console.log(file)
    return this.usersService.changeAvatar(user, file)
  }

  @Patch('admin/updateUsers/:id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Role(Roles.ADMIN)
  @UseInterceptors(FileInterceptor("avatar", {
    storage: diskStorage({
      destination: "./uploads/avatar",
      filename: (req, file, cb) => {
        const ramdom = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');

        return cb(null, `${ramdom}_${file.originalname}`)
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error("Invalid file type"), false)
      }
      return cb(null, true)
    }
  }))
  updateAccountUserByAdmin(@Param('id', ParseUUIDPipe) id: string, @Body() updateAccountUserByAdminDTO: updateAccountUserByAdminDTO, @UploadedFile() file: Express.Multer.File) {

    return this.usersService.updateAccountByAdmin(id, updateAccountUserByAdminDTO, file)


  }



  @Patch("admin-change-password")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  adminChangePassword(@Body() adminChangePassword: AdminChangePasswordDto) {

    return this.usersService.adminChangePassword(adminChangePassword)

  }

  @Post("create-users")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  createAccountAdmin(@Body() createAccountAdmin: createAccountByAdmin) {
    return this.usersService.createAccountByAdmin(createAccountAdmin)
  }



}
