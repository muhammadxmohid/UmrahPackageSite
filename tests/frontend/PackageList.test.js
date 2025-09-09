import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PackageList from '../../frontend/src/pages/PackageList';
import axios from '../../frontend/src/utils/api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../frontend/src/utils/api');

const mockPackages = [
  {
    _id: '1',
    title: 'Umrah Package',
    price: 1000,
    durationDays: 7,
    images: ['https://example.com/image1.jpg']
  },
  {
    _id: '2',
    title: 'Hajj Package',
    price: 2000,
    durationDays: 10,
    images: ['https://example.com/image2.jpg']
  }
];

test('renders packages', async () => {
  axios.get.mockResolvedValueOnce({ data: mockPackages });
  render(
    <MemoryRouter>
      <PackageList />
    </MemoryRouter>
  );
  expect(screen.getByText(/Loading packages/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText(/Umrah Package/i)).toBeInTheDocument();
    expect(screen.getByText(/Hajj Package/i)).toBeInTheDocument();
  });
});

test('handles error', async () => {
  axios.get.mockRejectedValueOnce(new Error('API error'));
  render(
    <MemoryRouter>
      <PackageList />
    </MemoryRouter>
  );
  await waitFor(() => {
    expect(screen.getByText(/Failed to load packages/i)).toBeInTheDocument();
  });
});
