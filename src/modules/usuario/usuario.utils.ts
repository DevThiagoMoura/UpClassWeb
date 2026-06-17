import type { Usuario } from './usuario.entity';

export const PERFIS = ['aluno', 'instrutor', 'administrador'] as const;

export type UsuarioPerfil = (typeof PERFIS)[number];

export const normalizeCpfDigits = (cpf?: string | null): string =>
  (cpf || '').replace(/\D/g, '');

export const isValidCpf = (cpf?: string | null): boolean => {
  const digits = normalizeCpfDigits(cpf);

  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) {
    return false;
  }

  const values = digits.split('').map(Number);

  const firstSum = values
    .slice(0, 9)
    .reduce((sum, value, index) => sum + value * (10 - index), 0);
  const firstDigit = ((firstSum * 10) % 11) % 10;

  if (firstDigit !== values[9]) {
    return false;
  }

  const secondSum = values
    .slice(0, 10)
    .reduce((sum, value, index) => sum + value * (11 - index), 0);
  const secondDigit = ((secondSum * 10) % 11) % 10;

  return secondDigit === values[10];
};

export const perfilLabel = (perfil: string): string => {
  switch (perfil) {
    case 'administrador':
      return 'Administrador';
    case 'instrutor':
      return 'Instrutor';
    default:
      return 'Aluno';
  }
};

export const perfilBadgeClass = (perfil: string): string => {
  switch (perfil) {
    case 'administrador':
      return 'badge-primary';
    case 'instrutor':
      return 'badge-warning';
    default:
      return 'badge-info';
  }
};

export const formatCpf = (cpf?: string | null): string => {
  if (!cpf) {
    return '-';
  }

  const digits = normalizeCpfDigits(cpf);

  if (digits.length !== 11) {
    return cpf;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
    6,
    9,
  )}-${digits.slice(9)}`;
};

export const toUsuarioFormModel = (
  usuario?: Usuario | null,
): Record<string, unknown> => ({
  id: usuario?.id,
  nome: usuario?.nome || '',
  email: usuario?.email || '',
  cpf: usuario?.cpf || '',
  perfil: usuario?.perfil || 'aluno',
  ativo: usuario?.ativo ?? true,
});
