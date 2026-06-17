import { NextFunction, Request, Response } from 'express';
import {
  buildProtectedNextPath,
  getAuthConfig,
  normalizeNextPath,
  readCookieValue,
  verifyAuthToken,
} from './autenticacao.utils';

const isProtectedRoute = (path: string): boolean =>
  path === '/categorias' ||
  path.startsWith('/categorias/') ||
  path === '/cursos' ||
  path.startsWith('/cursos/') ||
  path === '/usuarios' ||
  path.startsWith('/usuarios/');

export const autenticacaoMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authConfig = getAuthConfig();
  const token = readCookieValue(request.headers.cookie, authConfig.cookieName);
  const usuario = verifyAuthToken(token, authConfig.secret);
  const path = request.path || '/';

  response.locals.authUser = usuario;
  response.locals.authenticated = Boolean(usuario);

  if ((path === '/login' || path === '/cadastro') && usuario) {
    response.redirect('/');
    return;
  }

  if (!isProtectedRoute(path)) {
    next();
    return;
  }

  if (usuario) {
    next();
    return;
  }

  const nextPath = normalizeNextPath(
    buildProtectedNextPath(request.method, request.originalUrl),
    '/',
  );

  response.clearCookie(authConfig.cookieName, {
    path: '/',
  });
  response.redirect(`/login?next=${encodeURIComponent(nextPath)}`);
};
