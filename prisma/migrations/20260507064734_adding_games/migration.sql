/*
  Warnings:

  - You are about to drop the column `userId` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `customers` table. All the data in the column will be lost.
  - Added the required column `image` to the `Games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specification` to the `Games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `admins` DROP FOREIGN KEY `Admins_userId_fkey`;

-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `Customers_userId_fkey`;

-- DropIndex
DROP INDEX `Admins_userId_key` ON `admins`;

-- DropIndex
DROP INDEX `Customers_userId_key` ON `customers`;

-- AlterTable
ALTER TABLE `admins` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `customers` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `games` ADD COLUMN `image` VARCHAR(191) NOT NULL,
    ADD COLUMN `specification` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Admins` ADD CONSTRAINT `Admins_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customers` ADD CONSTRAINT `Customers_id_fkey` FOREIGN KEY (`id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
