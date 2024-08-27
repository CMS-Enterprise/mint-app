import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';

import { MessageProvider } from 'hooks/useMessage';

import Status from './index';

describe('Model Plan Status Update page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = render(
      <MemoryRouter
        initialEntries={[
          'models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area/status'
        ]}
      >
        <MockedProvider>
          <Route path="models/f11eb129-2c80-4080-9440-439cbe1a286f/collaboration-area/status">
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
