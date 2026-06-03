# Passo a passo: configuracao de banco de dados (NestJS + MySQL)

Este guia mostra a configuracao de banco de dados do projeto, desde a instalacao de dependencias com npm ate a organizacao da pasta `config/database` e a integracao no `AppModule`.

## 1. Instalar dependencias

No diretorio raiz do projeto, execute:

```bash
npm install
```

Se precisar instalar manualmente os pacotes de banco em um projeto novo, use:

```bash
npm install typeorm @nestjs/typeorm mysql2 @nestjs/config
```

## 2. Configurar variaveis de ambiente

Use o arquivo de exemplo como base:

```bash
cp .env.example .env
```

Preencha os valores no `.env` conforme seu MySQL local:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=upclass_web
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

## 3. Estrutura da configuracao de banco

No projeto, a configuracao de banco esta distribuida em:

- `src/config/database/database.providers.ts`
- `src/config/database/database.module.ts`
- `src/config/constants/database-source.ts`

### 3.1 `database.providers.ts`

Cria o provider do `DataSource` usando `ConfigService`, com leitura das variaveis `DB_*` e inicializacao da conexao.

### 3.2 `database.module.ts`

Agrupa e exporta os providers do banco para uso em outros modulos.

### 3.3 `database-source.ts`

Define o token de injecao usado para registrar o `DataSource`:

```ts
export const DATABASE_SOURCE = 'DATA_SOURCE';
```

Esse token e usado em `database.providers.ts` no campo `provide`, garantindo um identificador unico para injetar a conexao em servicos e repositories customizados.

## 4. Configurar no `AppModule`

No arquivo `src/app.module.ts`, mantenha:

- `ConfigModule.forRoot({ isGlobal: true })` para carregar variaveis de ambiente globalmente.
- `DatabaseModule` em `imports` para inicializar e disponibilizar o banco.

Exemplo (estrutura atual):

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CategoriaModule,
    CursoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 5. Executar o projeto

Com o MySQL em execucao e o `.env` configurado:

```bash
npm run start:dev
```

Se a conexao estiver correta, a aplicacao sobe normalmente e o `DataSource` inicializa no bootstrap do Nest.

## 6. Observacoes importantes

- `DB_SYNCHRONIZE=true` pode alterar tabelas automaticamente. Em producao, use `false`.
- `DB_LOGGING=true` ajuda em debug de consultas SQL.
- O projeto usa `entities: [__dirname + '/../../**/*.entity{.ts,.js}']`, entao suas entidades devem seguir esse padrao de nome.
