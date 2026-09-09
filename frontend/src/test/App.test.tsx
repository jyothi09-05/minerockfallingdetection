import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import App from '../App';

describe('MineMind Frontend Foundation', () => {
  it('renders login page when not authenticated', () => {
    render(<App />);
    expect(screen.getByText(/MINEMIND/i)).toBeInTheDocument();
    expect(screen.getByText(/Establish Secure Session/i)).toBeInTheDocument();
  });
});
