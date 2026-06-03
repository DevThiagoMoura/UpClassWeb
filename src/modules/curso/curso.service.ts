import { Injectable } from '@nestjs/common';
import { Curso } from './curso.entity';
import { CreateCursoDto } from './dtos/create-curso.dto';
import { UpdateCursoDto } from './dtos/update-curso.dto';

@Injectable()
export class CursoService {
  async findAll(): Promise<Curso[]> {
    return Curso.find({
      relations: ['categoria'],
      order: {
        titulo: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Curso | null> {
    return Curso.findOne({
      where: { id },
      relations: ['categoria'],
    });
  }

  async create(dados: CreateCursoDto): Promise<Curso> {
    const curso = new Curso();

    Object.assign(curso, {
      ...dados,
      status: dados.status || 'rascunho',
      instrutorId: dados.instrutorId || null,
      categoria: { id: dados.categoria },
    });

    return curso.save();
  }

  async update(id: number, dados: UpdateCursoDto): Promise<Curso | null> {
    const curso = await this.findOne(id);

    if (!curso) {
      return null;
    }

    Object.assign(curso, {
      ...dados,
      status: dados.status || 'rascunho',
      instrutorId: dados.instrutorId || null,
      categoria: { id: dados.categoria },
    });

    return curso.save();
  }

  async remove(id: number): Promise<Curso | null> {
    const curso = await this.findOne(id);

    if (!curso) {
      return null;
    }

    return curso.remove();
  }
}
