# Passo a passo: configuracao de helpers para EJS

Helpers sao funcoes utilitarias registradas globalmente no Express e disponiveis em todos os templates EJS sem necessidade de passar pela controller.

## 1. Estrutura de arquivos

```
src/helpers/
  index.ts          <- registro e exportacao de todos os helpers
  date.helper.ts    <- helper de formatacao de data
```

## 2. Criar um novo helper

Crie um arquivo seguindo o padrao `nome.helper.ts` dentro de `src/helpers/`.

Exemplo de formato:

```ts
// src/helpers/money.helper.ts

export const moneyFormat = (
  value: number | null | undefined,
  locale = 'pt-BR',
  currency = 'BRL',
): string => {
  if (value === null || value === undefined) return '';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};
```

## 3. Registrar o helper no `index.ts`

Importe a funcao e adicione ao objeto `helpers`:

```ts
// src/helpers/index.ts

import { Application } from 'express';
import { dateFormat } from './date.helper';
import { moneyFormat } from './money.helper'; // <- helper de moeda

const helpers: Record<string, unknown> = {
  dateFormat,
  moneyFormat, // <- adicionar aqui
};

export const registerHelpers = (app: Application): void => {
  Object.assign(app.locals, helpers);
};
```

## 4. Registrar no bootstrap (`main.ts`)

A funcao `registerHelpers` ja esta chamada no `main.ts`. Nao e necessario alterar nada ao adicionar novos helpers.

```ts
// src/main.ts
registerHelpers(app.getHttpAdapter().getInstance());
```

## 5. Usar nas views EJS

Com o helper registrado, ele fica disponivel em qualquer template:

```ejs
<%= dateFormat(curso.criadoEm) %>
<%# -> 08/04/2026 %>

<%= dateFormat(curso.criadoEm, {}, 'pt-BR', true) %>
<%# -> 08/04/2026, 14:30 %>

<%= moneyFormat(curso.preco) %>
<%# -> R$ 99,90 %>
```

## 6. Helper `dateFormat`: referencia

Arquivo: `src/helpers/date.helper.ts`

```ts
export const dateFormat = (
  value: string | Date | number | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  locale = 'pt-BR',
  withTime = false,
): string => {
  if (value === null || value === undefined) return '';

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) return '';

  const resolvedOptions: Intl.DateTimeFormatOptions = withTime
    ? { ...options, hour: '2-digit', minute: '2-digit' }
    : options;

  return date.toLocaleDateString(locale, resolvedOptions);
};
```

| Parametro  | Tipo                           | Padrao              | Descricao                           |
|------------|--------------------------------|---------------------|-------------------------------------|
| `value`    | `string \| Date \| number \| null \| undefined` | —      | Valor da data a formatar            |
| `options`  | `Intl.DateTimeFormatOptions`   | `dd/mm/yyyy`        | Opcoes de formatacao do Intl        |
| `locale`   | `string`                       | `'pt-BR'`           | Locale de formatacao                |
| `withTime` | `boolean`                      | `false`             | Inclui hora e minuto no retorno     |

## 7. Checklist

- Novo arquivo criado em `src/helpers/` com sufixo `.helper.ts`
- Funcao importada e adicionada ao objeto `helpers` em `src/helpers/index.ts`
- `registerHelpers` em `main.ts` ja registra automaticamente
- Helper disponivel nas views via `<%= nomeDoHelper(...) %>`
