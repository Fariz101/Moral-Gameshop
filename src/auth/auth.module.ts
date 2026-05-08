import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { JWTStrategy } from '../helper/jwt-strategy';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, BcryptService, JWTStrategy],
  imports: [
    PrismaModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { 
        expiresIn: Number(process.env.JWT_EXPIRATION) ?? 1440
      },
    }),
  ],
})
export class AuthModule {}
