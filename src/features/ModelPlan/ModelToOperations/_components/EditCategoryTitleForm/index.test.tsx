import React from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { categoryMock } from 'tests/mock/mto';
import { modelID } from 'tests/mock/readonly';
import VerboseMockedProvider from 'tests/MockedProvider';

import MessageProvider from 'contexts/MessageContext';

import EditCategoryTitleForm from './index';

describe('Custom Catergory form', () => {
  it('matches snapshot', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/models/:modelID/',
          element: <EditCategoryTitleForm />
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

    await waitFor(() => {
      expect(screen.getByText('Current title')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
