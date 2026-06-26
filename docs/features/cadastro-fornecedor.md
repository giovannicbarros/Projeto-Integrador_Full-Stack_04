# Funcionalidade: Cadastro e Gestão de Fornecedores

## Objetivo

Permitir que o gerente de compras cadastre, liste, edite e exclua fornecedores no sistema de controle de estoque (CRUD completo), centralizando as informações de identificação fiscal (CNPJ) e de contato necessárias para a gestão de compras e para o relacionamento com os fornecedores da empresa.

## Regras de negócio

- Todos os campos do cadastro são obrigatórios: Nome da Empresa, CNPJ, Endereço (Logradouro, Número, Bairro, Cidade, UF, CEP), Telefone, E-mail e Contato Principal.
- O CNPJ informado deve ser válido segundo o algoritmo oficial de dígito verificador da Receita Federal, além de respeitar o formato de 14 dígitos. A normalização do CNPJ (remoção da máscara) limita o resultado a 14 dígitos diretamente na função de normalização, evitando que dígitos excedentes digitados ou colados no campo sejam silenciosamente truncados apenas na exibição — comportamento que antes podia causar a rejeição indevida de um CNPJ visualmente válido.
- A UF deve ser uma das 27 unidades federativas válidas do Brasil, selecionada a partir de uma lista pré-definida (combo).
- O CEP deve conter 8 dígitos numéricos (exibido com a máscara `00000-000`).
- O CNPJ deve ser único no sistema: não é permitido cadastrar ou atualizar um fornecedor para um CNPJ já usado por outro fornecedor. Em caso de duplicidade, o sistema exibe a mensagem "Fornecedor com esse CNPJ já está cadastrado!" e bloqueia a operação.
- O telefone deve ser válido no formato fixo (DDD + 8 dígitos) ou celular (DDD + 9 dígitos).
- O e-mail deve estar em um formato válido.
- Em caso de sucesso, o sistema exibe a mensagem "Fornecedor cadastrado com sucesso!" (criação), "Fornecedor atualizado com sucesso!" (edição) ou "Fornecedor excluído com sucesso!" (exclusão).
- Em caso de dados inválidos ou campos obrigatórios não preenchidos, o sistema impede a operação e exibe mensagens de erro específicas ao lado de cada campo inválido.
- A exclusão é definitiva (hard delete) e exige confirmação do usuário antes de ser executada.
- Toda operação de busca, edição ou exclusão referenciando um `id` inexistente retorna o erro "Fornecedor não encontrado." (HTTP 404).

## Fluxo de funcionamento

### Cadastro (Create)

1. O usuário acessa a página `/fornecedores/novo`, que exibe o formulário de cadastro.
2. Ao digitar, os campos de CNPJ, telefone e CEP são formatados automaticamente (máscara), a UF é selecionada a partir de um combo com as 27 unidades federativas, e o formulário valida os dados em tempo real no navegador (`react-hook-form` + `zod`).
3. Ao clicar em "Cadastrar", os dados são enviados via `POST` para a API `/api/fornecedores`.
4. A API revalida os dados recebidos com o mesmo schema Zod usado no formulário (defesa em profundidade contra chamadas diretas à API).
5. O `service` (`fornecedor.service.ts`) verifica se já existe um fornecedor com o mesmo CNPJ; caso exista, a operação é interrompida e o erro de duplicidade é retornado.
6. Caso os dados sejam válidos e o CNPJ seja inédito, o `repository` (`fornecedor.repository.ts`) persiste o novo fornecedor no banco de dados via Prisma.
7. A API responde com sucesso (`201`) ou com o erro correspondente (`400` para dados inválidos, `409` para CNPJ duplicado, `500` para erros inesperados), e a interface exibe a mensagem apropriada (toast de sucesso/erro ou erro inline no campo).

### Listagem (Read)

1. O usuário acessa a página `/fornecedores`, ponto de entrada principal da funcionalidade (linkado na navegação e na página inicial).
2. A página é um Server Component renderizado dinamicamente (`export const dynamic = 'force-dynamic'`) que busca os dados diretamente do `service` (`listarFornecedores`), sem round-trip pela própria API.
3. Os fornecedores são exibidos em uma tabela responsiva com Nome da Empresa, Cidade/UF, CNPJ e Telefone formatados (`formatCnpj`/`formatPhone`) e E-mail, com ações de "Editar" e "Excluir" por linha. Caso não haja fornecedores, é exibida a mensagem "Nenhum fornecedor cadastrado."
4. A rota `GET /api/fornecedores` também está disponível e retorna a mesma lista em JSON, para uso por integrações externas ou chamadas client-side futuras.

