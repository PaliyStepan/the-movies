import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Avatar' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiPropertyOptional({ example: 2009 })
  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(new Date().getFullYear() + 5)
  year?: number;

  @ApiPropertyOptional({ example: 'In the 22nd century...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Avatar' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  originalTitle?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  @Length(2, 10)
  originalLanguage?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/poster.jpg',
    description: 'Полный внешний URL постера (http/https)',
  })
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  posterPath?: string;

  @ApiPropertyOptional({ example: 8.7 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  tmdbRating?: number;

  @ApiPropertyOptional({ example: 29843 })
  @IsOptional()
  @IsInt()
  @Min(0)
  voteCount?: number;

  @ApiPropertyOptional({ example: [18, 80], type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  genreIds?: number[];
}
