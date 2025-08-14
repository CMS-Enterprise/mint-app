import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import NewPlan from './index';

describe('New Model Plan page', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/models/new-plan']}>
        <MockedProvider>
          <Route path="/models/new-plan">
            <NewPlan />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('new-plan')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/models/new-plan']}>
        <MockedProvider>
          <Route path="/models/new-plan">
            <NewPlan />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
