# Funcionalidade: Associação de Fornecedor a Produto

## Objetivo

Permitir que o gerente de estoque associe um ou mais fornecedores cadastrados a um produto específico, possibilitando rastrear de quais fornecedores cada produto é adquirido e gerenciar melhor as relações de compra.

## Regras de negócio

- Um produto pode estar associado a vários fornecedores, e um fornecedor pode estar associado a vários produtos (relação N:N).
- Não é permitido associar o mesmo fornecedor duas vezes ao mesmo produto. Em caso de tentativa de duplicidade, o sistema bloqueia a operação e exibe a mensagem "Fornecedor já está associado a este produto!".
- Em caso de sucesso na associação, o sistema exibe a mensagem "Fornecedor associado com sucesso ao produto!".
- Ao desassociar um fornecedor de um produto, o sistema exibe a mensagem "Fornecedor desassociado com sucesso!". A desassociação é uma ação reversível (o fornecedor pode ser associado novamente ao mesmo produto) e, por isso, não exige confirmação prévia.
- Toda operação de associação ou desassociação referenciando um `produtoId` ou `fornecedorId` inexistente retorna erro 404 ("Produto não encontrado."/"Fornecedor não encontrado.").
- Ao excluir um produto ou um fornecedor (fluxos de exclusão já existentes), todas as associações relacionadas a ele são removidas automaticamente do banco de dados (cascade), sem necessidade de lógica adicional nos serviços de exclusão.

## Fluxo de funcionamento

### Acesso à tela de associação

1. Na listagem `/produtos`, cada linha possui um ícone de "Fornecedores" (caminhão) na coluna Ações, que leva à página `/produtos/[id]/fornecedores`.
2. A página é um Server Component que busca o produto (`buscarProdutoPorId`) — retornando 404 caso não exista —, a lista completa de fornecedores cadastrados (`listarFornecedores`, para o dropdown de seleção) e a lista de fornecedores já associados ao produto (`listarFornecedoresDoProduto`), em paralelo.
3. A tela exibe os dados do produto em campos somente leitura (Nome, Código de Barras, Descrição e miniatura da imagem, quando houver), seguidos da seção de associação.

### Associação (Create)

1. O usuário seleciona um fornecedor no menu suspenso "Selecione um fornecedor" (lista todos os fornecedores cadastrados, incluindo os já associados) e clica em "Associar Fornecedor".
2. A requisição é enviada via `POST` para `/api/produtos/[id]/fornecedores`, com o `fornecedorId` selecionado no corpo, validado com Zod (`associarFornecedorSchema`).
3. O `service` (`produto-fornecedor.service.ts`) confirma que o produto e o fornecedor existem e verifica se a associação já existe; em caso de duplicidade, lança `FornecedorJaAssociadoError` (HTTP 409).
4. Caso não exista associação prévia, o `repository` (`produto-fornecedor.repository.ts`) cria o registro na tabela `produtos_fornecedores`.
5. Em caso de sucesso, a lista de fornecedores associados é atualizada (`router.refresh()`) e a mensagem de confirmação é exibida via toast.

### Desassociação (Delete)

1. Na seção "Fornecedores Associados", o usuário clica em "Desassociar" na linha do fornecedor desejado.
2. A requisição é enviada via `DELETE` para `/api/produtos/[id]/fornecedores/[fornecedorId]`.
3. O `service` confirma que o produto existe e que a associação existe; caso não exista, lança `AssociacaoNaoEncontradaError` (HTTP 404).
4. Em caso de sucesso, o registro é removido da tabela `produtos_fornecedores`, a lista é atualizada (`router.refresh()`) e a mensagem de confirmação é exibida via toast.

## Estrutura do banco envolvida

Tabela `produtos_fornecedores` (model Prisma `ProdutoFornecedor`), tabela de junção explícita entre `produtos` e `fornecedores`:

| Coluna           | Tipo        | Restrições                                                  |
|-------------------|-------------|---------------------------------------------------------------|
| `produto_id`      | INT         | PK (composta), FK → `produtos.id`, `ON DELETE CASCADE`        |
| `fornecedor_id`   | INT         | PK (composta), FK → `fornecedores.id`, `ON DELETE CASCADE`    |
| `created_at`      | DATETIME(3) | NOT NULL, default `now()`                                     |

A chave primária composta `(produto_id, fornecedor_id)` garante, a nível de banco, que o mesmo par produto/fornecedor não possa ser associado mais de uma vez.

Migration: `prisma/migrations/20260629152049_create_produtos_fornecedores/migration.sql`.

## Possíveis melhorias futuras

- Registrar informações adicionais por associação (ex.: preço de compra negociado, quantidade fornecida, prazo de entrega).
- Manter histórico de associações desfeitas, em vez de excluir definitivamente o registro de `produtos_fornecedores`.
- Permitir associar múltiplos fornecedores a um produto em lote, em vez de um por vez.
- Filtrar o dropdown de seleção para destacar visualmente os fornecedores já associados, em vez de depender apenas da validação do servidor.
- Registrar o usuário responsável pela associação/desassociação, quando o sistema de autenticação de usuários for implementado.
