import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { toBoolean } from 'nest-validation-view';
import { CreateCategoriaDto } from './create-categoria.dto';

export class UpdateCategoriaDto extends CreateCategoriaDto {
  @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso' })
  @IsNotEmpty({ message: 'O campo ativo é obrigatório' })
  @Transform(({ value }) => toBoolean(value, true))
  ativo!: boolean;
}
