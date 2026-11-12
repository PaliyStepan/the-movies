-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "tmdb_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "original_title" TEXT,
    "original_language" TEXT,
    "year" INTEGER,
    "description" TEXT,
    "poster_url" TEXT,
    "backdrop_url" TEXT,
    "tmdb_rating" DOUBLE PRECISION,
    "vote_count" INTEGER,
    "genre_ids" INTEGER[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_tmdb_id_key" ON "movies"("tmdb_id");
