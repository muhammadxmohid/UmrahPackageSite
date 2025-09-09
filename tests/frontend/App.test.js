import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../frontend/src/App';

test('renders navbar links', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Packages/i)).toBeInTheDocument();
  expect(screen.getByText(/Inquiry/i)).toBeInTheDocument();
});
