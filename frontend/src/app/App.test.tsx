import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('./router', () => ({ default: () => <div data-testid="router" /> }));
vi.mock('@/shared/components/ui/toaster', () => ({ Toaster: () => <div data-testid="toaster" /> }));

const mockState = { restoreSession: vi.fn() };
vi.mock('@/features/auth/auth.store', () => ({
  useAuthStore: (selector: any) => selector(mockState),
}));

import App from './App';

describe('App', () => {
  beforeEach(() => {
    mockState.restoreSession.mockClear();
  });

  it('restaure la session au montage et rend le routeur', () => {
    render(<App />);
    expect(mockState.restoreSession).toHaveBeenCalled();
    expect(screen.getByTestId('router')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });
});
