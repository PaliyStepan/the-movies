import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class IMovieListQueryDto {
  @ApiPropertyOptional({
    description: 'Поиск по названию или описанию (минимум 3 символа)',
    example: 'avatar',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    enum: ['title', 'year', 'tmdbRating', 'voteCount', 'createdAt'],
    default: 'tmdbRating',
  })
  @IsOptional()
  @IsIn(['title', 'year', 'tmdbRating', 'voteCount', 'createdAt'])
  sort?: 'title' | 'year' | 'tmdbRating' | 'voteCount' | 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
