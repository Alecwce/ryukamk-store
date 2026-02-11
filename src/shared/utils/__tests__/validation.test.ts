import { describe, it, expect } from 'vitest';
import { checkoutSchema } from '../validation';

describe('checkoutSchema', () => {
  const validData = {
    name: 'Juan Pérez',
    phone: '981314450',
    address: 'Av. Larco 123, Miraflores, Lima'
  };

  describe('Campo: name', () => {
    it('✅ debe pasar con un nombre válido', () => {
      const result = checkoutSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('❌ debe fallar con nombre de menos de 3 caracteres', () => {
      const result = checkoutSchema.safeParse({ ...validData, name: 'Jo' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El nombre debe tener al menos 3 caracteres');
      }
    });

    it('❌ debe fallar si el nombre contiene números', () => {
      const result = checkoutSchema.safeParse({ ...validData, name: 'Juan 123' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El nombre solo debe contener letras');
      }
    });
  });

  describe('Campo: phone', () => {
    it('✅ debe pasar con un teléfono peruano válido', () => {
      const result = checkoutSchema.safeParse({ ...validData, phone: '999999999' });
      expect(result.success).toBe(true);
    });

    it('❌ debe fallar si tiene menos de 9 dígitos', () => {
      const result = checkoutSchema.safeParse({ ...validData, phone: '99999999' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El número debe empezar con 9 y tener 9 dígitos');
      }
    });

    it('❌ debe fallar si no empieza con 9', () => {
      const result = checkoutSchema.safeParse({ ...validData, phone: '899999999' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('El número debe empezar con 9 y tener 9 dígitos');
      }
    });
  });

  describe('Campo: address', () => {
    it('✅ debe pasar con una dirección válida', () => {
      const result = checkoutSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('❌ debe fallar con una dirección demasiado corta', () => {
      const result = checkoutSchema.safeParse({ ...validData, address: 'Calle 1' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('La dirección debe ser más detallada (mín. 10 caracteres)');
      }
    });
  });
});
