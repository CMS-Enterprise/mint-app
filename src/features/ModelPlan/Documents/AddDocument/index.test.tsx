import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import MessageProvider from 'contexts/MessageContext';

import AddDocument from './index';

describe('Model Plan Add Documents page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/documents/add-document'
          ]}
        >
          <MessageProvider>
            <Route path="/models/:modelID/collaboration-area/documents/add-document">
              <AddDocument />
            </Route>
          </MessageProvider>
        </MemoryRouter>
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
