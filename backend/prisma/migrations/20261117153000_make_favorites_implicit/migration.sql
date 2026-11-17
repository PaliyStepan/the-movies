DROP INDEX "favorites_user_id_created_at_idx";

ALTER TABLE "favorites" DROP CONSTRAINT "favorites_user_id_fkey";
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_movie_id_fkey";
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_pkey";

ALTER TABLE "favorites" DROP COLUMN "created_at";
ALTER TABLE "favorites" RENAME COLUMN "movie_id" TO "A";
ALTER TABLE "favorites" RENAME COLUMN "user_id" TO "B";
ALTER TABLE "favorites" RENAME TO "_UserFavorites";

ALTER TABLE "_UserFavorites" ADD CONSTRAINT "_UserFavorites_AB_pkey" PRIMARY KEY ("A", "B");
CREATE INDEX "_UserFavorites_B_index" ON "_UserFavorites"("B");

ALTER TABLE "_UserFavorites" ADD CONSTRAINT "_UserFavorites_A_fkey"
    FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_UserFavorites" ADD CONSTRAINT "_UserFavorites_B_fkey"
    FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
