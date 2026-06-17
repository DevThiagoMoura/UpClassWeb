import { Injectable } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import { Usuario } from './usuario.entity';
import type { UsuarioPerfil } from './usuario.utils';

type Credenciais = {
  senhaHash: string;
  senhaSalt: string;
};

@Injectable()
export class UsuarioService {
  async findAll(): Promise<Usuario[]> {
    return Usuario.find({
      order: {
        nome: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Usuario | null> {
    return Usuario.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return Usuario.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  private criarCredenciais(senha: string): Credenciais {
    const senhaSalt = randomBytes(16).toString('hex');
    const senhaHash = scryptSync(senha, senhaSalt, 64).toString('hex');

    return {
      senhaHash,
      senhaSalt,
    };
  }

  private confirmarSenha(
    senha: string,
    senhaHash: string,
    senhaSalt: string,
  ): boolean {
    const atual = scryptSync(senha, senhaSalt, 64);
    const esperado = Buffer.from(senhaHash, 'hex');

    return (
      atual.length === esperado.length && timingSafeEqual(atual, esperado)
    );
  }

  async validarCredenciais(
    email: string,
    senha: string,
  ): Promise<Usuario | null> {
    const usuario = await Usuario.createQueryBuilder('usuario')
      .addSelect(['usuario.senhaHash', 'usuario.senhaSalt'])
      .where('usuario.email = :email', {
        email: email.trim().toLowerCase(),
      })
      .getOne();

    if (!usuario || !usuario.ativo) {
      return null;
    }

    if (!this.confirmarSenha(senha, usuario.senhaHash, usuario.senhaSalt)) {
      return null;
    }

    return usuario;
  }

  async create(dados: CreateUsuarioDto): Promise<Usuario> {
    const usuario = new Usuario();
    const credenciais = this.criarCredenciais(dados.senha);

    Object.assign(usuario, {
      nome: dados.nome,
      email: dados.email.trim().toLowerCase(),
      cpf: dados.cpf || null,
      perfil: dados.perfil || ('aluno' satisfies UsuarioPerfil),
      ativo: dados.ativo,
      senhaHash: credenciais.senhaHash,
      senhaSalt: credenciais.senhaSalt,
    });

    return usuario.save();
  }

  async update(id: number, dados: UpdateUsuarioDto): Promise<Usuario | null> {
    const usuario = await this.findOne(id);

    if (!usuario) {
      return null;
    }

    usuario.nome = dados.nome;
    usuario.email = dados.email.trim().toLowerCase();
    usuario.cpf = dados.cpf || null;
    usuario.perfil = dados.perfil;
    usuario.ativo = dados.ativo;

    if (dados.senha) {
      const credenciais = this.criarCredenciais(dados.senha);
      usuario.senhaHash = credenciais.senhaHash;
      usuario.senhaSalt = credenciais.senhaSalt;
    }

    return usuario.save();
  }

  async remove(id: number): Promise<Usuario | null> {
    const usuario = await this.findOne(id);

    if (!usuario) {
      return null;
    }

    return usuario.remove();
  }
}
