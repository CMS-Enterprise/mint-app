import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import { Beneficiaries } from './index';
import beneficiaryMock from './mock';

describe('Model Plan Beneficiaries', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/beneficiaries'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/beneficiaries">
            <Beneficiaries />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('beneficiaries-form')).toBeInTheDocument();
    });

    // await waitFor(() => {
    //   expect(screen.getByTestId('beneficiaries-other')).toHaveValue(
    //     'Other Note'
    //   );
    // });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/beneficiaries'
        ]}
      >
        <MockedProvider mocks={beneficiaryMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/beneficiaries">
            <Beneficiaries />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    // await waitFor(() => {
    //   expect(screen.getByTestId('beneficiaries-other')).toHaveValue(
    //     'Other Note'
    //   );
    // });
    expect(asFragment()).toMatchSnapshot();
  });
});
