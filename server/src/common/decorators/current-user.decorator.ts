import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request, Response } from 'express';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {

    // const user = ctx.switchToHttp().getRequest<Request>().header('x-user');

    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.header('x-user');

    if (!user || !user.trim()) {
      throw new BadRequestException('Missing required "x-user" header');
    }

    return user.trim();
  },
);
