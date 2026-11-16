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
  Query,
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
import { ReviewListQueryDto } from './dto/review-list-query.dto.js';

@ApiTags('reviews')
@Controller({ version: '1' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('movies/:movieId/reviews')
  @ApiOperation({ summary: 'Отзывы фильма (пагинированные)' })
  @ApiParam({ name: 'movieId', description: 'UUID фильма' })
  @ApiOkResponse({ description: 'Пагинированный список отзывов' })
  findByMovie(
    @Param('movieId') movieId: string,
    @Query() query: ReviewListQueryDto,
  ) {
    return this.reviewsService.findByMovie(movieId, query);
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

  @Authorization()
  @ApiBearerAuth()
  @Get('reviews/me')
  @ApiOperation({ summary: 'Мои отзывы (пагинированные)' })
  @ApiOkResponse({ description: 'Пагинированный список моих отзывов' })
  findMy(@Query() query: ReviewListQueryDto, @Authorized('id') userId: string) {
    return this.reviewsService.findByUser(userId, query);
  }

  @Get('reviews/:id')
  @ApiOperation({ summary: 'Отзыв по id' })
  @ApiParam({ name: 'id', description: 'UUID отзыва' })
  @ApiOkResponse({ description: 'Найденный отзыв' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }
}
