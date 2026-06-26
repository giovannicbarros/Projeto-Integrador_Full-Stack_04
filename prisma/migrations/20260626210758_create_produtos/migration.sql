-- CreateTable
CREATE TABLE `produtos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `codigo_barras` VARCHAR(20) NULL,
    `descricao` TEXT NOT NULL,
    `quantidade_estoque` INTEGER NOT NULL DEFAULT 0,
    `categoria` VARCHAR(100) NOT NULL,
    `data_validade` DATETIME(3) NULL,
    `imagem_base64` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `produtos_codigo_barras_key`(`codigo_barras`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
