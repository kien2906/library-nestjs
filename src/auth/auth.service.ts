import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../common/role.enum.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async register(registerDto: RegisterDto) {
    const { email, password, retypePassword, phone, fullName } = registerDto;
    const existUser = await this.userRepository.findOne({
      where: {
        email: email.trim(),
      },
    });

    if (password !== retypePassword) {
      throw new BadRequestException('Password and RetypePassword do not match');
    }

    if (existUser) {
      throw new BadRequestException('Account exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);
    const newUser = this.userRepository.create({
      email: email.trim(),
      password: passHash,
      fullName,
      phone,
      isActive: true,
      role: Role.USER,
      createAt: new Date(),
      updateAt: new Date(),
    });
    const saveUser = await this.userRepository.save(newUser);

    return {
      message: 'success',
      data: {
        id: saveUser.id,
        email: saveUser.email,
        password: saveUser.password,
        fullName: saveUser.fullName,
        role: saveUser.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const exists = await this.userRepository.findOne({
      where: {
        email: email.trim()
      }
    });

    if (!exists) {
      throw new UnauthorizedException("Email or password incorrect");
    }

    const isMatch = await bcrypt.compare(password, exists.password)

    if (!isMatch) {
      throw new UnauthorizedException("Email or password incorrect");
    }


    return {
      message: "Login successfully",
      user: {
        id: exists.id,
        email: exists.email,
        role: exists.role
      }
    }


  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
