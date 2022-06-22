import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import { ParticipantsAndProvidersContent } from './index';
import participantsAndProvidersMock from './mock';

describe('Model Plan Participants and Providers', () => {
  it('renders without errors', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers'
        ]}
      >
        <MockedProvider
          mocks={participantsAndProvidersMock}
          addTypename={false}
        >
          <Route path="/models/:modelID/task-list/participants-and-providers">
            <ParticipantsAndProvidersContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-form')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-medicare-type')
      ).toHaveValue('Oncology Providers');

      expect(
        screen.getByTestId('participants-and-providers-states-engagement')
      ).toHaveValue(
        'States will determine administration specific to the state'
      );

      expect(
        screen.getByTestId('participants-and-providers-participants-other')
      ).toHaveValue('The candy people');
    });
  });

  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/task-list/participants-and-providers'
        ]}
      >
        <MockedProvider
          mocks={participantsAndProvidersMock}
          addTypename={false}
        >
          <Route path="/models/:modelID/task-list/participants-and-providers">
            <ParticipantsAndProvidersContent />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('participants-and-providers-medicare-type')
      ).toHaveValue('Oncology Providers');
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
