import {
  Controller,
  Post,
  Get,
  Patch,
  Req,
  Body,
  UseGuards,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
import { CreatepostDto } from './dtos/createPost.dto';
import { UpdatepostDto } from './dtos/updatePost.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 1, {
      preservePath: true,
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createPost(
    @Body() createPostDto: CreatepostDto,
    @Req() req,
    @UploadedFile() image,
  ) {
    return this.postsService.createPost(createPostDto, req, image);
  }
  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 1, {
      preservePath: true,
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  updatePost(
    @Body() updatePostDto: UpdatepostDto,
    @Param() id: string,
    @Req() req,
    @UploadedFile() image,
  ) {
    return this.postsService.updatePost(updatePostDto, id, req, image);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  deletePost(@Param() id: string, @Req() req) {
    return this.postsService.deletePost(id, req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('allPosts')
  getAllPosts(@Req() req) {
    return this.postsService.getAllPosts(req);
  }
  @UseGuards(JwtAuthGuard)
  @Get('like/:id')
  like(@Req() req, @Param() id: string) {
    return this.postsService.like(id, req);
  }
}
