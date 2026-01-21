import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import api from './client';

const originalLocation = window.location;

const mockLocation = () => {
  const url = new URL('http://localhost/');
  const locationMock: any = {
    ...url,
    href: url.toString(),
    pathname: url.pathname,
    assign: vi.fn(function (val: string) {
      const next = new URL(val, 'http://localhost');
      this.href = next.toString();
      this.pathname = next.pathname;
    }),
  };
  Object.defineProperty(window, 'location', { value: locationMock, writable: true });
};

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear();
    mockLocation();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', { value: originalLocation });
  });

  it('ajoute le header Authorization quand le token existe', async () => {
    localStorage.setItem('authToken', 'token-123');
    const handler = (api.interceptors.request as any).handlers[0].fulfilled;
    const config = await handler({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer token-123');
  });

  it('supprime le token et redirige sur 401', async () => {
    localStorage.setItem('authToken', 'token-123');
    const reject = (api.interceptors.response as any).handlers[0].rejected;
    const error = { response: { status: 401 } } as any;

    await expect(reject(error)).rejects.toBe(error);
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(window.location.href).toContain('/auth/login');
  });
});
