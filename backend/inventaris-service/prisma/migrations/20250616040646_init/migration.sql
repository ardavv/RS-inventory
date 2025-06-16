-- CreateTable
CREATE TABLE `Item` (
    `itemID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `categoryID` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `expiresIn` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`itemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `categoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`categoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `notifID` INTEGER NOT NULL AUTO_INCREMENT,
    `itemID` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `notifDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`notifID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StorageLocation` (
    `locationID` INTEGER NOT NULL AUTO_INCREMENT,
    `locationName` VARCHAR(191) NOT NULL,
    `maxCapacity` INTEGER NOT NULL,

    PRIMARY KEY (`locationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemMove` (
    `moveID` INTEGER NOT NULL AUTO_INCREMENT,
    `itemID` INTEGER NOT NULL,
    `fromLocateID` INTEGER NOT NULL,
    `toLocateID` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `moveDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`moveID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `Category`(`categoryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Item`(`itemID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemMove` ADD CONSTRAINT `ItemMove_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Item`(`itemID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemMove` ADD CONSTRAINT `ItemMove_fromLocateID_fkey` FOREIGN KEY (`fromLocateID`) REFERENCES `StorageLocation`(`locationID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemMove` ADD CONSTRAINT `ItemMove_toLocateID_fkey` FOREIGN KEY (`toLocateID`) REFERENCES `StorageLocation`(`locationID`) ON DELETE RESTRICT ON UPDATE CASCADE;
