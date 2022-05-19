import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';

import AddDocument from './index';

describe('Model Plan Add Documents page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/f11eb129-2c80-4080-9440-439cbe1a286f/documents/add-document'
          ]}
        >
          <Route path="/models/:modelID/documents/add-document">
            <AddDocument />
          </Route>
        </MemoryRouter>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
