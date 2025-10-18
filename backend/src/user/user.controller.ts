// src/user/user.controller.ts
import { Controller, Get, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

// NOTA: Estes @UseGuards e o @User (decorator de parâmetro)
// ainda não existem. Vamos adicioná-los na Fase 3 (AuthModule).
// Por enquanto, as rotas estão "inseguras".

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Rota: GET /users/me
  @Get('me')
  // @UseGuards(JwtAuthGuard) // <-- Adicionaremos isso depois
  getProfile(/* @User('id') userId: string */): Promise<UserEntity> {
    const fakeUserId = 'ID_VEM_DO_TOKEN'; // <-- Vamos substituir isso
    return this.userService.findById(fakeUserId);
  }

  // Rota: PUT /users/me
  @Put('me')
  // @UseGuards(JwtAuthGuard) // <-- Adicionaremos isso depois
  updateProfile(
    /* @User('id') userId: string, */
    @Body() dto: UpdateUserDto,
  ): Promise<UserEntity> {
    const fakeUserId = 'ID_VEM_DO_TOKEN'; // <-- Vamos substituir isso
    return this.userService.update(fakeUserId, dto);
  }

  // Rota: DELETE /users/me
  @Delete('me')
  // @UseGuards(JwtAuthGuard) // <-- Adicionaremos isso depois
  deleteAccount(
    /* @User('id') userId: string */
  ): Promise<UserEntity> {
    const fakeUserId = 'ID_VEM_DO_TOKEN'; // <-- Vamos substituir isso
    return this.userService.delete(fakeUserId);
  }
}