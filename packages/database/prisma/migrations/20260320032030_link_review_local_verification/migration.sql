/*
  Warnings:

  - You are about to drop the column `is_local_verified` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[local_verification_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "is_local_verified",
ADD COLUMN     "local_verification_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_local_verification_id_key" ON "reviews"("local_verification_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_local_verification_id_fkey" FOREIGN KEY ("local_verification_id") REFERENCES "local_verifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
