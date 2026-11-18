import { Test, type TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { MoviesService } from './movies.service.js';

describe('MoviesService', () => {
  let service: MoviesService;
  let module: TestingModule;
  let prisma: {
    movie: {
      findUnique: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      count: ReturnType<typeof vi.fn>;
    };
    user: {
      update: ReturnType<typeof vi.fn>;
    };
    $transaction: ReturnType<typeof vi.fn>;
  };

  const movie = (id: string, genreIds: number[] = [18, 80]) => ({
    id,
    tmdbId: null,
    title: `Movie ${id}`,
    originalTitle: null,
    originalLanguage: null,
    year: 2020,
    description: null,
    posterPath: null,
    backdropPath: null,
    tmdbRating: 8,
    voteCount: 100,
    genreIds,
    createdById: null,
    createdAt: new Date('2020-01-01T00:00:00.000Z'),
    updatedAt: new Date('2020-01-01T00:00:00.000Z'),
  });

  beforeEach(async () => {
    prisma = {
      movie: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
      },
      user: {
        update: vi.fn(),
      },
      $transaction: vi.fn((operations: Promise<unknown>[]) =>
        Promise.all(operations),
      ),
    };

    module = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(MoviesService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('returns an empty search result without querying the database for short input', async () => {
    const result = await service.findAll({ search: 'ab' });

    expect(result).toEqual({
      items: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });
    expect(prisma.movie.findMany).not.toHaveBeenCalled();
  });

  it('prioritizes movies matching all genres before movies matching only some', async () => {
    prisma.movie.findUnique.mockResolvedValue(movie('source'));
    prisma.movie.findMany
      .mockResolvedValueOnce([movie('all-genres')])
      .mockResolvedValueOnce([movie('one-genre', [18])]);

    const result = await service.findRecommendations('source');

    expect(result.map(({ id }) => id)).toEqual(['all-genres', 'one-genre']);
    expect(prisma.movie.findMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: expect.objectContaining({
          genreIds: { hasEvery: [18, 80] },
        }),
      }),
    );
    expect(prisma.movie.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({
          genreIds: { hasSome: [18, 80] },
          NOT: { genreIds: { hasEvery: [18, 80] } },
        }),
      }),
    );
  });

  it('falls back to top-rated movies if no genre matches exist', async () => {
    prisma.movie.findUnique.mockResolvedValue(movie('source'));
    prisma.movie.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([movie('popular', [])]);

    const result = await service.findRecommendations('source');

    expect(result.map(({ id }) => id)).toEqual(['popular']);
    expect(prisma.movie.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { not: 'source' },
          tmdbRating: { not: null },
        }),
        take: 10,
      }),
    );
  });

  it('paginates the current user’s favorites and reports the total', async () => {
    prisma.movie.findMany.mockResolvedValue([movie('favorite')]);
    prisma.movie.count.mockResolvedValue(11);

    const result = await service.findFavorites('user-1', { page: 2, limit: 5 });

    expect(result).toMatchObject({
      items: [{ id: 'favorite' }],
      total: 11,
      page: 2,
      limit: 5,
      totalPages: 3,
    });
    expect(prisma.movie.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { favoritedBy: { some: { id: 'user-1' } } },
        skip: 5,
        take: 5,
      }),
    );
  });

  it('checks favorite status for the requested user', async () => {
    prisma.movie.findUnique.mockResolvedValue({
      favoritedBy: [{ id: 'user-1' }],
    });

    await expect(
      service.getFavoriteStatus('movie-1', 'user-1'),
    ).resolves.toEqual({ isFavorite: true });
    expect(prisma.movie.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'movie-1' },
        select: expect.objectContaining({
          favoritedBy: expect.objectContaining({
            where: { id: 'user-1' },
          }),
        }),
      }),
    );
  });

  it('adds and removes a favorite through the user/movie relation', async () => {
    prisma.movie.findUnique.mockResolvedValue({ id: 'movie-1' });
    prisma.user.update.mockResolvedValue({});

    await service.addToFavorites('movie-1', 'user-1');
    expect(prisma.user.update).toHaveBeenLastCalledWith({
      where: { id: 'user-1' },
      data: { favorites: { connect: { id: 'movie-1' } } },
    });

    await service.removeFromFavorites('movie-1', 'user-1');
    expect(prisma.user.update).toHaveBeenLastCalledWith({
      where: { id: 'user-1' },
      data: { favorites: { disconnect: { id: 'movie-1' } } },
    });
  });

  it('returns not found when checking favorites for a missing movie', async () => {
    prisma.movie.findUnique.mockResolvedValue(null);

    await expect(
      service.getFavoriteStatus('missing', 'user-1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
