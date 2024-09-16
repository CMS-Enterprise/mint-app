import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { collaboratorsMocks } from 'tests/mock/readonly';

import MessageProvider from 'contexts/MessageContext';

import AddCollaborator from './index';

describe('Adding a collaborator page', () => {
  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          'models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area/collaborators/add-collaborator?view=add'
        ]}
      >
        <MessageProvider>
          <MockedProvider mocks={collaboratorsMocks} addTypename={false}>
            <Route path="models/:modelID/collaboration-area/collaborators/add-collaborator">
              <AddCollaborator />
            </Route>
          </MockedProvider>
        </MessageProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByTestId('fieldset')).not.toBeDisabled();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
