import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from './dto/change-password.js';
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { AdminChangePasswordDto } from './dto/admin.change-password.js';
import { createAccountByAdmin } from './dto/create-user-by-admin.dto.js';
import { Role } from '../auth/decorators/roles.decorator.js';
import { Roles } from '../common/role.enum.js';
import { updateAccountUserByAdminDTO } from './dto/admin.updateAccount.js';
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) { }



  async getUsers() {

    const listUsers = await this.userRepository.find({
      where: {
        role: "USER"
      },

      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        role: true,
        isActive: true,
        createAt: true,
        avatar: true
      }
    });

    if (listUsers.length === 0) {
      return {
        message: "List Users successfully",
        data: []
      }
    }


    return {
      message: "List Users successfully",
      data: listUsers
    }
  }



  async getProfile(userId: string) {

    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    })


    if (!user) {
      throw new BadRequestException("User not found")
    }

    const avatar = `${this.configService.get<string>('BASE_URL')}/${user?.avatar}`
    return {
      message: 'Get profile successfully',
      data: {
        id: user?.id,
        name: user?.fullName,
        phone: user?.phone,
        email: user?.email,
        avatar: user?.avatar ? avatar : null
      },
    };
  }


  async changesPassword(reqUser: any, changePassword: ChangePasswordDto) {

    const user = await this.userRepository.findOne({
      where: {
        id: reqUser.id
      }
    });

    if (!user) {
      throw new Error("User not found")
    }


    if (!user.isActive) {
      throw new BadRequestException("User is not active")
    }


    if (changePassword.newPassword !== changePassword.cofirmPassword) {
      throw new BadRequestException("New password and confirm password do not match");
    }

    if (changePassword.oldPassword === changePassword.newPassword) {
      throw new BadRequestException(
        "New password must be different from old password"
      );
    }


    const isMatch = await bcrypt.compare(changePassword.oldPassword, user.password)


    if (!isMatch) {
      throw new BadRequestException("New password is the same as old password")
    }


    const newHashedPassword = await bcrypt.hash(changePassword.newPassword, 10);

    user.password = newHashedPassword;

    await this.userRepository.save(user)
    return {
      message: "Password changed successfully"
    }




  }

  async changeAvatar(reqUser: any, file: Express.Multer.File) {


    const user = await this.userRepository.findOne({
      where: {
        id: reqUser.id
      }
    })

    if (!user) {
      throw new Error("User not found")
    }


    if (!user.isActive) {
      throw new BadRequestException("User is not active")
    }

    user.avatar = file.path
    user.updateAt = new Date();

    await this.userRepository.save(user)

    return {
      message: "Change avatar successfully"
    }


  }
  async adminChangePassword(adminChangePassword: AdminChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: adminChangePassword.userId
      }
    })


    if (!user) {
      throw new Error("User not found")
    }


    if (!user.isActive) {
      throw new BadRequestException("User is not active")
    }
    if (adminChangePassword.newPassword !== adminChangePassword.cofirmPassword) {
      throw new BadRequestException("New password and confirm password do not match");
    }

    const isMatch = await bcrypt.compare(adminChangePassword.newPassword, user.password)

    if (isMatch) {
      throw new BadRequestException("New password must be different from old password");
    }

    const hashPassword = await bcrypt.hash(adminChangePassword.newPassword, 10);

    user.password = hashPassword;
    user.updateAt = new Date();

    await this.userRepository.save(user);

    return {
      message: "User password changed successfully by admin"
    };

  }

  async createAccountByAdmin(createAccountAdmin: createAccountByAdmin) {

    const checkEmail = await this.userRepository.findOne({
      where: {
        email: createAccountAdmin.email
      }
    })

    if (checkEmail) {
      throw new ConflictException("Email already exists");
    }

    const hashPassword = await bcrypt.hash(createAccountAdmin.password, 10);


    const createUser = this.userRepository.create({
      fullName: createAccountAdmin.fullname,
      password: hashPassword,
      email: createAccountAdmin.email,
      role: Roles.USER,
      isActive: true,
      createAt: new Date(),
      updateAt: new Date(),
    })

    const savedUser = await this.userRepository.save(createUser);

    return {
      message: "Create User successfully",
      user: {
        id: savedUser.id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        role: savedUser.role,
        isActive: savedUser.isActive,
      }
    }


  }


  async updateAccountByAdmin(id: string, updateAccountUserByAdminDTO: updateAccountUserByAdminDTO, file: Express.Multer.File) {



    if (!updateAccountUserByAdminDTO || Object.keys(updateAccountUserByAdminDTO).length === 0) {
      throw new BadRequestException("Please provide at least one field to update");
    }
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      }
    })


    if (!user) {
      throw new BadRequestException("User not found")
    }

    if (updateAccountUserByAdminDTO?.email) {
      const checkEmail = await this.userRepository.findOne({
        where: {
          email: updateAccountUserByAdminDTO.email
        }
      })

      if (checkEmail && checkEmail.id !== id) {
        throw new BadRequestException("Email already exists")
      }


    }


    user.fullName = updateAccountUserByAdminDTO.fullname ?? user.fullName
    user.phone = updateAccountUserByAdminDTO.phone ?? user.phone
    user.email = updateAccountUserByAdminDTO.email ?? user.email
    user.role = updateAccountUserByAdminDTO.role ?? user.role
    if (file) {
      user.avatar = file.filename;
    }


    await this.userRepository.save(user)

    return {
      message: "Update profile user Successfully"
    }
  }
}
