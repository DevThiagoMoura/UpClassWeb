import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  Length,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  PERFIS,
  normalizeCpfDigits,
  type UsuarioPerfil,
} from '../usuario.utils';
import { IsCpf } from './cpf.decorator';
import { Match } from './match.decorator';

const toTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed || undefined;
};

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return ['true', '1', 'on', 'sim'].includes(value.toLowerCase());
  }

  return false;
};

const passwordProvided = (value: Record<string, unknown>): boolean =>
  value.senha !== undefined || value.confirmacaoSenha !== undefined;

export class UpdateUsuarioDto {
  @Transform(({ value }) => toTrimmedString(value) ?? '')
  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  @Length(3, 120, { message: 'O nome deve ter entre 3 e 120 caracteres' })
  nome!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : undefined,
  )
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email!: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return undefined;
    }

    const digits = normalizeCpfDigits(value);

    return digits || undefined;
  })
  @IsOptional()
  @IsCpf({ message: 'Informe um CPF válido' })
  @Length(11, 11, { message: 'O CPF deve conter 11 dígitos' })
  cpf?: string;

  @Transform(({ value }) => toTrimmedString(value))
  @ValidateIf((value) => passwordProvided(value as Record<string, unknown>))
  @IsNotEmpty({ message: 'A senha é obrigatória quando você quer alterá-la' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  senha?: string;

  @Transform(({ value }) => toTrimmedString(value))
  @ValidateIf((value) => passwordProvided(value as Record<string, unknown>))
  @IsNotEmpty({
    message: 'A confirmação de senha é obrigatória quando você quer alterá-la',
  })
  @Match('senha', { message: 'A confirmação de senha não confere' })
  confirmacaoSenha?: string;

  @Transform(({ value }) => toTrimmedString(value) ?? '')
  @IsNotEmpty({ message: 'O perfil é obrigatório' })
  @IsIn(PERFIS as unknown as string[], {
    message: 'O perfil informado é inválido',
  })
  perfil!: UsuarioPerfil;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean({ message: 'O status informado é inválido' })
  ativo!: boolean;
}
