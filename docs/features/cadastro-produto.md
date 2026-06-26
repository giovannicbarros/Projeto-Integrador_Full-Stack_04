# Funcionalidade: Cadastro e Gestão de Produtos

## Objetivo

Permitir que o gerente de estoque cadastre, liste, edite e exclua produtos no sistema de controle de estoque (CRUD completo), centralizando as informações relevantes sobre os produtos disponíveis — identificação, descrição, quantidade disponível, categoria, validade e imagem — para possibilitar o gerenciamento e a rastreabilidade do estoque.

## Regras de negócio

- Nome do Produto, Descrição e Categoria são obrigatórios. Código de Barras, Quantidade em Estoque, Data de Validade e Imagem do Produto são opcionais, pois nem todo produto possui validade, imagem ou código de barras cadastrado.
- O Código de Barras, quando informado, é normalizado para conter apenas dígitos (máximo de 20 dígitos) e deve ser único no sistema: não é permitido cadastrar ou atualizar um produto para um código de barras já usado por outro produto. Em caso de duplicidade, o sistema exibe a mensagem "Produto com este código de barras já está cadastrado!" e bloqueia a operação. Como o campo é opcional, dois ou mais produtos podem ficar sem código de barras simultaneamente, sem violar a unicidade.
- A Quantidade em Estoque, quando não informada, assume o valor padrão `0`. Quando informada, deve ser um número inteiro maior ou igual a zero.
- A Categoria é selecionada a partir de uma lista pré-definida (Eletrônicos, Alimentos, Vestuário, Higiene e Limpeza, Casa e Decoração, Papelaria) ou da opção "Outro", que libera um campo de texto livre para especificar uma categoria não listada. O valor final salvo no banco é sempre o texto da categoria (pré-definida ou customizada).
- A Data de Validade, quando informada, deve ser uma data válida.
- A Imagem do Produto, quando enviada, é convertida para uma string `base64` (Data URL no formato `data:image/...`) diretamente no navegador e armazenada nessa forma no banco, limitada a aproximadamente 2 MB para evitar payloads excessivos.
- Em caso de sucesso, o sistema exibe a mensagem "Produto cadastrado com sucesso!" (criação), "Produto atualizado com sucesso!" (edição) ou "Produto excluído com sucesso!" (exclusão).
- Em caso de dados inválidos ou campos obrigatórios não preenchidos, o sistema impede a operação e exibe mensagens de erro específicas ao lado de cada campo inválido.
- A exclusão é definitiva (hard delete) e exige confirmação do usuário antes de ser executada.
- Toda operação de busca, edição ou exclusão referenciando um `id` inexistente retorna o erro "Produto não encontrado." (HTTP 404).

## Fluxo de funcionamento

### Cadastro (Create)

1. O usuário acessa a página `/produtos/novo`, que exibe o formulário de cadastro.
2. O formulário valida cada campo ao perder o foco (`onBlur`, via `react-hook-form` + `zod`), sem precisar esperar o envio para mostrar o erro. A Categoria é controlada por um combo com as opções pré-definidas mais "Outro"; ao selecionar "Outro", um campo de texto livre é exibido para que o usuário especifique a categoria. A Imagem é selecionada por um campo de upload de arquivo, que gera uma pré-visualização da imagem escolhida e converte o arquivo para `base64` no navegador (via `FileReader`), sem necessidade de upload multipart para o servidor.
3. Ao clicar em "Cadastrar" com algum campo obrigatório inválido ou vazio, além das mensagens inline em cada campo, é exibido um toast de informação ("Verifique os campos destacados em vermelho.") orientando o usuário a corrigir os dados.
4. Ao clicar em "Cadastrar" com todos os dados válidos, o formulário transforma os valores (string do input) para os tipos finais do produto (número, data, nulo quando vazio) e os envia via `POST`, em JSON, para a API `/api/produtos`.
5. A API revalida o corpo recebido com um schema Zod equivalente, adaptado para validar o formato já transformado (`produtoApiSchema`), funcionando como defesa em profundidade contra chamadas diretas à API.
6. O `service` (`produto.service.ts`) verifica, quando um código de barras foi informado, se já existe um produto com o mesmo código; caso exista, a operação é interrompida e o erro de duplicidade é retornado.
7. Caso os dados sejam válidos e o código de barras (se informado) seja inédito, o `repository` (`produto.repository.ts`) persiste o novo produto no banco de dados via Prisma.
8. A API responde com sucesso (`201`) ou com o erro correspondente (`400` para dados inválidos, `409` para código de barras duplicado, `500` para erros inesperados), e a interface exibe a mensagem apropriada (toast de sucesso/erro ou erro inline no campo de código de barras).

