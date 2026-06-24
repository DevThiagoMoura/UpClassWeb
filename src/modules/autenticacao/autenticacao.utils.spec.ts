import { normalizePerfil, usuarioTemPerfil } from './autenticacao.utils';

describe('autenticacao.utils', () => {
  describe('perfis de acesso', () => {
    it('normaliza perfil ignorando caixa e espacos', () => {
      expect(normalizePerfil(' Administrador ')).toBe('administrador');
    });

    it('valida permissao por perfil normalizado', () => {
      expect(
        usuarioTemPerfil(
          {
            nome: 'Administrador',
            email: 'admin@upclass.com',
            perfil: 'Administrador',
          },
          ['administrador'],
        ),
      ).toBe(true);
    });

    it('bloqueia perfil sem permissao', () => {
      expect(
        usuarioTemPerfil(
          {
            nome: 'Aluno',
            email: 'aluno@upclass.com',
            perfil: 'aluno',
          },
          ['administrador', 'instrutor'],
        ),
      ).toBe(false);
    });
  });
});
