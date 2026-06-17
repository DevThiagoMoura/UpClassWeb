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
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import { UsuarioService } from './usuario.service';
import {
  PERFIS,
  formatCpf,
  perfilBadgeClass,
  perfilLabel,
  toUsuarioFormModel,
} from './usuario.utils';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get()
  @Render('usuario/inicial')
  async inicial(): Promise<object> {
    const usuarios = await this.usuarioService.findAll();

    return {
      titulo: 'Consulta de Usuários',
      usuarios,
      perfilLabel,
      perfilBadgeClass,
      formatCpf,
    };
  }

  @Get('criar')
  @Render('usuario/formulario')
  formularioCriar(): object {
    return {
      titulo: 'Novo usuário',
      usuario: {
        nome: '',
        email: '',
        cpf: '',
        perfil: 'aluno',
        ativo: true,
      },
      perfis: PERFIS,
    };
  }

  @Post('criar')
  @Redirect('/usuarios')
  @ValidationView('usuario/formulario', ({ request, errors }) => ({
    titulo: 'Novo usuário',
    usuario: {
      ...request.body,
      ativo: request.body.ativo ?? 'true',
    },
    perfis: PERFIS,
    errors,
  }))
  async formularioCriarSalvar(@Body() dados: CreateUsuarioDto): Promise<void> {
    await this.usuarioService.create(dados);
  }

  @Get(':id')
  @Render('usuario/detalhes')
  async detalhes(@Param('id') id: number): Promise<object> {
    const usuario = await this.usuarioService.findOne(id);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return {
      titulo: 'Detalhes do Usuário',
      usuario,
      perfilLabel,
      formatCpf,
    };
  }

  @Get(':id/editar')
  @Render('usuario/formulario')
  async formEditar(@Param('id') id: number): Promise<object> {
    const usuario = await this.usuarioService.findOne(id);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return {
      titulo: 'Edição de Usuário',
      subtitulo: `Atualização do usuário: ${usuario.nome}`,
      usuario: toUsuarioFormModel(usuario),
      perfis: PERFIS,
    };
  }

  @Post(':id/editar')
  @Redirect('/usuarios')
  @ValidationView('usuario/formulario', ({ request, errors }) => ({
    titulo: 'Edição de Usuário',
    subtitulo: `Atualização do usuário: ${request.body?.nome || 'usuário'}`,
    usuario: {
      id: request.params.id,
      ...request.body,
      ativo: request.body.ativo ?? 'true',
    },
    perfis: PERFIS,
    errors,
  }))
  async formEditarSalvar(
    @Param('id') id: number,
    @Body() dados: UpdateUsuarioDto,
  ): Promise<void> {
    await this.usuarioService.update(id, dados);
  }

  @Get(':id/excluir')
  @Render('usuario/remover')
  async formExcluir(@Param('id') id: number): Promise<object> {
    const usuario = await this.usuarioService.findOne(id);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return {
      titulo: 'Exclusão de Usuário',
      subtitulo: `Exclusão do usuário: ${usuario.nome}`,
      usuario,
      perfilLabel,
      formatCpf,
    };
  }

  @Post(':id/excluir')
  @Redirect('/usuarios')
  async formExcluirSalvar(@Param('id') id: number): Promise<void> {
    await this.usuarioService.remove(id);
  }

  @Post(':id/remover')
  @HttpCode(204)
  async remove(@Param('id') id: number): Promise<void> {
    await this.usuarioService.remove(id);
  }
}
