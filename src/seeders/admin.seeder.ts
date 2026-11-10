import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity.js';
import { Roles } from '../common/role.enum.js';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async onApplicationBootstrap() {

        const admin = await this.userRepository.findOne({
            where: {
                email: 'admin@gmail.com'
            }
        });

        if (admin) {
            console.log('Admin account already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('123456', 10);

        const newAdmin = this.userRepository.create({
            fullName: 'System Administrator',
            phone: '0900000000',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: Roles.ADMIN,
            isActive: true,
            createAt: new Date(),
            updateAt: new Date()
        });

        await this.userRepository.save(newAdmin);


        console.log('Admin account created successfully');
    }
}