import { NextFunction, Request, Response } from 'express';
import {
  buildProtectedNextPath,
  getAuthConfig,
  normalizeNextPath,
  normalizePerfil,
  readCookieValue,
  usuarioTemPerfil,
  verifyAuthToken,
} from './autenticacao.utils';

const getPerfisPermitidos = (path: string): string[] | null => {
  if (path === '/usuarios' || path.startsWith('/usuarios/')) {
    return ['administrador'];
  }

  if (path === '/categorias' || path.startsWith('/categorias/')) {
    return ['administrador'];
  }

  if (path === '/cursos' || path.startsWith('/cursos/')) {
    return ['administrador', 'instrutor'];
  }

  return null;
};

export const autenticacaoMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authConfig = getAuthConfig();
  const token = readCookieValue(request.headers.cookie, authConfig.cookieName);
  const usuario = verifyAuthToken(token, authConfig.secret);
  const path = request.path || '/';
  const perfil = normalizePerfil(usuario?.perfil);
  const isAdministrador = perfil === 'administrador';
  const isInstrutor = perfil === 'instrutor';
  const perfisPermitidos = getPerfisPermitidos(path);

  response.locals.authUser = usuario;
  response.locals.authenticated = Boolean(usuario);
  response.locals.authPerfil = perfil;
  response.locals.isAdministrador = isAdministrador;
  response.locals.isInstrutor = isInstrutor;
  response.locals.isAluno = perfil === 'aluno';
  response.locals.canManageUsuarios = isAdministrador;
  response.locals.canManageCategorias = isAdministrador;
  response.locals.canManageCursos = isAdministrador || isInstrutor;

  if ((path === '/login' || path === '/cadastro') && usuario) {
    response.redirect('/');
    return;
  }

  if (!perfisPermitidos) {
    next();
    return;
  }

  if (!usuario) {
    const nextPath = normalizeNextPath(
      buildProtectedNextPath(request.method, request.originalUrl),
      '/',
    );

    response.clearCookie(authConfig.cookieName, {
      path: '/',
    });
    response.redirect(`/login?next=${encodeURIComponent(nextPath)}`);
    return;
  }

  if (usuarioTemPerfil(usuario, perfisPermitidos)) {
    next();
    return;
  }

  response.status(403).render('autenticacao/acesso-negado', {
    titulo: 'Acesso restrito',
    perfisPermitidos,
  });
};
