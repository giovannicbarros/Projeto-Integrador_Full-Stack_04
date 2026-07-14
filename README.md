# Projeto Integrador Full-Stack 04

Sistema de controle de estoque desenvolvido como Trabalho de Conclusão de Curso (TCC), permitindo o cadastro e gerenciamento de produtos, fornecedores e a associação entre eles.

## Tecnologias utilizadas

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Prisma ORM 6](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [Zod](https://zod.dev/) (validação de dados)
- [React Hook Form](https://react-hook-form.com/)

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) 20 ou superior
- [npm](https://www.npmjs.com/) (instalado junto com o Node.js)
- Um servidor [MySQL](https://www.mysql.com/) em execução localmente

## Como executar o projeto localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/<seu-usuario>/Projeto-Integrador_Full-Stack_04.git
cd Projeto-Integrador_Full-Stack_04
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Criar o banco de dados

Crie um banco de dados MySQL vazio para o projeto, por exemplo:

```sql
CREATE DATABASE estoque_db;
```

### 4. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e ajuste com as credenciais do seu MySQL local:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com a string de conexão do seu banco:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/estoque_db"
```

> **Atenção:** nunca faça commit do arquivo `.env` com credenciais reais. Ele já está listado no `.gitignore` — utilize sempre o `.env.example` como referência.

### 5. Gerar o Prisma Client

```bash
npx prisma generate
```

### 6. Aplicar as migrations no banco de dados

```bash
npx prisma migrate deploy
```

Esse comando cria as tabelas `Fornecedor`, `Produto` e `ProdutoFornecedor` no banco configurado. O banco é criado vazio, sem dados de exemplo (não há script de *seed*).

### 7. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Comando                  | Descrição                                              |
| ------------------------- | ------------------------------------------------------- |
| `npm run dev`             | Inicia o servidor de desenvolvimento                    |
| `npm run build`           | Gera o build de produção                                |
| `npm run start`           | Inicia o servidor com o build de produção já gerado     |
| `npm run lint`            | Executa a verificação de lint (ESLint)                  |
| `npm run format`          | Formata o código com Prettier                           |
| `npx prisma generate`     | Gera o Prisma Client a partir do schema                 |
| `npx prisma migrate deploy` | Aplica as migrations pendentes ao banco de dados      |
| `npx prisma migrate dev`  | Cria e aplica uma nova migration (uso em desenvolvimento) |
| `npx prisma studio`       | Abre uma interface visual para explorar o banco de dados |

## Estrutura do projeto

```
prisma/                  # Schema e migrations do Prisma
src/
├── app/                 # Rotas e páginas (App Router), incluindo as rotas de API em app/api
├── components/          # Componentes React reutilizáveis
├── constants/           # Constantes utilizadas na aplicação
├── generated/prisma/    # Prisma Client gerado (não versionado)
├── hooks/                # Hooks React customizados
├── lib/                 # Configuração de bibliotecas (ex.: instância do Prisma)
├── repositories/         # Camada de acesso ao banco de dados
├── services/             # Camada de regras de negócio
├── types/                # Tipagens TypeScript compartilhadas
└── utils/                # Funções utilitárias
docs/features/            # Documentação das funcionalidades do sistema
```

## Documentação das funcionalidades

Documentações detalhadas de cada funcionalidade (objetivo, regras de negócio, fluxo e estrutura do banco) estão disponíveis em [`docs/features/`](docs/features/):

- [Cadastro de fornecedores](docs/features/cadastro-fornecedor.md)
- [Cadastro de produtos](docs/features/cadastro-produto.md)
- [Associação entre produtos e fornecedores](docs/features/associacao-fornecedor-produto.md)
- [Dashboard inicial](docs/features/dashboard-inicial.md)
