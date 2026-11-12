import { createReadStream } from 'node:fs';
import { parse } from 'csv-parse';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env['DATABASE_URL']!,
});
const prisma = new PrismaClient({ adapter });

const CSV_PATH = './prisma/data/tmdb_movies.csv';

interface CsvRow {
  id: string;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: string;
  vote_count: string;
  genre_ids: string;
}

async function main() {
  const parser = createReadStream(CSV_PATH).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,
      relax_column_count: true,
    }),
  );

  let imported = 0;
  let skipped = 0;
  let total = 0;

  for await (const row of parser as AsyncIterable<CsvRow>) {
    total++;

    if (!row.poster_path || !row.overview || !row.title) {
      skipped++;
      continue;
    }

    let genreIds: number[] = [];
    try {
      genreIds = JSON.parse(row.genre_ids) as number[];
    } catch {
      genreIds = [];
    }

    const year = row.release_date ? Number(row.release_date.slice(0, 4)) : null;

    const data = {
      tmdbId: Number(row.id),
      title: row.title,
      originalTitle: row.original_title || null,
      originalLanguage: row.original_language || null,
      year: Number.isFinite(year) ? year : null,
      description: row.overview,
      posterPath: row.poster_path,
      backdropPath: row.backdrop_path || null,
      tmdbRating: row.vote_average ? Number(row.vote_average) : null,
      voteCount: row.vote_count ? Number(row.vote_count) : null,
      genreIds,
    };

    try {
      await prisma.movie.upsert({
        where: { tmdbId: data.tmdbId },
        create: data,
        update: data,
      });
      imported++;
    } catch (err) {
      console.error(`Failed to import tmdbId=${data.tmdbId}:`, err);
      skipped++;
    }

    if (total % 500 === 0) {
      console.log(
        `Progress: ${total} rows, imported: ${imported}, skipped: ${skipped}`,
      );
    }
  }

  console.log(
    `\nDone. Total: ${total}, imported: ${imported}, skipped: ${skipped}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
