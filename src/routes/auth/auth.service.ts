import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { comparePaswords, encodePassword } from 'src/core/utils/bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../users/dtos';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_SERVICE') private readonly usersService: UsersService, private prisma: PrismaService) {}

  UserModel = this.prisma.user;

  async validateUser(username: string, password: string) {
    const userDB = await this.usersService.findUserByUsername(username);
    if (userDB) {
      const matched = comparePaswords(password, userDB.password);
      if (matched) {
        return userDB;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const password = encodePassword(createUserDto.password);
      const newUser = this.UserModel.create({
        data: { ...createUserDto, password },
      });
      return newUser;
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }
}
