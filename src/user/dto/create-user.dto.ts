import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role!: UserRole;
}
