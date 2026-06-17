import { Controller, Get, Render } from '@nestjs/common';
import { CategoriaService } from './modules/categoria/categoria.service';
import { CursoService } from './modules/curso/curso.service';
import { UsuarioService } from './modules/usuario/usuario.service';

@Controller()
export class AppController {
  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly cursoService: CursoService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Get()
  @Render('inicial')
  async getHello(): Promise<object> {
    const resumo = {
      totalCategorias: 0,
      categoriasAtivas: 0,
      totalCursos: 0,
      cursosPublicados: 0,
      cursosRascunho: 0,
      totalUsuarios: 0,
      usuariosAtivos: 0,
      usuariosAdministradores: 0,
    };

    try {
      const [categorias, cursos, usuarios] = await Promise.all([
        this.categoriaService.findAll(),
        this.cursoService.findAll(),
        this.usuarioService.findAll(),
      ]);

      resumo.totalCategorias = categorias.length;
      resumo.categoriasAtivas = categorias.filter((categoria) => categoria.ativo)
        .length;
      resumo.totalCursos = cursos.length;
      resumo.cursosPublicados = cursos.filter(
        (curso) => curso.status === 'publicado',
      ).length;
      resumo.cursosRascunho = cursos.filter(
        (curso) => curso.status === 'rascunho',
      ).length;
      resumo.totalUsuarios = usuarios.length;
      resumo.usuariosAtivos = usuarios.filter((usuario) => usuario.ativo).length;
      resumo.usuariosAdministradores = usuarios.filter(
        (usuario) => usuario.perfil === 'administrador',
      ).length;
    } catch {
      
    }

    return {
      titulo: 'UpClass',
      horaAgora: new Date().toLocaleString('pt-BR'),
      resumo,
    };
  }

  @Get('sobre')
  @Render('_sobre')
  getSobre(): object {
    return {
      titulo: 'Sobre a UpClass',
    };
  }
}
