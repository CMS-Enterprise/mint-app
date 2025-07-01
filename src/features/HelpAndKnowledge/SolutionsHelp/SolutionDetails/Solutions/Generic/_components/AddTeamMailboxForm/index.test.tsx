import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { possibleSolutionsMock } from 'tests/mock/mto';

import MessageProvider from 'contexts/MessageContext';

import AddTeamMailboxForm from './index';

const mocks = [...possibleSolutionsMock];

describe('Add a team mailbox point of contact form', () => {
  it('should matches snapshot', async () => {
    const { getByText, asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/help-and-knowledge/operational-solutions/solutions?solution=accountable-care-organization&section=points-of-contact'
        ]}
      >
        <MockedProvider mocks={mocks} addTypename={false}>
          <MessageProvider>
            <Route path="/help-and-knowledge/operational-solutions">
              <AddTeamMailboxForm closeModal={() => {}} />
            </Route>
          </MessageProvider>
        </MockedProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText('Mailbox title')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
