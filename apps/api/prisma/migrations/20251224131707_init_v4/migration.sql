/*
  Warnings:

  - Added the required column `detailed_address` to the `venues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "venues" ADD COLUMN     "detailed_address" TEXT NOT NULL;
