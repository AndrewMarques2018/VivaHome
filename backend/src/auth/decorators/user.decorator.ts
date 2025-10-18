/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';

export const User = createParamDecorator(
  (data: keyof UserEntity, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    // Se passarmos um parâmetro (ex: @User('id')), retorna só o campo.
    // Se não (ex: @User()), retorna o objeto user inteiro.
    return data ? user?.[data] : user;
  },
);
