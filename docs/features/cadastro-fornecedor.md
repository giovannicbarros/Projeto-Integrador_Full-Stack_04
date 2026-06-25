# Funcionalidade: Cadastro de Fornecedor

## Objetivo

Permitir que o gerente de compras cadastre fornecedores no sistema de controle de estoque, centralizando as informações de identificação fiscal (CNPJ) e de contato necessárias para a gestão de compras e para o relacionamento com os fornecedores da empresa.

## Regras de negócio

- Todos os campos do cadastro são obrigatórios: Nome da Empresa, CNPJ, Endereço, Telefone, E-mail e Contato Principal.
- O CNPJ informado deve ser válido segundo o algoritmo oficial de dígito verificador da Receita Federal, além de respeitar o formato de 14 dígitos.
- O CNPJ deve ser único no sistema: não é permitido cadastrar dois fornecedores com o mesmo CNPJ. Em caso de duplicidade, o sistema exibe a mensagem "Fornecedor com esse CNPJ já está cadastrado!" e bloqueia o cadastro.
- O telefone deve ser válido no formato fixo (DDD + 8 dígitos) ou celular (DDD + 9 dígitos).
- O e-mail deve estar em um formato válido.
- Em caso de sucesso, o sistema exibe a mensagem "Fornecedor cadastrado com sucesso!".
- Em caso de dados inválidos ou campos obrigatórios não preenchidos, o sistema impede o cadastro e exibe mensagens de erro específicas ao lado de cada campo inválido.

## Fluxo de funcionamento

1. O usuário acessa a página `/fornecedores/novo`, que exibe o formulário de cadastro.
2. Ao digitar, os campos de CNPJ e telefone são formatados automaticamente (máscara) e o formulário valida os dados em tempo real no navegador (`react-hook-form` + `zod`).
3. Ao clicar em "Cadastrar", os dados são enviados via `POST` para a API `/api/fornecedores`.
4. A API revalida os dados recebidos com o mesmo schema Zod usado no formulário (defesa em profundidade contra chamadas diretas à API).
5. O `service` (`fornecedor.service.ts`) verifica se já existe um fornecedor com o mesmo CNPJ; caso exista, a operação é interrompida e o erro de duplicidade é retornado.
6. Caso os dados sejam válidos e o CNPJ seja inédito, o `repository` (`fornecedor.repository.ts`) persiste o novo fornecedor no banco de dados via Prisma.
7. A API responde com sucesso (`201`) ou com o erro correspondente (`400` para dados inválidos, `409` para CNPJ duplicado, `500` para erros inesperados), e a interface exibe a mensagem apropriada (toast de sucesso/erro ou erro inline no campo).

## Estrutura do banco envolvida

Tabela `fornecedores` (model Prisma `Fornecedor`):

| Coluna              | Tipo           | Restrições                  |
|---------------------|----------------|------------------------------|
| `id`                | INT            | PK, auto increment           |
| `nome_empresa`      | VARCHAR(150)   | NOT NULL                     |
| `cnpj`              | VARCHAR(14)    | NOT NULL, UNIQUE              |
| `endereco`          | VARCHAR(255)   | NOT NULL                     |
| `telefone`          | VARCHAR(11)    | NOT NULL                     |
| `email`             | VARCHAR(150)   | NOT NULL                     |
| `contato_principal` | VARCHAR(150)   | NOT NULL                     |
| `created_at`        | DATETIME(3)    | NOT NULL, default `now()`    |
| `updated_at`        | DATETIME(3)    | NOT NULL, atualizado automaticamente |

Migration: `prisma/migrations/20260624210010_create_fornecedores/migration.sql`.

## Possíveis melhorias futuras

- Implementar a listagem de fornecedores com paginação e busca (`GET /api/fornecedores`) e a página `/fornecedores`.
- Implementar edição e exclusão (preferencialmente soft delete) de fornecedores.
- Adicionar busca/autocompletar dos dados da empresa a partir do CNPJ usando uma API externa (ex.: BrasilAPI ou ReceitaWS).
- Adicionar unicidade de e-mail, caso a regra de negócio venha a exigir isso.
- Registrar o usuário responsável pelo cadastro, quando o sistema de autenticação de usuários for implementado.
