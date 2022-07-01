import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import participantsAndProvidersMock from '../mock';

import ProviderOptions from './index';

describe('Model Plan ProviderOptions', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/provider-options'
        ]}
      >
        <MockedProvider
          mocks={participantsAndProvidersMock}
          addTypename={false}
        >
          <Route path="/models/:modelID/task-list/participants-and-providers/provider-options">
            <ProviderOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-providers-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'participants-and-providers-provider-add-method-other'
        )
      ).toHaveValue('Competitive ball-room dancing, free for all');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers/provider-options'
        ]}
      >
        <MockedProvider
          mocks={participantsAndProvidersMock}
          addTypename={false}
        >
          <Route path="/models/:modelID/task-list/participants-and-providers/provider-options">
            <ProviderOptions />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(
          'participants-and-providers-provider-add-method-other'
        )
      ).toHaveValue('Competitive ball-room dancing, free for all');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
