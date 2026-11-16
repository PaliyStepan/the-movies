import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateReviewDto {
  @ApiPropertyOptional({
    example: 'Лучший фильм десятилетия',
    description: 'Опциональная цитата в начале отзыва',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @ApiProperty({ example: 'Отличный фильм, рекомендую...' })
  @IsString()
  @Length(10, 5000)
  description: string;
}
