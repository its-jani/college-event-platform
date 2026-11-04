import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) })
  );
});

test('renders the campus event hub dashboard', async () => {
  render(<App />);
  expect(await screen.findByText(/Campus Event Hub/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /post new event/i })).toBeInTheDocument();
});
