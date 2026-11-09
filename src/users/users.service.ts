import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ChangePasswordDto } from './dto/change-password.js';
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
     private readonly configService :ConfigService
  ) { }

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

  async changeAvatar(reqUser: any, file : Express.Multer.File){
    

    const user =  await this.userRepository.findOne({
      where:{
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
    user.updateAt= new Date();

    await this.userRepository.save(user)

    return {
      message : "Change avatar successfully"
    }


  }
}
