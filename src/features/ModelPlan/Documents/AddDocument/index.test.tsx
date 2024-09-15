import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';

import AddDocument from './index';

describe('Model Plan Add Documents page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MockedProvider>
        <MemoryRouter
          initialEntries={[
            '/models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area/documents/add-document'
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
