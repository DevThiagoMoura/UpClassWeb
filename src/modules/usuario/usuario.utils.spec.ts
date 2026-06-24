import { formatCpf, isValidCpf, normalizeCpfDigits } from './usuario.utils';

describe('usuario.utils', () => {
  describe('CPF', () => {
    it('normaliza CPF mantendo somente numeros', () => {
      expect(normalizeCpfDigits('529.982.247-25')).toBe('52998224725');
    });

    it('valida um CPF correto', () => {
      expect(isValidCpf('529.982.247-25')).toBe(true);
    });

    it('recusa CPFs invalidos', () => {
      expect(isValidCpf('111.111.111-11')).toBe(false);
      expect(isValidCpf('123.456.789-00')).toBe(false);
    });

    it('formata CPF com 11 digitos', () => {
      expect(formatCpf('52998224725')).toBe('529.982.247-25');
    });
  });
});
