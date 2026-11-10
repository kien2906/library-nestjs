import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { User } from './entities/user.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSeeder } from '../seeders/admin.seeder.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User]),],
  controllers: [UsersController],
  providers: [UsersService, AdminSeeder],
})
export class UsersModule { }
