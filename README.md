# UpClass Web

O UpClass Web é uma aplicação web para gerenciamento de uma plataforma de cursos. O sistema centraliza o cadastro, a organização e o acompanhamento de usuários, categorias, cursos, módulos, aulas, matrículas, pagamentos, avaliações e tags.

## Objetivo da aplicação

Desenvolver uma aplicação web renderizada no servidor, seguindo o padrão estrutural da disciplina, com páginas EJS, formulários administrativos, validações por DTOs e persistência em banco de dados MySQL via TypeORM.

Nesta etapa inicial, o projeto contempla:

- estrutura base NestJS com TypeScript;
- configuração de views EJS e layout principal;
- configuração inicial de banco de dados com TypeORM e MySQL;
- módulo completo de categorias;
- módulo completo de cursos;
- README preenchido para acompanhamento da atividade.

## Integrantes

- Daniélly Bernardino Batista
- Thiago Moura de Carvalho

## Tecnologias

- NestJS
- TypeScript
- EJS
- Express EJS Layouts
- TypeORM
- MySQL
- class-validator
- class-transformer
- nest-validation-view

## Estrutura inicial

```text
src/
  app.module.ts
  main.ts
  config/
    constants/
    database/
  helpers/
  modules/
    categoria/
    curso/

views/
  layouts/
    main.ejs
    partials/
  categoria/
  curso/
```

## Configuração

Copie o arquivo `.env.example` para `.env` e ajuste as credenciais do MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=upclass_web
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

Crie o banco de dados no MySQL:

```sql
CREATE DATABASE upclass_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Execução

```bash
npm install
npm run start:dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Rotas iniciais

- `GET /`
- `GET /categorias`
- `GET /categorias/criar`
- `POST /categorias/criar`
- `GET /categorias/:id`
- `GET /categorias/:id/editar`
- `POST /categorias/:id/editar`
- `GET /categorias/:id/excluir`
- `POST /categorias/:id/excluir`
- `GET /cursos`
- `GET /cursos/criar`
- `POST /cursos/criar`
- `GET /cursos/:id`
- `GET /cursos/:id/editar`
- `POST /cursos/:id/editar`
- `GET /cursos/:id/excluir`
- `POST /cursos/:id/excluir`

## Repositório

Link do repositório: https://github.com/DevThiagoMoura/UpClassWeb
