import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { Authorization } from '../auth/decorators/authorization.decorator.js';
import { Authorized } from '../auth/decorators/authorized.decorator.js';

@ApiTags('reviews')
@Controller({ version: '1' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('movies/:movieId/reviews')
  @ApiOperation({ summary: 'Отзывы фильма' })
  @ApiParam({ name: 'movieId', description: 'UUID фильма' })
  @ApiOkResponse({ description: 'Список отзывов' })
  findByMovie(@Param('movieId') movieId: string) {
    return this.reviewsService.findByMovie(movieId);
  }

  @Authorization()
  @ApiBearerAuth()
  @Post('movies/:movieId/reviews')
  @ApiOperation({ summary: 'Создать отзыв (только для авторизованных)' })
  @ApiParam({ name: 'movieId', description: 'UUID фильма' })
  @ApiCreatedResponse({ description: 'Созданный отзыв' })
  create(
    @Param('movieId') movieId: string,
    @Body() dto: CreateReviewDto,
    @Authorized('id') userId: string,
  ) {
    return this.reviewsService.create(movieId, dto, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @Patch('reviews/:id')
  @ApiOperation({ summary: 'Обновить отзыв (только автор)' })
  @ApiParam({ name: 'id', description: 'UUID отзыва' })
  @ApiOkResponse({ description: 'Обновлённый отзыв' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @Authorized('id') userId: string,
  ) {
    return this.reviewsService.update(id, dto, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @Delete('reviews/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить отзыв (только автор)' })
  @ApiParam({ name: 'id', description: 'UUID отзыва' })
  @ApiNoContentResponse({ description: 'Отзыв удалён' })
  remove(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.reviewsService.remove(id, userId);
  }
}
