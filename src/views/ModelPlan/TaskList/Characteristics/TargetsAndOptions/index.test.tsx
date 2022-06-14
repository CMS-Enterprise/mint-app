import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import charactersticMock from '../mock';

import TargetsAndOptions from './index';

describe('Model Plan Characteristics', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/characteristics/targets-and-options'
        ]}
      >
        <MockedProvider mocks={charactersticMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/characteristics/targets-and-options">
            <TargetsAndOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-targets-and-options-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-geographies-targeted-other')
      ).toHaveValue('Other geography type');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/characteristics/targets-and-options'
        ]}
      >
        <MockedProvider mocks={charactersticMock} addTypename={false}>
          <Route path="/models/:modelID/task-list/characteristics/targets-and-options">
            <TargetsAndOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('plan-characteristics-geographies-targeted-other')
      ).toHaveValue('Other geography type');
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
