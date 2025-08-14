import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { modelID, paymentsMocks as mocks } from 'tests/mock/readonly';

import ReadOnlyPayments from './index';

describe('Read Only Model Plan Summary -- Payment', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-view/payment`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-view/payment">
            <ReadOnlyPayments modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
    });
  });
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter initialEntries={[`/models/${modelID}/read-view/payment`]}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Route path="/models/:modelID/read-view/payment">
            <ReadOnlyPayments modelID={modelID} />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('tasklist-tag')).toHaveTextContent(
        'In progress'
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
