import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, role } = createUserDto;
      const createUser = await this.prisma.user.create({
        data: {
          email,
          password: await this.bcrypt.hashPassword(password),
          role,
        },
      });
      return {
        success: true,
        message: 'user created successfully',
        data: createUser,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when get user: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll(findUserDto: FindUserDto) {
    try {
      const { search = '', role, page = 1, limit = 10 } = findUserDto;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (search) {
        where.email = {
          contains: search,
        };
      }

      if (role) {
        where.role = role;
      }

      const user = await this.prisma.user.findMany({
        where,
        skip: skip,
        take: Number(limit),
      });
      const total = await this.prisma.user.count({ where });

      return {
        success: true,
        message: 'user data founded succesfully',
        data: user,
        meta: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when get user: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: id },
      });
      if (!user) {
        return {
          success: false,
          message: 'User does not exists',
          data: null,
        };
      }
      return {
        success: true,
        message: 'user data founded succesfully',
        data: user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when get user: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { email, password, role } = updateUserDto;
      const findUser = await this.prisma.user.findFirst({
        where: { id: id },
      });
      if (!findUser) {
        return {
          success: false,
          message: 'User does not exists',
          data: null,
        };
      }
      const updateUser = await this.prisma.user.update({
        where: { id: id },
        data: {
          email: email ?? findUser.email,
          password: password
            ? await this.bcrypt.hashPassword(password)
            : findUser.password,
          role: role ?? findUser.role,
        },
      });
      return {
        success: true,
        message: 'New User has updated',
        data: updateUser,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when update user: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: { id: id },
      });
      if (!findUser) {
        return {
          success: false,
          message: 'User does not exists',
          data: null,
        };
      }
      const deletedUser = await this.prisma.user.delete({
        where: { id: id },
      });
      return {
        success: true,
        message: 'user has deleted',
        data: deletedUser,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when delete user: ${error.message}`,
        data: null,
      };
    }
  }
}
