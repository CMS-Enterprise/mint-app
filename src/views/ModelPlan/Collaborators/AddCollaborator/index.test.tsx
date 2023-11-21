import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import { collaboratorsMocks } from 'data/mock/readonly';
import { MessageProvider } from 'hooks/useMessage';

import AddCollaborator from './index';

describe('Adding a collaborator page', () => {
  it('matches snapshot', async () => {
    const { asFragment, getByTestId } = render(
      <MemoryRouter
        initialEntries={[
          'models/f11eb129-2c80-4080-9440-439cbe1a286f/collaborators/add-collaborator?view=add'
        ]}
      >
        <MessageProvider>
          <MockedProvider mocks={collaboratorsMocks} addTypename={false}>
            <Route path="models/:modelID/collaborators/add-collaborator">
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
