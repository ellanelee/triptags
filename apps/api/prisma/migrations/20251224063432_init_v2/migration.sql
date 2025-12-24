/*
  Warnings:

  - You are about to drop the column `subdistrict` on the `regions` table. All the data in the column will be lost.
  - You are about to drop the column `main_image` on the `venues` table. All the data in the column will be lost.
  - You are about to drop the column `overall_rating` on the `venues` table. All the data in the column will be lost.
  - You are about to drop the column `review_count` on the `venues` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[country,city,district]` on the table `regions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `image_url` to the `venue_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "review_helpful" DROP CONSTRAINT "review_helpful_user_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropIndex
DROP INDEX "regions_country_city_district_subdistrict_key";

-- AlterTable
ALTER TABLE "google_place" ALTER COLUMN "google_rating" DROP NOT NULL,
ALTER COLUMN "google_types" DROP NOT NULL,
ALTER COLUMN "google_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "regions" DROP COLUMN "subdistrict";

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "system_tag" SET DEFAULT false;

-- AlterTable
ALTER TABLE "venue_images" ADD COLUMN     "image_url" TEXT NOT NULL,
ALTER COLUMN "image_source" DROP NOT NULL;

-- AlterTable
ALTER TABLE "venues" DROP COLUMN "main_image",
DROP COLUMN "overall_rating",
DROP COLUMN "review_count",
ADD COLUMN     "venueCategory" "VenueCategory",
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "regions_country_city_district_key" ON "regions"("country", "city", "district");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_helpful" ADD CONSTRAINT "review_helpful_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
