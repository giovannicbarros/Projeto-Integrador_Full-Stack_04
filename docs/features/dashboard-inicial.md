# Funcionalidade: Dashboard Inicial

## Objetivo

Dar visibilidade imediata, logo na página inicial do sistema, ao volume de produtos e fornecedores já cadastrados, além de destacar quais produtos já possuem fornecedor associado — e, portanto, já estão prontos para divulgação/venda — orientando o usuário a completar associações pendentes.

## Regras de negócio

- Um produto é considerado "pronto para divulgação" quando possui ao menos um registro correspondente na tabela de junção `produtos_fornecedores`.
- A seção "Produtos para Divulgação" exibe no máximo `PRODUTOS_DIVULGACAO_LIMIT` (6) produtos, ordenados pela data de última atualização do produto (mais recentes primeiro). A listagem completa de produtos continua disponível na tela `/produtos`.
- Os três indicadores numéricos (produtos cadastrados, fornecedores cadastrados, produtos com fornecedor associado) refletem sempre o estado atual do banco de dados — a página é renderizada dinamicamente a cada acesso (`export const dynamic = 'force-dynamic'`), sem cache estático.
- Quando não existe nenhum produto com fornecedor associado, é exibida uma mensagem de estado vazio orientando o usuário a realizar associações pela tela de produtos.

## Fluxo de funcionamento

1. A página inicial (`src/app/page.tsx`), um Server Component, busca em paralelo (`Promise.all`):
   - `contarProdutos()` (`src/services/produto.service.ts`) — total de produtos cadastrados.
   - `contarFornecedores()` (`src/services/fornecedor.service.ts`) — total de fornecedores cadastrados.
   - `contarProdutosComFornecedor()` (`src/services/produto-fornecedor.service.ts`) — total de produtos com ao menos um fornecedor associado.
   - `listarProdutosParaDivulgacao()` (`src/services/produto-fornecedor.service.ts`) — até 6 produtos com fornecedor associado, já incluindo os fornecedores relacionados.
2. Os três primeiros valores são exibidos em cartões de indicador (`StatCard`, `src/components/stat-card.tsx`), cada um linkando para a tela de listagem correspondente (`/produtos` ou `/fornecedores`).
3. A seção "Produtos para Divulgação" renderiza uma grade de cartões com imagem do produto (ou um ícone de placeholder quando não há imagem cadastrada), nome, categoria e "pills" com o nome de cada fornecedor associado. Quando não há produtos com fornecedor associado, uma mensagem de estado vazio é exibida no lugar da grade.
4. Um link "Ver todos os produtos" leva o usuário à listagem completa em `/produtos`.

## Estrutura do banco envolvida

A funcionalidade é somente leitura e não introduz nenhuma tabela ou coluna nova. Utiliza:

- `produtos` — `count()` para o total de produtos e `findMany()` (com `where: { fornecedores: { some: {} } } }` e `take`) para a vitrine de divulgação.
- `fornecedores` — `count()` para o total de fornecedores.
- `produtos_fornecedores` — utilizada implicitamente pelo Prisma para o filtro `fornecedores: { some: {} } }` (produtos com ao menos uma associação) e para trazer, via `include`, os fornecedores de cada produto exibido na vitrine.

Nenhuma migration nova é necessária.

## Possíveis melhorias futuras

- Adicionar paginação ou carrossel à seção "Produtos para Divulgação", em vez do limite fixo de 6 itens.
- Ordenar a vitrine pela data da associação mais recente (campo `createdAt` de `produtos_fornecedores`) em vez da data de atualização do produto.
- Incluir alertas de estoque baixo ou de produtos próximos da data de validade no painel inicial.
- Permitir filtrar a vitrine por categoria de produto.
- Personalizar o painel por usuário, quando o sistema de autenticação for implementado.
