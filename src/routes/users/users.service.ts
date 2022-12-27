import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  UserModel = this.prisma.user;

  async findUsers(sortBy: string, orderBy: 'asc' | 'desc', page: number, limit: number) {
    try {
      const users = await this.UserModel.findMany({
        orderBy: { [sortBy]: orderBy },
        skip: (page - 1) * limit,
        take: limit,
        include: { posts: true },
      });
      const count = await this.UserModel.count();

      return Promise.all([users, count]).then(([users, count]) => {
        return {
          users,
          ['numberOfPages']: Math.ceil(count / limit),
          ['currentPage']: page,
        };
      });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }

  async findUserById(id: number) {
    try {
      return await this.UserModel.findUnique({ where: { id } });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }

  async findUserByUsername(username: string) {
    try {
      return await this.UserModel.findUnique({
        where: { username },
      });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.UserModel.delete({
        where: { id },
      });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }
}
