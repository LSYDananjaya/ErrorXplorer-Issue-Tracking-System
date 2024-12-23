/*
  Warnings:

  - Added the required column `userEmail` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `issue` ADD COLUMN `userEmail` VARCHAR(191) NOT NULL;
