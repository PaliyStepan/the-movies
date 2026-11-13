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
import { MoviesService } from './movies.service.js';
import { MovieListQueryDto } from './dto/movie-list-query.dto.js';
import { Authorization } from '../auth/decorators/authorization.decorator.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { Authorized } from '../auth/decorators/authorized.decorator.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';

@ApiTags('movies')
@Controller({ path: 'movies', version: '1' })
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({
    summary: 'Поиск фильмов',
    description:
      'Пагинированный список фильмов. Поиск работает только при search ≥ 3 символов. Если search пуст или короче — возвращается пустой список.',
  })
  @ApiOkResponse({ description: 'Пагинированный список фильмов' })
  findAll(@Query() query: MovieListQueryDto) {
    return this.moviesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Фильм по id' })
  @ApiParam({ name: 'id', description: 'UUID фильма' })
  @ApiOkResponse({ description: 'Найденный фильм' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Authorization()
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Создать фильм (только для авторизованных)' })
  @ApiCreatedResponse({ description: 'Созданный фильм' })
  create(@Body() dto: CreateMovieDto, @Authorized('id') userId: string) {
    return this.moviesService.create(dto, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить фильм (только автор)' })
  @ApiParam({ name: 'id', description: 'UUID фильма' })
  @ApiOkResponse({ description: 'Обновлённый фильм' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMovieDto,
    @Authorized('id') userId: string,
  ) {
    return this.moviesService.update(id, dto, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить фильм (только автор)' })
  @ApiParam({ name: 'id', description: 'UUID фильма' })
  @ApiNoContentResponse({ description: 'Фильм удалён' })
  remove(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.moviesService.remove(id, userId);
  }
}
