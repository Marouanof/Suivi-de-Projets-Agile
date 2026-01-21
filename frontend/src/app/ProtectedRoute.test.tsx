import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

const mockState: any = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

vi.mock('../features/auth/auth.store', () => ({
  useAuthStore: () => mockState,
}));

import ProtectedRoute from './ProtectedRoute';

const renderWithRoutes = () => (
  <MemoryRouter initialEntries={['/private']}>
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/private" element={<div>Private Area</div>} />
      </Route>
      <Route path="/auth/login" element={<div>Login Page</div>} />
    </Routes>
  </MemoryRouter>
);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    Object.assign(mockState, { user: null, isAuthenticated: false, isLoading: false });
  });

  it('affiche Loading quand isLoading est vrai', () => {
    Object.assign(mockState, { isLoading: true });
    render(renderWithRoutes());
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('redirige vers login si non authentifié', () => {
    render(renderWithRoutes());
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  it('rend le contenu protégé quand authentifié', () => {
    Object.assign(mockState, { isAuthenticated: true, user: { id: 'u1' }, isLoading: false });
    render(renderWithRoutes());
    expect(screen.getByText(/private area/i)).toBeInTheDocument();
  });
});
