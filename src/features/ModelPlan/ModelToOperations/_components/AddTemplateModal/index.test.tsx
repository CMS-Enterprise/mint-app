import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { modelID } from 'tests/mock/readonly';

import MessageProvider from 'contexts/MessageContext';

import AddTemplateModal from '.';

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/',
          element: (
            <MessageProvider>
              <AddTemplateModal />
            </MessageProvider>
          )
        }
      ],
      {
        initialEntries: [`/models/${modelID}/`]
      }
    );

    const { asFragment } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
