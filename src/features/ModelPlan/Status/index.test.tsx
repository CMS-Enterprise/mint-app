import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import MessageProvider from 'contexts/MessageContext';

import Status from './index';

describe('Model Plan Status Update page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          'models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status'
        ]}
      >
        <MockedProvider>
          <Route path="models/ce3405a0-3399-4e3a-88d7-3cfc613d2905/collaboration-area/status">
            <MessageProvider>
              <Status />
            </MessageProvider>
          </Route>
        </MockedProvider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
