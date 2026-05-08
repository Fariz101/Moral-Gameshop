/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `admins` DROP FOREIGN KEY `Admins_id_fkey`;

-- DropForeignKey
ALTER TABLE `customers` DROP FOREIGN KEY `Customers_id_fkey`;

-- AlterTable
ALTER TABLE `admins` ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admins_userId_key` ON `Admins`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Customers_userId_key` ON `Customers`(`userId`);

-- AddForeignKey
ALTER TABLE `Admins` ADD CONSTRAINT `Admins_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Customers` ADD CONSTRAINT `Customers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
