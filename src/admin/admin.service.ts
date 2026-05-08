import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { FindAdminDto } from './dto/find-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      const { name, email, password } = createAdminDto;
      const createAdmin = await this.prisma.admins.create({
        data: {
        name: name,
        user: {
          create: {
            email: email,
            password: await this.bcrypt.hashPassword(password), 
            role: 'ADMIN',     
          },
        },
      },
      include: {
        user: true, 
      },
      });
      return {
        success: true,
        message: 'admin created successfully',
        data: createAdmin,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when get admin: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll(findAdminDto: FindAdminDto) {
    try {
      const { search = '', page = 1, limit = 10 } = findAdminDto;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (search) {
        where.name = {
          contains: search,
        };
      }


      const admins = await this.prisma.admins.findMany({
        where,
        skip: skip,
        take: Number(limit),
        include: {
          user: true, 
        },
      });
      const total = await this.prisma.admins.count({ where });

      return {
        success: true,
        message: 'admin data founded succesfully',
        data: admins,
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
        message: `error when get admin: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const admins = await this.prisma.admins.findFirst({
        where: { id: id },
        include: {
          user: true, 
        },
      });
      if (!admins) {
        return {
          success: false,
          message: 'Admin does not exists',
          data: null,
        };
      }
      return {
        success: true,
        message: 'admin data founded succesfully',
        data: admins,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when get admin: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const { name } = updateAdminDto;
      const findAdmin = await this.prisma.admins.findFirst({
        where: { id: id },
      });
      if (!findAdmin) {
        return {
          success: false,
          message: 'Admin does not exists',
          data: null,
        };
      }
      const updateAdmin = await this.prisma.admins.update({
        where: { id: id },
        data: {
          name: name ?? findAdmin.name,
        },
        include: {
          user: true, 
        },
      });
      return {
        success: true,
        message: 'New Admin has updated',
        data: updateAdmin,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when update admin: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const findAdmin = await this.prisma.admins.findFirst({
        where: { id: id },
      });
      if (!findAdmin) {
        return {
          success: false,
          message: 'Admin does not exists',
          data: null,
        };
      }
      const deletedAdmin = await this.prisma.admins.delete({
        where: { id: id },
        include: {
          user: true, 
        },
      });
      return {
        success: true,
        message: 'admin has deleted',
        data: deletedAdmin,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when delete admin : ${error.message}`,
        data: null,
      };
    }
  }
}
