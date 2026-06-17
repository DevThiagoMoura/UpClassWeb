# UpClass

Aplicação web para gerenciamento de uma plataforma de cursos.

## Estado atual

- base NestJS com TypeScript;
- views EJS com layout principal;
- persistência com TypeORM e MySQL;
- módulos de categorias, cursos e usuários;
- login com token assinado em cookie;
- cadastro público de acesso;
- proteção de rotas administrativas.

## Execução

```bash
npm install
npm run start:dev
```

A aplicação fica em:

```text
http://localhost:3000
```

## Acesso

- e-mail: `admin@upclass.com`
- senha: `UpClass@123`

## Rotas principais

- `GET /`
- `GET /login`
- `GET /cadastro`
- `POST /login`
- `POST /cadastro`
- `POST /logout`
- `GET /categorias`
- `GET /cursos`
- `GET /usuarios`

## Repositório

https://github.com/DevThiagoMoura/UpClassWeb
