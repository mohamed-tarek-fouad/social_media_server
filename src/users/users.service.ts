import { PrismaService } from 'src/prisma.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET,
    });
  }
  async allUsers() {
    const user = await this.prisma.users.findMany({});
    if (user.length === 0) {
      throw new HttpException('there is no users', HttpStatus.BAD_REQUEST);
    }

    return { ...user, message: 'fetched all users successfully' };
  }

  async userById(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException(
        "this user does'nt exist",
        HttpStatus.BAD_REQUEST,
      );
    }
    delete user.password;
    return { ...user, message: 'user fetched successfully' };
  }
  async follow(id: string, req) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      throw new HttpException(
        "this user does'nt exist",
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.users.update({
      where: {
        id: req.user.userId,
      },
      data: {
        following: { push: id },
      },
    });
    await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        followers: { push: req.user.userId },
      },
    });
    return { message: 'followed user successfully' };
  }
  async unfollow(id: string, req) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: req.user.userId,
      },
    });
    if (!user) {
      throw new HttpException(
        "this user does'nt exist",
        HttpStatus.BAD_REQUEST,
      );
    }
    const followeduser = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });
    await this.prisma.users.update({
      where: {
        id: req.user.userId,
      },
      data: {
        following: {
          set: user.followers.filter((id) => id !== followeduser.id),
        },
      },
    });
    await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        followers: {
          set: followeduser.followers.filter((id) => id !== user.id),
        },
      },
    });
    return { message: 'unfollowed user successfully' };
  }
}
