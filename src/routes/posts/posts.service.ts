import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  PostModel = this.prisma.post;

  async create(createPostDto: CreatePostDto, authorId: number) {
    try {
      return await this.PostModel.create({
        data: { ...createPostDto, authorId },
        include: { author: true },
      });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.PostModel.findMany({
        include: {
          author: true,
        },
      });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }

  async findAllForUser(authorId: number) {
    try {
      return await this.PostModel.findMany({
        where: { authorId },
        include: {
          author: true,
        },
      });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      return await this.PostModel.findUnique({ where: { id }, include: { author: true } });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    try {
      return await this.PostModel.update({
        where: { id, authorId: userId },
        data: { ...updatePostDto },
      });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number, userId: number) {
    try {
      return await this.PostModel.delete({ where: { id, authorId: userId } });
    } catch (error: any) {
      throw new HttpException(error?.meta?.cause, HttpStatus.BAD_REQUEST);
    }
  }
}
