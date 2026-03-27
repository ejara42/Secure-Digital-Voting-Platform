/* eslint-env jest */
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Results from './Results';

jest.mock('socket.io-client', () => ({
  io: () => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  }),
}));

jest.mock('../api/api', () => ({
  getResults: jest.fn().mockResolvedValue({
    results: [],
    totalVotes: 0,
    totalVoters: 0,
    turnoutPercent: 0,
  }),
}));

describe('Results page', () => {
  it('shows no-ballot state when there is no ballotId in route', () => {
    render(
      <MemoryRouter initialEntries={['/results']}>
        <Routes>
          <Route path="/results" element={<Results />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/No Ballot Selected/i)).toBeInTheDocument();
  });
});
