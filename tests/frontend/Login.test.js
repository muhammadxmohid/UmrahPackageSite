import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../frontend/src/pages/Login';
import { AuthContext } from '../../frontend/src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Login Page', () => {
  it('renders login form', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, login: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it('shows error on empty submit', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, login: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    fireEvent.click(screen.getByText(/Login/i));
    expect(screen.getByText(/Please fill in all fields/i)).toBeInTheDocument();
  });
});
