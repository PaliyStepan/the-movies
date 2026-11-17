import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { IMovieListQuery, IPaginated, IMovie } from '@the-movies/shared';
import type { Prisma } from '../generated/prisma/client.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { IMovieListQueryDto } from './dto/movie-list-query.dto.js';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: IMovieListQuery,
  ): Promise<IPaginated<IMovie>> {
    const search = query.search?.trim() ?? '';

    if (search.length < 3) {
      return {
        items: [],
        total: 0,
        page: 1,
        limit: query.limit ?? 20,
        totalPages: 0,
      };
    }

    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const sort = query.sort ?? 'tmdbRating';
    const order = query.order ?? 'desc';

    const where: Prisma.MovieWhereInput = {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { originalTitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.movie.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      items: items.map((movie) => this.toResponse(movie)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<IMovie> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: {
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!movie) throw new NotFoundException('Фильм не найден');

    const { _count, ...rest } = movie;

    return {
      ...this.toResponse(rest),
      reviewsCount: _count.reviews,
    };
  }

  async findRecommendations(id: string): Promise<IMovie[]> {
    const movie = await this.prisma.movie.findUnique({ where: { id } });

    if (!movie) {
      throw new NotFoundException('Фильм не найден');
    }

    const excludeCurrentMovie = { id: { not: id } };
    const orderBy = [
      { tmdbRating: { sort: 'desc', nulls: 'last' } },
      { voteCount: { sort: 'desc', nulls: 'last' } },
    ] satisfies Prisma.MovieOrderByWithRelationInput[];

    let similarMovies: Awaited<
      ReturnType<typeof this.prisma.movie.findMany>
    > = [];

    if (movie.genreIds.length) {
      const moviesWithAllGenres = await this.prisma.movie.findMany({
          where: {
            ...excludeCurrentMovie,
            genreIds: { hasEvery: movie.genreIds },
          },
          orderBy,
          take: 10,
      });

      const moviesWithSomeGenres =
          moviesWithAllGenres.length < 10
            ? await this.prisma.movie.findMany({
                where: {
                  ...excludeCurrentMovie,
                  genreIds: { hasSome: movie.genreIds },
                  NOT: { genreIds: { hasEvery: movie.genreIds } },
                },
                orderBy,
                take: 10 - moviesWithAllGenres.length,
              })
            : [];

      similarMovies = [...moviesWithAllGenres, ...moviesWithSomeGenres];
    }

    const recommendations =
      similarMovies.length > 0
          ? similarMovies
          : await this.prisma.movie.findMany({
            where: {
              ...excludeCurrentMovie,
              tmdbRating: { not: null },
            },
            orderBy,
            take: 10,
          });

    return recommendations.map((recommendation) =>
      this.toResponse(recommendation),
    );
  }

  async create(dto: CreateMovieDto, userId: string): Promise<IMovie> {
    const movie = await this.prisma.movie.create({
      data: {
        title: dto.title,
        originalTitle: dto.originalTitle ?? null,
        originalLanguage: dto.originalLanguage ?? null,
        year: dto.year ?? null,
        description: dto.description ?? null,
        posterPath: dto.posterPath ?? null,
        tmdbRating: dto.tmdbRating ?? null,
        voteCount: dto.voteCount ?? null,
        genreIds: dto.genreIds ?? [],
        createdById: userId,
      },
    });
    return this.toResponse(movie);
  }

  private toResponse(movie: {
    id: string;
    tmdbId: number | null;
    title: string;
    originalTitle: string | null;
    originalLanguage: string | null;
    year: number | null;
    description: string | null;
    posterPath: string | null;
    backdropPath: string | null;
    tmdbRating: number | null;
    voteCount: number | null;
    genreIds: number[];
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): IMovie {
    return {
      ...movie,
      createdAt: movie.createdAt.toISOString(),
      updatedAt: movie.updatedAt.toISOString(),
    };
  }

  async getFavoriteStatus(
    id: string,
    userId: string,
  ): Promise<{ isFavorite: boolean }> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      select: {
        favoritedBy: {
          where: { id: userId },
          select: { id: true },
        },
      },
    });
    if (!movie) throw new NotFoundException('Фильм не найден');

    return { isFavorite: movie.favoritedBy.length > 0 };
  }

  async addToFavorites(id: string, userId: string): Promise<void> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!movie) throw new NotFoundException('Фильм не найден');

    await this.prisma.user.update({
      where: { id: userId },
      data: { favorites: { connect: { id } } },
    });
  }

  async removeFromFavorites(id: string, userId: string): Promise<void> {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!movie) throw new NotFoundException('Фильм не найден');

    await this.prisma.user.update({
      where: { id: userId },
      data: { favorites: { disconnect: { id } } },
    });
  }

  async findFavorites(
    userId: string,
    query: IMovieListQuery,
  ): Promise<IPaginated<IMovie>> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const [favorites, total] = await this.prisma.$transaction([
      this.prisma.movie.findMany({
        where: { favoritedBy: { some: { id: userId } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.movie.count({
        where: { favoritedBy: { some: { id: userId } } },
      }),
    ]);

    return {
      items: favorites.map((movie) => ({
        ...this.toResponse(movie),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    dto: UpdateMovieDto,
    userId: string,
  ): Promise<IMovie> {
    const movie = await this.prisma.movie.findUnique({ where: { id } });

    if (!movie) {
      throw new NotFoundException('Фильм не найден');
    }

    if (movie.createdById !== userId) {
      throw new ForbiddenException('Вы не можете редактировать этот фильм');
    }

    const updated = await this.prisma.movie.update({
      where: { id },
      data: {
        title: dto.title,
        originalTitle: dto.originalTitle,
        originalLanguage: dto.originalLanguage,
        year: dto.year,
        description: dto.description,
        posterPath: dto.posterPath,
        tmdbRating: dto.tmdbRating,
        voteCount: dto.voteCount,
        genreIds: dto.genreIds,
      },
    });

    return this.toResponse(updated);
  }

  async remove(id: string, userId: string): Promise<void> {
    const movie = await this.prisma.movie.findUnique({ where: { id } });

    if (!movie) {
      throw new NotFoundException('Фильм не найден');
    }

    if (movie.createdById !== userId) {
      throw new ForbiddenException('Вы не можете удалить этот фильм');
    }

    await this.prisma.movie.delete({ where: { id } });
  }

  async findByUser(
    userId: string,
    query: IMovieListQueryDto,
  ): Promise<IPaginated<IMovie>> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const sort = query.sort ?? 'createdAt';
    const order = query.order ?? 'desc';

    const where: Prisma.MovieWhereInput = { createdById: userId };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.movie.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      items: items.map((movie) => this.toResponse(movie)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
