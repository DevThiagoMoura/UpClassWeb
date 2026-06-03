import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Redirect,
  Render,
} from '@nestjs/common';
import { ValidationView } from 'nest-validation-view';
import { CategoriaService } from '../categoria/categoria.service';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dtos/create-curso.dto';
import { UpdateCursoDto } from './dtos/update-curso.dto';

@Controller('cursos')
export class CursoController {
  constructor(
    private cursoService: CursoService,
    private categoriaService: CategoriaService,
  ) {}

  @Get()
  @Render('curso/inicial')
  async inicial(): Promise<object> {
    const cursos = await this.cursoService.findAll();

    return {
      titulo: 'Consulta de Cursos',
      cursos,
    };
  }

  @Get('criar')
  @Render('curso/formulario')
  async formularioCriar(): Promise<object> {
    const categorias = await this.categoriaService.findAll();

    return {
      titulo: 'Novo curso',
      categorias,
    };
  }

  @Post('criar')
  @Redirect('/cursos')
  @ValidationView('curso/formulario', ({ request, errors }) => ({
    curso: {
      ...request.body,
      categoria: { id: request.body.categoria },
    },
    categorias: [],
    errors,
  }))
  async formularioCriarSalvar(@Body() dados: CreateCursoDto): Promise<void> {
    await this.cursoService.create(dados);
  }

  @Get(':id')
  @Render('curso/detalhes')
  async detalhes(@Param('id') id: number): Promise<object> {
    const curso = await this.cursoService.findOne(id);

    if (!curso) {
      throw new NotFoundException('Curso não encontrado!');
    }

    return {
      titulo: 'Detalhes do Curso',
      curso,
    };
  }

  @Get(':id/editar')
  @Render('curso/formulario')
  async formEditar(@Param('id') id: number): Promise<object> {
    const curso = await this.cursoService.findOne(id);
    const categorias = await this.categoriaService.findAll();

    if (!curso) {
      throw new NotFoundException('Curso não encontrado!');
    }

    return {
      titulo: 'Edição de Curso',
      subtitulo: `Atualização do curso: ${curso.titulo}`,
      curso,
      categorias,
    };
  }

  @Post(':id/editar')
  @Redirect('/cursos')
  @ValidationView('curso/formulario', ({ request, errors }) => ({
    curso: {
      id: request.params.id,
      ...request.body,
      categoria: { id: request.body.categoria },
    },
    categorias: [],
    errors,
  }))
  async formEditarSalvar(
    @Param('id') id: number,
    @Body() dados: UpdateCursoDto,
  ): Promise<void> {
    await this.cursoService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('curso/remover')
  async formExcluir(@Param('id') id: number): Promise<object> {
    const curso = await this.cursoService.findOne(id);

    if (!curso) {
      throw new NotFoundException('Curso não encontrado!');
    }

    return {
      titulo: 'Exclusão de Curso',
      subtitulo: `Exclusão do curso: ${curso.titulo}`,
      curso,
    };
  }

  @Post(':id/excluir')
  @Redirect('/cursos')
  async formExcluirSalvar(@Param('id') id: number): Promise<void> {
    await this.cursoService.remove(id);
  }

  @Post(':id/remover')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    await this.cursoService.remove(id);
  }
}
