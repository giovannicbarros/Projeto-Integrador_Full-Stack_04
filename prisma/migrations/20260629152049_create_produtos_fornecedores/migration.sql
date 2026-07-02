-- CreateTable
CREATE TABLE `produtos_fornecedores` (
    `produto_id` INTEGER NOT NULL,
    `fornecedor_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`produto_id`, `fornecedor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `produtos_fornecedores` ADD CONSTRAINT `produtos_fornecedores_produto_id_fkey` FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produtos_fornecedores` ADD CONSTRAINT `produtos_fornecedores_fornecedor_id_fkey` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
