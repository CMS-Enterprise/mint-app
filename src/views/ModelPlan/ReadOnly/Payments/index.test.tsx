import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import { modelID, paymentsMocks as mocks } from 'data/mock/readonly';

import ReadOnlyPayments from './index';

describe('Read Only Model Plan Summary -- Payment', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-only/payment`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/payment">
            <ReadOnlyPayments modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Claims-Based Payments'
      );
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-only/payment`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-only/payment">
            <ReadOnlyPayments modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Claims-Based Payments'
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
