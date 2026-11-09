import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guards/jwt.strategy.js';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    PassportModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],

    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>("JWT_SECRET") || "super_secret_library",

      signOptions: {
        expiresIn: (configService.get<string>("JWT_EXPIRES") ||
          "1d") as JwtSignOptions["expiresIn"],
      },

    })
  })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, AuthService]
})
export class AuthModule { }
