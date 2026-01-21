import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, resetPasswordSchema } from './auth.validation';

describe('auth.validation', () => {
  it('loginSchema refuse un email invalide', () => {
    const result = loginSchema.safeParse({ email: 'bad', password: 'x' });
    expect(result.success).toBe(false);
  });

  it('registerSchema exige un rôle valide', () => {
    const result = registerSchema.safeParse({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com',
      password: '123456',
      role: 'WRONG' as any,
    });
    expect(result.success).toBe(false);
  });

  it('resetPasswordSchema signale un mismatch de mot de passe', () => {
    const result = resetPasswordSchema.safeParse({ password: 'Password1', confirmPassword: 'nope' });
    expect(result.success).toBe(false);
  });
});
