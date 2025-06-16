-- CreateTable
CREATE TABLE `ItemTrack` (
    `moveId` INTEGER NOT NULL AUTO_INCREMENT,
    `itemId` INTEGER NOT NULL,
    `fromLocateId` INTEGER NOT NULL,
    `toLocateId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `moveDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`moveId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
