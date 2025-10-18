import { Controller, Get, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getProfile(@User() user: UserEntity): UserEntity {
    return user;
  }

  @Put('me')
  updateProfile(
    @User('id') userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.update(userId, dto);
  }

  @Delete('me')
  deleteAccount(@User('id') userId: string): Promise<UserEntity> {
    return this.userService.delete(userId);
  }
}
