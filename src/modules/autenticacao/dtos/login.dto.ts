import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'O campo senha é obrigatório' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  senha!: string;

  @IsOptional()
  @IsString()
  next?: string;
}
