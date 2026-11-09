import { BadRequestException, ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../common/role.enum.js';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
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
         throw new BadRequestException("Email does not exist.");
    }

    if (!exists.isActive) {
      throw new BadRequestException("Account not active")
    }

    const isMatch = await bcrypt.compare(password, exists.password)

    if (!isMatch) {
      throw new BadRequestException("Invaild password");
    }


    // Tạo token 
    const jwtPayload = {
      sub: exists.id,
      email: exists.email,
      role: exists.role
    }

    const jwtToken = this.jwtService.sign(jwtPayload)

    return {
      message: "Login successfully",
      accessToken: jwtToken,
      user: {
        id: exists.id,
        fullname: exists.fullName
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
