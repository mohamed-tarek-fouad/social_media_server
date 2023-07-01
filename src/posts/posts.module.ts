import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, PrismaService],
})
export class PostsModule {}
