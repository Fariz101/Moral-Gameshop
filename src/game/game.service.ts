import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from '../prisma/prisma.service';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { FindGameDto } from './dto/find-game.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
    private readonly cloudinary: CloudinaryService
  ) {}

  async create(createGameDto: CreateGameDto, file: Express.Multer.File) {
    try {
      const { title, description, specification, image, price, genre } = createGameDto;
      
      let imageUrl = null;
      if (file) {
        const uploadResult = await this.cloudinary.uploadFile(file, 'game_photos');
        imageUrl = uploadResult.secure_url;
      }
      
      const createGame = await this.prisma.games.create({
        data: {
          title,
          description,
          specification,
          image: imageUrl,
          price: price ? Number(price) : null,
          genre,
        },
      });
      return {
        success: true,
        message: 'game created successfully',
        data: createGame,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when get game: ${error.message}`,
        data: null,
      };
    }
  }

  async findAll(findGameDto: FindGameDto) {
    try {
      const { search = '', genre, page = 1, limit = 10 } = findGameDto;
      const skip = (page - 1) * limit;

      const where: any = {};
      if (search) {
        where.title = {
          contains: search,
        };
      }

      if (genre) {
        where.genre = genre;
      }

      const games = await this.prisma.games.findMany({
        where,
        skip: skip,
        take: Number(limit),
      });
      const total = await this.prisma.games.count({ where });

      return {
        success: true,
        message: 'game data founded succesfully',
        data: games,
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
        message: `error when get game: ${error.message}`,
        data: null,
      };
    }
  }

  async findOne(id: number) {
    try {
      const games = await this.prisma.games.findFirst({
        where: { id: id },
      });
      if (!games) {
        return {
          success: false,
          message: 'Game does not exists',
          data: null,
        };
      }
      return {
        success: true,
        message: 'game data founded succesfully',
        data: games,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when get game: ${error.message}`,
        data: null,
      };
    }
  }

  async update(id: number, updateGameDto: UpdateGameDto, file?: Express.Multer.File) {
    try {
      const { title, description, specification, image, price, genre } = updateGameDto;
      const findGame = await this.prisma.games.findFirst({
        where: { id: id },
      });
      if (!findGame) {
        return {
          success: false,
          message: 'Game does not exists',
          data: null,
        };
      }

      let imageUrl = findGame.image;

      if (file) {
        if (findGame.image) {
          try {
            await this.cloudinary.deleteFile(findGame.image);
          } catch (deleteError) {
            console.log('Gagal menghapus gambar lama di Cloudinary', deleteError);
          }
        }
        const uploadResult = await this.cloudinary.uploadFile(file, 'game_covers');
        imageUrl = uploadResult.secure_url;
      }

      const updateGame = await this.prisma.games.update({
        where: { id: id },
        data: {
          title: title ?? findGame.title,
          description: description ?? findGame.description,
          specification: specification ?? findGame.specification,
          image: imageUrl ?? findGame.image,
          price: price ? Number(price) : findGame.price,
          genre: genre ?? findGame.genre,
        },
      });
      return {
        success: true,
        message: 'New Game has updated',
        data: updateGame,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when update game: ${error.message}`,
        data: null,
      };
    }
  }

  async remove(id: number) {
    try {
      const findGame = await this.prisma.games.findFirst({
        where: { id: id },
      });
      if (!findGame) {
        return {
          success: false,
          message: 'Game does not exists',
          data: null,
        };
      }

      if (findGame.image) {
        try {
          await this.cloudinary.deleteFile(findGame.image);
        } catch (deleteError) {
          console.log('Gagal menghapus gambar di Cloudinary', deleteError);
        }
      }

      const deletedGame = await this.prisma.games.delete({
        where: { id: id },
      });
      return {
        success: true,
        message: 'game has deleted',
        data: deletedGame,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `error when delete game: ${error.message}`,
        data: null,
      };
    }
  }
}
