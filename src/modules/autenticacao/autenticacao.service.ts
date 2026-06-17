import { Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { CadastroDto } from './dtos/cadastro.dto';
import {
  AuthUser,
  createAuthToken,
  getAuthConfig,
  readCookieValue,
  verifyAuthToken,
} from './autenticacao.utils';
import { UsuarioService } from '../usuario/usuario.service';
import type { CreateUsuarioDto } from '../usuario/dtos/create-usuario.dto';

@Injectable()
export class AutenticacaoService {
  constructor(private readonly usuarioService: UsuarioService) {}

  async autenticar(dados: LoginDto): Promise<AuthUser | null> {
    const usuarioCadastrado = await this.usuarioService.validarCredenciais(
      dados.email,
      dados.senha,
    );

    if (usuarioCadastrado) {
      return {
        nome: usuarioCadastrado.nome,
        email: usuarioCadastrado.email,
        perfil: usuarioCadastrado.perfil,
      };
    }

    const authConfig = getAuthConfig();
    const emailInformado = dados.email.trim().toLowerCase();
    const emailConfigurado = authConfig.email.trim().toLowerCase();

    if (
      emailInformado !== emailConfigurado ||
      dados.senha !== authConfig.password
    ) {
      return null;
    }

    return {
      nome: authConfig.nome,
      email: authConfig.email,
      perfil: authConfig.perfil,
    };
  }

  async cadastrar(dados: CadastroDto): Promise<void> {
    const dadosUsuario = {
      nome: dados.nome,
      email: dados.email,
      cpf: dados.cpf,
      senha: dados.senha,
      confirmacaoSenha: dados.confirmacaoSenha,
      perfil: 'aluno',
      ativo: true,
    } satisfies CreateUsuarioDto;

    await this.usuarioService.create(dadosUsuario);
  }

  criarToken(usuario: AuthUser): string {
    const authConfig = getAuthConfig();

    return createAuthToken(usuario, authConfig.secret, authConfig.ttlHours);
  }

  extrairUsuarioAutenticado(cookieHeader: string | undefined): AuthUser | null {
    const authConfig = getAuthConfig();
    const token = readCookieValue(cookieHeader, authConfig.cookieName);

    return verifyAuthToken(token, authConfig.secret);
  }

  getCookieName(): string {
    return getAuthConfig().cookieName;
  }

  getCookieMaxAgeMs(): number {
    return getAuthConfig().ttlHours * 60 * 60 * 1000;
  }
}