### Edição (Update)

1. Ao clicar em "Editar" na listagem, o usuário é levado a `/fornecedores/[id]/editar`, que busca o fornecedor pelo `id` (`buscarFornecedorPorId`) e renderiza o mesmo formulário de cadastro (`FornecedorForm`) já pré-preenchido com os dados atuais.
2. Se o `id` não for um número válido ou não existir, a página retorna 404 (`notFound()` do Next.js).
3. Ao salvar, os dados são enviados via `PUT` para `/api/fornecedores/[id]`, passando pelas mesmas validações de schema e tratamento de erros do cadastro; a verificação de CNPJ duplicado ignora o próprio registro sendo editado.
4. Em caso de sucesso, o usuário é redirecionado para `/fornecedores` com a lista já atualizada.

### Exclusão (Delete)

1. Ao clicar em "Excluir" na listagem, o usuário confirma a ação em uma caixa de diálogo nativa do navegador (`window.confirm`).
2. Confirmada a exclusão, o componente cliente envia uma requisição `DELETE` para `/api/fornecedores/[id]`.
3. O `service` (`excluirFornecedor`) verifica se o fornecedor existe antes de excluir; caso não exista, retorna erro 404.
4. Em caso de sucesso, a lista é atualizada automaticamente (`router.refresh()`) e uma mensagem de confirmação é exibida via toast.

## Estrutura do banco envolvida

Tabela `fornecedores` (model Prisma `Fornecedor`):

| Coluna              | Tipo           | Restrições                  |
|---------------------|----------------|------------------------------|
| `id`                | INT            | PK, auto increment           |
| `nome_empresa`      | VARCHAR(150)   | NOT NULL                     |
| `cnpj`              | VARCHAR(14)    | NOT NULL, UNIQUE              |
| `logradouro`        | VARCHAR(150)   | NOT NULL                     |
| `numero`            | VARCHAR(10)    | NOT NULL                     |
| `bairro`            | VARCHAR(100)   | NOT NULL                     |
| `cidade`            | VARCHAR(100)   | NOT NULL                     |
| `uf`                | VARCHAR(2)     | NOT NULL                     |
| `cep`               | VARCHAR(8)     | NOT NULL                     |
| `telefone`          | VARCHAR(11)    | NOT NULL                     |
| `email`             | VARCHAR(150)   | NOT NULL                     |
| `contato_principal` | VARCHAR(150)   | NOT NULL                     |
| `created_at`        | DATETIME(3)    | NOT NULL, default `now()`    |
| `updated_at`        | DATETIME(3)    | NOT NULL, atualizado automaticamente |

Migrations: `prisma/migrations/20260624210010_create_fornecedores/migration.sql` (criação da tabela) e `prisma/migrations/20260626171230_restructure_fornecedor_endereco/migration.sql` (substituição do campo único `endereco` pelos campos estruturados `logradouro`, `numero`, `bairro`, `cidade`, `uf` e `cep`).

## Possíveis melhorias futuras

- Adicionar paginação e busca/filtro na listagem de fornecedores.
- Substituir a exclusão definitiva por soft delete (campo `deletedAt`), preservando o histórico de fornecedores vinculados a pedidos de compra.
- Substituir a confirmação de exclusão via `window.confirm` por um modal customizado, alinhado ao design visual do projeto.
- Adicionar busca/autocompletar dos dados da empresa a partir do CNPJ usando uma API externa (ex.: BrasilAPI ou ReceitaWS).
- Integrar busca automática de endereço a partir do CEP usando uma API externa (ex.: ViaCEP), preenchendo Logradouro, Bairro, Cidade e UF automaticamente.
- Adicionar unicidade de e-mail, caso a regra de negócio venha a exigir isso.
- Registrar o usuário responsável pelo cadastro/edição/exclusão, quando o sistema de autenticação de usuários for implementado.
