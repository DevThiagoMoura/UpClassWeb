import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ValidationView } from 'nest-validation-view';
import { CadastroDto } from './dtos/cadastro.dto';
import { LoginDto } from './dtos/login.dto';
import { AutenticacaoService } from './autenticacao.service';
import {
  buildProtectedNextPath,
  normalizeNextPath,
} from './autenticacao.utils';

@Controller()
export class AutenticacaoController {
  constructor(private readonly autenticacaoService: AutenticacaoService) {}

  @Get('login')
  @Render('autenticacao/login')
  login(@Query('next') next?: string, @Query('cadastro') cadastro?: string): object {
    const caminho = normalizeNextPath(next, '');
    const cadastroRealizado = cadastro === 'ok';

    return {
      layout: false,
      titulo: 'Login - UpClass',
      login: {
        email: '',
        next: caminho,
      },
      mensagemContexto: cadastroRealizado
        ? 'Cadastro realizado com sucesso. Faça login para continuar.'
        : caminho
          ? 'Faça login para acessar essa área.'
          : 'Entre com suas credenciais de acesso.',
    };
  }

  @Post('login')
  @ValidationView('autenticacao/login', ({ request, errors }) => ({
    layout: false,
    titulo: 'Login - UpClass',
    login: {
      email: request.body?.email ?? '',
      next: request.body?.next ?? '',
    },
    errors,
    mensagemContexto: 'Revise os campos destacados e tente novamente.',
  }))
  async autenticar(
    @Body() dados: LoginDto,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    const usuario = await this.autenticacaoService.autenticar(dados);

    if (!usuario) {
      response.status(HttpStatus.UNAUTHORIZED).render('autenticacao/login', {
        layout: false,
        titulo: 'Login - UpClass',
        login: {
          email: dados.email,
          next: dados.next ?? '',
        },
        mensagemContexto: 'Credenciais inválidas. Confira e-mail e senha.',
        erroAutenticacao: 'Credenciais inválidas. Confira e-mail e senha.',
      });

      return;
    }

    const nextPath = buildProtectedNextPath(request.method, dados.next ?? '/');
    const cookieName = this.autenticacaoService.getCookieName();

    response.cookie(cookieName, this.autenticacaoService.criarToken(usuario), {
      httpOnly: true,
      maxAge: this.autenticacaoService.getCookieMaxAgeMs(),
      sameSite: 'lax',
      path: '/',
    });

    response.redirect(HttpStatus.SEE_OTHER, nextPath);
  }

  @Get('cadastro')
  @Render('autenticacao/cadastro')
  cadastro(): object {
    return {
      layout: false,
      titulo: 'Cadastro - UpClass',
      cadastro: {
        nome: '',
        email: '',
        cpf: '',
      },
      mensagemContexto: 'Preencha os dados para criar seu acesso.',
    };
  }

  @Post('cadastro')
  @ValidationView('autenticacao/cadastro', ({ request, errors }) => ({
    layout: false,
    titulo: 'Cadastro - UpClass',
    cadastro: {
      nome: request.body?.nome ?? '',
      email: request.body?.email ?? '',
      cpf: request.body?.cpf ?? '',
    },
    errors,
    mensagemContexto: 'Revise os campos destacados e tente novamente.',
  }))
  async salvarCadastro(@Body() dados: CadastroDto, @Res() response: Response): Promise<void> {
    await this.autenticacaoService.cadastrar(dados);

    response.redirect(HttpStatus.SEE_OTHER, '/login?cadastro=ok');
  }

  @Post('logout')
  logout(@Res() response: Response): void {
    response.clearCookie(this.autenticacaoService.getCookieName(), {
      path: '/',
    });

    response.redirect(HttpStatus.SEE_OTHER, '/login');
  }
}
