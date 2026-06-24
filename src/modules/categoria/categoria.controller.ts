import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Redirect,
  Render,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ValidationView } from 'nest-validation-view';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';
import { UpdateCategoriaDto } from './dtos/update-categoria.dto';

@Controller('categorias')
export class CategoriaController {
  constructor(private categoriaService: CategoriaService) {}

  @Get()
  @Render('categoria/inicial')
  async inicial(): Promise<object> {
    const categorias = await this.categoriaService.findAll();

    return {
      titulo: 'Consulta de Categorias',
      categorias,
    };
  }

  @Get('criar')
  @Render('categoria/formulario')
  formularioCriar(): object {
    return {
      titulo: 'Nova categoria',
    };
  }

  @Post('criar')
  @Redirect('/categorias')
  @ValidationView('categoria/formulario', ({ request, errors }) => ({
    categoria: {
      ...request.body,
    },
    errors,
  }))
  async formularioCriarSalvar(@Body() dados: CreateCategoriaDto): Promise<void> {
    await this.categoriaService.create(dados);
  }

  @Get(':id')
  @Render('categoria/detalhes')
  async detalhes(@Param('id') id: number): Promise<object> {
    const categoria = await this.categoriaService.findOne(id);

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada!');
    }

    return {
      titulo: 'Detalhes da Categoria',
      categoria,
    };
  }

  @Get(':id/editar')
  @Render('categoria/formulario')
  async formEditar(@Param('id') id: number): Promise<object> {
    const categoria = await this.categoriaService.findOne(id);

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada!');
    }

    return {
      titulo: 'Edição de Categoria',
      subtitulo: `Atualização da categoria: ${categoria.nome}`,
      categoria,
    };
  }

  @Post(':id/editar')
  @Redirect('/categorias')
  @ValidationView('categoria/formulario', ({ request, errors }) => ({
    categoria: {
      id: request.params.id,
      ...request.body,
    },
    errors,
  }))
  async formEditarSalvar(
    @Param('id') id: number,
    @Body() dados: UpdateCategoriaDto,
  ): Promise<void> {
    await this.categoriaService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('categoria/remover')
  async formExcluir(@Param('id') id: number): Promise<object> {
    const categoria = await this.categoriaService.findOne(id);

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada!');
    }

    return {
      titulo: 'Exclusão de Categoria',
      subtitulo: `Exclusão da categoria: ${categoria.nome}`,
      categoria,
      mensagemBloqueio:
        this.categoriaService.getMensagemBloqueioRemocao(categoria),
    };
  }

  @Post(':id/excluir')
  async formExcluirSalvar(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<void> {
    const categoria = await this.categoriaService.findOne(id);

    if (!categoria) {
      throw new NotFoundException('Categoria nao encontrada!');
    }

    const mensagemBloqueio =
      this.categoriaService.getMensagemBloqueioRemocao(categoria);

    if (mensagemBloqueio) {
      response.status(HttpStatus.CONFLICT).render('categoria/remover', {
        titulo: 'Exclusao de Categoria',
        subtitulo: `Exclusao da categoria: ${categoria.nome}`,
        categoria,
        mensagemBloqueio,
      });

      return;
    }

    await this.categoriaService.remove(id);

    response.redirect(HttpStatus.SEE_OTHER, '/categorias');
  }

  @Post(':id/remover')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    await this.categoriaService.remove(id);
  }
}
