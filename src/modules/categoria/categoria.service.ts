import { Injectable } from '@nestjs/common';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';
import { UpdateCategoriaDto } from './dtos/update-categoria.dto';

@Injectable()
export class CategoriaService {
  async findAll(): Promise<Categoria[]> {
    return Categoria.find({
      order: {
        nome: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Categoria | null> {
    return Categoria.findOne({
      where: { id },
      relations: ['cursos'],
    });
  }

  async create(dados: CreateCategoriaDto): Promise<Categoria> {
    const categoria = new Categoria();

    Object.assign(categoria, dados);

    return categoria.save();
  }

  async update(
    id: number,
    dados: UpdateCategoriaDto,
  ): Promise<Categoria | null> {
    const categoria = await this.findOne(id);

    if (!categoria) {
      return null;
    }

    Object.assign(categoria, dados);

    return categoria.save();
  }

  async remove(id: number): Promise<Categoria | null> {
    const categoria = await this.findOne(id);

    if (!categoria) {
      return null;
    }

    return categoria.remove();
  }
}
