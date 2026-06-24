import { Injectable } from '@nestjs/common';
import { Curso } from './curso.entity';
import { CreateCursoDto } from './dtos/create-curso.dto';
import { UpdateCursoDto } from './dtos/update-curso.dto';

@Injectable()
export class CursoService {
  async findAll(termoBusca?: string): Promise<Curso[]> {
    const busca = termoBusca?.trim();
    const query = Curso.createQueryBuilder('curso')
      .leftJoinAndSelect('curso.categoria', 'categoria')
      .orderBy('curso.titulo', 'ASC');

    if (busca) {
      query.where(
        [
          'LOWER(curso.titulo) LIKE :busca',
          'LOWER(curso.descricao) LIKE :busca',
          'LOWER(curso.status) LIKE :busca',
          'LOWER(categoria.nome) LIKE :busca',
        ].join(' OR '),
        { busca: `%${busca.toLowerCase()}%` },
      );
    }

    return query.getMany();
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
