import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import ModelPlan from './index';

describe('Read Only Model Plan Overivew', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={['/models']}>
        <MockedProvider>
          <Route path="/models">
            <ModelPlan />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('model-plan-overview')).toBeInTheDocument();
      expect(
        screen.getByText('CMMI Models and Demonstrations')
      ).toBeInTheDocument();
      expect(screen.getByText('All models')).toBeInTheDocument();
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={['/models']}>
        <MockedProvider>
          <Route path="/models">
            <ModelPlan />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
