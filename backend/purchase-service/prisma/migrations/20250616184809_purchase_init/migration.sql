-- CreateTable
CREATE TABLE `Purchase` (
    `buyID` INTEGER NOT NULL AUTO_INCREMENT,
    `itemID` INTEGER NOT NULL,
    `vendorID` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `buyDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `totPrice` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('Dipesan', 'Diterima', 'Dibatalkan') NOT NULL,

    PRIMARY KEY (`buyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vendor` (
    `vendorID` INTEGER NOT NULL AUTO_INCREMENT,
    `vendorName` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`vendorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `itemID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`itemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Item`(`itemID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_vendorID_fkey` FOREIGN KEY (`vendorID`) REFERENCES `Vendor`(`vendorID`) ON DELETE RESTRICT ON UPDATE CASCADE;
