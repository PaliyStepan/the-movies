/*
  Warnings:

  - You are about to drop the column `backdrop_url` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `poster_url` on the `movies` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "backdrop_url",
DROP COLUMN "poster_url",
ADD COLUMN     "backdrop_path" TEXT,
ADD COLUMN     "poster_path" TEXT;
