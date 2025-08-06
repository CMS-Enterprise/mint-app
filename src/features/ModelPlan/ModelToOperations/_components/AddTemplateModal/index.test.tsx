import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render } from '@testing-library/react';
import { categoryMock, modelID } from 'tests/mock/mto';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import AddTemplateModal from '.';

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/',
          element: <AddTemplateModal />
        }
      ],
      {
        initialEntries: [`/models/${modelID}/`]
      }
    );

    const { asFragment } = render(
      <MessageProvider>
        <VerboseMockedProvider
          mocks={[...[...categoryMock]]}
          addTypename={false}
        >
          <RouterProvider router={router} />
        </VerboseMockedProvider>
      </MessageProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
