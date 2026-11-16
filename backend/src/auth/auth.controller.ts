import {
  Body,
  Res,
  Req,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterRequest } from './dto/register.dto.js';
import { LoginRequest } from './dto/login.dto.js';
import type { Response, Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.dto.js';
import { Authorization } from './decorators/authorization.decorator.js';
import { Authorized } from './decorators/authorized.decorator.js';
import type { User } from '../generated/prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Создание аккаунта',
    description: 'Создает новый аккаунт',
  })
  @ApiCreatedResponse({
    type: AuthResponse,
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные',
  })
  @ApiConflictResponse({
    description: 'Такой пользователь уже существует',
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequest,
  ) {
    return await this.authService.register(res, dto);
  }

  @ApiOperation({
    summary: 'Вход в систему',
    description: 'Авторизация + выдача токена доступа',
  })
  @ApiOkResponse({
    type: AuthResponse,
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные',
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный email или пароль',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequest,
  ) {
    return await this.authService.login(res, dto);
  }

  @ApiOperation({
    summary: 'Обновления токена',
    description: 'Обновляет токен',
  })
  @ApiOkResponse({
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Недействительный токен',
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(req, res);
  }

  @ApiOperation({
    summary: 'Выход из системы',
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res);
  }

  @Authorization()
  @ApiBearerAuth()
  @Get('@me')
  @HttpCode(HttpStatus.OK)
  async me(@Authorized() user: User) {
    return user;
  }

  @Authorization()
  @ApiBearerAuth()
  @Patch('profile')
  @ApiOperation({ summary: 'Обновить профиль (имя, фамилия)' })
  @ApiOkResponse({ description: 'Обновлённый пользователь' })
  updateProfile(
    @Body() dto: UpdateProfileDto,
    @Authorized('id') userId: string,
  ) {
    return this.authService.updateProfile(userId, dto);
  }

  @Authorization()
  @ApiBearerAuth()
  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Сменить пароль' })
  @ApiNoContentResponse({ description: 'Пароль изменён' })
  changePassword(
    @Body() dto: ChangePasswordDto,
    @Authorized('id') userId: string,
  ) {
    return this.authService.changePassword(userId, dto);
  }
}
