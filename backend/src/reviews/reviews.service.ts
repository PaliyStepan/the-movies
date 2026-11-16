import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { IReview } from '@the-movies/shared';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByMovie(movieId: string): Promise<IReview[]> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) throw new NotFoundException('Фильм не найден');

    const reviews = await this.prisma.review.findMany({
      where: { movieId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map((r) => this.toResponse(r));
  }

  async findOne(id: string): Promise<IReview> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    if (!review) throw new NotFoundException('Отзыв не найден');
    return this.toResponse(review);
  }

  async create(
    movieId: string,
    dto: CreateReviewDto,
    userId: string,
  ): Promise<IReview> {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });
    if (!movie) throw new NotFoundException('Фильм не найден');

    const existing = await this.prisma.review.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });
    if (existing) {
      throw new ConflictException('Вы уже оставили отзыв на этот фильм');
    }

    const review = await this.prisma.review.create({
      data: {
        title: dto.title ?? null,
        description: dto.description,
        userId,
        movieId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return this.toResponse(review);
  }

  async update(
    id: string,
    dto: UpdateReviewDto,
    userId: string,
  ): Promise<IReview> {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Отзыв не найден');
    if (review.userId !== userId) {
      throw new ForbiddenException('Вы не можете редактировать этот отзыв');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return this.toResponse(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Отзыв не найден');
    if (review.userId !== userId) {
      throw new ForbiddenException('Вы не можете удалить этот отзыв');
    }

    await this.prisma.review.delete({ where: { id } });
  }

  private toResponse(review: {
    id: string;
    title: string | null;
    description: string;
    userId: string;
    movieId: string;
    user: {
      id: string;
      email: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
  }): IReview {
    return {
      id: review.id,
      title: review.title,
      description: review.description,
      userId: review.userId,
      movieId: review.movieId,
      user: {
        ...review.user,
        createdAt: review.user.createdAt.toISOString(),
        updatedAt: review.user.updatedAt.toISOString(),
      },
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }
}
