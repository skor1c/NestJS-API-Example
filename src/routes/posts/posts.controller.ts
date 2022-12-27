import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthenticatedGuard } from 'src/core/guards/LocalAuthGuard.guard';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SerializedPost } from './types/SerializedPost';

@ApiCookieAuth()
@ApiTags('posts')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthenticatedGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() request) {
    const userId = request.user.id;
    const newPost = await this.postsService.create(createPostDto, userId);
    if (newPost) return new SerializedPost(newPost);
  }

  @Get()
  async findAll() {
    const posts = await this.postsService.findAll();
    if (posts) return posts.map((post) => new SerializedPost(post));
  }

  @Get('user')
  async findAllForUser(@Req() request) {
    const userId = request.user.id;
    const posts = await this.postsService.findAllForUser(userId);
    if (posts) return posts.map((post) => new SerializedPost(post));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findOne(id);
    if (post) return new SerializedPost(post);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto, @Req() request) {
    const userId = request.user.id;
    const updatedPost = await this.postsService.update(id, updatePostDto, userId);
    if (updatedPost) return new SerializedPost(updatedPost);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() request) {
    const userId = request.user.id;
    const deletedPost = await this.postsService.remove(id, userId);
    if (deletedPost) return { message: 'Post deleted successfully' };
  }
}
