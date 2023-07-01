import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatepostDto } from './dtos/createPost.dto';
import { v2 as cloudinary } from 'cloudinary';
import { UpdatepostDto } from './dtos/updatePost.dto';
@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  async uploadImage(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        })
        .end(buffer);
    });
  }
  async createPost(createPostDto: CreatepostDto, req, image) {
    const url = image ? await this.uploadImage(image[0].buffer) : null;
    const post = await this.prisma.posts.create({
      data: { ...createPostDto, userId: req.user.userId, image: url },
    });
    return { message: 'post created successfully', post };
  }
  async updatePost(updatePostDto: UpdatepostDto, id: string, req, image) {
    const url = await this.uploadImage(image[0].buffer);
    await this.prisma.posts.updateMany({
      where: { id, userId: req.user.userId },
      data: { ...updatePostDto, userId: req.user.userId, image: url },
    });
    return { message: 'post updated successfully' };
  }
  async deletePost(id: string, req) {
    await this.prisma.posts.deleteMany({
      where: { id, userId: req.user.userId },
    });
    return { message: 'post deleted successfully' };
  }
  async getAllPosts(req) {
    const user = await this.prisma.users.findUnique({
      where: { id: req.user.userId },
      select: { following: true },
    });
    const allPosts = await this.prisma.posts.findMany({
      where: { userId: { in: user.following } },
    });
    return { message: 'timeLine successfully', allPosts };
  }
  async like(id: string, req) {
    const post = await this.prisma.posts.findUnique({
      where: { id },
    });
    if (req.user.userId in post.likes) {
      await this.prisma.posts.update({
        where: {
          id,
        },
        data: {
          likes: { set: post.likes.filter((id) => id !== req.user.userId) },
        },
      });
      return { message: 'disliked post sucessfully' };
    } else {
      await this.prisma.posts.update({
        where: {
          id,
        },
        data: {
          likes: { push: req.user.userId },
        },
      });
      return { message: 'liked post sucessfully' };
    }
  }
}
