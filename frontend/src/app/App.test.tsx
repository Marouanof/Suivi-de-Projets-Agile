import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('affiche le titre principal', () => {
    render(<App />);
    // Adapte le texte selon ce qui s'affiche sur ta page d'accueil
    expect(screen.getByText(/welcome back/i)).toBeDefined();
  });
});
