import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockAuthService = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getProfile: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
}));

vi.mock('./auth.service', () => ({ authService: mockAuthService }));

import { useAuthStore } from './auth.store';

const resetStore = () => {
  useAuthStore.setState({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });
  localStorage.clear();
};

describe('useAuthStore', () => {
  beforeEach(() => {
    resetStore();
    Object.values(mockAuthService).forEach((fn) => (fn as any).mockReset?.());
  });

  afterEach(() => {
    resetStore();
  });

  it('login sauvegarde le token et l’utilisateur', async () => {
    mockAuthService.login.mockResolvedValue({ token: 't123', user: { id: 'u1', email: 'a@b.com', role: 'USER' } });

    await useAuthStore.getState().login({ email: 'a@b.com', password: 'pass' });

    const state = useAuthStore.getState();
    expect(state.token).toBe('t123');
    expect(state.user?.id).toBe('u1');
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem('authToken')).toBe('t123');
  });

  it('login renseigne error en cas d’échec', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

    await expect(useAuthStore.getState().login({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');

    const state = useAuthStore.getState();
    expect(state.error).toBe('Invalid credentials');
    expect(state.isAuthenticated).toBe(false);
  });

  it('restoreSession recharge le token et l’utilisateur du localStorage', () => {
    localStorage.setItem('authToken', 'tok');
    localStorage.setItem('authUser', JSON.stringify({ id: 'u2', email: 'c@d.com' }));

    useAuthStore.getState().restoreSession();

    const state = useAuthStore.getState();
    expect(state.token).toBe('tok');
    expect(state.user?.id).toBe('u2');
    expect(state.isAuthenticated).toBe(true);
  });

  it('logout nettoie le store et le localStorage', async () => {
    mockAuthService.logout.mockResolvedValue({ message: 'ok' });
    useAuthStore.setState({ token: 'tok', user: { id: 'u1' }, isAuthenticated: true } as any);
    localStorage.setItem('authToken', 'tok');

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('getProfile met à jour l’utilisateur retourné', async () => {
    mockAuthService.getProfile.mockResolvedValue({ user: { id: 'u3', email: 'x@y.com' } });

    await useAuthStore.getState().getProfile();

    expect(useAuthStore.getState().user?.id).toBe('u3');
  });
});
