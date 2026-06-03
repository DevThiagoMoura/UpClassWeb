import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  nome!: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto' })
  descricao?: string;
}
