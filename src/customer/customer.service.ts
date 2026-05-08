import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { FindCustomerDto } from './dto/find-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const { username, about, email, password } = createCustomerDto;
      const createCustomer = await this.prisma.customers.create({
        data: {
          username: username,
          about: about,
          user: {
            create: {
              email: email,
              password: await this.bcrypt.hashPassword(password),
              role: 'CUSTOMER',
            },
          },
        },
      include: {
        user: true, 
      },
      });
      return {
        success: true,
        message: 'customer created successfully',
        data: createCustomer ,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when get customer: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll(findCustomerDto: FindCustomerDto) {
    try {
      const { search = '', page = 1, limit = 10 } = findCustomerDto;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (search) {
        where.username = {
          contains: search,
        };
      }
      const customers = await this.prisma.customers.findMany({
        where,
        skip: skip,
        take: Number(limit),
        include: {
          user: true, 
        },
      });
      const total = await this.prisma.customers.count({ where });

      return {
        success: true,
        message: 'customer data founded succesfully',
        data: customers,
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
        message: `error when get customer: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const customers = await this.prisma.customers.findFirst({
        where: { id: id },
        include: {
          user: true, 
        },
      });
      if (!customers) {
        return {
          success: false,
          message: 'Customer does not exists',
          data: null,
        };
      }
      return {
        success: true,
        message: 'customer data founded succesfully',
        data: customers ,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when get customer: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      const { username, about } = updateCustomerDto;
      const findCustomer = await this.prisma.customers.findFirst({
        where: { id: id },
      });
      if (!findCustomer) {
        return {
          success: false,
          message: 'Customer does not exists',
          data: null,
        };
      }
      const updateCustomer = await this.prisma.customers.update({
        where: { id: id },
        data: {
          username: username ?? findCustomer.username,
          about: about ?? findCustomer.about,
        },
        include: {
          user: true, 
        },
      });
      return {
        success: true,
        message: 'Customer has updated',
        data: updateCustomer,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when update customer: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const findCustomer = await this.prisma.customers.findFirst({
        where: { id: id },
      });
      if (!findCustomer) {
        return {
          success: false,
          message: 'Customer does not exists',
          data: null,
        };
      }
      const deletedCustomer = await this.prisma.customers.delete({
        where: { id: id },
        include: {
          user: true, 
        },
      });
      return {
        success: true,
        message: 'customer has deleted',
        data: deletedCustomer,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when delete customer : ${error.message}`,
        data: null,
      };
    }
  }
}
