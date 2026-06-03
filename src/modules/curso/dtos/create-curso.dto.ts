import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

const toDecimalNumber = (value: unknown): unknown => {
  const normalizedValue = Array.isArray(value) ? value[value.length - 1] : value;

  if (normalizedValue === '' || normalizedValue === null) {
    return undefined;
  }

  if (typeof normalizedValue === 'string') {
    return Number(normalizedValue.replace(',', '.'));
  }

  return normalizedValue;
};

const toOptionalInteger = (value: unknown): unknown => {
  const normalizedValue = Array.isArray(value) ? value[value.length - 1] : value;

  if (normalizedValue === '' || normalizedValue === null) {
    return undefined;
  }

  return Number(normalizedValue);
};

const toRequiredInteger = (value: unknown): unknown => {
  const normalizedValue = Array.isArray(value) ? value[value.length - 1] : value;

  if (normalizedValue === '' || normalizedValue === null) {
    return undefined;
  }

  return Number(normalizedValue);
};

export class CreateCursoDto {
  @IsNotEmpty({ message: 'O campo título é obrigatório' })
  @MinLength(5, { message: 'O título deve ter no mínimo 5 caracteres' })
  titulo!: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto' })
  descricao?: string;

  @IsNotEmpty({ message: 'O campo preço é obrigatório' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O preço deve ter no máximo 2 casas decimais' },
  )
  @Transform(({ value }) => toDecimalNumber(value))
  @Min(0, { message: 'O preço deve ser maior ou igual a R$ 0,00' })
  preco!: number;

  @IsOptional()
  @IsIn(['rascunho', 'publicado', 'arquivado'], {
    message: 'O status informado é inválido',
  })
  status?: string;

  @IsNotEmpty({ message: 'O campo categoria é obrigatório' })
  @IsInt({ message: 'A categoria informada é inválida' })
  @Transform(({ value }) => toRequiredInteger(value))
  categoria!: number;

  @IsOptional()
  @IsInt({ message: 'O instrutor informado é inválido' })
  @Transform(({ value }) => toOptionalInteger(value))
  instrutorId?: number;
}