### Listagem (Read)

1. O usuário acessa a página `/produtos`, linkada na navegação principal ao lado de Fornecedores.
2. A página é um Server Component renderizado dinamicamente (`export const dynamic = 'force-dynamic'`) que busca os dados diretamente do `service` (`listarProdutos`), sem round-trip pela própria API.
3. Os produtos são exibidos em uma tabela responsiva com Nome, Categoria, Código de Barras, Quantidade em Estoque e Data de Validade (formatada em `pt-BR`, ou `-` quando não informada), com ações de "Editar" e "Excluir" por linha. Caso não haja produtos, é exibida a mensagem "Nenhum produto cadastrado."
4. A rota `GET /api/produtos` também está disponível e retorna a mesma lista em JSON, para uso por integrações externas ou chamadas client-side futuras.

### Edição (Update)

1. Ao clicar em "Editar" na listagem, o usuário é levado a `/produtos/[id]/editar`, que busca o produto pelo `id` (`buscarProdutoPorId`) e renderiza o mesmo formulário de cadastro (`ProdutoForm`) já pré-preenchido com os dados atuais, incluindo a pré-visualização da imagem existente e a categoria selecionada (detectando automaticamente se o valor salvo corresponde a uma categoria pré-definida ou a uma categoria customizada via "Outro").
2. Se o `id` não for um número válido ou não existir, a página retorna 404 (`notFound()` do Next.js).
3. Ao salvar, os dados são enviados via `PUT` para `/api/produtos/[id]`, passando pelas mesmas validações de schema e tratamento de erros do cadastro; a verificação de código de barras duplicado ignora o próprio registro sendo editado.
4. Em caso de sucesso, o usuário é redirecionado para `/produtos` com a lista já atualizada.

### Exclusão (Delete)

1. Ao clicar em "Excluir" na listagem, o usuário confirma a ação em um modal de confirmação customizado (`ConfirmDialog`), alinhado ao design visual do projeto.
2. Confirmada a exclusão, o componente cliente envia uma requisição `DELETE` para `/api/produtos/[id]`.
3. O `service` (`excluirProduto`) verifica se o produto existe antes de excluir; caso não exista, retorna erro 404.
4. Em caso de sucesso, a lista é atualizada automaticamente (`router.refresh()`) e uma mensagem de confirmação é exibida via toast.

## Estrutura do banco envolvida

Tabela `produtos` (model Prisma `Produto`):

| Coluna                | Tipo           | Restrições                  |
|-----------------------|----------------|------------------------------|
| `id`                  | INT            | PK, auto increment           |
| `nome`                | VARCHAR(150)   | NOT NULL                     |
| `codigo_barras`       | VARCHAR(20)    | NULL, UNIQUE                  |
| `descricao`           | TEXT           | NOT NULL                     |
| `quantidade_estoque`  | INT            | NOT NULL, default `0`        |
| `categoria`           | VARCHAR(100)   | NOT NULL                     |
| `data_validade`       | DATETIME(3)    | NULL                          |
| `imagem_base64`       | LONGTEXT       | NULL                          |
| `created_at`          | DATETIME(3)    | NOT NULL, default `now()`    |
| `updated_at`          | DATETIME(3)    | NOT NULL, atualizado automaticamente |

Migration: `prisma/migrations/20260626210758_create_produtos/migration.sql` (criação da tabela `produtos`).

## Possíveis melhorias futuras

- Adicionar paginação e busca/filtro (por nome, categoria ou código de barras) na listagem de produtos.
- Substituir a exclusão definitiva por soft delete (campo `deletedAt`), preservando o histórico de produtos vinculados a movimentações de estoque.
- Migrar o armazenamento da imagem de `base64` no banco para um serviço externo de armazenamento de arquivos (ex.: S3, Cloudinary), reduzindo o tamanho das linhas da tabela e melhorando a performance de leitura.
- Permitir a leitura do código de barras via câmera/leitor óptico no momento do cadastro.
- Adicionar alertas automáticos de produtos próximos da data de validade ou com estoque baixo.
- Tornar a lista de categorias pré-definidas configurável (cadastro de categorias), em vez de fixa no código.
- Registrar o usuário responsável pelo cadastro/edição/exclusão, quando o sistema de autenticação de usuários for implementado.
