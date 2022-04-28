import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';

import AddCollaborator from './index';

describe('Adding a collaborator page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          'models/new-plan/f11eb129-2c80-4080-9440-439cbe1a286f/add-collaborator'
        ]}
      >
        <MockedProvider>
          <Route path="models/new-plan/:modelId/add-collaborator">
            <AddCollaborator />
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
