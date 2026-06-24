import { createHmac, timingSafeEqual } from 'node:crypto';

export type AuthUser = {
  nome: string;
  email: string;
  perfil: string;
};

export const normalizePerfil = (perfil?: string | null): string =>
  (perfil || '').trim().toLowerCase();

export const usuarioTemPerfil = (
  usuario: AuthUser | null,
  perfisPermitidos: string[],
): boolean => {
  const perfil = normalizePerfil(usuario?.perfil);

  return perfisPermitidos.includes(perfil);
};

type AuthConfig = {
  cookieName: string;
  secret: string;
  email: string;
  password: string;
  nome: string;
  perfil: string;
  ttlHours: number;
};

type AuthTokenPayload = {
  user: AuthUser;
  exp: number;
};

const DEFAULT_AUTH_CONFIG: AuthConfig = {
  cookieName: 'upclass_auth',
  secret: 'upclass-web-login',
  email: 'admin@upclass.com',
  password: 'UpClass@123',
  nome: 'Administrador',
  perfil: 'Administrador',
  ttlHours: 8,
};

const encode = (value: string): string =>
  Buffer.from(value, 'utf8').toString('base64url');

const decode = (value: string): string =>
  Buffer.from(value, 'base64url').toString('utf8');

export const getAuthConfig = (): AuthConfig => ({
  cookieName: process.env.AUTH_COOKIE_NAME ?? DEFAULT_AUTH_CONFIG.cookieName,
  secret: process.env.AUTH_SESSION_SECRET ?? DEFAULT_AUTH_CONFIG.secret,
  email: process.env.AUTH_EMAIL ?? DEFAULT_AUTH_CONFIG.email,
  password: process.env.AUTH_PASSWORD ?? DEFAULT_AUTH_CONFIG.password,
  nome: process.env.AUTH_NAME ?? DEFAULT_AUTH_CONFIG.nome,
  perfil: process.env.AUTH_ROLE ?? DEFAULT_AUTH_CONFIG.perfil,
  ttlHours: (() => {
    const ttlHours = Number(
      process.env.AUTH_TTL_HOURS ?? DEFAULT_AUTH_CONFIG.ttlHours,
    );

    return Number.isFinite(ttlHours) && ttlHours > 0
      ? ttlHours
      : DEFAULT_AUTH_CONFIG.ttlHours;
  })(),
});

export const normalizeNextPath = (
  value: unknown,
  fallback = '/',
): string => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const next = value.trim();

  if (!next) {
    return fallback;
  }

  if (!next.startsWith('/') || next.startsWith('//') || next.includes('://')) {
    return fallback;
  }

  return next;
};

export const buildProtectedNextPath = (
  method: string,
  path: string,
): string => {
  const normalizedPath = normalizeNextPath(path, '/');

  if (method.toUpperCase() !== 'POST') {
    return normalizedPath;
  }

  if (normalizedPath.endsWith('/remover')) {
    if (normalizedPath.startsWith('/categorias')) {
      return '/categorias';
    }

    if (normalizedPath.startsWith('/cursos')) {
      return '/cursos';
    }

    if (normalizedPath.startsWith('/usuarios')) {
      return '/usuarios';
    }
  }

  return normalizedPath;
};

export const createAuthToken = (
  user: AuthUser,
  secret: string,
  ttlHours: number,
): string => {
  const payload: AuthTokenPayload = {
    user,
    exp: Date.now() + ttlHours * 60 * 60 * 1000,
  };
  const body = encode(JSON.stringify(payload));
  const signature = createHmac('sha256', secret).update(body).digest('base64url');

  return `${body}.${signature}`;
};

export const verifyAuthToken = (
  token: string | undefined,
  secret: string,
): AuthUser | null => {
  if (!token) {
    return null;
  }

  const [body, signature] = token.split('.');

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(body)
    .digest('base64url');

  const receivedBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(decode(body)) as AuthTokenPayload;

    if (!payload?.user || typeof payload.exp !== 'number') {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload.user;
  } catch {
    return null;
  }
};

export const readCookieValue = (
  cookieHeader: string | undefined,
  cookieName: string,
): string | undefined => {
  if (!cookieHeader) {
    return undefined;
  }

  const cookiePairs = cookieHeader.split(';');

  for (const cookiePair of cookiePairs) {
    const [name, ...valueParts] = cookiePair.trim().split('=');

    if (name === cookieName) {
      return valueParts.join('=');
    }
  }

  return undefined;
};
