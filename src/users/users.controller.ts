import {
  Body,
  Controller,
  Get,
  Param,
  Req,
  Delete,
  Post,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('')
  allUsers() {
    return this.usersService.allUsers();
  }
  @Get(':id')
  userById(@Param('id') id: string) {
    return this.usersService.userById(id);
  }
  @Post('follow/:id')
  @UseGuards(JwtAuthGuard)
  follow(@Param('id') id: string, @Req() req) {
    return this.usersService.follow(id, req);
  }
  @Get('unfollow/:id')
  @UseGuards(JwtAuthGuard)
  unfollow(@Param('id') id: string, @Req() req) {
    return this.usersService.unfollow(id, req);
  }
}
