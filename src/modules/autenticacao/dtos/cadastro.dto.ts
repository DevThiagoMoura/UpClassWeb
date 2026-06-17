import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  MinLength,
} from 'class-validator';
import { normalizeCpfDigits } from '../../usuario/usuario.utils';
import { IsCpf } from '../../usuario/dtos/cpf.decorator';
import { Match } from '../../usuario/dtos/match.decorator';

const toTrimmedString = (value: unknown): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CadastroDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  @Length(3, 120, { message: 'O nome deve ter entre 3 e 120 caracteres' })
  nome!: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email!: string;

  @Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    const digits = normalizeCpfDigits(value);

    return digits || undefined;
  })
  @IsOptional()
  @IsCpf({ message: 'Informe um CPF válido' })
  @Length(11, 11, { message: 'O CPF deve conter 11 dígitos' })
  cpf?: string;

  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty({ message: 'O campo senha é obrigatório' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  senha!: string;

  @Transform(({ value }) => toTrimmedString(value))
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  @Match('senha', { message: 'A confirmação de senha não confere' })
  confirmacaoSenha!: string;
}
